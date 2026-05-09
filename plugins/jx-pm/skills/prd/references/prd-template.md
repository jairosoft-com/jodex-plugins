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

**Acceptance Criteria:**
- AC-{feature_number}-01: [Specific verifiable criterion]
- AC-{feature_number}-02: [Another criterion]
- AC-{feature_number}-03: [Error handling criterion]
- AC-{feature_number}-04: Lint passes
- AC-{feature_number}-05: Typecheck passes
- AC-{feature_number}-06: Unit tests pass
- AC-{feature_number}-07: E2E tests pass *(UI stories only)*

**Validates:** [Goal or objective reference]

### US-{feature_number}-02: [Title]

**Description:** As a [user], I want [feature] so that [benefit].

**Acceptance Criteria:**
- AC-{feature_number}-08: [Criterion — note global counter continues]
- AC-{feature_number}-09: [Another criterion]
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
