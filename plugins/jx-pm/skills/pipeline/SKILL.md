---
name: pipeline
user-invocable: true
argument-hint: "[--mode lite|prd|unified] [--docs-root <path>]"
description: >
  Run PRD generation. For the full workflow (PRD → Spec → Task → ADO),
  run each skill manually: /jx-pm:prd → /jx-dev:spec → /jx-dev:task → /jx-pm:ado.
  Triggers on: run pipeline, pm workflow, generate prd pipeline.
  Do not trigger for individual skill invocations.
---

# PRD Pipeline

Run PRD generation via the `jx-pm:prd` skill.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--mode` | No | `prd` | Passed to `/jx-pm:prd` |
| `--docs-root` | No | `docs/` or `$JX_DOCS_ROOT` | Passed to prd skill |

## Execution

```
1. /jx-pm:prd --mode {mode}     → PRD.md (or BRD_PRD.md)
```

## Full Workflow (Manual)

For the complete pipeline, run each skill in order:

```
1. /jx-pm:prd        → PRD.md
2. /jx-dev:spec      → TECH_SPEC.md
3. /jx-dev:task      → task.json
4. /jx-pm:ado        → Azure work items
```

## Deprecated Flags

The following flags are no longer supported and will produce an error if used:

| Flag | Reason |
|------|--------|
| `--skip-ado` | ADO sync is now a separate skill (`/jx-pm:ado`). Run it independently. |
| `--chain-all` | Cross-plugin chaining removed. Use the manual workflow above. |

If any deprecated flag is detected, HALT with an error message explaining the replacement.

## Notes

- Folder path prompted once during prd skill
- For review/edit between steps, use individual skills directly
- This skill only runs PRD generation — it no longer orchestrates the full pipeline
