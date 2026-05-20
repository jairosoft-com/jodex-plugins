---
title: Conditional AC Format Selection
type: concept
tags: [acceptance-criteria, prd, product-management, bdd, jx-pm, design-pattern]
created: 2026-05-20
updated: 2026-05-20
source_count: 2
aliases: [AC format matching, conditional acceptance criteria]
provenance: source-derived
---

# Conditional AC Format Selection

AC format should match story type rather than defaulting to a single format:

- **Scenario-Based (Given/When/Then):** User journeys — login, checkout, form submission
- **Rule-Based (Checklist):** Constraints, validations, permissions, accessibility
- **System State / Flow:** Backend processing, API payloads, data migrations

Hybrid stories use multiple formats separated by bold sub-headers. Every story must cover happy and unhappy paths.

## Implementation

Implemented in jx-pm PRD skill (2026-05-20). Source convergence: NotebookLM "Building Product Management Skills" notebook and Gemini AC generation prompt independently recommended the same three-format conditional approach.

## Related

- [[Sub-Headers as Dual-Purpose Contracts]]
- [[Idea Lifecycle]]
