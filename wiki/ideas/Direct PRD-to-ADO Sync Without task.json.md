---
title: Direct PRD-to-ADO Sync Without task.json
type: idea
status: raw
created: 2026-05-18
updated: 2026-05-18
source: user request
source_count: 0
provenance: user-stated
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
