---
title: Direct PRD-to-ADO Sync Without task.json
type: idea
status: raw
created: 2026-05-18
updated: 2026-05-18
source: user request
source_count: 0
provenance: synthesis
groomed: 2026-05-18
tags:
  - jx-pm
  - ado
  - prd
  - refactor
links:
  - "[[ADO State Sync Model]]"
  - "[[Plugin Pipeline Sequence]]"
---

# Direct PRD-to-ADO Sync Without task.json

Change `/jx-pm:ado` to sync directly from PRD.md (or BRD_PRD.md) to Azure Boards, removing the `task.json` intermediate and the `/jx-dev:task` dependency. The ADO skill derives the Feature → User Story → Task hierarchy from the PRD structure itself.

## Grooming Decisions

- **Estimation**: LLM-derived. The ADO skill infers story points and hour estimates from story/AC descriptions at sync time — no user prompting per story.
- **Bindings**: Write back to PRD.md frontmatter. Azure work item IDs and sync timestamps are stored in the PRD's YAML frontmatter, keeping a single source of truth.
- **Migration**: Replace entirely. Remove task.json support from `/jx-pm:ado` — PRD is the only input going forward. The `/jx-dev:task` skill and `task-json-schema.md` become unused by the ADO sync path.
- **State tracking**: Per-AC `passes` flags stored in `ado_sync` frontmatter. Drives bottom-up state transitions (AC → Story → Feature) same as task.json does today.
- **Write-back**: Per-item. Each Azure ID is written to PRD frontmatter immediately after creation — crash-safe, matches existing [[Per-Item Write-Back]] contract.
- **Legacy migration**: Accepted risk. No auto-import from task.json. This is a new workflow; existing projects continue as-is or re-sync manually.
- **Sync direction**: PRD wins. The PRD is source of truth for content (titles, descriptions, AC text). ADO edits are overwritten on next sync. ADO remains source of truth for state (e.g., Active, Closed).

## Frontmatter Shape

```yaml
ado_sync:
  organization: "jairosoft"
  project: "Jodex"
  feature_work_item_id: 204500
  feature_work_item_url: "https://..."
  last_synced: "2026-05-18T10:30:00Z"
  stories:
    US-001-01:
      work_item_id: 204501
      passes: false
      tasks:
        AC-001: { id: 204502, passes: false }
        AC-002: { id: 204503, passes: true }
```

Story points and hour estimates are not stored — LLM-derived at sync time.

## First-Run Behavior

On first sync the PRD has no `ado_sync` block. The skill creates all work items in ADO, then writes the `ado_sync` block back to the PRD frontmatter with the new IDs. Subsequent runs read existing IDs and update in place.

## Validation

Studied a real BRD-PRD (Feature 010) and its generated task.json. The PRD already contains all hierarchy needed: Feature ID, User Stories with IDs, Acceptance Criteria with IDs. task.json only adds estimates, priority ordering, and ADO bindings — all derivable or storable in frontmatter.
