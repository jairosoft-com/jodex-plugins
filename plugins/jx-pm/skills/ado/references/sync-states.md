# Azure Boards State Transition Reference

Quick reference for state sync transitions.

## ADO Work Item States

Standard Agile process template states:
- **New** — Created, not started
- **Active** — Work in progress
- **Resolved** — Work complete, pending verification
- **Closed** — Verified complete
- **Removed** — Terminal, do not touch

## Two-Step Transitions

Some state changes require intermediate steps:
- New → Closed requires: New → Active → Closed
- New → Resolved requires: New → Active → Resolved

Always issue both updates sequentially. If first succeeds but second fails, item is in intermediate state (Active) — correctable on next sync.

## Task (AC) Transitions

```
passes: true
  New    → Active → Closed
  Active → Closed
  Closed → (no change)

passes: false
  Resolved/Closed → Active (reopen)
  New/Active      → (no change)

Removed → skip (log warning)
```

## User Story Transitions

Story complete = `passes: true` AND all ACs `passes: true`

```
complete: true
  New    → Active → Resolved
  Active → Resolved
  Resolved → (no change)

complete: false
  Resolved/Closed → Active (reopen)
  New/Active      → (no change)

Removed → skip (log warning)
```

## Feature Transitions

All pass = all stories pass AND ADO cross-check (all child stories Resolved/Closed)

```
all pass: true
  New    → Active → Resolved
  Active → Resolved
  Resolved → (no change)

all pass: false
  Resolved/Closed → Active (reopen)
  New/Active      → (no change)

Removed → skip (log warning)
```

## Processing Order

Always bottom-up:
1. Tasks (ACs)
2. User Stories
3. Feature

Each level's state depends on children being resolved first.

## Unrecognized States

If a work item is in a state not listed here (custom process template):
- Log warning with item ID, current state
- Skip — do not attempt transition
- Include in sync report as "skipped: unrecognized state"
