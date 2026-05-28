---
title: "Source - Test SKILL"
type: source
tags: [skill, jx-qa, playwright, test]
created: 2026-05-11
updated: 2026-05-11
raw_path: wiki/raw/sources/a2240379-SKILL.md
provenance: source-derived
---

# Source - Test SKILL

## Metadata
- **Original path**: plugins/jx-qa/skills/test/SKILL.md
- **SHA-256**: a2240379e439d720ab5af39738dd466589403d0a93bcac9dfd85372aebd530f2
- **Size**: 1,300 bytes

## Summary

User-invocable [[Skill]] for running [[Playwright]] E2E tests from the [[QA Testing Plugin|jx-qa]] command surface. The default mode runs tests headlessly with `npx playwright test`; optional `ui` opens Playwright UI mode; optional `headed` runs tests with a visible browser.

## Key Concepts
- Headless Playwright test execution as the default validation mode
- Interactive Playwright UI mode for selecting, inspecting, and debugging tests
- Headed browser mode for observing execution without the full UI debugger
- Trigger scope limited to E2E Playwright test execution, excluding test-plan review and test generation tasks

## Pages Updated
- [[QA Testing Plugin]]
