---
name: ado
user-invocable: true
argument-hint: "[--dry-run] [--tenant <org>/<project>] [--docs-root <path>] [--new-tenant]"
description: >
  Synchronize PRD.md / BRD_PRD.md to Azure Boards. Creates Feature and User Story hierarchy.
  Triggers on: sync to azure boards, create azure work items, populate boards from PRD.
  Do not trigger for: PRD generation, tech spec generation, task breakdown, wiki operations.
---

# Azure Boards Sync

Synchronize PRD to Azure Boards via MCP tools. Creates Feature and User Story work items, maintains bindings in PRD frontmatter.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--dry-run` | No | — | Show planned operations without executing |
| `--tenant` | No | — | Explicit `<org>/<project>` override |
| `--docs-root` | No | `docs/` or `$JX_DOCS_ROOT` | Output directory root |
| `--new-tenant` | No | — | Strip existing Azure IDs and re-sync to different tenant (destructive) |

## Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| Normal | No `ado_sync` in PRD frontmatter | Create all items |
| Partial | Some stories have work item IDs | Create only missing items |
| Update | All items synced | Update existing items with current PRD content |

---

## Phase 1: Validate Inputs

1. Resolve folder path per `../../../jx-core/_shared/docs-root.md`
2. Validate folder name per `../../../jx-core/_shared/id-rules.md`
3. Detect source document: look for `PRD.md` first, then `BRD_PRD.md`. Halt if neither exists: "No PRD.md or BRD_PRD.md found in {folder}."
4. Verify Azure DevOps MCP tools are available

---

## Phase 2: Parse PRD

### Frontmatter

1. If PRD begins with `---`, parse the YAML frontmatter block
2. Extract `ado_sync` key if present. Preserve all other frontmatter keys for later merge.
3. If no frontmatter or no `ado_sync` → treat as first sync

### Body

Extract from markdown:

1. **Feature metadata**: From `## Document Metadata` section, extract Feature ID (3-digit) and Feature Name. Validate Feature ID matches folder feature number.
2. **Feature description**: Extract from `## Executive Summary`, `## Overview`, or `## Introduction` — whichever exists first.
3. **User Stories**: Find all `### US-{NNN}-{seq}: {Title}` headings. For each story extract:
   - Story ID (e.g., `US-010-01`)
   - Title (text after the colon)
   - Description: the "As a / I want / So that" block
   - Acceptance Criteria with format context: for each AC, produce `{ac_id, text, format_group}`:
     - Locate `**Acceptance Criteria:**` container within the story. Sub-header detection is SCOPED to the AC block only (between `**Acceptance Criteria:**` and the block boundary: `**Validates:**`, next `### US-` heading, next `##` heading, or end of story)
     - Within the AC block, scan for routing sub-headers: `**Scenarios:**`, `**Rules:**`, `**System Behavior:**` (alias `**System State:**`), `**Quality Gates:**`
     - ACs following a routing sub-header inherit that sub-header's format_group (`scenarios`, `rules`, `system_behavior`, `quality_gates`)
     - `**Acceptance Criteria:**` itself is a non-routing container (resets format_group to none)
     - ACs with no preceding format sub-header → `format_group = "legacy"`
     - **Orphaned format promotion:** For legacy ACs, check if text contains full Given/When/Then structure (all three keywords) → promote to `scenarios_inferred`. If text contains both `When ` and `system ` → promote to `system_behavior_inferred`. Partial matches remain `legacy`.
   - "Validates:" reference (included in description for traceability)

4. **Quality gate metadata extraction**: From `## Document Metadata`, read `Quality Gates:` bullet list. Parse each bullet as one gate phrase, strip `[ui-only]` tags for exclusion matching.
   - If `Quality Gates:` is present as a bullet list → use as the authoritative exclusion list
   - If `Quality Gates:` is present but malformed (e.g., comma-separated) → **halt with error**: "Malformed Quality Gates metadata. Expected bullet list, found comma-separated value. Fix PRD Document Metadata."
   - If `Quality Gates:` is entirely absent → use default gates: `Lint passes`, `Typecheck passes`, `Unit tests pass`, `E2E tests pass` (backward compat with legacy PRDs)
   - Fallback is keyed on absence of `Quality Gates:`, NOT on `Quality Profile:`

5. **Pre-sync AC validation**: Run the shared validator before proceeding:
   ```bash
   bash ../scripts/validate-ac-blocks.sh {prd_file}
   ```
   Halt with line-numbered errors if any orphan/continuation lines detected. This catches hand-edited PRDs that bypass the PRD generator's Phase 6 validation.

The parser handles all three template variants (lite, standard, unified BRD-PRD) and both legacy (no sub-headers) and new-format (with sub-headers) PRDs.

---

## Phase 3: Tenant Binding

**PRD frontmatter `ado_sync` is authoritative. Memory is suggestion only.**

**Known limitation:** No MCP tool exposes which organization the server is connected to. The `organization` field is stored for user verification during confirmation, not MCP-validated.

### First sync (no `ado_sync` block)
1. Check agent memory for last-used org/project
2. Display suggestion: "Sync to {org}/{project}? (from memory)"
3. User confirms or provides different org/project
4. Validate project: Call `mcp__azure-devops__core_list_projects` with `projectNameFilter`. Exactly 1 match → proceed. 0 matches → halt.
5. Bind on first successful write-back to frontmatter

### Subsequent syncs (`ado_sync.organization` and `ado_sync.project` present)
1. Read org/project from frontmatter
2. Compare against current MCP connection (project name only — org cannot be verified)
3. If project mismatch: **HALT** — "Tenant mismatch: PRD bound to {stored}, connected to {current}. Use --new-tenant to re-bind."

### --new-tenant flag (destructive — confirmation gate)
1. Show all Azure IDs from `ado_sync.stories` map + `feature_work_item_id`
2. Require typed confirmation: "Type 'rebind' to strip Azure IDs and sync to new tenant:"
3. Clear the entire `ado_sync` block from frontmatter via pinned helper
4. Proceed with fresh sync

---

## Phase 4: Detect Sync State & Hierarchy Reconciliation

### Sync state detection

- `ado_sync.feature_work_item_id` absent → Feature needs creation
- For each story from Phase 2: check if `ado_sync.stories[{story_id}]` has a value. No value → needs creation.
- **Orphans**: any key in `ado_sync.stories` whose ID does not appear in parsed PRD body. Report in dry-run and final report. Do NOT close or modify in ADO.

### Determine mode
- No `ado_sync` block or all IDs absent → Normal (create all)
- Some story IDs present, some absent → Partial (create missing, update existing)
- All IDs present → Update only

### Hierarchy reconciliation (for items with existing Azure IDs)
1. **Feature**: verify it exists in Azure via `wit_get_work_item`
2. **Each Story**: verify it exists and is linked to Feature parent. Repair link with `wit_add_child_work_items` if missing.
3. **Item not found in Azure** (deleted externally): warn, clear ID from `ado_sync.stories`, treat as needs-creation.

Include reconciliation results in `--dry-run` output.

---

## Phase 5: Create/Update Work Items

### Title Convention

- Feature: `{featureId}: {featureName}`
- User Story: `{story.id}: {story.title}`

### Work Item Tagging

Every work item gets an immutable source tag at creation:
- Feature: `prd:FEAT-{featureId}` (e.g., `prd:FEAT-010`)
- User Story: `prd:{story.id}` (e.g., `prd:US-010-01`)

Tags are used for crash recovery identification. Never modify or remove them.

### Creation Order

1. Feature (if not exists)
2. User Stories (as children of Feature)

**No ADO Task work items are created.** Acceptance criteria are not tasks — they become content in the User Story AC field.

### Work Item Fields

**Feature:**
- Title: `{featureId}: {featureName}`
- Description: Executive Summary / Overview content from PRD
- Tags: `prd:FEAT-{featureId}`

**User Story:**
- Title: `{story.id}: {story.title}`
- Description: "As a / I want / So that" block + "Validates:" reference
- Acceptance Criteria field: Route each AC by its `format_group` from Phase 2:
  - `scenarios` / `scenarios_inferred` → pass through as-is (already Gherkin)
  - `rules` / `legacy` (after exclusion) → synthesize Gherkin from behavioral statement
  - `system_behavior` / `system_behavior_inferred` → pass through as-is (technical behavior spec)
  - `quality_gates` → exclude from AC field
  - `legacy` with normalized exact-phrase match → exclude (phrases from PRD `Quality Gates:` metadata, or default gates if absent, after stripping trailing annotations like `*(UI stories only)*`)
  - **Sub-header routing is authoritative:** ACs under functional sub-headers (scenarios, rules, system_behavior) are NEVER phrase-excluded.
  - If only quality-gate ACs remain → leave AC field empty, log warning.
  - **Inferred-routing confirmation:** If any ACs were promoted to `scenarios_inferred` or `system_behavior_inferred`, display the inferred routing before any write (all non-dry-run modes: Normal, Partial, Update). User must confirm before ADO writes proceed.
  - Dry-run output shows format routing per AC: `AC-NNN-NN [format_group] → action: "text"`
- Story Points: LLM-derived estimate (1/2/3/5/8 scale). Weight by functional scenario count (excluding quality gates), not raw AC line count. **First sync only — never overwrite on subsequent syncs.**
- Tags: `prd:{story.id}`

### Field Update Rules (on update of existing items)

| Field | Behavior |
|-------|----------|
| Title | PRD wins — always update |
| Description | PRD wins — always update |
| Acceptance Criteria (text) | PRD wins — always update |
| Story Points | Preserve ADO value (never overwrite after first sync) |
| State | Never touch (ADO owns state) |
| Area Path | Never touch |
| Iteration Path | Never touch |

### Per-Item Frontmatter Write-Back

After EACH successful `wit_create_work_item`:
1. Capture the returned work item ID and URL
2. Call pinned helper `frontmatter-sync.py` with updated `ado_sync` fields:
   - For Feature: set `feature_work_item_id` and `feature_work_item_url`
   - For Story: add `{story_id}: {work_item_id}` to `ado_sync.stories` map
   - Set `last_synced` to current ISO timestamp
   - Set `organization` and `project` (on first sync)
3. The helper performs atomic temp+rename — no partial writes

### Crash Recovery

If frontmatter lacks ID for an item that should exist (crash between create and write-back):
1. Search Azure by tag: `prd:{item_id}` (immutable marker)
2. Exactly 1 match → reuse (write ID back to frontmatter via helper)
3. 0 matches → create new
4. 2+ matches → HALT, show duplicates, require manual resolution (fail-closed)

### Dry-Run

If `--dry-run` is set:
- Show all planned operations (creates, updates, reconciliation)
- Do NOT call any ADO write tools
- Do NOT modify PRD frontmatter
- Exit after displaying the plan

---

## Phase 6: Sync Report

### Update frontmatter

Final write-back ensuring `last_synced`, `organization`, `project` are current.

### Save memory

Store org/project as suggestion for next time.

### Display report

Markdown report:
- Source folder and PRD path
- Azure organization and project
- Sync mode used
- Counts: Features created/updated, Stories created/updated/skipped
- Orphans: story IDs in frontmatter but not in PRD body (with Azure work item IDs for manual review)
- Reconciliation: links repaired
- Warnings and errors

---

## Confirmation Gates

| Operation | Confirmation word | What it does |
|---|---|---|
| `--new-tenant` | `rebind` | Clears `ado_sync` block, re-syncs to different tenant |
| Inferred AC routing | `confirm` | Proceeds with inferred `scenarios_inferred` / `system_behavior_inferred` routing for legacy ACs without sub-headers |

---

## Checklist

- [ ] PRD.md or BRD_PRD.md found in folder
- [ ] Feature ID extracted and matches folder feature number
- [ ] User Stories and ACs parsed from PRD body
- [ ] Tenant binding verified (or first-bind confirmed via `core_list_projects`)
- [ ] Hierarchy reconciliation completed (Feature + Story links verified/repaired)
- [ ] Per-item frontmatter write-back after each create (via pinned helper, atomic)
- [ ] Crash recovery uses tag-based search, fail-closed (exactly 1 match or halt)
- [ ] AC block validation passed (shared validator, no orphan/continuation lines)
- [ ] AC format routing applied per format_group (scenarios→pass-through, rules/legacy→synthesize, system_behavior→pass-through, quality_gates→exclude)
- [ ] Quality-gate exclusion: sub-header layer + normalized exact-phrase layer (legacy only); sub-header routing is authoritative
- [ ] Inferred routing confirmed by user (if any scenarios_inferred/system_behavior_inferred ACs present)
- [ ] Story Points weighted by functional scenario count (excluding quality gates); first sync only
- [ ] Orphaned stories reported but not modified in ADO
- [ ] No Task work items created
- [ ] All work items tagged with `prd:{source_id}`
- [ ] Sync report generated
