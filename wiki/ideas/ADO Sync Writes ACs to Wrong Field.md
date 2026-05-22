---
title: ADO Sync Writes ACs to Wrong Field
type: idea
tags: [jx-pm, jx-core, ado, acceptance-criteria, bug, spec-gap]
created: 2026-05-22
updated: 2026-05-22
status: backlogged
priority: P1
effort: small
source: Live ADO sync session (2026-05-22)
aliases: [ado ac field bug, acceptance criteria wrong field]
provenance: synthesis
---

# ADO Sync Writes ACs to Wrong Field

## Problem

The ADO sync skill (`jx-core/_shared/ado.md`) specifies two separate fields for User Stories:

- **Description** (`System.Description`): "As a / I want / So that" block + "Validates:" reference
- **Acceptance Criteria** (`Microsoft.VSTS.Common.AcceptanceCriteria`): Routed ACs by format_group

But during execution, all content (story description + ACs) is written to `System.Description` only. The dedicated `Microsoft.VSTS.Common.AcceptanceCriteria` field is left empty.

### Root Cause

The skill uses `wit_add_child_work_items` for story creation because it auto-links stories to the Feature parent. However, this tool only accepts `title` and `description` parameters — it has no `acceptanceCriteria` parameter. The agent stuffs everything into `description` to avoid data loss.

### Spec Gap

The skill spec (lines 163-177) correctly designs the two-field layout but:

1. Never names the ADO field (`Microsoft.VSTS.Common.AcceptanceCriteria`)
2. Never prescribes which MCP tool to use for story creation
3. Doesn't address the `wit_add_child_work_items` limitation

## Decision: Option B — Create then Update

Use `wit_add_child_work_items` for creation + parent linking (its strength), then follow up with `wit_update_work_item` per story to:

1. Move ACs into `Microsoft.VSTS.Common.AcceptanceCriteria`
2. Clean `System.Description` to contain only the story description (As a / I want / So that + Validates)

### Why Option B

- Both tools are already in `allowed-tools` — no permission changes needed
- Preserves automatic parent linking (avoids manual relation management)
- Two calls per story is acceptable overhead — stories are created once, not frequently
- Simpler than Option C (wit_create_work_item + manual parent linking via relations API)

### Why Not Option A or C

- **Option A** (keep current behavior): Violates the spec's two-field design; ADO boards show empty AC field
- **Option C** (wit_create_work_item + manual link): More complex; `wit_add_child_work_items` doesn't link existing items, so parent linking would require a different tool or raw relation patching

## Scope

### Modified Files

| File | Changes |
|------|---------|
| `plugins/jx-core/_shared/ado.md` | Phase 5: (1) Add explicit field name `Microsoft.VSTS.Common.AcceptanceCriteria`. (2) Prescribe two-step creation: `wit_add_child_work_items` for create+link, then `wit_update_work_item` to set AC field and clean Description. (3) Add field name to Phase 5 Field Update Rules table. |

### Unchanged

| File | Reason |
|------|--------|
| `plugins/jx-pm/commands/ado.md` | `wit_update_work_item` already in allowed-tools |
| `plugins/jx-pm/skills/ado/SKILL.md` | Stub — delegates to jx-core shared |
| `plugins/jx-core/scripts/frontmatter-sync.py` | No field changes — frontmatter tracks IDs, not AC content |
| `plugins/jx-core/scripts/validate-ac-blocks.sh` | Validates PRD structure, not ADO field mapping |

## Acceptance Criteria

- AC-1: After sync, `Microsoft.VSTS.Common.AcceptanceCriteria` contains routed ACs (Gherkin format for scenarios/rules, pass-through for system_behavior)
- AC-2: After sync, `System.Description` contains only the story description ("As a / I want / So that" + "Validates:") — no ACs
- AC-3: Quality gate ACs are excluded from both fields (unchanged behavior)
- AC-4: The spec explicitly names `Microsoft.VSTS.Common.AcceptanceCriteria` as the target field
- AC-5: The spec prescribes the two-step tool sequence (create+link, then update AC field)
- AC-6: Existing `--dry-run` output shows AC field mapping per story
- AC-7: Update mode (re-sync) correctly overwrites the AC field per Field Update Rules

## Verification

1. Run `--dry-run` — verify output shows Description and AC field separately
2. Run live sync on a test PRD — verify `wit_get_work_item` shows both fields populated correctly
3. Run re-sync (update mode) — verify AC field updates, Story Points preserved

## Dependencies

None. Backward compatible — new syncs populate both fields; existing syncs with combined Description still work (update mode will split them on next sync).
