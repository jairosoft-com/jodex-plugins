---
title: Direct PRD-to-ADO Sync Without task.json
type: idea
status: raw
created: 2026-05-18
updated: 2026-05-18
source: user request
source_count: 0
provenance: user-stated
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

Change `/jx-pm:ado` to sync directly from PRD.md (or BRD_PRD.md) to Azure Boards, removing the `task.json` intermediate and the `/jx-dev:task` dependency. The ADO skill should derive the Feature → User Story → Task hierarchy from the PRD structure itself.
