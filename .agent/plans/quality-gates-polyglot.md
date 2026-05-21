# Plan: Configurable Quality Gates for Polyglot Support

## Problem

Quality gates in the PRD skill are hardcoded to JS/TS toolchain ("Lint passes", "Typecheck passes", etc.). Python, Rust, Go projects need different gates. The hardcoded phrases also cascade to ADO exclusion logic and task sizing.

## Approach

New shared config file at `plugins/jx-core/_shared/quality-gates.md` with tagged conditions and language presets. Follows the `docs-root.md` pattern.

## Hard Constraints

### HC-1: Profile and Gate List Persistence in PRD Metadata

The selected quality profile AND the resolved gate list MUST be persisted in the generated PRD's Document Metadata section:

```
- **Quality Profile**: python
- **Quality Gates**: Ruff passes, Mypy passes, Unit tests pass, E2E tests pass [ui-only]
```

ADO sync and task conversion read the `Quality Gates:` list directly from PRD metadata — they do NOT re-resolve from the profile name or filesystem path. This makes the PRD self-contained: it works identically regardless of which machine runs the sync, whether the custom config file still exists, or whether the preset definitions have changed since generation.

The `Quality Profile:` field is informational (for human readers). The `Quality Gates:` field is **authoritative** (for ADO/task).

**Fallback rule:** ADO/task use `Quality Gates:` metadata whenever present, regardless of whether `Quality Profile:` is present, missing, or unrecognized. Only when `Quality Gates:` is entirely absent (legacy PRDs) do they fall back to default gates.

**Gate list format:** Persisted as a markdown bullet list under a `Quality Gates:` heading in Document Metadata, NOT as a comma-separated string. Each gate is one bullet. Tags like `[ui-only]` are preserved inline.

```
- **Quality Profile**: python
- **Quality Gates**:
  - Ruff passes
  - Mypy passes
  - Unit tests pass
  - E2E tests pass [ui-only]
```

Gate names MUST NOT contain commas. Validation at generation time rejects gate names with commas.

### HC-2: Project Override Must Be Explicit

Project-level overrides require a namespaced path (`{docs_root}/.jodex/quality-gates.md`) with a required `version:` frontmatter marker. A file without the marker is ignored with a warning. This prevents stale or unrelated files from silently changing behavior.

### HC-3: Backward Compatibility (Refined)

**Downstream behavior** is identical to current: default gates are the same phrases, ADO exclusion and task sizing produce the same results.

**PRD output** has additive metadata changes: new `Quality Profile:` and `Quality Gates:` fields in Document Metadata. This is explicitly additive — no existing fields are removed or renamed. Downstream parsers that don't read these fields are unaffected.

**Existing PRDs** (without `Quality Gates:` metadata) are handled by the fallback rule: ADO/task use default gates when metadata is absent. No migration required.

**Non-default behavior** activates ONLY when `--quality-profile` is explicitly passed OR a valid `.jodex/quality-gates.md` override exists with correct version marker.

## Changes

### 1. Create quality-gates.md

New file: `plugins/jx-core/_shared/quality-gates.md`

Contents:
- Resolution order:
  1. `--quality-profile <name>` argument (highest priority)
  2. Project override at `{docs_root}/.jodex/quality-gates.md` (must have `version: 1` frontmatter)
  3. Default gates from this file
- Default gate list with [ui-only] tags
- Language presets: python, rust, go
- Tag semantics: `[ui-only]` appended only to UI stories
- Profile propagation rule: resolved profile name written to PRD metadata

### 2. Update SKILL.md

- Phase 1: add `--quality-profile` to argument table (values: `default`, `python`, `rust`, `go`, or path to custom config)
- Phase 2: resolve quality profile per quality-gates.md resolution order
- Phase 5: replace hardcoded gate list with "Read gates from resolved profile"
- Phase 5: persist `Quality Profile: <name>` and `Quality Gates: <comma-separated list>` in Document Metadata section. The gate list is authoritative for downstream consumers.
- Quality Gates auto-append rule: reference config, respect [ui-only] tag

### 3. Update ado.md

- Phase 2: read `Quality Gates:` bullet list from PRD Document Metadata. Parse each bullet as one gate phrase, strip [ui-only] tags for exclusion matching. If no `Quality Gates:` metadata → use default gates (backward compat with legacy PRDs).
- Phase 5: exact-phrase exclusion list sourced from PRD metadata gate list, not hardcoded or re-resolved from filesystem
- Dry-run output: show resolved profile name and exclusion phrases before any write
- Legacy fallback: PRDs without `Quality Profile:` metadata use default gates (identical to current behavior)

### 4. Update task.md and task-json-schema.md

- Functional AC Counting: exclusion phrases sourced from PRD metadata `Quality Gates:` list (same as ADO). Legacy PRDs without metadata use default gates.
- Hour estimation: classify quality-gate ACs by matching against the PRD metadata gate list, not JS-specific labels. All quality-gate ACs get 0.25h regardless of toolchain.
- task-json-schema.md: update quality-gate hour classification to reference config

### 5. Update templates

- lite-template.md, prd-template.md, unified-template.md: replace literal gate names with `{quality_gate}` placeholders + comment: `<!-- Gates resolved from quality-gates.md. Default: Lint passes, Typecheck passes, Unit tests pass -->`
- Add `Quality Profile: default` and `Quality Gates: Lint passes, Typecheck passes, Unit tests pass, E2E tests pass [ui-only]` to Document Metadata section in all templates

### 6. Add python-example.md

New file: `plugins/jx-pm/skills/prd/references/python-example.md`
- Same one-click checkout scenario but with Ruff/Mypy gates
- Document Metadata includes `Quality Profile: python`
- Demonstrates --quality-profile python usage

## Files

| File | Action | Risk |
|------|--------|------|
| `plugins/jx-core/_shared/quality-gates.md` | Create | Low — new additive file |
| `plugins/jx-pm/skills/prd/references/python-example.md` | Create | Low — new example |
| `plugins/jx-pm/skills/prd/SKILL.md` | Modify | Medium — core skill |
| `plugins/jx-core/_shared/ado.md` | Modify | Medium — ADO sync |
| `plugins/jx-core/_shared/task.md` | Modify | Medium — sizing + hour estimation |
| `plugins/jx-core/_shared/task-json-schema.md` | Modify | Low — hour classification |
| `plugins/jx-pm/skills/prd/references/lite-template.md` | Modify | Low |
| `plugins/jx-pm/skills/prd/references/prd-template.md` | Modify | Low |
| `plugins/jx-pm/skills/prd/references/unified-template.md` | Modify | Low |

## Backward Compatibility

Default gates are identical to current hardcoded values. PRD output has additive metadata (Quality Profile + Quality Gates fields). Downstream behavior changes only with explicit `--quality-profile` or a valid `.jodex/quality-gates.md` override. Legacy PRDs without `Quality Gates:` metadata use default gates via fallback rule.

## Resolved Review Findings

| ID | Source | Finding | Resolution |
|----|--------|---------|------------|
| F1 | Codex R1 | Profile not propagated to ADO/task | HC-1: persist in PRD metadata, ADO/task read from it |
| F2 | Codex R1 | Project override silently breaks defaults | HC-2: namespaced path + version marker, explicit opt-in |
| F3 | Codex R1 | Task hour estimation JS-specific | Task change expanded: all quality gates get 0.25h via config tag |
| F4 | Codex R2 | Custom profile paths not replayable downstream | Gate list persisted in PRD metadata; ADO/task read from metadata, not filesystem |
| F5 | Codex R3 | Fallback contradicts authoritative metadata | Fallback depends on absence of Quality Gates:, not Quality Profile: |
| F6 | Codex R3 | Comma-separated gate list not replay-safe | Bullet list format, commas forbidden in gate names, validated at generation |
| F7 | Codex R3 | Backward compat promise internally impossible | Revised HC-3: additive metadata, identical downstream behavior |
