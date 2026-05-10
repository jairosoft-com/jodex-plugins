---
name: spec
user-invocable: true
argument-hint: "[--docs-root <path>]"
description: >
  Transform a PRD or BRD_PRD into a framework-agnostic TECH_SPEC.md with Mermaid diagrams,
  JSON Schema data models, OpenAPI contracts, and Architecture Decision Records.
  Triggers on: create tech spec, generate technical spec, technical design, architecture doc.
  Do not trigger for: PRD generation, task breakdown, Azure sync, wiki operations.
---

# Technical Specification Generator

Transform a PRD into a complete, machine-readable technical specification focused on stable contracts and architectural decisions. Framework-agnostic — uses Mermaid, JSON Schema, OpenAPI, and ADR format.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--docs-root` | No | `docs/` or `$JX_DOCS_ROOT` | Output directory root |

---

## Phase 1: Folder Path & ID Extraction

Apply rules from `../../../jx-core/_shared/id-rules.md` and `../../../jx-core/_shared/docs-root.md`:

1. Prompt for folder path
2. Validate folder name pattern
3. Extract feature number

### Round-Trip ID Extraction

Check for existing PRD in folder:
- Look for `PRD.md` or `BRD_PRD.md`
- If found: extract feature number from requirement IDs using pattern `\w+-(\d{3})-\d+`
- Validate all IDs in PRD have consistent feature number
- If inconsistent: HALT with error
- If no PRD found: use folder-based feature number, request user's feature description

---

## Phase 2: PRD Analysis & Ambiguity Detection

Read the PRD and analyze for:

**Vague Adjectives:** "Fast", "Modern", "Scalable", "User-friendly" without metrics
**Missing Constraints:** Error handling, offline behavior, latency budgets, data retention
**Logic Gaps:** Incomplete flows, missing validation, undefined edge cases
**Undefined Contracts:** Vague API responses, unclear data structures
**Security Blindspots:** Missing auth, authorization, data protection requirements

Report findings to user before proceeding.

---

## Phase 3: Socratic Interview

Ask 3-7 high-value architectural questions. Focus on decisions that shape implementation:

### Technical Decisions
- "Should this use optimistic UI updates to meet the latency requirement?"
- "Do you need a relational schema or is NoSQL acceptable for this data shape?"
- "Synchronous API call or async background job?"

### Non-Functional Requirements
- "Expected load? (requests/sec, concurrent users)"
- "Latency targets for critical operations?"
- "Data retention policy?"

### Cross-Cutting Concerns
- "How should authentication/authorization work?"
- "What monitoring and alerting do you need?"
- "Rollback strategy if deployment fails?"

### Constraints & Trade-offs
- "Optimizing for development speed or runtime performance?"
- "Acceptable downtime window for deployments?"

**Rules:**
- Never ask generic questions ("Who is the target audience?")
- Tie every question to a specific architectural decision
- Challenge vague requirements with concrete alternatives

---

## Phase 4: Generate TECH_SPEC

Generate using `references/template.md` structure. Use diagram patterns from `references/diagram-patterns.md`.

### ID Generation

TECH_SPEC creates only two ID types:
- `TC-{feature_number}-{seq}` — Technical Constraints
- `TEST-{feature_number}-{seq}` — Test Cases

Reference PRD IDs (US, AC, FR, NFR) without modification. NEVER create new US/AC/FR IDs.

### Section 1: Introduction (The "Why")
- Background & problem statement
- User stories (reference from PRD by ID)
- Goals & non-goals

### Section 2: Architecture Overview (The "Where")
- System context diagram (Mermaid C4 — see diagram-patterns.md)
- Narrative: system responsibilities, key interactions, data flows

### Section 3: Design Details (The "How")
Organized by user story. For each:
- **Trigger:** What initiates this flow
- **System Behavior:** EARS syntax (When/If/While...shall)
- **Sequence Diagram:** Mermaid
- **Data Models:** JSON Schema
- **API Contracts:** OpenAPI YAML (if applicable)
- **State Machines:** Mermaid stateDiagram-v2 (if applicable)
- **Error Handling:** Failure modes and recovery

### Section 4: Architecture Decision Records
For each major decision:
```markdown
### ADR-{seq}: [Decision Title]
**Status:** [Proposed | Accepted | Deprecated]
**Context:** [What forces are at play]
**Decision:** [What we decided]
**Consequences:** [What becomes easier/harder]
**Alternatives Considered:** [What else was evaluated and why rejected]
```

### Section 5: Implementation Plan
- Phased rollout strategy
- Task breakdown with dependencies
- Data migration (if applicable)

### Section 6: Technical Constraints
```markdown
### TC-{feature_number}-{seq}: [Title]
[Description]
**Rationale:** [Why this constraint exists]
**Impact:** [How it affects design]
**Mitigation:** [How to work within it]
```

### Section 7: Testing Strategies
```markdown
### TEST-{feature_number}-{seq}: [Title]
**Related Requirements:** [US-{NNN}-{seq}, AC-{NNN}-{seq}]
**Test Type:** [Unit | Integration | E2E | Performance]
**Test Steps:**
1. [Step]
2. [Step]
**Expected Result:** [Outcome]
```

### Section 8: Cross-Cutting Concerns
- Security & privacy
- Scalability & performance
- Monitoring & alerting
- Deployment & rollback

---

## Phase 5: Validation & Save

### Self-Review Checklist
- [ ] All diagrams use Mermaid syntax
- [ ] Data models use JSON Schema
- [ ] APIs use OpenAPI specification
- [ ] No framework-specific implementation details
- [ ] All vague adjectives replaced with metrics
- [ ] Cross-cutting concerns addressed
- [ ] Testing strategy defined with TEST IDs
- [ ] Technical constraints documented with TC IDs
- [ ] ADRs document key architectural decisions
- [ ] PRD IDs referenced without modification

### Save
- Save to `{docs_root}/{folder_name}/TECH_SPEC.md`

---

## Interaction Style

- **Be Socratic:** Challenge vague requirements
- **Be Visual:** Offer diagrams for complex logic (Mermaid only)
- **Be Explicit:** Never use "etc." — list all items
- **Be Minimal:** Focus on stable contracts, not implementation details
- **Be Formal:** JSON Schema, OpenAPI, Mermaid for all specs
