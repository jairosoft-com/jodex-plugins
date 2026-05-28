---
title: Quality Gates Applied to Doc-Only Stories
type: idea
tags: [jx-pm, prd, quality-gates, documentation, story-type]
created: 2026-05-22
updated: 2026-05-22
status: completed
priority: P2
effort: medium
source: Live PRD generation session for FEAT-002 (2026-05-22)
aliases: [doc-only quality gates, skip gates for docs]
provenance: synthesis
---

# Quality Gates Applied to Doc-Only Stories

## Problem

The PRD generator auto-appends quality gates (Lint passes, Typecheck passes, Unit tests pass) to every user story. This is correct for code stories but meaningless for documentation-only stories — editing a markdown spec file has nothing to lint, typecheck, or unit test.

Observed during FEAT-002 (ADO Sync AC Field Fix): all 4 stories are spec/doc changes to `ado.md`, yet each received 3 quality gate ACs that add no value and inflate the AC count.

*Not the same as [[Quality Gates Assume JS-TS Toolchain]] (completed) — that fix added language presets (python/rust/go). This is about story-type awareness: the generator doesn't distinguish code stories from doc stories regardless of language.*

## Proposed Solution

Add a `[code-only]` tag to quality gates, parallel to the existing `[ui-only]` tag. The PRD generator would then skip `[code-only]` gates for stories it identifies as documentation-only.

### Story Type Detection

The generator already writes a format rationale line per story (`*Format: Rule-Based — the deliverable is a documentation artifact*`). This rationale could drive gate selection:

- Story rationale mentions "documentation", "spec", "wiki", "markdown" → doc-only → skip `[code-only]` gates
- All other stories → include `[code-only]` gates

### Updated Gate Tags

| Tag | Current Behavior | Proposed Behavior |
|-----|-----------------|-------------------|
| *(no tag)* | Added to all stories | Added to all stories (unchanged) |
| `[ui-only]` | Added only to UI stories | Unchanged |
| `[code-only]` | N/A | Added only to stories involving code changes |

### Default Gate Updates

```
- Lint passes [code-only]
- Typecheck passes [code-only]
- Unit tests pass [code-only]
- E2E tests pass [ui-only]
```

## Scope

### Modified Files

| File | Changes |
|------|---------|
| `plugins/jx-core/_shared/quality-gates.md` | Add `[code-only]` tag definition to Tag Semantics table. Tag default gates with `[code-only]`. Add Hour Estimation row for `[code-only]`. |
| `plugins/jx-pm/skills/prd/SKILL.md` | Phase 5 Quality Gates section: add `[code-only]` filtering logic based on story format rationale. |

*No changes to `plugins/jx-core/_shared/ado.md` (ADO sync reads from PRD metadata — omitted gates won't reach ADO) or `plugins/jx-pm/commands/ado.md` (no allowed-tools change).*

## Dependencies

None. Backward compatible — stories without format rationale default to including all gates (current behavior).
