# Implementation Plan: Direct PRD-to-ADO Sync Without task.json

## Context

The `/jx-pm:ado` skill currently reads `task.json` to sync work items to Azure Boards. This requires running `/jx-dev:task` first to convert the PRD into task.json — an unnecessary intermediate step. The PRD already contains the hierarchy (Feature → User Stories → ACs) needed for ADO sync. This plan rewrites the ADO skill to read PRD.md directly, storing bindings in PRD frontmatter.

All grooming decisions are final (see `wiki/ideas/Direct PRD-to-ADO Sync Without task.json.md`).

## Step 1: Promote idea to backlogged

- Update `wiki/ideas/Direct PRD-to-ADO Sync Without task.json.md` — change `status: raw` to `status: backlogged`
- Update `wiki/_index.md` — change `[raw]` to `[backlogged]` in the idea entry

## Step 2: Rewrite `plugins/jx-core/_shared/ado.md`

This is the main deliverable. Replace the 8-phase task.json-based skill with a 6-phase PRD-based skill:

| New Phase | Replaces | What it does |
|-----------|----------|-------------|
| 1. Validate Inputs | Old Phase 1 | Resolve docs-root, find PRD.md or BRD_PRD.md (no task.json) |
| 2. Parse PRD | New | Extract Feature metadata, User Stories, ACs from markdown; read `ado_sync` frontmatter if present |
| 3. Tenant Binding | Old Phase 2 | Same logic, reads org/project from `ado_sync` frontmatter instead of task.json |
| 4. Detect & Reconcile | Old Phases 3+4 | Classify items by presence of IDs in frontmatter; verify existing ADO links |
| 5. Create/Update | Old Phase 5 | Feature + User Stories only (no Tasks). Per-item frontmatter write-back. LLM estimates on first sync only |
| 6. Report | Old Phase 8 | Final frontmatter write, memory save, markdown report |

**Removed entirely:** Old Phase 6 (State Sync), Old Phase 7 (Prune Tombstones)

Key behaviors:
- **PRD parsing**: Extract from `## Document Metadata` (Feature ID/Name), `### US-{NNN}-{seq}` headings (stories), `AC-{NNN}-{seq}` lines (criteria → content in Story AC field, not separate work items)
- **Frontmatter write-back**: After each `wit_create_work_item`, call pinned helper script to merge `ado_sync` into PRD frontmatter (temp+rename for atomicity). See Step 2b.
- **Work item tagging**: Each ADO work item gets a tag `prd:{story_id}` (e.g., `prd:US-010-01`) at creation. Feature gets `prd:FEAT-{id}`.
- **Crash recovery**: Search Azure by `prd:` tag (immutable), fail-closed (exactly 1 match reuse, 0 create, 2+ halt). Tag-based search replaces title-prefix search.
- **Estimates**: LLM-derived Story Points on first sync; never overwrite on subsequent syncs
- **No state changes**: Never modify ADO work item state (Active, Closed, etc.)
- **Orphan reporting**: Stories in frontmatter but not in PRD body are reported, not closed
- **Tenant org verification**: Known limitation — no MCP tool exposes the connected org. Org is stored in frontmatter for user verification at confirmation time, not MCP-validated. Same treatment as the feedback skill.

Confirmation gates retained: `--new-tenant` (`rebind`). Removed: `recreate`, `sync`, `--prune`.

## Step 2b: Create pinned helper `plugins/jx-core/scripts/frontmatter-sync.py`

A Python script that safely merges `ado_sync` data into PRD frontmatter:

- **Input**: PRD file path + JSON string with `ado_sync` fields to merge
- **Behavior**: Reads PRD, parses YAML frontmatter (or creates it if absent), deep-merges the `ado_sync` block, preserves all other frontmatter keys and the full markdown body
- **Atomicity**: Writes to a temp file, then renames over the original
- **Error handling**: Exits non-zero on parse failure, never writes a corrupted file

Authorize in `allowed-tools` as: `Bash(python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/frontmatter-sync.py":*)`

## Step 3: Update `plugins/jx-pm/commands/ado.md`

- Description: "Sync PRD to Azure Boards (Features, Stories)"
- Remove `--prune` from argument-hint
- allowed-tools: Add `core_list_projects`, add pinned helper `Bash(python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/frontmatter-sync.py":*)`, remove `wit_work_items_link`

## Step 4: Update `plugins/jx-pm/skills/ado/SKILL.md`

- Description: reference PRD sync, not task.json
- Remove `--prune` from argument-hint
- Update trigger text: "populate boards from PRD" replaces "populate boards from task json"
- Stub body unchanged (still delegates to `jx-core/_shared/ado.md`)

## Step 5: Delete `plugins/jx-pm/skills/ado/references/sync-states.md`

State transition rules are obsolete — ADO owns state.

## Step 6: Update `plugins/jx-pm/skills/pipeline/SKILL.md`

Update the "Full Workflow (Manual)" section to show ADO sync can happen right after PRD:
```
1. /jx-pm:prd   → PRD.md
2. /jx-pm:ado   → Azure work items (reads PRD directly)
3. /jx-dev:spec → TECH_SPEC.md (optional)
4. /jx-dev:task → task.json (optional)
```

## Files Modified

| File | Action | Description |
|------|--------|-------------|
| `wiki/ideas/Direct PRD-to-ADO Sync Without task.json.md` | edit | Promote to backlogged |
| `wiki/_index.md` | edit | Update status tag |
| `plugins/jx-core/_shared/ado.md` | rewrite | New 6-phase PRD-based skill |
| `plugins/jx-core/scripts/frontmatter-sync.py` | create | Pinned helper for safe YAML frontmatter merge + atomic write |
| `plugins/jx-pm/commands/ado.md` | edit | Description, args, allowed-tools |
| `plugins/jx-pm/skills/ado/SKILL.md` | edit | Description, args, triggers |
| `plugins/jx-pm/skills/ado/references/sync-states.md` | delete | Obsolete |
| `plugins/jx-pm/skills/pipeline/SKILL.md` | edit | Updated workflow order |

## Files Reused As-Is

- `plugins/jx-core/_shared/docs-root.md` — docs-root resolution
- `plugins/jx-core/_shared/id-rules.md` — ID validation
- `plugins/jx-core/_shared/task-json-schema.md` — still used by `/jx-dev:task`, not by ado

## Verification

1. **Fresh PRD sync**: Run on a PRD with no frontmatter → verify `ado_sync` block inserted, Feature + Stories created in ADO
2. **Re-sync**: Run again → verify titles/descriptions updated, Story Points preserved
3. **Orphan detection**: Remove a story from PRD body, re-sync → verify reported but not closed in ADO
4. **Tenant mismatch**: Edit `ado_sync.organization` to wrong value → verify HALT
5. **No Tasks created**: After sync, query ADO children of each Story → verify no Task work items
6. **Dry-run**: Run with `--dry-run` → verify no ADO writes, no frontmatter changes
7. **Crash recovery**: Create a Story manually in ADO with correct title prefix → verify skill finds and reuses it
