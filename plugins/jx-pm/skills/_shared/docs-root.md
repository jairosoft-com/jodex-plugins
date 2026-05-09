# Shared Docs Root Configuration

All jx-pm skills reference this file for output directory resolution.

## Resolution Order

1. `--docs-root <path>` argument (highest priority)
2. `$JX_PM_DOCS_ROOT` environment variable
3. Default: `docs/`

## Output Structure

```
{docs_root}/{NNN}_{feature_name}/
├── PRD.md (or BRD_PRD.md)   ← /jx-pm:prd
├── TECH_SPEC.md              ← /jx-pm:techspec
└── task.json                 ← /jx-pm:task (enriched by /jx-pm:ado)
```

## Prompting for Path

When prompting user for folder path, display:
```
Where should this document be saved?
(e.g., {docs_root}006_payment_gateway/)
```

Use the resolved docs root in the example.

## Passing Between Skills

When `--chain` is active, pass the full resolved folder path to the next skill. The next skill does NOT re-prompt for path.
