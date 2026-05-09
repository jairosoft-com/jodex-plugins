---
title: Golden Thread Traceability
type: concept
tags: [pattern, requirements, traceability, product-management]
created: 2026-05-09
updated: 2026-05-09
source_count: 3
aliases: [golden thread, requirements traceability, traceability chain]
provenance: synthesis
---

# Golden Thread Traceability

An unbroken chain of logic connecting strategic business objectives to executable test code. Every technical decision traces back to a business goal.

## The Chain

1. **Business Objective** (BRD) → OBJ-{NNN}-{seq}
2. **User Story** (PRD) → US-{NNN}-{seq} *(Validates: OBJ-{NNN}-{seq})*
3. **Acceptance Criteria** (PRD) → AC-{NNN}-{seq} *(part of US-{NNN}-{seq})*
4. **Functional Requirement** (PRD) → FR-{NNN}-{seq} *(Supports: US-{NNN}-{seq})*
5. **Technical Constraint** (TECH_SPEC) → TC-{NNN}-{seq}
6. **Test Case** (TECH_SPEC) → TEST-{NNN}-{seq} *(Validates: US-{NNN}-{seq}, AC-{NNN}-{seq})*

## Principle

If you cannot trace a line from a test case back to a business objective, that test is suspect. If you cannot trace from a business objective down to a test, that objective is unverified.

## Application in jx-pm

The [[Product Management Skills Plugin]] enforces this chain across its pipeline:
- `/jx-pm:prd` creates OBJ, US, AC, FR, NFR IDs
- `/jx-pm:techspec` creates TC, TEST IDs and references PRD IDs
- `/jx-pm:task` preserves all IDs in canonical JSON
- `/jx-pm:ado` maps each ID to an Azure DevOps work item

## Related

- [[Multi-Phase Skill]] — structural pattern for skills in the chain
- [[Requirement ID System]] — the ID format that enables tracing
- [[Product Management Skills Plugin]] — plugin implementing this pattern

## Sources
- [[Source - PRD Generator SKILL]]
- [[Source - Tech Spec Generator SKILL]]
- [[Source - Task JSON Converter SKILL]]
