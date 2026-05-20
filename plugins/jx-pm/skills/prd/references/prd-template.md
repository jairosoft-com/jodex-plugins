# PRD Template — Standard Mode

## Document Metadata
- **Feature ID**: {feature_number}
- **Feature Name**: {feature_name}
- **Document Type**: PRD
- **Generated Date**: {YYYY-MM-DD}

## Introduction

[Brief description of the feature and the problem it solves. 2-3 sentences.]

## Goals

- [SMART goal 1]
- [SMART goal 2]
- [SMART goal 3]
- [SMART goal 4]

## User Stories

### US-{feature_number}-01: [Title]

**Description:** As a [user], I want [feature] so that [benefit].

*Format: Scenario-Based — [rationale: user-facing flow with step-by-step journey]*

**Acceptance Criteria:**

**Scenarios:**
- AC-{feature_number}-01: Given [context], When [action], Then [expected result — happy path]
- AC-{feature_number}-02: Given [context], When [error condition], Then [error handling — unhappy path]

**Quality Gates:**
- AC-{feature_number}-03: Lint passes
- AC-{feature_number}-04: Typecheck passes
- AC-{feature_number}-05: Unit tests pass
- AC-{feature_number}-06: E2E tests pass

**Validates:** [Goal or objective reference]

### US-{feature_number}-02: [Title]

**Description:** As a [user], I want [feature] so that [benefit].

*Format: Rule-Based — [rationale: field validations and constraints]*

**Acceptance Criteria:**

**Rules:**
- AC-{feature_number}-07: [Constraint or validation — happy path. Note global counter continues]
- AC-{feature_number}-08: [Another constraint]
- AC-{feature_number}-09: [Error/edge case — unhappy path]

**Quality Gates:**
- AC-{feature_number}-10: Lint passes
- AC-{feature_number}-11: Typecheck passes
- AC-{feature_number}-12: Unit tests pass

**Validates:** [Goal or objective reference]

## Functional Requirements

- FR-{feature_number}-01: The system must [action with measurable outcome] *(Supports US-{feature_number}-01)*
- FR-{feature_number}-02: When [trigger], the system must [response with timing] *(Supports US-{feature_number}-01)*
- FR-{feature_number}-03: All [data type] must be [constraint] *(Supports US-{feature_number}-02)*

## Non-Functional Requirements

- NFR-{feature_number}-01: **Performance:** [measurable: e.g., "95% of API requests <200ms"]
- NFR-{feature_number}-02: **Security:** [specific: e.g., "All PII encrypted at rest using AES-256"]
- NFR-{feature_number}-03: **Accessibility:** [standard: e.g., "WCAG 2.1 AA compliance"]
- NFR-{feature_number}-04: **Scalability:** [metric: e.g., "Support 10,000 concurrent users"]

## Non-Goals (Out of Scope)

- [Excluded feature 1 — reason]
- [Excluded feature 2 — reason]

## Design Considerations

- UI/UX requirements (link to mockups if available)
- Existing components to reuse
- Key interaction patterns

## Technical Considerations

- Known constraints or dependencies
- Integration points with existing systems
- Performance requirements
- Data model implications

## Success Metrics

**Primary:**
- [Metric 1]: [baseline] → [target] (measured via [method])
- [Metric 2]: [baseline] → [target] (measured via [method])

**Secondary:**
- [Supporting metric]

## Open Questions

- [Question 1]
- [Question 2]
