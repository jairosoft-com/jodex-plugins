# FEAT-002: ADO Sync AC Field Fix — Implementation Plan

## Context

The ADO sync skill (`plugins/jx-core/_shared/ado.md`) creates User Story work items but writes acceptance criteria into `System.Description` instead of `Microsoft.VSTS.Common.AcceptanceCriteria`. Root cause: `wit_add_child_work_items` only accepts title+description (no AC field). The spec never names the ADO field or prescribes tool sequence.

**Decision:** Option B — use `wit_add_child_work_items` for creation + parent linking, then `wit_update_work_item` per story to set AC field and clean Description.

**Single file change:** `plugins/jx-core/_shared/ado.md`

## AC-to-Section Mapping

| AC | Description | Target Section |
|----|-------------|----------------|
| AC-002-01 | AC field populated on create | Creation Order, Work Item Fields |
| AC-002-02 | Description contains only narrative | Creation Order, Work Item Fields |
| AC-002-03 | Quality-gate-only leaves AC empty | Already handled (line 173) |
| AC-002-04 | Crash recovery between steps | Crash Recovery |
| AC-002-08 | Update mode splits combined content | Field Update Rules |
| AC-002-09 | Update overwrites both fields | Field Update Rules (PRD wins) |
| AC-002-10 | Story Points preserved | Already handled (line 186) |
| AC-002-14 | Spec names AC field | Work Item Fields |
| AC-002-15 | Two-step creation prescribed | Creation Order |
| AC-002-16 | Field Update Rules table includes AC field name | Field Update Rules |
| AC-002-17 | wit_add_child_work_items gets only narrative | Creation Order, Work Item Fields |
| AC-002-18 | Unambiguous tool sequence | Creation Order |
| AC-002-22-25 | Dry-run shows field mapping | Dry-Run |

## Edits (7 surgical changes, single file)

### Edit 1: Creation Order (lines 149-154)
Add two-step tool sequence prescription:
- Step 2a: `wit_add_child_work_items` — create + parent-link, description = narrative only
- Step 2b: `wit_update_work_item` — set `Microsoft.VSTS.Common.AcceptanceCriteria`, clean Description, AND set Tags + Story Points in the same call (reduces API calls from 3 to 2 per story)
- Step 3: Frontmatter write-back after 2a (before 2b) for crash safety

### Edit 2: Work Item Fields — User Story (lines 163-177)
- Add `(System.Description)` to Description bullet with "**No acceptance criteria content.**"
- Add `(Microsoft.VSTS.Common.AcceptanceCriteria)` to AC bullet with HTML format note and tool reference
- Change "AC field" references to explicit field name
- Note that Tags and Story Points are set in the same step 2b call (not separate calls)

### Edit 3: Field Update Rules (lines 179-190)
- Add `ADO Field Path` column with explicit system field names for all rows
- Clarify Description row: "(narrative only, no ACs)"
- Add paragraph: update mode corrects legacy stories with combined content
- Note: "PRD wins" means both fields are overwritten from source — no detection logic needed for legacy content

### Edit 4: Per-Item Frontmatter Write-Back (lines 191-200)
- Distinguish Feature (single-step via `wit_create_work_item`) from User Story (two-step)
- Explicit "write-back after step 2a, before step 2b" timing

### Edit 5: Crash Recovery (lines 202-208)
- Split into Window 1 (create-to-write-back, existing logic with tag-based search) and Window 2 (write-back-to-AC-update, new)
- Window 2 recovery: frontmatter already has the ID (write-back happens after 2a), so update mode auto-corrects on next sync — no tag search needed for this window
- Note: AC-002-04 in the PRD mentions "tag-based search" but that applies to Window 1 only; Window 2 uses update-mode correction

### Edit 6: Dry-Run (lines 210-216)
- Add per-story field mapping output: Description preview, AC preview, excluded quality gates with reason

### Edit 7: Checklist (after line 259)
- Add two items: AC field populated via two-step flow; Description contains narrative only

## Adversarial Review Findings (Round 1)

| ID | Severity | Finding | Resolution |
|----|----------|---------|------------|
| F-01 | warning | AC-002-04 says "tag-based search" but Window 2 uses update-mode (ID already persisted) | Edit 5 clarifies the two windows; no plan change |
| F-02 | warning | Update mode detection logic for legacy stories unspecified | "PRD wins" makes detection moot; Edit 3 note added |
| F-03 | info | Mixed format_groups — no special handling needed | Routing rules unchanged, only target field changes |
| F-04 | info | Zero functional ACs — already handled at line 173 | Edit 2 preserves with explicit field name |
| F-05 | info | Tags + Story Points should batch into step 2b call | Edit 1 and Edit 2 updated |

**Verdict:** No critical or structural issues. Plan is at diminishing returns.

## What NOT to change
- `plugins/jx-pm/commands/ado.md` — `wit_update_work_item` already in allowed-tools
- `plugins/jx-core/scripts/frontmatter-sync.py` — no field changes
- `plugins/jx-core/scripts/validate-ac-blocks.sh` — validates PRD structure, not ADO fields
- Phases 1-4, 6 — unchanged
- Confirmation Gates table — unchanged

## Verification

1. Read-back: After editing, read `ado.md` and confirm all 7 edits are present
2. AC coverage: Walk the AC-to-section mapping and verify each AC is addressed
3. Dry-run test: Run `/jx-pm:ado --dry-run --docs-root docs` on FEAT-001 PRD and verify output shows Description vs AC field separately
4. Live sync test: Run `/jx-pm:ado` on FEAT-002 PRD and verify `wit_get_work_item` shows both fields populated
5. Backlog update: Mark `wiki/ideas/ADO Sync Writes ACs to Wrong Field.md` status to completed
