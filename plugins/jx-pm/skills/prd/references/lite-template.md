# PRD Template — Lite Mode

## Document Metadata
- **Feature ID**: {feature_number}
- **Feature Name**: {feature_name}
- **Document Type**: PRD
- **Generated Date**: {YYYY-MM-DD}
- **Quality Profile**: default
- **Quality Gates**:
  - Lint passes [code-only]
  - Typecheck passes [code-only]
  - Unit tests pass [code-only]
  - E2E tests pass [ui-only]

## Overview
- **Feature ID:** {feature_number}
- **Feature Name:** [Clear, descriptive title]
- **Business Objective:** [The "why" — what business goal does this support?]
- **Success Metric:** [How will we measure success? Be specific]

## Problem Statement
- What problem are we solving?
- What evidence supports this? (data, research, feedback)
- Who experiences this problem?

## Goals
- [SMART goal 1]
- [SMART goal 2]
- [SMART goal 3]

## User Stories

### US-{feature_number}-01: [Title]
**As a** [user type]
**I want** [feature/capability]
**So that** [benefit/value]

*Format: Rule-Based — [rationale]*

**Acceptance Criteria:**

**Rules:**
- AC-{feature_number}-01: [Specific, verifiable criterion — happy path]
- AC-{feature_number}-02: [Another criterion]
- AC-{feature_number}-03: [Unhappy path — error/edge case]

**Quality Gates:**
- AC-{feature_number}-04: {quality_gate_1}
- AC-{feature_number}-05: {quality_gate_2}
- AC-{feature_number}-06: {quality_gate_3}

<!-- Gates resolved from quality-gates.md. Default: Lint passes, Typecheck passes, Unit tests pass, E2E tests pass [ui-only] -->
<!-- See SKILL.md Format Selection Rules for Scenario-Based and System State formats -->

**Validates:** [OBJ or GOAL reference]

## Functional Requirements

- FR-{feature_number}-01: The system must [action] *(Supports US-{feature_number}-01)*
- FR-{feature_number}-02: When [trigger], the system must [response] *(Supports US-{feature_number}-01)*

## Non-Functional Requirements

- NFR-{feature_number}-01: **Performance:** [measurable criterion]
- NFR-{feature_number}-02: **Security:** [specific standard]
- NFR-{feature_number}-03: **Accessibility:** [compliance level]

## Non-Goals (Out of Scope)

- [Feature deliberately excluded]
- [Why excluded, if helpful]

## Success Metrics

**Primary:**
- [Metric]: [baseline] → [target]

**Measurement:**
- [Method: e.g., "Measured via analytics event tracking"]

## Open Questions

- [Remaining questions before implementation]
