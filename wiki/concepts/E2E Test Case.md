---
title: E2E Test Case
type: concept
tags: [testing, qa, classification]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [end-to-end test, E2E test]
provenance: source-derived
---

# E2E Test Case

A test case that exercises a system through its user interface, covering browser/UI assertions, navigation flows, and cross-system interactions. The [[QA Testing Plugin|jx-qa]] plugin's extract skill classifies requirements as E2E-testable or not.

## E2E-Testable

- Browser/UI content assertions (rendered text, element visibility)
- Navigation and user flows (page load, click sequences, form submission)
- Visual/layout checks (spacing, overflow, responsive behavior)
- Authentication flows, checkout sequences, workflow state transitions
- Cross-system handoffs (email delivery, API-then-UI verification)
- Data persistence (submit form → verify on reload)

## NOT E2E

- Lint, type-check, build tool passes (CLI tooling)
- Unit/integration test assertions (test runner scope)
- Code-level inspection (imports, exports, constant values)
- Static analysis checks

## Hybrid Requirements

When an acceptance criterion contains both E2E and code-level assertions, extract only the E2E portion. Example: "bio uses nickname AND imports constant" → test only the nickname display.

## Sources
- [[Source - Extract SKILL]]
