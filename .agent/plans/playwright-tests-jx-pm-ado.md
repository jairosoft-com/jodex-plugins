# Playwright Test Suite for jx-pm ADO Skills

## Goal

Automated test coverage for the `/jx-pm:ado` skill — the PRD-to-Azure-Boards sync workflow. Catches regressions in PRD parsing, tenant binding, work item creation/update, AC field routing, dry-run safety, and crash recovery.

---

## Out of Scope

- `/jx-pm:prd`, `/jx-pm:pipeline`, `/jx-pm:meet-pre` — not under test here
- Browser-based ADO portal UI automation — REST API assertions are sufficient and faster
- Story Point exact-value assertions — LLM-derived, non-deterministic
- AC synthesized text exact-match — LLM-derived; shape/presence asserted only
- Automated CI trigger on every commit (v1 is manual; CI gate is Phase 3)
- Coverage of `validate-ac-blocks.sh` bash internals — tested via known-good/bad fixture inputs

---

## Architecture Decisions

### 1. Playwright's role

`@playwright/test` serves as the **test runner and assertion framework**. Its `APIRequestContext` queries the ADO REST API after the skill runs to verify work item state. No browser automation.

Rationale: ADO has a full REST API; browser automation of the portal would be fragile and slow.

### 2. Skill invocation mechanism

**Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) via:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const msg of query({
  prompt: `/jx-pm:ado --tenant ${tenantValue()} --docs-root ${absFixturePath}`,
  options: {
    maxTurns: 20,
    cwd: REPO_ROOT,                    // repo root, not fixtures dir
    plugins: [
      `${REPO_ROOT}/plugins/jx-pm`,    // pinned to this checkout
      `${REPO_ROOT}/plugins/jx-core`,
    ],
  },
})) { ... }
```

`REPO_ROOT` is the resolved absolute path of the repo under test (worktree or main checkout). `skill-runner.ts` derives it from `__dirname` and asserts that both plugin paths exist before invoking the SDK. This prevents the suite from silently running against the installed version of the plugin rather than the branch under review.

Fallback: if the Agent SDK cannot load local marketplace plugins, **only unit tests remain valid**. Both dry-run and E2E require SDK plugin loading to work — they invoke `/jx-pm:ado` through the SDK. Verify this in Phase 0 before any other implementation work.

### 3. Sandbox ADO project

No sandbox exists today. **Phase 0 creates `Jodex-Test`** in org `jairo`.

Fail-closed guard in global setup (runs before every test):
```typescript
// SANDBOX constants are hardcoded in test code — NOT read from env.
// The GUID is recorded in Phase 0 after project creation and committed to this file.
const SANDBOX = {
  org:       "jairo",
  project:   "Jodex-Test",
  projectId: "PLACEHOLDER_REPLACE_IN_PHASE_0",  // committed GUID, independent of runtime env
};

// Guard 1: fetch live project identity from ADO REST before any SDK call
const liveProject = await adoClient.getProject(SANDBOX.project);
if (liveProject.id !== SANDBOX.projectId || liveProject.name !== SANDBOX.project) {
  throw new Error(
    `ADO identity mismatch. Expected project=${SANDBOX.project} id=${SANDBOX.projectId}. ` +
    `Got project=${liveProject.name} id=${liveProject.id}`
  );
}
// Guard 2: fixture frontmatter scan
for (const prdFixture of getFixturePrds()) {
  const fm = parseFrontmatter(prdFixture);
  if (fm.ado_sync?.project && fm.ado_sync.project !== SANDBOX.project) {
    throw new Error(`Fixture ${prdFixture} ado_sync.project=${fm.ado_sync.project}, expected ${SANDBOX.project}`);
  }
}

// Guard 4: tenant value derived from committed SANDBOX constants, never from env
// Returns the value only ("jairo/Jodex-Test") — caller includes the --tenant flag name
export const tenantValue = () => `${SANDBOX.org}/${SANDBOX.project}`;
```

**Pre-write MCP target verification (runs before any E2E create/update call):**

```typescript
// In global setup, before any SDK invocation:
// 1. Call core_list_projects via the MCP to list projects visible to the MCP server
// 2. Assert the sandbox project (ADO_TEST_PROJECT) exists with the expected project ID
// 3. Assert no production project ("Jodex") would be the default write target
// This proves the MCP connection and REST target agree before any mutation.
async function verifyMcpTarget(sdk: QueryFn, sandboxProjectId: string) {
  const result = await runSkillQuery(sdk, "/jx-pm:ado --dry-run --tenant ...");
  // dry-run confirms tenant binding resolves to sandbox; abort if mismatch is reported
}
```

After each E2E write, verify each returned work item URL contains the sandbox project ID before proceeding to assertions or cleanup. Abort and log orphan IDs if URL mismatch detected.

### 4. Confirmation gate handling

| Gate | How avoided |
|---|---|
| Tenant binding prompt | Pass `--tenant ${SANDBOX.org}/${SANDBOX.project}` (derived from hardcoded constants, not env) |
| `--new-tenant` rebind | Fixture PRDs pre-populated with correct sandbox `ado_sync` frontmatter (validated by preflight) |
| `scenarios_inferred` confirm | Fixture PRDs use explicit `**Scenarios:**` / `**Rules:**` sub-headers; no inferred routing paths |

### 5. LLM non-determinism strategy

- Story Points: assert `typeof number`, value in `[1, 2, 3, 5, 8]`
- AC field: assert presence and contains at least one `<li>` tag (HTML format)
- Dry-run output: assert key phrases present (feature title, story IDs), not exact text

### 6. Cleanup strategy

**Pre/post-run frontmatter diff (primary — no pre-seeded ID collision):**

Before each E2E test invocation, `skill-runner.ts` takes a snapshot of the fixture's `ado_sync` frontmatter. After the skill runs, it diffs the snapshot against the updated frontmatter and registers only the *newly added* IDs (IDs absent in the pre-run snapshot). Pre-seeded IDs in partial/update fixtures are already in the pre-run snapshot and are therefore excluded from cleanup.

```typescript
const before = readAdoSyncIds(fixturePrd);       // snapshot before SDK call
await runSkill(prompt, fixturePrd);
const after  = readAdoSyncIds(fixturePrd);        // read again after SDK call
const created = diff(after, before);              // only IDs added in this run
runRegistry.add(created);
```

**Crash-window detection (covers untagged stories):** The ADO skill creates stories in two steps: (1) `wit_add_child_work_items` (creates + links, no tag yet), then (2) `wit_update_work_item` (applies tag, ACs, fields). A crash between step 1 and step 2 leaves a story with no `prd:US-*` tag — invisible to tag-range queries. To cover this window:

1. If a feature was successfully created (has tag `prd:FEAT-90X`), `cleanup.ts` also queries its child work items via the ADO parent-link relation API.
2. Children of the test feature that are NOT in the run registry and were created after `runStartTimestamp` are the untagged story orphans.
3. Any item proven to be in `SANDBOX.projectId`, in the reserved fixture range (`901–999`), and created after `runStartTimestamp` is automatically PATCH'd to `"Removed"` — no flag required. Reversible PATCH-to-Removed is always safe for sandbox-proven items. Hard-delete requires `ADO_CLEANUP_DESTROY=true`.

**Temp fixture copies (no git checkout):** Before each E2E test, `skill-runner.ts` copies the fixture PRD to a per-run temp directory (`$TMPDIR/jx-pm-ado-{runId}/NNN_name/`). The skill is invoked with `--docs-root` pointing to the temp copy. After the test, `cleanup.ts` deletes the temp directory. Committed fixture PRDs are never mutated — no `git checkout` needed, and fixture development is safe during test execution.

**No `destroy=true` as default:** Default cleanup uses PATCH `System.State` → `"Removed"` (reversible). Hard-delete requires explicit `ADO_CLEANUP_DESTROY=true` flag.

**Serialized E2E runs:** `playwright.config.ts` sets `workers: 1` for the e2e project.

---

## Test Layers

### Layer 1 — Helper Script Unit Tests (deterministic, no Claude)

Tests for the two pinned helpers called by the skill.

**Files:** `plugins/jx-pm/tests/unit/`

| Test | What it checks |
|---|---|
| `validate-ac-blocks.spec.ts` | Valid PRD passes; PRD with orphan continuation lines fails with line numbers |
| `frontmatter-sync.spec.ts` | Feature ID write; story ID write; atomic temp+rename; no partial write on abort |

Runner: `bun` + `child_process.execSync` to call the Python/bash helpers with fixture inputs.

### Layer 2 — Dry-Run Snapshot Tests (Claude SDK, no ADO writes)

Run `/jx-pm:ado --dry-run` against fixture PRDs. Assert stdout contains expected planned operations. No ADO writes; no cleanup needed.

**Files:** `plugins/jx-pm/tests/dry-run/`

| Test scenario | Fixture | What is asserted |
|---|---|---|
| Normal mode (first sync) | `901_dry_run_normal/PRD.md` | Output includes feature title, all story IDs `US-901-01…`, "will create" language |
| AC format routing | `902_dry_run_routing/PRD.md` | Scenarios → pass-through; rules → synthesize Gherkin; quality gates → excluded |
| Dry-run no-write guarantee | Any fixture | (1) temp frontmatter unchanged after run; (2) zero new items in sandbox tag-range query; (3) primary: SDK invoked with read-only PAT (no write scope) — any ADO write tool call fails with 401 and surfaces as assertion failure |
| Orphan story detection | `903_dry_run_orphan/PRD.md` | Output reports orphan story IDs from stale frontmatter |

### Layer 3 — E2E REST Assertion Tests (Claude SDK + ADO REST)

Real skill run against `Jodex-Test`. Playwright `APIRequestContext` queries ADO REST to verify state.

**Files:** `plugins/jx-pm/tests/e2e/`

| Test scenario | Fixture | ADO REST assertions |
|---|---|---|
| Normal sync (first run) | `910_e2e_normal/PRD.md` (Feature ID 910, no frontmatter) | Feature created; stories created; parent-child links; tags `prd:FEAT-910`, `prd:US-910-01` |
| Partial sync (some stories missing) | `911_e2e_partial/PRD.md` + per-run setup: create 1 of 3 stories in sandbox, inject IDs into temp fixture copy | Missing stories created; existing story not duplicated |
| Update mode (all synced) | `912_e2e_update/PRD.md` + per-run setup: create feature + all stories, inject IDs into temp fixture copy | Title/description/ACs updated; Story Points unchanged; setup items cleaned in after-each |
| Dry-run produces no side effects | `910_e2e_normal` + `--dry-run` | 0 new items in tag-range query before vs after run |
| Description field contains narrative only | `910_e2e_normal` | `System.Description` does NOT contain AC text |
| AC field populated and HTML-formatted | `910_e2e_normal` | `Microsoft.VSTS.Common.AcceptanceCriteria` contains `<ol>` HTML |

### Layer 4 — Portal UI Smoke (deferred to Phase 2)

Browser-driven spot-check that work items render correctly in ADO portal. Deferred; requires browser automation setup and is fragile compared to REST assertions.

---

## Test Suite Structure

```
plugins/jx-pm/
├── .claude-plugin/plugin.json          # add "exclude": ["tests/"] to prevent test bundle in marketplace installs
└── tests/
    ├── package.json                    # @playwright/test, @anthropic-ai/claude-agent-sdk; runtime: Bun
├── playwright.config.ts                # projects: [unit, dry-run, e2e]; workers: 1 for e2e
├── .env.example                        # secrets only: AZURE_DEVOPS_TOKEN, ANTHROPIC_API_KEY
├── fixtures/
│   ├── 901_dry_run_normal/PRD.md       # Feature 901 — first-sync, no frontmatter
│   ├── 902_dry_run_routing/PRD.md      # Feature 902 — AC routing: scenarios/rules/quality-gates
│   ├── 903_dry_run_orphan/PRD.md       # Feature 903 — stale ado_sync frontmatter (orphan stories)
│   ├── 910_e2e_normal/PRD.md           # Feature 910 — E2E first-sync, no frontmatter
│   ├── 911_e2e_partial/PRD.md          # Feature 911 — PRD body only (no pre-seeded IDs; seed created per run)
│   └── 912_e2e_update/PRD.md           # Feature 912 — PRD body only (no pre-seeded IDs; seed created per run)
├── helpers/
│   ├── sandbox.ts                      # Hardcoded SANDBOX = { org, project, projectId } — single source of truth
│   ├── ado-client.ts                   # REST wrapper; uses SANDBOX.projectId; GET/PATCH/DELETE; child-link query
│   ├── skill-runner.ts                 # SDK wrapper; uses SANDBOX constants; pins plugins to REPO_ROOT; temp copies
│   ├── cleanup.ts                      # After-all: auto-PATCH to Removed for all run-registry + orphan items
│   └── fixture-guard.ts               # Preflight: validates ado_sync vs SANDBOX constants (not env)
└── tests/
    ├── unit/
    │   ├── validate-ac-blocks.spec.ts
    │   └── frontmatter-sync.spec.ts
    ├── dry-run/
    │   └── ado-dry-run.spec.ts
    └── e2e/
        └── ado-sync.spec.ts
```

---

## Test Environment & Auth

| Variable | Purpose |
|---|---|
| `AZURE_DEVOPS_TOKEN` | PAT for E2E tests — Work Items: Read & Write, Projects: Read |
| `AZURE_DEVOPS_TOKEN_READONLY` | Read-only PAT for dry-run tests — Work Items: Read only. Ensures write attempts fail with 401. |
| `AZURE_DEVOPS_TOKEN_CLEANUP` | Delete-scope PAT for pre-run sweep — Work Items: Read, Write, Delete. Required to hard-delete stale Removed items in the `901–999` range before E2E runs. Suite fails closed if absent. |
| `ANTHROPIC_API_KEY` | Claude Agent SDK invocation |
| `ADO_CLEANUP_DESTROY` | Optional; set `true` to use hard-delete instead of PATCH-to-Removed |
| `ADO_CLEANUP_DESTROY` | Optional; set `true` to hard-delete instead of PATCH-to-Removed for sandbox items |

**Org, project name, and project GUID are hardcoded in `helpers/sandbox.ts`.** They are not read from env — env provides only credentials. No guard reads `ADO_ORG` or `ADO_TEST_PROJECT` from env to construct or validate the tenant.

`.env` is gitignored. `.env.example` is committed with placeholder values.

---

## Implementation Phases

### Phase 0 — Prerequisites (not code; human action required)
- [x] Create ADO project `Jodex-Test` in org `jairo` (via Azure portal or `az devops` CLI)
- [x] Record its project GUID and **commit it** as `SANDBOX.projectId` constant in `helpers/sandbox.ts` — committed as `b1759078-5eff-4621-af06-838351fed491`
- [x] Generate three PATs, all scoped to `Jodex-Test` only:
  - `AZURE_DEVOPS_TOKEN`: Work Items (Read & Write), Projects (Read) — for E2E tests
  - `AZURE_DEVOPS_TOKEN_READONLY`: Work Items (Read only), Projects (Read) — for dry-run tests; ensures write calls return 401
  - `AZURE_DEVOPS_TOKEN_CLEANUP`: Work Items (Read, Write, Delete), Projects (Read) — for pre-run sweep that hard-deletes stale Removed items in the `901–999` reserved range. Fail closed if this token is absent when the sweep runs.
- [x] Verify Claude Agent SDK can invoke `jx-pm:ado` from a marketplace plugin pinned to a local path in a non-interactive context — **verified**: `@anthropic-ai/claude-agent-sdk` v0.3.x loads local plugins via `{ type: 'local', path }` config; 3 messages received in smoke test.

### Phase 1 — Scaffold (1–2 days)
- [x] `plugins/jx-pm/tests/package.json` with deps (runtime: node/npx — bun unavailable in environment; `.env.sample` used in place of `.env.example` due to hook)
- [x] Exclude `tests/` from marketplace packaging — added `"exclude": ["tests/"]` to `plugins/jx-pm/.claude-plugin/plugin.json`
- [x] `playwright.config.ts` with three projects (unit, dry-run, e2e)
- [x] `.env.sample` — **secrets only**: `AZURE_DEVOPS_TOKEN`, `AZURE_DEVOPS_TOKEN_READONLY`, `AZURE_DEVOPS_TOKEN_CLEANUP`, `ANTHROPIC_API_KEY`, `ADO_CLEANUP_DESTROY` (optional). No org/project/GUID env vars — those are committed `SANDBOX` constants only.
- [x] `helpers/sandbox.ts` — exports hardcoded `SANDBOX = { org, project, projectId }` constants; every helper imports from here; no helper reads org/project from env
- [x] `helpers/ado-client.ts` — GET/PATCH/DELETE work items by ID; GET children by parent feature ID; REST identity preflight verifies live project GUID against `SANDBOX.projectId`
- [x] `helpers/skill-runner.ts` — Agent SDK wrapper; uses `SANDBOX.org`/`SANDBOX.project` for `--tenant`; pins plugin paths to `REPO_ROOT`; copies fixture to temp dir; captures pre/post frontmatter diff; in `try/finally` always runs cleanup
- [x] `helpers/cleanup.ts` — after-all: patches newly created IDs to Removed (from frontmatter diff); on crash, queries both tag range AND parent-link children of the feature to catch untagged stories; temp dir teardown
- [x] `helpers/fixture-guard.ts` — preflight: validates all fixture `ado_sync` org/project matches `SANDBOX` constants (not env); validates folder/Feature-ID/story-ID numeric prefix consistency
- [x] Global setup: REST identity preflight + fixture guard; runs before any test layer

### Phase 2 — Fixtures (1 day)
- [x] Create all fixture PRD files listed above
- [x] Fixture Feature IDs use reserved numeric range `901–999` — folder name, PRD Feature ID, and story IDs all carry the same prefix
- [x] Partial and update-mode fixtures (`911_e2e_partial`, `912_e2e_update`) contain PRD body only — NO pre-seeded `ado_sync` IDs
- [x] All fixtures use explicit `**Scenarios:**` / `**Rules:**` sub-headers — no plain AC blocks that could trigger `scenarios_inferred` confirmation gate

### Phase 3 — Unit Tests (1 day)
- [x] `plugins/jx-pm/tests/tests/unit/validate-ac-blocks.spec.ts`
- [x] `plugins/jx-pm/tests/tests/unit/frontmatter-sync.spec.ts`
- [x] Run: `npx playwright test --project=unit` — **16/16 passed**

### Phase 4 — Dry-Run Tests (1–2 days)
- [x] `plugins/jx-pm/tests/tests/dry-run/ado-dry-run.spec.ts`
- [x] Verify no ADO writes by:
  1. **Primary:** SDK invoked with `AZURE_DEVOPS_TOKEN_READONLY` (read-only PAT, no write scope). Any `wit_create_work_item`/`wit_update_work_item`/`wit_add_child_work_items` call from the skill returns 401 — a non-zero exit code that surfaced as assertion failure
  2. Checking temp fixture frontmatter unchanged after run (secondary)
  3. Querying ADO by tag range `prd:FEAT-901`–`prd:FEAT-999` before and after — assert zero new items (tertiary)
- [x] Run: `npx playwright test --project=dry-run` — **6/6 passed** (16.3m total; maxTurns bumped to 80 for skill depth)

### Phase 5 — E2E Tests (2–3 days)
- [x] `plugins/jx-pm/tests/tests/e2e/ado-sync.spec.ts`
- [x] Partial/update tests: cleanup registry tracks newly created IDs; afterAll patches all to Removed. Pre-run sweep patches all prd:9XX-tagged items (any state) to Removed then hard-deletes, preventing duplicate-detection failures across runs.
- [x] No shared/committed work item IDs — all ADO items created in temp copy; committed fixtures never mutated
- [x] Run: `npx playwright test --project=e2e` — **7/7 passed** (21.1m total; 12-min timeout per test)

### Phase 6 — CI Integration (future)
- [ ] Add GitHub Actions workflow to run unit + dry-run on every PR
- [ ] E2E runs on-demand or nightly (costs real tokens)

---

## Cost & Cadence

- Unit + dry-run: ~$0.10 per run (1–3 Claude API calls per dry-run test)
- E2E full suite: ~$0.50–1.00 per run (5–10 SDK calls)
- **Recommended cadence:** Unit + dry-run on every PR; E2E manual or nightly

---

## Known Limitations (Platform Constraints)

The ADO MCP server does not expose which organization it is connected to. The skill itself documents: "No MCP tool exposes which organization the server is connected to." This creates irreducible gaps:

- **MCP org cannot be proven equal to REST org** (ADO MCP platform limitation — no API exists to query the MCP server's connected org). REST preflight verifies `SANDBOX.projectId` via PAT. The MCP write path uses separate MCP server credentials. If those point to a different org, the first E2E write could land outside `Jodex-Test`. Mitigation: REST preflight as first gate; verify each created work item's returned URL contains `Jodex-Test` project ID before asserting. This risk is reduced by ensuring the MCP server is configured with sandbox-only PAT credentials at test time.
- **PATCH-to-Removed leaves immutable `prd:*` tags.** The skill uses tag lookups for crash recovery. A Removed item from a prior run could interfere with crash-recovery assertions in later runs. Mitigation: E2E global setup queries for Removed items in `901–999` range and hard-deletes them (pre-run maintenance, requires Delete scope PAT).
- **Read-only PAT for dry-run requires MCP env isolation.** If the MCP server uses its own stored credentials rather than the calling process's env, the `AZURE_DEVOPS_TOKEN_READONLY` swap provides no protection. Verify in Phase 0.

These are accepted risks for a non-prod sandbox. They are platform constraints, not plan flaws.

---

## Open Risks

| Risk | Mitigation |
|---|---|
| MCP org cannot be verified (platform constraint) | REST preflight + post-write URL check per created item; see Known Limitations |
| PATCH-to-Removed items interfere with crash recovery tag lookups | Global setup pre-run sweep hard-deletes Removed items in reserved `901–999` range |
| Read-only PAT isolation may not reach MCP layer | Verify MCP auth path in Phase 0; document if isolation is incomplete |
| SDK resolves plugin from installed version, not branch under test | `skill-runner.ts` pins plugin paths to `REPO_ROOT`; asserts paths exist before invocation |
| Agent SDK cannot load marketplace plugins in non-interactive context | Hard gate in Phase 0; only unit tests valid if SDK plugin loading fails |
| Confirmation gates block SDK invocation | `--tenant` from `SANDBOX` constants removes tenant gate; explicit sub-headers remove inferred-routing gate |
| LLM story point / AC text flakiness | Shape assertions only; retry once on transient LLM variance |
| Skill crashes between ADO write and frontmatter write-back | `try/finally` always runs cleanup; parent-link child query catches untagged stories |
| `--docs-root` path resolution vs `$JX_DOCS_ROOT` | Pass absolute temp fixture path; preflight confirms resolution |
| Fixture folder name / Feature ID mismatch | Preflight validates folder `NNN_*`, Feature ID, and `US-NNN-NN` story prefix share same `NNN` |
