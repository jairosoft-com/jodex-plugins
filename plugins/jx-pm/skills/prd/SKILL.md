---
name: prd
user-invocable: true
argument-hint: "[--mode lite|prd|unified] [--docs-root <path>] [--chain] [--chain-all]"
description: >
  Generate structured Product Requirements Documents with built-in traceability.
  Supports three modes: lite (single feature, 3-5 stories), prd (complex multi-system),
  unified (BRD+PRD combining business justification with tactical detail).
  Triggers on: create prd, write requirements, plan feature, document feature, feature spec,
  create brd, unified requirements, strategic product spec.
  Do not trigger for: tech spec generation, task breakdown, Azure sync, wiki operations.
---

# PRD Generator

Generate structured requirements documents with golden thread traceability from business objectives to testable acceptance criteria.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--mode` | No | `prd` | `lite` \| `prd` \| `unified` |
| `--docs-root` | No | `docs/` or `$JX_PM_DOCS_ROOT` | Output directory root |
| `--chain` | No | — | After save, invoke `/jx-pm:techspec` with same folder |
| `--chain-all` | No | — | After save, invoke `/jx-pm:pipeline` for remaining skills |

## Mode Selection Guide

| Mode | When to use | Output file |
|------|-------------|-------------|
| `lite` | Single feature, limited ambiguity, 3-5 user stories | `PRD.md` |
| `prd` | Multi-system, integrations, migrations, >5 stories | `PRD.md` |
| `unified` | Need executive buy-in AND implementation detail in one doc | `BRD_PRD.md` |

---

## Phase 1: Argument Parsing

Parse arguments from invocation:
- Extract `--mode` (default: `prd`)
- Resolve docs root per `_shared/docs-root.md`
- Note `--chain` or `--chain-all` for Phase 6

---

## Phase 2: Folder Path & Validation

Apply rules from `_shared/id-rules.md`:

1. Prompt: `Where should this document be saved? (e.g., {docs_root}006_payment_gateway/)`
2. Validate folder name pattern: `{NNN}_{feature_name}`
3. Extract feature number (preserve leading zeros)
4. Display confirmation, wait for user approval
5. Store feature number for ID generation

---

## Phase 3: Clarifying Questions

Ask 3-5 essential questions with lettered options for quick iteration.

### All Modes

```
1. What is the primary business objective?
   A. Increase revenue/conversions
   B. Reduce costs/improve efficiency
   C. Improve user experience/retention
   D. Regulatory compliance/risk mitigation
   E. Market expansion/competitive positioning
   F. Other: [please specify]

2. Who is the target user?
   A. End customers (external)
   B. Internal employees
   C. Business partners/B2B
   D. Admin users only
   E. Multiple user types

3. What is the desired scope?
   A. Minimal viable version (MVP)
   B. Full-featured implementation
   C. Phased rollout
   D. Proof of concept only
```

### Additional for `prd` mode

```
4. What systems does this span?
   A. Single service/component
   B. Multiple internal services
   C. External integrations required
   D. Migration from existing system

5. What evidence supports this initiative?
   A. User research/interviews
   B. Analytics/data showing problem
   C. Competitive analysis
   D. Executive directive
   E. Multiple sources
```

### Additional for `unified` mode

```
4. What type of approval do you need?
   A. Budget justification for executives
   B. Strategic alignment with leadership
   C. Both budget and strategy
   D. Technical feasibility sign-off

5. What is the investment scale?
   A. Small (<$50K, <3 months)
   B. Medium ($50K-$250K, 3-6 months)
   C. Large (>$250K, >6 months)
```

Users can respond with "1A, 2C, 3A" for quick iteration.

---

## Phase 4: Golden Thread

Before generating, establish the traceability chain:

**Business Objective → User Need → Feature → Acceptance Criteria → Success Metric**

Display to user:
```
Golden Thread:
1. Business Objective: [from Q1 answer]
2. Target User: [from Q2 answer]
3. Scope: [from Q3 answer]
4. Success Metric: [to be defined in document]
```

Confirm before proceeding.

---

## Phase 5: Generate Document

Generate using the appropriate template:
- `lite` → `references/lite-template.md`
- `prd` → `references/prd-template.md`
- `unified` → `references/unified-template.md`

### Core Principles (All Modes)

**Measurability Mandate:** Every requirement must be testable. Transform vague → measurable:
- "Fast" → "<200ms response time for 95% of requests"
- "Secure" → "AES-256 encryption at rest, bcrypt password hashing"
- "Easy to use" → "First-time users complete task in <3 minutes"

**INVEST User Stories:** Independent, Negotiable, Valuable, Estimable, Small, Testable.

**User Story Format:**
```markdown
### US-{feature_number}-{seq}: [Title]
**As a** [user type]
**I want** [feature/capability]
**So that** [benefit/value]

**Acceptance Criteria:**
- AC-{feature_number}-{seq}: [Specific, verifiable criterion]
- AC-{feature_number}-{seq}: [Another measurable criterion]
- AC-{feature_number}-{seq}: Lint passes
- AC-{feature_number}-{seq}: Typecheck passes
- AC-{feature_number}-{seq}: Unit tests pass

**Validates:** [OBJ-{feature_number}-{seq} or GOAL-{feature_number}-{seq}]
```

**AC Counter Rule:** Global sequential numbering across ALL user stories (never resets per story).

**Quality Criteria (auto-added to every story):**
- All stories: Lint passes, Typecheck passes, Unit tests pass
- UI stories: + E2E tests pass

---

## Phase 6: Save & Chain

1. Save to `{docs_root}/{folder_name}/PRD.md` (or `BRD_PRD.md` for unified mode)
2. Display save confirmation with path
3. If `--chain`: invoke `/jx-pm:techspec` with same folder path
4. If `--chain-all`: invoke `/jx-pm:pipeline` with remaining skills

---

## Checklist Before Saving

- [ ] Folder path validated, feature number extracted
- [ ] Clarifying questions asked and answers incorporated
- [ ] Document metadata section present (Feature ID, Feature Name, Document Type, Date)
- [ ] All objectives are SMART goals
- [ ] User stories follow INVEST criteria with `US-{NNN}-{seq}` format
- [ ] Acceptance criteria use global counter with `AC-{NNN}-{seq}` format
- [ ] Each story has "Validates:" field linking to objective/goal
- [ ] Functional requirements numbered `FR-{NNN}-{seq}` with "Supports:" notation
- [ ] NFRs are measurable (no vague terms)
- [ ] Non-goals explicitly listed
- [ ] Success metrics tie back to business objective
- [ ] Quality criteria added to every story
