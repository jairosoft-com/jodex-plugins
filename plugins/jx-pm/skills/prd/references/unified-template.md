# Unified BRD-PRD Template

## Document Metadata
- **Feature ID**: {feature_number}
- **Feature Name**: {feature_name}
- **Document Type**: BRD_PRD
- **Generated Date**: {YYYY-MM-DD}

## Document Control

| Attribute | Details |
|-----------|---------|
| **Status** | [Draft / In Review / Approved] |
| **Project Sponsor** | [Name] |
| **Product Owner** | [Name] |
| **Target Release** | [Date] |

---

## Part I: Strategic Foundation (BRD)

### 1. Executive Summary

*(Write last. 1-2 paragraphs: problem, solution, objectives, timeline, ROI)*

### 2. Business Problem & Opportunity

#### Current State
[Describe existing situation with data]

**Quantitative Evidence:**
- [Data point 1]
- [Data point 2]

**Qualitative Evidence:**
- [User feedback / research]

#### Root Cause Analysis
[Underlying causes, not symptoms]

### 3. Business Objectives & Success Metrics

| Objective ID | SMART Objective | KPI | Current | Target |
|---|---|---|---|---|
| OBJ-{feature_number}-01 | [Specific, measurable goal] | [Metric] | [Baseline] | [Goal] |
| OBJ-{feature_number}-02 | [Another goal] | [Metric] | [Baseline] | [Goal] |

### 4. Project Scope

#### In Scope
- [Deliverable 1]
- [Deliverable 2]

#### Out of Scope
- [Excluded item 1 — reason]
- [Excluded item 2 — reason]

### 5. Stakeholder Analysis (RACI)

| Stakeholder | Role | R/A/C/I |
|---|---|---|
| [Name] | Sponsor | A |
| [Name] | Product Owner | R |

### 6. Assumptions, Constraints & Dependencies

**Assumptions:** [List]
**Constraints:** [Budget, timeline, tech]
**Dependencies:** [External systems, teams]

### 7. Risk Assessment

| Risk ID | Risk | Likelihood (1-5) | Impact (1-5) | Mitigation |
|---|---|---|---|---|
| RISK-{feature_number}-01 | [Description] | [N] | [N] | [Strategy] |

---

## Part II: Tactical Execution (PRD)

### 8. Target Users & Personas

**Primary Persona:** [Name/Role]
- Goals: [What they want]
- Pain Points: [Current frustrations]

### 9. User Stories

#### GOAL-{feature_number}-01: [Goal Name]

### US-{feature_number}-01: [Title]
**As a** [persona]
**I want** [action]
**So that** [benefit]

**Acceptance Criteria:**
- AC-{feature_number}-01: [Criterion]
- AC-{feature_number}-02: [Criterion]
- AC-{feature_number}-03: Lint passes
- AC-{feature_number}-04: Typecheck passes
- AC-{feature_number}-05: Unit tests pass

**Validates:** OBJ-{feature_number}-01

### US-{feature_number}-02: [Title]
**As a** [persona]
**I want** [action]
**So that** [benefit]

**Acceptance Criteria:**
- AC-{feature_number}-06: [Criterion — global counter continues]
- AC-{feature_number}-07: [Criterion]
- AC-{feature_number}-08: Lint passes
- AC-{feature_number}-09: Typecheck passes
- AC-{feature_number}-10: Unit tests pass

**Validates:** OBJ-{feature_number}-01

### 10. Non-Functional Requirements

| NFR ID | Category | Requirement | Links to | Test Method |
|---|---|---|---|---|
| NFR-{feature_number}-01 | Performance | [Specific metric] | OBJ-{feature_number}-01 | [Method] |
| NFR-{feature_number}-02 | Security | [Specific standard] | Compliance | [Method] |

### 11. Technical Considerations

- Architecture approach
- Integration points
- Data model implications

### 12. Open Questions & Decision Log

| Question | Date | Decision | Rationale |
|---|---|---|---|
| [Question] | [Date] | [Decision] | [Why] |

### 13. Release Plan

| Milestone | Target Date | Status |
|---|---|---|
| Requirements Approved | [Date] | [Status] |
| Design Complete | [Date] | [Status] |
| Development Kickoff | [Date] | [Status] |
| Launch | [Date] | [Status] |

---

## Approval

| Role | Name | Date |
|---|---|---|
| Sponsor | | |
| Product Owner | | |
