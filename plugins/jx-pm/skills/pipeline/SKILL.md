---
name: pipeline
user-invocable: true
argument-hint: "[--mode lite|prd|unified] [--docs-root <path>] [--skip-ado]"
description: >
  Run the full PM pipeline: PRD → Tech Spec → Task JSON → Azure sync.
  Equivalent to running each skill with --chain-all. Triggers on: run full pipeline,
  full pm workflow, end to end requirements. Do not trigger for individual skill invocations.
---

# Full PM Pipeline

Run all jx-pm skills in sequence with a single command.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--mode` | No | `prd` | Passed to `/jx-pm:prd` |
| `--docs-root` | No | `docs/` or `$JX_PM_DOCS_ROOT` | Passed to all skills |
| `--skip-ado` | No | — | Stop after task.json (skip Azure sync) |

## Execution Order

```
1. /jx-pm:prd --mode {mode}     → PRD.md (or BRD_PRD.md)
2. /jx-pm:techspec              → TECH_SPEC.md
3. /jx-pm:task                  → task.json
4. /jx-pm:ado                   → Azure work items (unless --skip-ado)
```

## Behavior

- Folder path prompted once (during prd skill), passed to all subsequent skills
- Each skill runs its full phase sequence
- If any skill halts with error, pipeline stops — user resolves, then re-invokes pipeline (idempotent)
- `--skip-ado`: stops after step 3 (useful when Azure DevOps is not configured)

## Notes

This is a convenience wrapper. Each skill is independently invocable. Use individual skills when:
- You only need one output (e.g., just a PRD)
- You want to review/edit between steps
- You're re-running a single step after edits
