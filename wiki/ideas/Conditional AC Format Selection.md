---
title: Conditional AC Format Selection
type: idea
tags: [acceptance-criteria, prd, product-management, bdd, jx-pm]
created: 2026-05-20
status: raw
source: NotebookLM (Building PM Skills) + Gemini AC prompt
---

# Conditional AC Format Selection

AC format should match story type, not default to one format:

- **Scenario-Based (Given/When/Then):** User journeys — login, checkout, form submission
- **Rule-Based (Checklist):** Constraints, validations, permissions, accessibility
- **System State / Flow:** Backend processing, API payloads, data migrations

Hybrid stories use multiple formats separated by bold sub-headers. Every story must cover happy and unhappy paths.

Implemented in jx-pm PRD skill (2026-05-20). Source convergence: NotebookLM "Building Product Management Skills" notebook and Gemini AC generation prompt independently recommended the same three-format conditional approach.
