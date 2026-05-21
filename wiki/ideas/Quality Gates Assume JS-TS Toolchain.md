---
title: Quality Gates Assume JS-TS Toolchain
type: idea
tags: [jx-pm, prd, hardcoded, quality-gates, polyglot, jx-core]
created: 2026-05-20
updated: 2026-05-20
status: backlogged
priority: P2
effort: medium
source: PRD skill hardcoded values review (2026-05-20)
---

# Quality Gates Assume JS-TS Toolchain

Auto-appended quality gates ("Lint passes", "Typecheck passes", "Unit tests pass", "E2E tests pass") assume a JS/TS project. A Python project needs "mypy passes" or "ruff passes". Rust needs "cargo clippy passes". Go needs "go vet passes".

## Decision: Shared Config File with Presets

Config location: new shared file at `plugins/jx-core/_shared/quality-gates.md`, following the `docs-root.md` pattern. Tagged list with `[ui-only]` conditions and language presets.

### Resolution Order

1. `--quality-profile <name>` argument (highest priority)
2. Project-level quality-gates.md override (if exists in docs root)
3. Default gates from `jx-core/_shared/quality-gates.md`

### Default Gates

- Lint passes
- Typecheck passes
- Unit tests pass
- E2E tests pass [ui-only]

### Presets

**python:** Ruff passes, Mypy passes, Unit tests pass, E2E tests pass [ui-only]

**rust:** Cargo clippy passes, Unit tests pass, Integration tests pass [ui-only]

**go:** Go vet passes, Unit tests pass, E2E tests pass [ui-only]

### Tag Semantics

`[ui-only]` — gate is only appended to stories identified as UI stories.

## Scope

### New Files

| File | Purpose |
|------|---------|
| `plugins/jx-core/_shared/quality-gates.md` | Shared config — defaults, presets, resolution order, tag conditions |
| `plugins/jx-pm/skills/prd/references/python-example.md` | Python-flavored PRD example showing ruff/mypy quality gates |

### Modified Files

| File | Changes |
|------|---------|
| `plugins/jx-pm/skills/prd/SKILL.md` | Phase 1: add --quality-profile arg. Phase 5: read gates from config. Quality Gates section: respect [ui-only] tags |
| `plugins/jx-core/_shared/ado.md` | Phase 2: read quality-gates.md for exclusion phrases. Phase 5: exclusion list from config |
| `plugins/jx-core/_shared/task.md` | Functional AC Counting: exclusion phrases from quality-gates.md |
| `plugins/jx-pm/skills/prd/references/lite-template.md` | Replace hardcoded gates with config-sourced placeholders |
| `plugins/jx-pm/skills/prd/references/prd-template.md` | Same treatment |
| `plugins/jx-pm/skills/prd/references/unified-template.md` | Same treatment |

### Unchanged

| File | Reason |
|------|--------|
| `plugins/jx-pm/skills/prd/references/example.md` | Stays JS/TS-flavored as the default example |
| `plugins/jx-core/scripts/validate-ac-blocks.sh` | Validates structure, not gate content |

## Dependencies

No blocking dependencies. Backward compatible — default gates are identical to current hardcoded values.
