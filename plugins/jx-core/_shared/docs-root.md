# Shared Docs Root Configuration

All jx skills reference this file for output directory resolution.

## Resolution Order

1. `--docs-root <path>` argument (highest priority)
2. `$JX_DOCS_ROOT` environment variable
3. `$JX_PM_DOCS_ROOT` environment variable (backward compatibility)
4. Default: `docs/`

## Output Structure

```
{docs_root}/{NNN}_{feature_name}/
├── PRD.md (or BRD_PRD.md)
├── TECH_SPEC.md
└── task.json
```

## Prompting for Path

When prompting user for folder path, display:
```
Where should this document be saved?
(e.g., {docs_root}006_payment_gateway/)
```

Use the resolved docs root in the example.
