# Implementation Plan: Doc-Only Quality Gates (FEAT-003)

**Source:** `wiki/ideas/Quality Gates Applied to Doc-Only Stories.md`
**PRD:** `docs/003_doc_only_quality_gates/BRD_PRD.md`
**Status:** Awaiting approval
**Review:** Round 2 complete — 9 findings total, all resolved (2+3 HIGH, 3+0 MEDIUM, 1+0 LOW)

---

## Objective

Add a `[code-only]` tag to quality gates and story-type detection logic in the PRD skill so that documentation-only user stories do not receive code quality gate ACs (Lint passes, Typecheck passes, Unit tests pass).

---

## Scope — 3 files

| File | Change Type |
|------|------------|
| `plugins/jx-core/_shared/quality-gates.md` | Add `[code-only]` tag definition, annotate default gates, update override docs |
| `plugins/jx-pm/skills/prd/SKILL.md` | Add `[code-only]` filtering logic in Phase 5; update line 204 and checklist lines 289/296 |
| `plugins/jx-core/_shared/ado.md` | Update both normalization paths (line 70 and line 174) to strip `[code-only]` |

No changes to: task.json tooling, commands/ado.md, templates, or validator script.

> **Scope clarification (R1-F3):** FEAT-003 applies only to the default TypeScript/JavaScript quality profile. The `python`, `rust`, and `go` presets contain untagged code-tooling gates — tagging non-default presets is a follow-up item.

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

> Note: python/rust/go presets intentionally left untagged in FEAT-003.

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

### 1d. Update Project Override Format section (R1-F4)

**Current (last sentence of Project Override Format):**
```markdown
Override contents follow the same format as the Default Gates section above: one gate per line, optional `[ui-only]` tag.
```

**After:**
```markdown
Override contents follow the same format as the Default Gates section above: one gate per line, with any recognized tag from the Tag Semantics table (`[ui-only]`, `[code-only]`, or no tag).
```

---

## Step 2 — Update `plugins/jx-pm/skills/prd/SKILL.md`

### 2a. Update line 204 — Quality Gates sub-header description (R2-F1)

**Current (line 204):**
```markdown
- `**Quality Gates:**` — Always present, always Rule-Based
```

**After:**
```markdown
- `**Quality Gates:**` — Present only when at least one gate survives story-type filtering; always Rule-Based when present
```

### 2b. Replace the Quality Gates paragraph in Phase 5

**Target location:** The "Quality Gates auto-added" block (~lines 241–257)

**Current:**
```markdown
**Quality Gates (auto-added to every story under `**Quality Gates:**` sub-header):**

Read gates from the resolved quality profile (see `../../../jx-core/_shared/quality-gates.md`). Gates without tags are added to all stories. Gates tagged `[ui-only]` are added only to UI stories.

Default profile gates: Lint passes, Typecheck passes, Unit tests pass, E2E tests pass [ui-only].
```

**After:**
```markdown
**Quality Gates (conditionally added per story type under `**Quality Gates:**` sub-header):**

Read gates from the resolved quality profile (see `../../../jx-core/_shared/quality-gates.md`). Apply tag-based filtering per story type using the format rationale line:

- Gates with **no tag** → added to all stories
- Gates tagged `[ui-only]` → added only when format rationale mentions "UI", "interface", or "browser"
- Gates tagged `[code-only]` → skipped when format rationale contains any of: `documentation`, `spec`, `wiki`, `markdown` AND contains none of the code/UI signals above
- **Absent format rationale** → include all gates regardless of tag (backward-compatible default)

**Story-type classification rule (R2-F2):** A story is doc-only only when its format rationale contains doc-only keywords (`documentation`, `spec`, `wiki`, `markdown`) AND contains no code-producing or UI-deliverable signals ("UI", "interface", "browser", "code", "implementation"). Mixed-signal rationales are treated as code stories: `[code-only]` gates are included.

**Section emit rule (R1-F1):** Emit the `**Quality Gates:**` sub-header and its contents only when at least one gate survives filtering. If all gates are filtered out (pure doc-only story under default profile), omit the `**Quality Gates:**` sub-header entirely for that story.

Default profile gates: Lint passes [code-only], Typecheck passes [code-only], Unit tests pass [code-only], E2E tests pass [ui-only].
```

### 2c. Update the Checklist — two entries (R2-F1)

**Current line 289:**
```markdown
- [ ] Sub-headers present on every AC block (Scenarios/Rules/System Behavior + Quality Gates)
```

**After:**
```markdown
- [ ] Sub-headers present on every AC block (Scenarios/Rules/System Behavior); Quality Gates sub-header present only when at least one gate survives story-type filtering
```

**Current line 296:**
```markdown
- [ ] Quality Gates added to every story
```

**After:**
```markdown
- [ ] Quality Gates section present for every code-producing story; omitted entirely for doc-only stories (format rationale has doc keywords and no code/UI signals) when no unfiltered gates remain
```

---

## Step 3 — Update `plugins/jx-core/_shared/ado.md`

### 3a. Broaden metadata extraction path normalization (R1-F2, R2-F3)

**Target:** Line 70

**Current:**
```markdown
4. **Quality gate metadata extraction**: From `## Document Metadata`, read `Quality Gates:` bullet list. Parse each bullet as one gate phrase, strip `[ui-only]` tags for exclusion matching.
```

**After:**
```markdown
4. **Quality gate metadata extraction**: From `## Document Metadata`, read `Quality Gates:` bullet list. Parse each bullet as one gate phrase, strip all recognized bracket annotations (`[ui-only]`, `[code-only]`, or any `[…]` suffix) for exclusion matching.
```

### 3b. Broaden legacy exact-phrase path normalization (R2-F3)

**Target:** Line 174

**Current:**
```markdown
  - `legacy` with normalized exact-phrase match → exclude (phrases from PRD `Quality Gates:` metadata, or default gates if absent, after stripping trailing annotations like `*(UI stories only)*`)
```

**After:**
```markdown
  - `legacy` with normalized exact-phrase match → exclude (phrases from PRD `Quality Gates:` metadata, or default gates if absent, after stripping trailing annotations in any form: parenthetical like `*(UI stories only)*` and bracket like `[ui-only]`, `[code-only]`)
```

---

## Acceptance Criteria Traceability

| AC | Addressed by |
|----|-------------|
| AC-003-01 | Step 1a — `[code-only]` row in Tag Semantics |
| AC-003-02 | Step 1b — gates annotated in TypeScript/JavaScript preset |
| AC-003-03 | Step 1c — Hour Estimation row |
| AC-003-04 | Steps 3a+3b — both ADO normalization paths strip all bracket tags |
| AC-003-05 | Step 2b — keyword detection with classification rule; section-emit rule applied |
| AC-003-06 | Step 2b — absent rationale → include all gates (backward compat) |
| AC-003-07 | Step 2b — non-doc rationale → include `[code-only]` gates |
| AC-003-08 | Step 2b — mixed-signal stories retain `[code-only]` gates |
| AC-003-09 | Steps 3a+3b — normalization strips tags; persisted metadata unchanged |

---

## Resolved Review Findings

| Round | Finding | Severity | Resolution |
|-------|---------|----------|-----------|
| R1 | F1: Ambiguous section-vs-gate filtering | HIGH | Step 2b + 2a — explicit section-emit rule; line 204 updated |
| R1 | F2: `[code-only]` in ADO metadata not normalized | HIGH | Steps 3a+3b — both ado.md paths updated |
| R1 | F3: python/rust/go presets untagged | MEDIUM | Scoped out explicitly; follow-up noted |
| R1 | F4: Project Override Format missing `[code-only]` | MEDIUM | Step 1d |
| R1 | F5: Mixed rationale precedence undefined | MEDIUM | Step 2b — precedence rule (mixed-signal = code story) |
| R1 | F6: Verification uses all-doc FEAT-002 PRD | LOW | Verification updated to require mixed fixture |
| R2 | F1: SKILL.md line 204 + checklist still say "always present" | HIGH | Steps 2a + 2c |
| R2 | F2: Precedence rule inverted (doc-only wins over mixed) | HIGH | Step 2b — classification rule now requires doc keywords AND no code/UI signals |
| R2 | F3: ado.md line 174 legacy path also needs stripping | HIGH | Step 3b |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Keyword "spec" in format rationale matches non-doc stories | Keyword checked only in machine-generated `*Format: ...` rationale line; mixed-signal rule prevents false positives on hybrid stories |
| Broad `[…]` stripping in ado.md removes unintended annotations | Brackets only appear in this system as intentional gate annotations; no free-form bracket usage in gate names |
| python/rust/go presets skip filtering | Out of scope; documented as follow-up; no regression since presets were untagged before |

---

## Verification (R1-F6)

After implementation, create a **mixed fixture** PRD containing:

1. A doc-only story — `*Format: Rule-Based — the deliverable is a documentation artifact*`
   - Expected: no `**Quality Gates:**` sub-header
2. A code-producing story — `*Format: Rule-Based — the deliverable is a code change*`
   - Expected: `**Quality Gates:**` with `Lint passes`, `Typecheck passes`, `Unit tests pass`
3. A mixed-signal story — `*Format: Rule-Based — the deliverable is a documentation artifact with code implementation*`
   - Expected: `**Quality Gates:**` retained (mixed-signal = code story)

Verify:
- AC block validator passes on the mixed fixture
- ADO sync produces correct work items (gate ACs present for code/mixed stories, absent for doc-only)
