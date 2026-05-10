---
title: Playwright
type: entity
tags: [tool, testing, browser]
created: 2026-05-07
updated: 2026-05-07
source_count: 12
aliases: [playwright, playwright-cli]
provenance: source-derived
---

# Playwright

Browser automation framework by Microsoft. Used by the [[QA Testing Plugin|jx-qa]] plugin for E2E test generation and execution.

## Usage in This Repo

- `/jx-qa:generate` opens live browser, follows test steps, captures semantic locators
- `/jx-qa:browser` provides manual browser exploration and debugging
- `npx playwright test` runs generated `.spec.ts` files
- `npx playwright install` sets up browser binaries

## Security Scoping

`npx` narrowed to `npx playwright test` only — prevents use as a general package runner.

## Key Concepts

- [[Semantic Locator]] — stable element locators discovered via live browser
- [[Test Code Generation]] — every CLI action generates TypeScript code
- [[Request Mocking]] — intercept, mock, modify network requests
- [[Tracing]] — execution traces with DOM snapshots, network, screenshots
- [[Storage State]] — save/restore cookies, localStorage for auth reuse
- [[Browser Automation]] — broader topic area
- [[Idempotent Operation]] — generate skill skips existing specs

## Sources
- [[Source - JX QA README]]
- [[Source - Generate SKILL]]
- [[Source - Playwright CLI SKILL]]
- [[Source - Element Attributes Reference]]
- [[Source - Playwright Tests Reference]]
- [[Source - Request Mocking Reference]]
- [[Source - Running Code Reference]]
- [[Source - Session Management Reference]]
- [[Source - Storage State Reference]]
- [[Source - Test Generation Reference]]
- [[Source - Tracing Reference]]
- [[Source - Video Recording Reference]]
