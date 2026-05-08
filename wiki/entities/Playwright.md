---
title: Playwright
type: entity
tags: [tool, testing, browser]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [playwright, playwright-cli]
provenance: source-derived
---

# Playwright

Browser automation framework by Microsoft. Used by the [[QA AI]] plugin for E2E test generation and execution.

## Usage in This Repo

- `/qa-ai:generate` opens live browser, follows test steps, captures semantic locators
- `/qa-ai:browser` provides manual browser exploration and debugging
- `npx playwright test` runs generated `.spec.ts` files
- `npx playwright install` sets up browser binaries

## Security Scoping

`npx` narrowed to `npx playwright test` only — prevents use as a general package runner.

## Sources
- [[Source - QA AI README]]
