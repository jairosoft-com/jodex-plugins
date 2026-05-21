# Plan: Configurable Quality Gates for Polyglot Support

## Problem

Quality gates in the PRD skill are hardcoded to JS/TS toolchain ("Lint passes", "Typecheck passes", etc.). Python, Rust, Go projects need different gates. The hardcoded phrases also cascade to ADO exclusion logic and task sizing.

## Approach

New shared config file at `plugins/jx-core/_shared/quality-gates.md` with tagged conditions and language presets. Follows the `docs-root.md` pattern.

## Changes

### 1. Create quality-gates.md

New file: `plugins/jx-core/_shared/quality-gates.md`

Contents:
- Resolution order (--quality-profile > project override > defaults)
- Default gate list with [ui-only] tags
- Language presets: python, rust, go
- Tag semantics documentation

### 2. Update SKILL.md

- Phase 1: add `--quality-profile` to argument table
- Phase 5: replace hardcoded gate list with "Read gates from `../../../jx-core/_shared/quality-gates.md`"
- Quality Gates auto-append rule: reference config, respect [ui-only] tag

### 3. Update ado.md

- Phase 2: read quality-gates.md to build the exact-phrase exclusion list
- Phase 5: replace hardcoded 4 phrases with config-sourced list
- Legacy fallback: use default gates for exclusion when no config detected

### 4. Update task.md

- Functional AC Counting: exclusion phrases sourced from quality-gates.md instead of hardcoded

### 5. Update templates

- lite-template.md, prd-template.md, unified-template.md: replace literal gate names with `[quality gate from config]` placeholders + comment referencing quality-gates.md

### 6. Add python-example.md

New file: `plugins/jx-pm/skills/prd/references/python-example.md`
- Same one-click checkout scenario but with Ruff/Mypy gates
- Demonstrates --quality-profile python usage

## Files

| File | Action | Risk |
|------|--------|------|
| `plugins/jx-core/_shared/quality-gates.md` | Create | Low — new additive file |
| `plugins/jx-pm/skills/prd/references/python-example.md` | Create | Low — new example |
| `plugins/jx-pm/skills/prd/SKILL.md` | Modify | Medium — core skill |
| `plugins/jx-core/_shared/ado.md` | Modify | Medium — ADO sync |
| `plugins/jx-core/_shared/task.md` | Modify | Low — sizing only |
| `plugins/jx-pm/skills/prd/references/lite-template.md` | Modify | Low |
| `plugins/jx-pm/skills/prd/references/prd-template.md` | Modify | Low |
| `plugins/jx-pm/skills/prd/references/unified-template.md` | Modify | Low |

## Backward Compatibility

Default gates are identical to current hardcoded values. No existing PRD or ADO sync behavior changes unless --quality-profile is explicitly used.
