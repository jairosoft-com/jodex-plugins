# jx-dev

Developer skills: generate technical specifications and task breakdowns from PRDs.

## Skills

| Skill | Command | Description |
|-------|---------|-------------|
| spec | `/jx-dev:spec` | Transform a PRD into a framework-agnostic TECH_SPEC.md |
| task | `/jx-dev:task` | Convert PRD + TECH_SPEC into canonical task.json |

## Dependencies

- **jx-core** — Shared conventions: ID rules, docs-root resolution, task JSON schema.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `$JX_DOCS_ROOT` | Canonical docs output root (default: `docs/`) |
| `$JX_PM_DOCS_ROOT` | Backward-compatible fallback for `$JX_DOCS_ROOT` |

Precedence: `$JX_DOCS_ROOT` > `$JX_PM_DOCS_ROOT` > `docs/`
