# BRD-PRD: Founder Nickname in Prose Content

## Document Metadata

- **Feature ID**: 010
- **Feature Name**: nickname
- **Document Type**: BRD_PRD
- **Generated Date**: 2026-04-08

---

## Executive Summary

The Casa Colina Care website currently uses the founder's full formal name ("Mari Kriss C. Aseniero") in informal body/prose contexts such as team bio text. This creates a tone mismatch — formal names in conversational copy feel stiff and impersonal, which conflicts with the brand's warmth-first positioning. This feature establishes a clear rule: informal prose content uses the founder's nickname **"Kriss"**, while formal surfaces (name cards, headings, structured data) retain the full name. The only code change required is in one bio string in `src/app/about/page.tsx`.

---

## Business Case

### Problem Statement

The About page team card bio reads:

> "With years of experience in senior care and a deep love for the Hawaii Kai community, **Mari Kriss C. Aseniero** founded Casa Colina Care to provide a home where every resident is treated like family."

Using a full formal name inside a warm, conversational bio paragraph creates a tonal inconsistency. The target audience (adult children researching care for aging parents) responds to approachability and personal connection — a full legal-style name in flowing prose undermines that.

### Business Objectives

#### OBJ-010-01: Strengthen Brand Voice Consistency

Ensure all prose/body copy on the site uses the founder's informal nickname "Kriss" when referring to the founder in conversational contexts, aligning with the brand's warm, family-oriented voice.

**Success Metric:** Zero instances of the full formal name in informal prose contexts after implementation.

#### OBJ-010-02: Establish a Repeatable Content Convention

Define and document a clear naming convention (formal vs. informal) so future content additions (new pages, testimonials, bios) apply the rule consistently without ambiguity.

**Success Metric:** Nickname constant defined in codebase; rule documented in this PRD.

### Goals

#### GOAL-010-01: Update Existing Prose

Replace all informal prose references to the founder's full name with the nickname "Kriss" in the current codebase.

#### GOAL-010-02: Prevent Future Regression

Add the founder's nickname as a named constant in the codebase so future contributors use it rather than hardcoding the full name in prose.

---

## Scope

### In Scope

- Bio text in team cards (`src/app/about/page.tsx`, `team[0].bio`)
- Any other prose/body copy discovered during implementation that references the founder's full name informally

### Out of Scope

| Surface | Reason |
|---------|--------|
| Team card `name` field ("Mari Kriss C. Aseniero") | Formal identity display — full name is correct here |
| JSON-LD structured data (`src/lib/structured-data.ts`) | Machine-readable schema — must use formal name |
| Email addresses (`kriss@casacolinacare.com`) | Email identity — must not change |
| Page headings / section titles | Formal display context |
| FAQ answer referencing email (`src/lib/faq-data.ts`) | Email reference, not a name reference |

---

## Naming Convention Rule

| Context | Format | Example |
|---------|--------|---------|
| **Informal prose / bio text** | Nickname only | "Kriss founded Casa Colina Care..." |
| **Formal display (name cards, headings)** | Full name | "Mari Kriss C. Aseniero" |
| **Structured data / schema** | Full name | "Mari Kriss C. Aseniero" |
| **Email addresses** | Email as-is | `kriss@casacolinacare.com` |

---

## Functional Requirements

- **FR-010-01**: The founder's informal nickname "Kriss" must be defined as a named export in `src/lib/constants.ts` (e.g., `FOUNDER_NICKNAME`). Supports: US-010-01, US-010-02
- **FR-010-02**: The team bio string in `src/app/about/page.tsx` must reference the nickname constant rather than a hardcoded full name string. Supports: US-010-01
- **FR-010-03**: Any future prose content referencing the founder must import and use `FOUNDER_NICKNAME` from constants. Supports: US-010-02

---

## Non-Functional Requirements

- **NFR-010-01**: The visual change must not alter layout, spacing, or any styling — only the bio text string changes.
- **NFR-010-02**: The change must not break TypeScript strict mode or introduce any lint warnings.

---

## Technical Constraints

- **TC-010-01**: `src/lib/constants.ts` is currently near-empty (only a comment). The nickname constant must be the first meaningful export added there.
- **TC-010-02**: The team array in `src/app/about/page.tsx` is a plain TypeScript array — no CMS or data fetching involved. Direct string edit is sufficient.
- **TC-010-03**: No database, no i18n layer — this is a static content change only.

---

## User Stories

### US-010-01: Update Founder Bio to Use Nickname
**As a** site visitor reading the About page  
**I want** the founder's bio to feel warm and personal  
**So that** I connect with the care home's family-oriented brand

**Acceptance Criteria:**
- [ ] AC-010-01: The bio text in `team[0].bio` (`src/app/about/page.tsx:45`) uses "Kriss" instead of "Mari Kriss C. Aseniero" in the prose sentence
- [ ] AC-010-02: The `team[0].name` field ("Mari Kriss C. Aseniero") remains unchanged — formal name card display is not affected
- [ ] AC-010-03: The rendered About page displays "Kriss founded Casa Colina Care..." in the bio paragraph (browser-verified if tooling is available)
- [ ] AC-010-04: `npm run lint -- --fix` passes with no errors
- [ ] AC-010-05: `npm run type-check` passes with no errors
- [ ] AC-010-06: `npm test -- --run` passes with no regressions

**Validates:** OBJ-010-01

---

### US-010-02: Define Founder Nickname as a Codebase Constant
**As a** developer adding future content  
**I want** the founder's nickname available as a named constant  
**So that** I never need to guess the correct informal name to use in prose

**Acceptance Criteria:**
- [ ] AC-010-07: `src/lib/constants.ts` exports `FOUNDER_NICKNAME = 'Kriss'`
- [ ] AC-010-08: `src/app/about/page.tsx` imports `FOUNDER_NICKNAME` from `src/lib/constants.ts` and uses it in the bio string (no hardcoded nickname string in component)
- [ ] AC-010-09: `npm run lint -- --fix` passes with no errors
- [ ] AC-010-10: `npm run type-check` passes with no errors

**Validates:** OBJ-010-02

---

## Risks

### RISK-010-01: Future Content Drift
**Risk:** Future bio updates or new pages hardcode the full name in prose again, undoing this convention.
**Likelihood:** Medium
**Impact:** Low
**Mitigation:** Use the `FOUNDER_NICKNAME` constant (US-010-02) so prose content is decoupled from the full name string.

---

## Implementation Notes

### Affected Files

| File | Line | Change |
|------|------|--------|
| `src/lib/constants.ts` | 2 | Add `export const FOUNDER_NICKNAME = 'Kriss'` |
| `src/app/about/page.tsx` | 1 | Add import for `FOUNDER_NICKNAME` |
| `src/app/about/page.tsx` | 45 | Replace `"...Mari Kriss C. Aseniero founded..."` with `"...${FOUNDER_NICKNAME} founded..."` using template literal |

### Before / After

**Before (`src/app/about/page.tsx:45`):**
```tsx
bio: 'With years of experience in senior care and a deep love for the Hawaii Kai community, Mari Kriss C. Aseniero founded Casa Colina Care to provide a home where every resident is treated like family.',
```

**After:**
```tsx
bio: `With years of experience in senior care and a deep love for the Hawaii Kai community, ${FOUNDER_NICKNAME} founded Casa Colina Care to provide a home where every resident is treated like family.`,
```

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Nickname is "Kriss" (2 s) | Confirmed by business owner |
| Store as constant in `constants.ts` | Prevents future hardcoding and aligns with existing pattern for centralising business info |
| Template literal for bio string | Allows constant interpolation cleanly without string concatenation |
| Formal name card (`team[0].name`) unchanged | Formal surfaces require full identity — nickname rule applies to prose only |
