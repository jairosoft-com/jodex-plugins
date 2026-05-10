# TECH_SPEC Template

# [Feature Name] — Technical Design Document

| Field | Value |
|-------|-------|
| **Author(s)** | [Names] |
| **Status** | Draft / In Review / Approved |
| **Last Updated** | {YYYY-MM-DD} |
| **Feature ID** | {feature_number} |
| **Source PRD** | {PRD.md or BRD_PRD.md} |

---

## 1. Introduction

### 1.1 Background & Problem Statement

[Current state, problem being solved, business drivers. 2-3 paragraphs max.]

### 1.2 User Stories

- US-{feature_number}-01: [Title from PRD]
- US-{feature_number}-02: [Title from PRD]

### 1.3 Goals & Non-Goals

**Goals:**
- [Specific, measurable outcome]
- [Technical capability]

**Non-Goals:**
- [Explicitly out of scope]

---

## 2. Architecture Overview

### 2.1 System Context

```mermaid
graph TD
    %% C4 Context diagram here
```

### 2.2 Narrative

[System responsibilities, key interactions, primary data flows. 1 paragraph.]

---

## 3. Design Details

### 3.1 US-{feature_number}-01: [Story Title]

**Trigger:** [What initiates this flow]

**System Behavior (EARS Syntax):**
- When [condition], the system shall [action]
- If [condition], the system shall [action]

**Sequence Diagram:**
```mermaid
sequenceDiagram
    %% Flow diagram here
```

**Data Models (JSON Schema):**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "EntityName",
  "type": "object",
  "properties": {},
  "required": []
}
```

**API Contract (OpenAPI):**
```yaml
paths:
  /api/resource:
    post:
      summary: Create resource
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Entity'
      responses:
        '201':
          description: Created
```

**State Machine:** *(if applicable)*
```mermaid
stateDiagram-v2
    %% State transitions here
```

**Error Handling:**
- [Failure mode]: [Recovery behavior]

---

## 4. Architecture Decision Records

### ADR-01: [Decision Title]
**Status:** Accepted
**Context:** [Forces at play]
**Decision:** [What we decided]
**Consequences:** [What becomes easier/harder]
**Alternatives Considered:**
- [Alternative 1]: [Why rejected]

---

## 5. Implementation Plan

### 5.1 Phased Rollout

| Phase | Deliverable | Dependencies |
|-------|-------------|--------------|
| 1 | [Initial] | None |
| 2 | [Next] | Phase 1 |

### 5.2 Data Migration

[Strategy or "No migration required."]

---

## 6. Technical Constraints

### TC-{feature_number}-01: [Title]
[Description]
**Rationale:** [Why]
**Impact:** [Effect on design]
**Mitigation:** [Workaround]

---

## 7. Testing Strategies

### TEST-{feature_number}-01: [Title]
**Related Requirements:** US-{feature_number}-01, AC-{feature_number}-01
**Test Type:** [Unit | Integration | E2E | Performance]
**Test Steps:**
1. [Step]
2. [Step]
**Expected Result:** [Outcome]

---

## 8. Cross-Cutting Concerns

### 8.1 Security & Privacy
- Authentication: [Method]
- Authorization: [Approach]
- Data protection: [Encryption, PII handling]

### 8.2 Scalability & Performance
- Expected load: [Metrics]
- Scaling strategy: [Approach]
- Latency targets: [SLAs]

### 8.3 Monitoring & Alerting
- Key metrics: [What to monitor]
- Alerting: [Critical conditions]

### 8.4 Deployment & Rollback
- Strategy: [Blue-green, canary, rolling]
- Rollback plan: [How to revert safely]
