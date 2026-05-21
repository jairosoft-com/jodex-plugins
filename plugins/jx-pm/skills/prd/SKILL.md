---
name: prd
user-invocable: true
argument-hint: "[--mode lite|prd|unified] [--docs-root <path>] [--quality-profile default|python|rust|go]"
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
| `--docs-root` | No | `docs/` or `$JX_DOCS_ROOT` | Output directory root |
| `--quality-profile` | No | `default` | `default` \| `python` \| `rust` \| `go` \| path to custom config |

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
- Resolve docs root per `../../../jx-core/_shared/docs-root.md`
- Resolve `$JX_DOCS_ROOT` for output path
- Resolve quality profile per `../../../jx-core/_shared/quality-gates.md` resolution order:
  1. `--quality-profile` argument (highest priority)
  2. Project override at `{docs_root}/.jodex/quality-gates.md` (must have `version: 1` frontmatter)
  3. Default gates from quality-gates.md

---

## Phase 2: Folder Path & Validation

Apply rules from `../../../jx-core/_shared/id-rules.md`:

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

*Format: [Selected format] — [1-2 sentence rationale]*

**Acceptance Criteria:**

**[Scenarios:|Rules:|System Behavior:]**
- AC-{feature_number}-{seq}: [Happy-path criterion]
- AC-{feature_number}-{seq}: [Unhappy-path criterion]

**Quality Gates:**
- AC-{feature_number}-{seq}: Lint passes
- AC-{feature_number}-{seq}: Typecheck passes
- AC-{feature_number}-{seq}: Unit tests pass

**Validates:** [OBJ-{feature_number}-{seq} or GOAL-{feature_number}-{seq}]
```

**AC Counter Rule:** Global sequential numbering across ALL user stories (never resets per story). One scenario/rule/state = one AC ID.

**All AC bodies MUST be single-line** after the `AC-{NNN}-{seq}:` prefix. Multi-line bodies break the ADO parser. See `../../../jx-core/_shared/id-rules.md` AC Format Compatibility.

### AC Format Selection

Analyze each user story and apply the format(s) most relevant to the feature type:

| Condition | Story Type | Format | Example |
|-----------|-----------|--------|---------|
| A | User interacts with UI in step-by-step flow | Scenario-Based (Given/When/Then) | Login, checkout, form submission |
| B | Field validations, permissions, constraints, accessibility | Rule-Based (Checklist) | Password rules, role access, WCAG |
| C | Background processing, API payloads, data migrations | System State / Flow | Webhook handler, ETL job, API integration |

**Do NOT default to one format.** Analyze the story type and select accordingly.

**Hybrid:** Complex stories may need multiple formats. Separate with bold sub-headers:
- `**Scenarios:**` — Given/When/Then items
- `**Rules:**` — Checklist items
- `**System Behavior:**` — State/flow items (canonical name; `**System State:**` is also accepted)
- `**Quality Gates:**` — Always present, always Rule-Based

These sub-headers serve dual purpose: visual grouping in the PRD AND format detection for ADO sync.

**Format Rationale:** Before the Acceptance Criteria block, add an italic line: `*Format: [type] — [why]*`

**Happy/Unhappy Paths:** Every story MUST include at least one happy-path AC and one unhappy-path AC. Unhappy paths cover error handling, edge cases, and failure recovery.

**Mode-Specific Defaults:**

| Mode | Default AC Format | Format Selection |
|------|-------------------|------------------|
| `lite` | Rule-Based (checklist) | Escalate to Scenario-Based or System State only if story type demands it |
| `prd` | Conditional per story | Full format selection rules apply |
| `unified` | Conditional per story | Full format selection rules apply |

**AC Format Examples:**

Scenario-Based:
```
- AC-006-01: Given user is on checkout page, When they click "Buy Now", Then order processes within 2s
- AC-006-02: Given user clicks "Buy Now" with expired card, When payment fails, Then error message displays with retry option
```

Rule-Based:
```
- AC-006-01: Payment details stored using PCI-compliant tokenization
- AC-006-02: User can save up to 3 payment methods
- AC-006-03: Invalid card number displays inline error within 500ms
```

System State:
```
- AC-006-01: When POST /orders receives valid payload, system creates order record with status=pending and returns 201
- AC-006-02: When POST /orders receives invalid payload, system returns 400 with validation errors array
```

**Quality Gates (auto-added to every story under `**Quality Gates:**` sub-header):**

Read gates from the resolved quality profile (see `../../../jx-core/_shared/quality-gates.md`). Gates without tags are added to all stories. Gates tagged `[ui-only]` are added only to UI stories.

Default profile gates: Lint passes, Typecheck passes, Unit tests pass, E2E tests pass [ui-only].

Persist the resolved profile and gate list in the PRD Document Metadata section:
```markdown
- **Quality Profile**: {profile_name}
- **Quality Gates**:
  - {gate_1}
  - {gate_2}
  - {gate_3}
  - {gate_4} [ui-only]
```

The `Quality Gates:` metadata is authoritative for downstream ADO/task consumers. Gate names must not contain commas.

---

## Phase 6: Validate & Save

### Pre-Save Validation

Run the shared AC block validator before writing:
```bash
bash ../../../jx-core/scripts/validate-ac-blocks.sh {output_file}
```

The validator checks that within each AC block (between `**Acceptance Criteria:**` and `**Validates:**` / next story / next section), every non-blank line matches: AC bullet (`- AC-{NNN}-{seq}: ...`), routing sub-header (`**Scenarios:**` etc.), or format rationale (`*Format: ...`). Orphan/continuation lines halt the save with line-numbered errors.

### Save

1. Save to `{docs_root}/{folder_name}/PRD.md` (or `BRD_PRD.md` for unified mode)
2. Display save confirmation with path

---

## Checklist Before Saving

- [ ] Folder path validated, feature number extracted
- [ ] Clarifying questions asked and answers incorporated
- [ ] Document metadata section present (Feature ID, Feature Name, Document Type, Date)
- [ ] All objectives are SMART goals
- [ ] User stories follow INVEST criteria with `US-{NNN}-{seq}` format
- [ ] Acceptance criteria use global counter with `AC-{NNN}-{seq}` format
- [ ] AC format rationale present for each story
- [ ] Happy and unhappy paths covered for each story
- [ ] Sub-headers present on every AC block (Scenarios/Rules/System Behavior + Quality Gates)
- [ ] All AC bodies are single-line (pre-save validation passed)
- [ ] Each story has "Validates:" field linking to objective/goal
- [ ] Functional requirements numbered `FR-{NNN}-{seq}` with "Supports:" notation
- [ ] NFRs are measurable (no vague terms)
- [ ] Non-goals explicitly listed
- [ ] Success metrics tie back to business objective
- [ ] Quality Gates added to every story
