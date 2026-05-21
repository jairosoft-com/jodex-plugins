# Shared Quality Gates Configuration

All jx skills reference this file for quality gate resolution, PRD generation, and downstream exclusion logic.

## Resolution Order

1. `--quality-profile <name>` argument (highest priority)
2. Project override at `{docs_root}/.jodex/quality-gates.md` (must have `version: 1` frontmatter)
3. Default gates from this file

## Default Gates

- Lint passes
- Typecheck passes
- Unit tests pass
- E2E tests pass [ui-only]

## Presets

### python
- Ruff passes
- Mypy passes
- Unit tests pass
- E2E tests pass [ui-only]

### rust
- Cargo clippy passes
- Unit tests pass
- Integration tests pass [ui-only]

### go
- Go vet passes
- Unit tests pass
- E2E tests pass [ui-only]

## Tag Semantics

| Tag | Meaning |
|-----|---------|
| `[ui-only]` | Gate is appended only to stories identified as UI stories |
| *(no tag)* | Gate is appended to all stories |

## Gate Name Rules

- Gate names MUST NOT contain commas
- Each gate is one line in the PRD metadata bullet list
- Gates are matched by normalized exact phrase for exclusion (strip trailing annotations)

## PRD Metadata Persistence

The PRD generator persists the resolved profile and gate list in Document Metadata:

```markdown
- **Quality Profile**: python
- **Quality Gates**:
  - Ruff passes
  - Mypy passes
  - Unit tests pass
  - E2E tests pass [ui-only]
```

- `Quality Profile:` is informational (for human readers)
- `Quality Gates:` is **authoritative** (ADO/task read this, not the filesystem)
- ADO/task use `Quality Gates:` whenever present, regardless of `Quality Profile:` value
- Only when `Quality Gates:` is entirely absent (legacy PRDs) → fall back to default gates
- Present-but-malformed `Quality Gates:` (e.g., comma-separated) is a hard error — halt, do not fall back

## Hour Estimation by Tag

| Tag | Hours | Rationale |
|-----|-------|-----------|
| *(no tag)* | 0.25 | Standard quality gate |
| `[ui-only]` | 0.5 | E2E/browser verification, higher cost |

## Project Override Format

A project-level override at `{docs_root}/.jodex/quality-gates.md` must have:

```yaml
---
version: 1
---
```

Files without `version: 1` frontmatter are ignored with a warning. This prevents stale or unrelated files from silently changing behavior.

Override contents follow the same format as the Default Gates section above: one gate per line, optional `[ui-only]` tag.
