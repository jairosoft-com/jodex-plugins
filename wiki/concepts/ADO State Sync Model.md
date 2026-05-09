---
title: ADO State Sync Model
type: concept
tags: [jx-pm, ado, azure-boards, state-machine, sync]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
aliases: [Azure Boards State Sync, ADO Sync States]
provenance: source-derived
---

# ADO State Sync Model

The ADO State Sync Model defines how the jx-pm ado skill transitions Azure Boards work items through their lifecycle states based on test/acceptance criteria results. It enforces bottom-up processing (Tasks → Stories → Features), handles two-step transitions for non-adjacent states, and skips unrecognized states from custom process templates with a logged warning.

The model uses the standard Agile process template states (New, Active, Resolved, Closed, Removed) and derives completion from child item states — a story is complete only when all its ACs pass, and a feature is complete only when all its stories are resolved.

## Related

- [[Skill Chaining]]
- [[Golden Thread Traceability]]
- [[Requirement ID System]]

## Sources
- [[Source - ADO Sync States Reference]]
