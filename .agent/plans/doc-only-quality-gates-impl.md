# Implementation Plan: Doc-Only Quality Gates (FEAT-003)

**Source:** `wiki/ideas/Quality Gates Applied to Doc-Only Stories.md`
**PRD:** `docs/003_doc_only_quality_gates/BRD_PRD.md`
**Status:** Awaiting approval
**Review:** Round 1 complete — 6 findings resolved (2 HIGH, 3 MEDIUM, 1 LOW)

---

## Objective

Add a `[code-only]` tag to quality gates and story-type detection logic in the PRD skill so that documentation-only user stories do not receive code quality gate ACs (Lint passes, Typecheck passes, Unit tests pass).

---

## Scope — 3 files

| File | Change Type |
|------|------------|
| `plugins/jx-core/_shared/quality-gates.md` | Add `[code-only]` tag definition, annotate default gates, update override docs |
| `plugins/jx-pm/skills/prd/SKILL.md` | Add `[code-only]` filtering logic in Phase 5 with unambiguous section-emit rule |
| `plugins/jx-core/_shared/ado.md` | Update quality gate normalization to strip all recognized bracket annotations |

No changes to: task.json tooling, commands/ado.md, templates, or validator script.

> **Scope clarification (Finding 3):** FEAT-003 applies only to the default TypeScript/JavaScript quality profile. The `python`, `rust`, and `go` presets contain untagged code-tooling gates but are not in scope — tagging non-default presets is a follow-up item.

---

## Step 1 — Update `quality-gates.md`

### 1a. Add `[code-only]` row to Tag Semantics table

**Current:**
```markdown
| Tag | Meaning |
|-----|---------|
| `[ui-only]` | Gate is appended only to stories identified as UI stories |
| *(no tag)* | Gate is appended to all stories |
```

**After:**
```markdown
| Tag | Meaning |
|-----|---------|
| `[ui-only]` | Gate is appended only to stories identified as UI stories |
| `[code-only]` | Gate is appended only to stories identified as producing code artifacts |
| *(no tag)* | Gate is appended to all stories |
```

### 1b. Annotate default TypeScript/JavaScript gates with `[code-only]`

**Current:**
```markdown
### TypeScript/JavaScript

- Lint passes
- Typecheck passes
- Unit tests pass
- E2E tests pass [ui-only]
```

**After:**
```markdown
### TypeScript/JavaScript

- Lint passes [code-only]
- Typecheck passes [code-only]
- Unit tests pass [code-only]
- E2E tests pass [ui-only]
```

> Note: python/rust/go presets are intentionally left untagged in FEAT-003.

### 1c. Add `[code-only]` row to Hour Estimation table

**Current:**
```markdown
| Tag | Hours | Rationale |
|-----|-------|-----------|
| *(no tag)* | 0.25 | Standard quality gate |
| `[ui-only]` | 0.5 | E2E/browser verification, higher cost |
```

**After:**
```markdown
| Tag | Hours | Rationale |
|-----|-------|-----------|
| *(no tag)* | 0.25 | Standard quality gate |
| `[code-only]` | 0.25 | Code tooling verification, same cost as standard |
| `[ui-only]` | 0.5 | E2E/browser verification, higher cost |
```

### 1d. Update Project Override Format section (Finding 4)

**Current (last paragraph of Project Override Format):**
```markdown
Override contents follow the same format as the Default Gates section above: one gate per line, optional `[ui-only]` tag.
```

**After:**
```markdown
Override contents follow the same format as the Default Gates section above: one gate per line, with any recognized tag from the Tag Semantics table (`[ui-only]`, `[code-only]`, or no tag).
```

---

## Step 2 — Update `plugins/jx-pm/skills/prd/SKILL.md`

### 2a. Replace the Quality Gates paragraph in Phase 5

**Target location:** The "Quality Gates auto-added" block (lines ~241–245)

**Current:**
```markdown
**Quality Gates (auto-added to every story under `**Quality Gates:**` sub-header):**

Read gates from the resolved quality profile (see `../../../jx-core/_shared/quality-gates.md`). Gates without tags are added to all stories. Gates tagged `[ui-only]` are added only to UI stories.

Default profile gates: Lint passes, Typecheck passes, Unit tests pass, E2E tests pass [ui-only].
```

**After:**
```markdown
**Quality Gates (conditionally added per story type under `**Quality Gates:**` sub-header):**

Read gates from the resolved quality profile (see `../../../jx-core/_shared/quality-gates.md`). Apply tag-based filtering per story type:

- Gates with **no tag** → added to all stories
- Gates tagged `[ui-only]` → added only when format rationale mentions "UI", "interface", or "browser"
- Gates tagged `[code-only]` → added only when format rationale does NOT match doc-only keywords; **skipped** when rationale contains any of: `documentation`, `spec`, `wiki`, `markdown`
- **Absent format rationale** → include all gates regardless of tag (backward-compatible default)

**Precedence rule for mixed rationales (Finding 5):** If a story's rationale contains both doc-only keywords AND UI/code keywords (e.g., "documentation artifact rendered in browser"), doc-only filtering wins — treat the story as doc-only and suppress all `[code-only]` gates. Only apply `[ui-only]` gates if the rationale explicitly identifies a UI deliverable with no doc-only keywords.

**Section emit rule (Finding 1):** Emit the `**Quality Gates:**` sub-header and its contents only when at least one gate survives filtering. If all gates are filtered (doc-only story, default profile — all non-`[ui-only]` gates are `[code-only]` and thus suppressed), omit the `**Quality Gates:**` sub-header entirely for that story.

Default profile gates: Lint passes [code-only], Typecheck passes [code-only], Unit tests pass [code-only], E2E tests pass [ui-only].
```

### 2b. Update the Checklist (Phase 6, last item)

**Current:**
```markdown
- [ ] Quality Gates added to every story
```

**After:**
```markdown
- [ ] Quality Gates section present for every code-producing story; section omitted entirely for doc-only stories (format rationale contains documentation/spec/wiki/markdown) when no unfiltered gates remain
```

---

## Step 3 — Update `plugins/jx-core/_shared/ado.md` (Finding 2)

### 3a. Broaden quality gate tag normalization

**Target location:** Line 70 — quality gate metadata extraction step

**Current:**
```markdown
4. **Quality gate metadata extraction**: From `## Document Metadata`, read `Quality Gates:` bullet list. Parse each bullet as one gate phrase, strip `[ui-only]` tags for exclusion matching.
```

**After:**
```markdown
4. **Quality gate metadata extraction**: From `## Document Metadata`, read `Quality Gates:` bullet list. Parse each bullet as one gate phrase, strip all recognized bracket annotations (`[ui-only]`, `[code-only]`, or any `[…]` suffix) for exclusion matching.
```

> Rationale: The Document Metadata `Quality Gates:` section persists the full resolved profile including bracket tags (e.g., `Lint passes [code-only]`). Downstream normalization must strip these to produce clean gate names for ADO field matching.

---

## Acceptance Criteria Traceability

| AC | Addressed by |
|----|-------------|
| AC-003-01 | Step 1a — `[code-only]` row in Tag Semantics |
| AC-003-02 | Step 1b — gates annotated in TypeScript/JavaScript preset |
| AC-003-03 | Step 1c — Hour Estimation row |
| AC-003-04 | Step 3a — ADO normalization strips all bracket tags (backward compat preserved) |
| AC-003-05 | Step 2a — keyword detection omits `[code-only]` gates; section-emit rule applied |
| AC-003-06 | Step 2a — absent rationale → include all gates (backward compat) |
| AC-003-07 | Step 2a — non-doc rationale → include `[code-only]` gates |
| AC-003-08 | Step 2a — precedence rule ensures UI stories keep both gate types |
| AC-003-09 | Step 3a — normalization strips `[code-only]` annotations; persisted metadata unchanged |

---

## Resolved Review Findings

| Finding | Severity | Resolution |
|---------|----------|-----------|
| F1: Ambiguous section-vs-gate filtering | HIGH | Step 2a — explicit section-emit rule: omit `**Quality Gates:**` when no gates survive |
| F2: `[code-only]` in ADO metadata not normalized | HIGH | Step 3a — ado.md updated to strip all `[…]` bracket annotations |
| F3: python/rust/go presets untagged | MEDIUM | Scoped out explicitly; plan notes follow-up required |
| F4: Project Override Format missing `[code-only]` | MEDIUM | Step 1d — override format updated to reference all Tag Semantics entries |
| F5: Mixed rationale precedence undefined | MEDIUM | Step 2a — explicit precedence rule added (doc-only wins) |
| F6: Verification uses all-doc FEAT-002 PRD | LOW | Verification updated to require mixed fixture below |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| `[code-only]` keyword "spec" matches non-doc stories | Keyword checked only in machine-generated `*Format: ...` rationale line, not story body. Generator-controlled; low false-positive risk. |
| ado.md change broadens tag stripping beyond `[code-only]` | "Any `[…]` suffix" rule is conservative: brackets only appear in gate names as intentional annotations in this system. |

---

## Verification (Updated for Finding 6)

After implementation, create a **mixed fixture** PRD with two stories:

1. A doc-only story (format rationale: `*Format: Rule-Based — the deliverable is a documentation artifact*`)
   - Expected: no `**Quality Gates:**` section
2. A code-producing story (format rationale: `*Format: Rule-Based — the deliverable is a code change*`)
   - Expected: `**Quality Gates:**` section with `Lint passes`, `Typecheck passes`, `Unit tests pass`

Verify:
- AC block validator passes on the mixed fixture
- ADO sync on the mixed fixture produces correct work items (gate ACs present for code story, absent for doc story)
