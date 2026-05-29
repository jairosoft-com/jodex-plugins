# Plan: Add jx-qa `spec-generator` Subagent

## Status

Design decisions **locked 2026-05-28**, then **hardened 2026-05-29** after a blocking Codex
adversarial review (`/codex:adversarial-review`) — 3 findings addressed: an enforceable permission
preflight (Decisions 1, 9), rollback-safe spec writes (Decision 3), and required-explicit-path
provenance for the agent (Decision 4). **Implementation not started** — this remains plan-only until
explicit go-ahead (repo rule: plan approval ≠ implementation approval).

## Summary

Add the first agent to the jx-qa plugin — `plugins/jx-qa/agents/spec-generator.md` —
an autonomous subagent that turns an **already-approved xlsx test plan** into verified
Playwright `.spec.ts` files by deferring to the existing `generate` skill: parse the plan,
skip existing specs, live-explore the site for semantic locators, write the spec, and run
it to confirm it passes.

Source idea: `wiki/ideas/jx-qa Spec-Generator Subagent.md`.

## Decisions (locked 2026-05-28)

1. **Security (gating) — Option A, signed off.** Ship the agent with bare
   `tools: Bash, Read, Write`. A subagent's `tools:` accepts only bare names (no
   `Bash(playwright-cli:*)` scoping), a skill's `allowed-tools` does **not** clamp a
   subagent, and a subagent inherits the session's `permissions`. So the broadened Bash
   surface is **governed by the consuming session's `permissions`**, not the agent/skill
   files, and must be **documented** (README + security note). Consuming projects **MUST** deny bare Bash and allow only `playwright-cli` /
   `npx playwright test` / the pinned `xlsx-writer.py` helper / `ls`; the agent **enforces this at
   runtime via the Decision 9 fail-closed permission preflight** and refuses to run otherwise.
   **Residual (honest):** plugin-level Bash scoping is provably impossible (a subagent's `tools:`
   takes only bare names; the bound skill's `allowed-tools` does not clamp it), so correct
   session-permission config remains a **required external control** — the preflight detects and
   refuses, it cannot itself scope Bash. **No auto-install** anywhere (see Decision 9).
2. **Concurrency — sequential v1.** One test case at a time within a single agent
   invocation. Parent-orchestrated fan-out (one agent per case) is **deferred to v2**.
3. **Failure policy — omit + report, bound = 2 repair attempts.** On a failing spec, repair
   locators/assertions and re-run up to 2 attempts. If still failing, **omit the spec and
   report it as a gap** — never write a non-passing `// Test Case TBD` spec (protects the
   ADO-linking contract). An idempotent re-run retries omitted cases (may self-heal).
   **Rollback-safe write (overrides the `generate` skill's in-place write):** write each candidate to
   a temp path (`tests/.<slug>.spec.ts.tmp`), run `npx playwright test` against it, and **atomically
   rename to `tests/<slug>.spec.ts` only after it passes**. On exhausted repairs / timeout / crash,
   **delete the temp candidate** and record the gap — never leave a partial or unverified file at the
   final path. On startup, sweep and delete orphaned `tests/.*.spec.ts.tmp`. This makes the slug-skip
   idempotency mean *skip only verified specs*, and delete-on-fail is what lets re-runs retry gaps.
4. **xlsx discovery — explicit path REQUIRED for the agent.** In the agent's
   background/non-interactive mode an **explicit xlsx path is required**, and **sole-match
   auto-discovery is disabled**: if no path is supplied, **stop and report** "specify the test plan
   path" rather than auto-selecting a sole file. A human naming the file IS the enforceable,
   non-interactive **provenance signal** (auto-driving live browser navigation + spec writes from an
   unproven sole xlsx in background mode is disallowed). The `generate` skill keeps its
   explicit-preferred → single-match → fail-closed discovery for the **interactive inline path only**.
5. **Evals — ship an eval skeleton.** Mirror `skills/*/evals/evals.json` (activation ±,
   idempotency, line-3 TBD contract, omit-on-failure). **DEPENDENCY:** confirm the repo's
   eval runner actually executes *agent* evals; if it is skill-only, the skeleton ships as a
   documented manual checklist plus a runner-extension follow-up. (Agent eval file location
   is TBD pending this — agents are single `.md` files, unlike skill directories.)
6. **Invocation — explicit-delegation via a `--background` flag on `/jx-qa:generate`.** The
   agent does NOT auto-compete with the `generate` skill's everyday triggers. Inline
   requests run the skill; `/jx-qa:generate --background` delegates to the agent. (Flag name
   `--background`; overridable.)
7. **URL resolution — step-1 → baseURL → skip+report.** Navigation target comes from the
   test case's step-1 action; if absent, fall back to `playwright.config` `baseURL`; if
   still none, skip the case and report (consistent with Decision 3).
8. **Return — plain human-readable report.** Generated / skipped / failures-with-reason. No
   machine-aggregation contract in v1 (follows from sequential v1).
9. **Preconditions — report-and-stop pre-flight.**
   **(a) Permission preflight (mandatory, fail-closed) — runs FIRST, before any plan parse or browser
   work.** Probe that broad shell is NOT granted: run a sentinel command that must be *denied* in a
   correctly-scoped session (e.g. `bash -c 'echo unscoped-shell-reachable'`). If the sentinel
   **succeeds**, the broad-Bash boundary is absent → **STOP** and report the required remediation
   (deny bare Bash; allow only `Bash(playwright-cli:*)`, `Bash(npx playwright test:*)`, the pinned
   `xlsx-writer.py` helper, `Bash(ls:*)`). Proceed only if the sentinel is **blocked AND** the required
   commands run.
   **(b)** Verify playwright-cli (`npx --no-install playwright-cli --version`) — doubles as the
   allowlisted-command confirmation for (a); if missing, **stop and report** the install command
   (`npm install -g @playwright/cli@latest`) — **do NOT auto-install**.
   **(c)** Plan-parse check falls out of the `xlsx-writer.py read` step.
   **(d)** Site reachability — lazy: first `playwright-cli goto` failure = fail-fast "site unreachable" stop.
   **(e)** Ensure `tests/` exists (create if absent).

## Files

- **NEW** `plugins/jx-qa/agents/spec-generator.md` — agent definition (frontmatter + system prompt).
- **NEW** agent eval skeleton — location TBD pending Decision 5's runner confirmation.
- **EDIT** `plugins/jx-qa/commands/generate.md` — add the `--background` flag: update
  `argument-hint`, add conditional logic ("if `--background` → delegate to the
  `spec-generator` subagent via the Agent/Task tool; else run the `generate` skill inline"),
  and add the Agent/Task tool to `allowed-tools`.
- **EDIT** `plugins/jx-qa/README.md` — add an "Agents" section documenting `spec-generator`
  and the **session-permissions security note** (Decision 1).
- **No** `plugin.json` / `marketplace.json` change — agents are auto-discovered from `agents/`.
- Wiki follow-up (separate from the code change): triage the idea (`/jx-kb:triage`) →
  promoted / implemented after shipping.

## Agent definition spec

Frontmatter:
- `name: spec-generator`
- `description:` scoped to **explicit delegation / background / batch / isolated** runs
  (Decision 6); explicitly states "for normal inline generation use the `generate` skill,"
  and "Do not use to extract from a BRD (→ `extract`) or to run an existing suite (→ `test`)."
- `model: sonnet`
- `tools: Bash, Read, Write`  (bare names — Decision 1)
- `skills: [generate, playwright-cli, test]`

System prompt:
- Role: autonomous Playwright spec author; input = an **explicitly-provided, approved** xlsx path (post-extract gate; no auto-discovery in agent mode — Decision 4).
- **Defer to the `generate` skill as the single source of truth** — do not duplicate it.
- Operating rules: idempotent slug-skip (**skip only verified specs** — Decision 3); line-3 `// Test Case TBD - <Title>` contract;
  semantic locators via `generate-locator`; self-verify each spec with `npx playwright test`;
  stay in scope (no BRD, no plan generation, no classification gate, no xlsx mutation).
- Bake in Decisions 2 (sequential), 3 (omit+report, 2 attempts, **+ rollback-safe temp→rename-on-pass /
  delete-on-fail**), 4 (**explicit path required; no auto-discovery**), 7 (URL resolution),
  9 (**mandatory fail-closed permission preflight, first**).
- Call out the rollback-safe write and the no-auto-discovery rule as **explicit overrides** of the
  `generate` skill — not silent deviations.
- Output: report per Decision 8.

## Validation (Decision 5)

- **Eval skeleton** mirroring the skills' format (activation ±, idempotency, TBD contract,
  omit-on-failure) — runnability pending the runner-support check.
- **Manual checklist** (the de facto validation until/unless the runner supports agents):
  load (agent appears + frontmatter parses); positive routing (`--background` → agent);
  negative routing ("extract from BRD" → `extract`; "run e2e" → `test`); end-to-end on a
  sample approved xlsx (passing specs, idempotent re-run skips); **security reach** (agent's
  Bash is bounded by the project's `permissions` as agreed).

## Risks

- **Broadened Bash surface** — the Decision-9 preflight **detects and refuses** when broad shell is
  granted but **cannot itself scope Bash**; correct session-`permissions` config remains a **required
  external control** (state honestly in the README security note — not plugin-enforced). Central, accepted.
- **Eval runner may not support agents** — Decision 5 dependency; fallback is manual checklist
  + runner-extension follow-up.
- **Flag routing** — verify `/jx-qa:generate --background` reliably delegates and the bare
  command still runs inline (Decision 6).
- Concurrent-browser cost — N/A in v1 (sequential).

## Out of scope

- Implementing the agent (plan-only; stop until go-ahead).
- Parent-orchestrated fan-out (v2 — Decision 2).
- Full BRD→specs orchestrator (blocked by `extract`'s human gate).
- A full agent eval *runner* (a skeleton is in scope; extending the runner may be a follow-up).
- Changing the project's session `permissions` (separate task under Option A if desired).
- **Extract-side approval fingerprint/metadata** (follow-up): `extract` emits no approval/checksum/metadata
  today (only the xlsx), so the agent can't validate provenance beyond the human-named path. File a
  follow-up for `extract` to stamp an approval fingerprint the agent could later verify; until then the
  required-explicit-path rule (Decision 4) is the provenance signal. Verifying the xlsx is **current** or
  targets the intended **tenant/site** also depends on this not-yet-existing extract metadata.

## Steps (once approved)

1. **Confirm eval-runner support for agents** (Decision 5 dependency) → decide skeleton-runnable
   vs. manual-checklist + follow-up.
2. Write `plugins/jx-qa/agents/spec-generator.md` (frontmatter + system prompt with Decisions baked in).
3. Edit `plugins/jx-qa/commands/generate.md` — add `--background` flag + Agent/Task tool.
4. Edit `plugins/jx-qa/README.md` — Agents section + security note.
5. Add the eval skeleton.
6. Validate: load + positive/negative routing + manual e2e on a sample xlsx + security reach.
7. Wiki follow-up: triage the idea → promoted / implemented.
