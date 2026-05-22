# Implementation Plan: Doc-Only Quality Gates (FEAT-003)

**Source:** `wiki/ideas/Quality Gates Applied to Doc-Only Stories.md`
**PRD:** `docs/003_doc_only_quality_gates/BRD_PRD.md`
**Status:** Awaiting approval

---

## Objective

Add a `[code-only]` tag to quality gates and story-type detection logic in the PRD skill so that documentation-only user stories do not receive code quality gate ACs (Lint passes, Typecheck passes, Unit tests pass).

---

## Scope — 2 files, no schema changes

| File | Change Type |
|------|------------|
| `plugins/jx-core/_shared/quality-gates.md` | Add `[code-only]` tag definition, annotate default gates |
| `plugins/jx-pm/skills/prd/SKILL.md` | Add `[code-only]` filtering logic in Phase 5 |

No changes to: ADO sync, task.json tooling, ado.md, commands/ado.md, templates, or validator script.

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

---

## Step 2 — Update `plugins/jx-pm/skills/prd/SKILL.md`

### 2a. Extend the Quality Gates paragraph in Phase 5

**Target location:** The "Quality Gates auto-added" paragraph (after line 240)

**Current:**
```markdown
**Quality Gates (auto-added to every story under `**Quality Gates:**` sub-header):**

Read gates from the resolved quality profile (see `../../../jx-core/_shared/quality-gates.md`). Gates without tags are added to all stories. Gates tagged `[ui-only]` are added only to UI stories.

Default profile gates: Lint passes, Typecheck passes, Unit tests pass, E2E tests pass [ui-only].
```

**After:**
```markdown
**Quality Gates (auto-added to every story under `**Quality Gates:**` sub-header):**

Read gates from the resolved quality profile (see `../../../jx-core/_shared/quality-gates.md`). Apply tag-based filtering per story type:

- Gates with **no tag** → added to all stories
- Gates tagged `[ui-only]` → added only to UI stories (format rationale mentions "UI", "interface", or "browser")
- Gates tagged `[code-only]` → added only to code-producing stories; **skip** when format rationale contains any of: `documentation`, `spec`, `wiki`, `markdown`
- **Absent format rationale** → include all gates regardless of tag (backward-compatible default)

Default profile gates: Lint passes [code-only], Typecheck passes [code-only], Unit tests pass [code-only], E2E tests pass [ui-only].
```

### 2b. Update the Checklist (Phase 6, last item)

**Current:**
```markdown
- [ ] Quality Gates added to every story
```

**After:**
```markdown
- [ ] Quality Gates added to every code-producing story; doc-only stories (format rationale contains documentation/spec/wiki/markdown) have Quality Gates section omitted
```

---

## Acceptance Criteria Traceability

| AC | Addressed by |
|----|-------------|
| AC-003-01 | Step 1a — `[code-only]` row in Tag Semantics |
| AC-003-02 | Step 1b — gates annotated in TypeScript/JavaScript preset |
| AC-003-03 | Step 1c — Hour Estimation row |
| AC-003-04 | No downstream tool change needed (they read `Quality Gates:` metadata) |
| AC-003-05 | Step 2a — keyword detection omits `[code-only]` gates |
| AC-003-06 | Step 2a — absent rationale → include all (backward compat) |
| AC-003-07 | Step 2a — non-doc rationale → include `[code-only]` gates |
| AC-003-08 | Step 2a — UI rationale → include both `[code-only]` and `[ui-only]` |
| AC-003-09 | No change to persisted metadata consumption |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Other language presets (python, rust, go) gates not tagged `[code-only]` | Out of scope for FEAT-003; their gates are not in the default profile. Follow-up item. |
| Keyword "spec" in format rationale might match non-doc stories | Keyword is checked only in the machine-generated `*Format: ...` line, not free-form story text. Low false-positive risk. |

---

## Verification

After implementation, manually re-run the FEAT-002 PRD generation for a documentation-only story and confirm:
- Zero `[code-only]` gates appear in `**Quality Gates:**` section
- AC block validator still passes
- A code-producing story in the same PRD still receives `[code-only]` gates
