---
title: Requirement ID System
type: concept
tags: [pattern, requirements, id-system, traceability]
created: 2026-05-09
updated: 2026-05-09
source_count: 9
aliases: [folder-based IDs, requirement IDs, feature number IDs]
provenance: synthesis
---

# Requirement ID System

A deterministic ID format for requirements documents that enables [[Golden Thread Traceability]] across the full document pipeline.

## Format

```
{TYPE}-{feature_number}-{seq}
```

- **TYPE**: Requirement category (see table below)
- **feature_number**: 3-digit number extracted from folder name, with leading zeros preserved (e.g., "006", not "6")
- **seq**: 2-digit sequential number with zero-padding (01, 02, 03...)

## ID Types

| Type | Full Name | Created By | Counter |
|------|-----------|------------|---------|
| OBJ | Business Objective | bprd | Independent |
| GOAL | Goal | bprd (unified mode) | Independent |
| US | User Story | bprd | Independent |
| AC | Acceptance Criteria | bprd | **Global across all US** |
| FR | Functional Requirement | bprd | Independent |
| NFR | Non-Functional Requirement | bprd | Independent |
| RISK | Risk | bprd (unified mode) | Independent |
| TC | Technical Constraint | techspec | Independent |
| TEST | Test Case | techspec | Independent |

## Critical Rule: Global AC Counter

Acceptance Criteria IDs do NOT reset per user story. They increment globally across the entire document:

```
US-006-01 → AC-006-01, AC-006-02
US-006-02 → AC-006-03, AC-006-04  (continues, not reset)
```

## Folder-Based Extraction

Feature number derives from folder name pattern `{NNN}_{feature_name}`:
- `prds/006_about_founder/` → feature number `006`
- `prds/010_payment_gateway/` → feature number `010`

## Cross-Document Consistency

- `/jx-pm:techspec` references PRD IDs (US, AC, FR) — never creates new ones
- `/jx-pm:techspec` creates only TC and TEST IDs
- `/jx-pm:task` preserves all IDs exactly in task.json
- `/jx-pm:ado` maps each ID to an Azure work item

## Related

- [[Golden Thread Traceability]] — the chain this ID system enables
- [[Product Management Skills Plugin]] — plugin using this system

## Sources
- [[Source - PRD Example Lite]]
- [[Source - PRD Lite Template]]
- [[Source - PRD Standard Template]]
- [[Source - Unified BRD-PRD Template]]
- [[Source - Tech Spec Template]]
- [[Source - ID Rules]]
- [[Source - jx-core ID Rules]]
- [[Source - jx-dev Spec SKILL]]
- [[Source - jx-dev Tech Spec Template]]
