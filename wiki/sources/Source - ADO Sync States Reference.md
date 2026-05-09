---
title: "Source - ADO Sync States Reference"
type: source
tags: [jx-pm, ado, azure-boards, state-machine]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/ado/references/sync-states.md
provenance: source-derived
---

# Source - ADO Sync States Reference

## Metadata
- **Original path**: plugins/jx-pm/skills/ado/references/sync-states.md
- **SHA-256**: c0111e76f6fb561c7698ae1e2867404065872ffd5fe6cca929599ba5284cd5c4
- **Size**: 1953 bytes

## Summary

Reference document for Azure Boards state transitions used by the jx-pm ado sync skill. Defines the standard Agile process template states (New, Active, Resolved, Closed, Removed), two-step transition rules, and per-work-item-type transition logic for Tasks, User Stories, and Features. Specifies bottom-up processing order and handling of unrecognized states.

## Key Concepts
- ADO Agile states: New, Active, Resolved, Closed, Removed
- Two-step transitions required for non-adjacent states (e.g., New → Active → Closed)
- Bottom-up processing order: Tasks → User Stories → Features
- Task transitions driven by `passes: true/false`
- Story completion requires all ACs passing
- Feature completion requires all stories passing plus ADO cross-check
- Unrecognized states are skipped with a warning

## Pages Created
- [[ADO State Sync Model]]
