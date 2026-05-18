---
title: Direct PRD-to-ADO Sync Without task.json
type: idea
status: raw
created: 2026-05-18
updated: 2026-05-18
source: user request
source_count: 0
provenance: user-stated
aliases:
  - PRD-to-ADO direct sync
  - Remove task.json dependency from ado skill
tags:
  - jx-pm
  - ado
  - prd
  - pipeline
  - refactor
links:
  - "[[ADO State Sync Model]]"
  - "[[Golden Thread Traceability]]"
  - "[[Plugin Pipeline Sequence]]"
  - "[[Skill Chaining]]"
---

# Direct PRD-to-ADO Sync Without task.json

## Idea

Change `/jx-pm:ado` to sync directly from PRD.md (or BRD_PRD.md) to Azure Boards, removing the dependency on `task.json` and the `/jx-dev:task` skill as a prerequisite step.

## Motivation

Today the PRD-to-ADO flow requires four manual steps: `/jx-pm:prd` → `/jx-dev:spec` → `/jx-dev:task` → `/jx-pm:ado`. The `task.json` intermediate artifact exists primarily as an input format for the ADO sync skill. If `/jx-pm:ado` can read the PRD directly and derive the Feature → User Story → Task hierarchy from it, the pipeline shortens and the cross-plugin dependency on `/jx-dev:task` is eliminated.

## Open Questions

- How does the ADO skill derive story points, hour estimates, and task breakdowns without the structured task.json format?
- Does the PRD contain enough structure (requirement IDs, user stories, acceptance criteria) to produce a reliable ADO hierarchy?
- What happens to existing task.json-based workflows — deprecate or support both inputs?
- Does this affect traceability (requirement ID → ADO work item mapping)?

## Related

- [[ADO State Sync Model]]
- [[Golden Thread Traceability]]
- [[Plugin Pipeline Sequence]]
- [[Skill Chaining]]
- [[Extract ADO Sync and Task Skills to jx-core]]
- [[Slash Feedback Skill for jx-core]]
