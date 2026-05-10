---
name: ado
user-invocable: true
argument-hint: "[--dry-run] [--tenant <org>/<project>] [--docs-root <path>] [--prune] [--new-tenant]"
description: >
  Synchronize task.json to Azure Boards. Creates Feature, User Stories, and Tasks hierarchy.
  Supports dry-run preview, state sync, and stale item pruning.
  Triggers on: sync to azure boards, create azure work items, populate boards from task json, sync state to azure.
  Do not trigger for: PRD generation, tech spec generation, task breakdown, wiki operations.
---

# Azure Boards Sync

Synchronize task.json to Azure Boards via MCP tools. Creates work item hierarchy, maintains bindings, and reconciles state.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--dry-run` | No | — | Show planned operations without executing |
| `--tenant` | No | — | Explicit `<org>/<project>` override |
| `--docs-root` | No | `docs/` or `$JX_DOCS_ROOT` | Output directory root |
| `--prune` | No | — | Close tombstoned Azure work items (destructive, requires confirmation) |
| `--new-tenant` | No | — | Strip existing Azure IDs and re-sync to different tenant (destructive) |

## Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| Normal | No Azure metadata in task.json | Create all items |
| Partial | Some items have `azureWorkItemId` | Create only missing items |
| Update | All items synced, user requests update | Update existing items with current content |
| Force recreate | User requests | Clear Azure refs, create all fresh |
| State sync | User requests | Update ADO states from `passes` flags |

---

## Phase 1: Validate Inputs

1. Resolve folder path per `../../../jx-core/_shared/docs-root.md`
2. Validate folder name per `../../../jx-core/_shared/id-rules.md`
3. Require `task.json` in folder (halt if missing)
4. Validate JSON structure per `../../../jx-core/_shared/task-json-schema.md`: require `project`, `featureName`, `featureId`, `userStories`
5. Validate `featureId` matches folder feature number
6. Verify Azure DevOps MCP tools are available

---

## Phase 2: Tenant Binding

**task.json is authoritative. Memory is suggestion only.**

### First sync (no Azure metadata in task.json)
1. Check agent memory for last-used org/project
2. Display suggestion: "Sync to {org}/{project}? (from memory)"
3. User confirms or provides different org/project
4. Bind to task.json on first successful write

### Subsequent syncs (Azure metadata exists)
1. Read `azureOrganization`/`azureProject` from task.json
2. Compare against current MCP connection
3. If mismatch: **HALT** — "Tenant mismatch: task.json bound to {stored}, connected to {current}. Use --new-tenant to re-bind."

### --tenant flag
- If provided, override MCP connection target
- Must still pass mismatch check against task.json binding

### --new-tenant flag (destructive — confirmation gate)
1. Show all Azure IDs that will be stripped
2. Create timestamped backup: `task.json.{org}.{project}.{timestamp}.bak`
3. Require typed confirmation: "Type 'rebind' to strip Azure IDs and sync to new tenant:"
4. Tombstone all existing Azure IDs as `{previousTenant: {org, project, ids: [...]}}`
5. Proceed with fresh sync to new tenant

---

## Phase 3: Detect Sync State

Classify each item in task.json:

- **Root Feature:** has/lacks `azureWorkItemId`
- **Each User Story:** has/lacks `azureWorkItemId`
- **Each AC:** has/lacks `azureWorkItemId`
- **Tombstoned items:** `{removed: true}` — skip for creation, report in dry-run

Determine mode:
- All items lack IDs → Normal (create all)
- Some items have IDs → Partial (create missing only)
- All items have IDs → prompt: Update / Force recreate / State sync / Skip

---

## Phase 4: Hierarchy Reconciliation

**Runs on every sync (not just retries).** Before creating anything new:

For each item with `azureWorkItemId`:
1. **Feature:** verify it exists in Azure (query by ID)
2. **User Stories:** verify each is linked to Feature parent. Create link if missing.
3. **Tasks:** verify each is linked to its User Story parent. Create link if missing.

**Conflict handling:**
- Item linked to wrong parent → HALT, show conflict, require manual resolution
- Item not found in Azure (deleted externally) → warn, clear local ID, treat as needs-creation

Include reconciliation results in `--dry-run` output.

---

## Phase 5: Create/Update Work Items

### Title Convention

All work items titled with source ID prefix:
- Feature: `{featureId}: {featureName}`
- User Story: `{story.id}: {story.title}`
- Task: `{criterion.id}: {criterion.text}`

### Creation Order

1. Feature (if not exists)
2. User Stories (child of Feature)
3. Tasks (child of respective User Story)

### Per-Item Write-Back

After EACH individual create:
1. Capture `azureWorkItemId` and `azureWorkItemUrl`
2. Write immediately to task.json (temp+rename)
3. Proceed to next item

This minimizes crash-without-ID window to single item.

### Crash Recovery Fallback

If task.json lacks ID for an item (rare — only after crash between create and write-back):
1. Search Azure by title prefix at correct hierarchy level
2. Exactly 1 match → reuse (write ID back)
3. 0 matches → create new
4. 2+ matches → HALT, show duplicates, require manual resolution (fail-closed)

### Work Item Fields

**Feature:**
- Title: `{featureId}: {featureName}`
- Description: feature description + business context

**User Story:**
- Title: `{story.id}: {story.title}`
- Description: story description
- Acceptance Criteria field: Gherkin (extracted from PRD or synthesized from behavioral ACs)
- Story Points: from `storyPoints`

**Task:**
- Title: `{criterion.id}: {criterion.text}`
- Description: criterion text
- Original Estimate: from `estimatedHours`

### Gherkin for User Story AC Field

1. Check PRD for inline Gherkin blocks in story section → use if found
2. No inline Gherkin → synthesize from behavioral acceptance criteria
3. Exclude quality-gate criteria (lint, typecheck, tests) from synthesis
4. If only quality-gate criteria remain → leave AC field empty, log warning

---

## Phase 6: State Sync

**Only runs in State Sync mode.** Reads `passes` flags from task.json and updates Azure states.

### Task (AC) State Transitions

| AC `passes` | Current ADO State | Action |
|---|---|---|
| `true` | New | → Active → Closed (two updates) |
| `true` | Active | → Closed |
| `true` | Closed | No change |
| `false` | Resolved/Closed | → Active (reopen) |
| `false` | New/Active | No change |
| — | Removed | Log warning, skip |

### User Story State Transitions

Story complete = `passes: true` AND every AC `passes: true`

| Complete? | Current ADO State | Action |
|---|---|---|
| Yes | New | → Active → Resolved |
| Yes | Active | → Resolved |
| Yes | Resolved | No change |
| No | Resolved/Closed | → Active (reopen) |
| No | New/Active | No change |

### Feature State Transitions

All stories pass = every story `passes: true` AND ADO cross-check (all child stories Resolved/Closed)

| All pass? | Current ADO State | Action |
|---|---|---|
| Yes | New | → Active → Resolved |
| Yes | Active | → Resolved |
| Yes | Resolved | No change |
| No | Resolved/Closed | → Active (reopen) |
| No | New/Active | No change |

Process order: Tasks → Stories → Feature (bottom-up).

---

## Phase 7: Prune Tombstoned Items

**Only runs with `--prune` flag. Destructive — confirmation gate required.**

1. Find all tombstoned items in task.json (`removed: true` with `azureWorkItemId`)
2. Show preview:
   - Work item ID, title, current Azure state
   - Intended action: Close work item
3. Create timestamped backup of task.json
4. Require typed confirmation: "Type 'prune' to close {N} stale Azure work items:"
5. Close each tombstoned work item in Azure (set state to Closed)
6. Remove tombstones from task.json
7. Write updated task.json

---

## Phase 8: Sync Report & Save

### Update task.json

- Add/update `azureWorkItemId`, `azureWorkItemUrl` per item
- Set `lastSyncedToAzure` to current ISO timestamp
- Set `azureOrganization`, `azureProject`
- Save agent memory with org/project as suggestion for next time

### Generate Report

Display markdown report:
- Source folder, PRD path
- Azure organization and project
- Sync mode used
- Counts: Features, Stories, Tasks created/updated/skipped
- Reconciliation: links repaired
- Tombstones: stale items (if any)
- State sync: items transitioned (if state sync mode)
- Warnings and errors

---

## Confirmation Gates

All destructive external-state operations require preview + typed confirmation:

| Operation | Confirmation word | What it does |
|---|---|---|
| Force recreate | `recreate` | Clears all Azure refs, creates fresh |
| State sync | `sync` | Updates Azure work item states from passes |
| `--new-tenant` | `rebind` | Strips Azure IDs, re-syncs to different tenant |
| `--prune` | `prune` | Closes tombstoned Azure work items |

---

## Checklist

- [ ] task.json exists and passes schema validation
- [ ] Feature ID matches folder feature number
- [ ] Tenant binding verified (or first-bind confirmed)
- [ ] Hierarchy reconciliation completed (links verified/repaired)
- [ ] Per-item write-back after each create
- [ ] Crash recovery uses fail-closed lookup (exactly 1 match or halt)
- [ ] Gherkin extracted/synthesized for User Story AC field
- [ ] State sync processes bottom-up (Tasks → Stories → Feature)
- [ ] Tombstoned items reported in dry-run
- [ ] Destructive operations behind confirmation gates
- [ ] Sync report generated
