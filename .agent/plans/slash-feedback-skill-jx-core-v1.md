# Slash Feedback Skill for jx-core — v1 Implementation Plan

## Context

The jx plugin ecosystem has no structured feedback capture mechanism. The groomed idea [[Slash Feedback Skill for jx-core]] (backlogged P2) defines a `/feedback` skill in jx-core that creates ADO Feature work items from any role plugin via stub delegation.

This plan covers v1: shared logic + stubs for jx-pm and jx-qa only. jx-dev and jx-kb stubs are deferred to v2.

Source: `wiki/ideas/Slash Feedback Skill for jx-core.md` (groomed 2026-05-14, adversarial-reviewed, Codex-reviewed)

---

## Review History

This plan has been through three adversarial review rounds. Key revisions:

1. **Allowlist gap** — Added `Read`, `Write`, and pinned helper Bash scope to command files. Original spec only listed ADO MCP tools.
2. **Tenant binding** — Restored `organization` to `feedback-target.json` (previously dropped because MCP can't verify it). Strengthened typed confirmation to require user to type `{org}/{project}` (not just "create"). Accepted residual risk: MCP cannot expose connected org.
3. **Helper path** — Changed from hard-coded `plugins/jx-core/scripts/...` to `"${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/..."` for installed-plugin portability. Uses the same sibling-plugin traversal already load-bearing in existing stubs.
4. **Hashing** — Moved from inline shell pipeline to pinned helper script with temp-file input, avoiding shell-quoting fragility.
5. **Identity claim** — Dropped `core_get_identity_ids` from the plan. It requires a caller-supplied search filter and cannot discover the connected identity.
6. **Temp file hygiene** — `.feedback-input.tmp` added to `.gitignore`; overwritten with empty content after hashing to prevent sensitive feedback from persisting.
7. **Wiki alignment** — Idea doc update moved to step 1 of execution order to eliminate plan-vs-wiki contract drift.

---

## Files to Create

### 1. `plugins/jx-core/_shared/feedback.md` — Shared logic (new)

The core of the skill. Follows the phased structure of `plugins/jx-core/_shared/ado.md`.

**Phase 1: Validate Input**
1. Read `$ARGUMENTS` — require non-empty freeform text; halt if blank
2. Identify invoking plugin name from the stub's delegation preamble (e.g., "You are invoked from **jx-pm**")

**Phase 2: Tenant Binding**
1. Check for `feedback-target.json` in the working directory root
2. If absent → prompt user for organization, project, and area path; write `feedback-target.json`
3. If present → validate project via `core_list_projects` with `projectNameFilter`:
   - Exactly 1 match → proceed
   - 0 matches → halt: "Project '{project}' not found in the connected ADO organization"
4. Fail closed if MCP connection is stale or `core_list_projects` errors

**MCP limitation:** No MCP tool exposes which organization the server is connected to. `core_list_projects` operates within the configured org but doesn't return the org name. The persisted `organization` field exists so the user can verify it during typed confirmation (Phase 4), not for MCP-based validation.

**Phase 3: Fingerprint + Dedupe Search**
1. Write feedback text to `.feedback-input.tmp` using the `Write` tool (avoids shell-quoting issues with freeform text containing quotes, `$`, backticks, etc.). This file is gitignored (see execution step 1).
2. Run the pinned helper:
   ```
   python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py" .feedback-input.tmp
   ```
   The helper reads the file, normalizes (trim, collapse whitespace, lowercase), and outputs the SHA-256 hex digest to stdout.
3. **Cleanup**: Overwrite `.feedback-input.tmp` with empty content via `Write` tool. Prevents sensitive feedback from persisting in the working directory.
4. Search ADO via `search_workitem` for open work items tagged `feedback-id:<fingerprint>`
5. Exactly 1 match → report existing item ("Already submitted as ADO #12345") and halt
6. Multiple matches → halt and surface conflict for manual resolution
7. 0 matches → proceed

**Phase 4: Confirmation Gate**
1. LLM-summarize feedback text into a concise title (~80 chars max)
2. Show preview:
   - **Organization / Project** (from `feedback-target.json`)
   - **Title** (proposed)
   - **Description** (full feedback text)
   - **Area Path** (from `feedback-target.json` — unvalidated, known limitation)
   - **Tags**: `feedback`, `<invoking-plugin>`, `feedback-id:<fingerprint>`
3. Require typed confirmation: `"Type '{organization}/{project}' to confirm:"`
   The user must type the full org/project string — not just "create" — forcing active verification of the target. This follows the `ado.md` `--new-tenant` pattern for destructive/write operations.

**Accepted residual risk:** The `organization` value comes from `feedback-target.json`, not from MCP. If the MCP server is reconfigured to a different org that has a project with the same name, `core_list_projects` will pass and the Feature will be created in the wrong org. This requires both (a) MCP misconfiguration AND (b) the user typing the wrong org/project at the confirmation gate. Accepted for v1 — the ADO MCP server does not expose its configured org, and no mitigation can fully close this gap without that capability.

**Phase 5: Create Work Item**
1. Call `wit_create_work_item` with:
   - Type: `Feature`
   - Project: from `feedback-target.json`
   - Title: LLM-summarized title
   - Description: full feedback text
   - Area Path: from `feedback-target.json`
   - Tags: `feedback`, `<invoking-plugin>`, `feedback-id:<fingerprint>`
2. On success → emit ADO work item ID and URL to user
3. On failure → surface error clearly (e.g., invalid area path, missing Feature type); do not retry silently

### 2. `plugins/jx-core/scripts/feedback-fingerprint.py` — Pinned helper (new)

Deterministic normalization + SHA-256 hashing. Reads feedback text from a file path argument, outputs hex digest to stdout.

Steps:
1. Read file from `sys.argv[1]` (halt with usage error if no argument)
2. Strip leading/trailing whitespace
3. Collapse all internal whitespace runs (spaces, tabs, newlines) to a single space
4. Convert to lowercase
5. UTF-8 encode and SHA-256 hash
6. Print hex digest to stdout

Follows the pinned helper pattern from `wiki-tools.py` and `xlsx-writer.py` — see [[Pinned Helper]] concept.

Example: `"  The login page\n  is SLOW  "` → `"the login page is slow"` → SHA-256 hex

### 3. `plugins/jx-pm/skills/feedback/SKILL.md` — jx-pm stub (new)

Thin stub following the pattern in `plugins/jx-pm/skills/ado/SKILL.md`:

```yaml
---
name: feedback
user-invocable: true
argument-hint: "<feedback text>"
description: >
  Capture user feedback and create an ADO Feature work item.
  Triggers on: submit feedback, file feedback, capture feedback.
  Do not trigger for: PRD generation, tech spec, task breakdown, ADO sync.
---
```

Body:
- Fail-closed guard: verify `../../../jx-core/_shared/feedback.md` is readable; halt if not
- Delegation preamble: "You are invoked from **jx-pm**."
- Follow all instructions in `../../../jx-core/_shared/feedback.md`

### 4. `plugins/jx-qa/skills/feedback/SKILL.md` — jx-qa stub (new)

Identical structure to jx-pm stub but with:
- Delegation preamble: "You are invoked from **jx-qa**."

### 5. `plugins/jx-pm/commands/feedback.md` — jx-pm command (new)

Following the pattern in `plugins/jx-pm/commands/ado.md`:

```yaml
---
description: Capture feedback and create ADO Feature work item
argument-hint: "<feedback text>"
allowed-tools: Read, Write, Bash(python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py":*), mcp__azure-devops__wit_create_work_item, mcp__azure-devops__search_workitem, mcp__azure-devops__wit_get_work_item, mcp__azure-devops__core_list_projects
---
```

Body: one-line description + `$ARGUMENTS`

### 6. `plugins/jx-qa/commands/feedback.md` — jx-qa command (new)

Identical to jx-pm command file (same allowed-tools).

---

## Files to Modify

### 7. `plugins/jx-qa/.claude-plugin/plugin.json` — Add jx-core dependency

```json
{
  "name": "jx-qa",
  "version": "1.0.0",
  "description": "QA Harness: extract E2E test cases from BRDs, generate Playwright specs, automate browser interactions.",
  "author": { "name": "Jairosoft", "email": "ramon@jairosoft.com" },
  "dependencies": ["jx-core"]
}
```

### 8. `plugins/jx-core/README.md` — Add feedback.md and script to contents table

Add rows:
- `| _shared/feedback.md | Feedback capture skill logic (consumed by jx-pm and jx-qa via stub) |`
- `| scripts/feedback-fingerprint.py | Deterministic normalization + SHA-256 for feedback dedup |`

Update sibling layout to show jx-qa consuming feedback stub.

### 9. `wiki/ideas/Slash Feedback Skill for jx-core.md` — Align idea doc with revised plan

Updates needed to keep plan and idea doc consistent:

**Tenant Binding section:**
- Restore `organization` to `feedback-target.json` schema (3 fields)
- Replace identity validation with project-only validation via `core_list_projects`
- Add typed confirmation gate matching `ado.md` `--new-tenant` pattern
- Document MCP limitation: no tool exposes connected org

**Confirmation Gate section (lines 97-108):**
- Remove "Connected Identity" from preview
- Add typed confirmation: `"Type 'create' to confirm creating in {org}/{project}:"`

**Allowed-tools spec:**
- Add `Read`, `Write`, `Bash(python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py":*)`
- Remove `core_get_identity_ids`

**Acceptance criteria — Tenant Validation:**
- Replace identity-related criteria with project-only + typed confirmation criteria

**Security section:**
- Update allowed-tools list to match revised spec
- Remove `core_get_identity_ids` reference

---

## `feedback-target.json` Schema

Lives in working directory root. Created on first invocation when absent.

```json
{
  "organization": "myorg",
  "project": "MyProject",
  "areaPath": "MyProject\\TeamArea"
}
```

Three required string fields. `organization` is persisted for user verification during typed confirmation — it is NOT validated via MCP (no tool exposes the connected org). `project` is validated via `core_list_projects`. `areaPath` cannot be pre-validated (known limitation).

---

## Normalization Spec (for fingerprint)

Implemented in `plugins/jx-core/scripts/feedback-fingerprint.py`:
1. Read file from path argument
2. Strip leading/trailing whitespace
3. Collapse all internal whitespace runs (spaces, tabs, newlines) to a single space
4. Convert to lowercase
5. UTF-8 encode → SHA-256 → hex string

Example: `"  The login page\n  is SLOW  "` → `"the login page is slow"` → SHA-256

---

## Execution Order

1. Modify `wiki/ideas/Slash Feedback Skill for jx-core.md` — align with revised plan first (add note: "Plan-aligned 2026-05-14; see `.agent/plans/slash-feedback-skill-jx-core-v1.md` for authoritative spec")
2. Add `.feedback-input.tmp` to `.gitignore` — prevent accidental commit of temp feedback file
3. Create `plugins/jx-core/scripts/feedback-fingerprint.py`
4. Create `plugins/jx-core/_shared/feedback.md`
5. Create `plugins/jx-pm/skills/feedback/SKILL.md`
6. Create `plugins/jx-qa/skills/feedback/SKILL.md`
7. Create `plugins/jx-pm/commands/feedback.md`
8. Create `plugins/jx-qa/commands/feedback.md`
9. Modify `plugins/jx-qa/.claude-plugin/plugin.json` — add dependency
10. Modify `plugins/jx-core/README.md` — add feedback.md + script to table

---

## Verification

1. **Structural check**: `find plugins -name "feedback*"` — confirm 6 new files (shared logic, helper script, 2 stubs, 2 commands)
2. **Gitignore check**: `git check-ignore .feedback-input.tmp` — confirm the temp file is ignored
3. **Pinned helper test**: Write test text to `.feedback-input.tmp`, run `python3 plugins/jx-core/scripts/feedback-fingerprint.py .feedback-input.tmp` — confirm deterministic hex output; run twice with same input to verify identical hash. Verify `.feedback-input.tmp` is overwritten with empty content after hashing.
3. **Cross-plugin path test**: From a directory outside the marketplace repo, verify `"${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py"` resolves correctly when CLAUDE_PLUGIN_ROOT is set to a role plugin root
4. **Stub guard test**: Temporarily rename `_shared/feedback.md` → verify stubs halt with error message → rename back
5. **Dependency check**: Read `jx-qa/plugin.json` → confirm `"jx-core"` in dependencies
6. **Command tool surface**: Read both `commands/feedback.md` → confirm allowed-tools include `Read`, `Write`, `Bash(python3 "${CLAUDE_PLUGIN_ROOT}/...":*)`, and 4 ADO MCP tools (no `core_get_identity_ids`)
7. **End-to-end smoke test**: Run `/jx-pm:feedback "Test feedback message"` → confirm:
   - Prompts for org/project/area-path on first run (no `feedback-target.json`)
   - Creates `feedback-target.json` in working directory (3 fields including org)
   - Shows confirmation preview with org/project, title, description, area path, tags
   - Requires typed confirmation: `"Type '{org}/{project}' to confirm:"`
   - On confirm → creates Feature in ADO with correct tags
   - On retry with same text → reports existing item (dedupe)

---

## Pre-existing Working Tree Issue

The `.claude/settings.json` diff removes `enabledPlugins` entries for `jx-qa` and `jx-kb`. This predates this plan and is unrelated to the feedback skill. Restore the entries or separate as a distinct change before smoke-testing `/jx-qa:feedback`.

---

## Out of Scope (v1)

- jx-dev and jx-kb stubs (deferred to v2)
- Organization-level MCP validation (no tool exposes connected org; typed confirmation is the safety net)
- Connected identity resolution (no MCP tool for identity discovery)
- Feature work item type pre-validation
- Area path enumeration/pre-validation
- List/query subcommand for past feedback
- `--dry-run` flag
