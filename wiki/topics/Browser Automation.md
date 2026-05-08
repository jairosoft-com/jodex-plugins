---
title: Browser Automation
type: topic
tags: [testing, playwright, browser]
created: 2026-05-07
updated: 2026-05-07
source_count: 10
aliases: [browser testing]
provenance: source-derived
---

# Browser Automation

Broader subject area covering programmatic control of web browsers for testing, scraping, and automation. In this repo, implemented through [[Playwright]] and the [[QA AI]] plugin.

## Capabilities in This Repo

- **Test generation** — `/qa-ai:generate` opens live browser, discovers [[Semantic Locator]]s
- **Manual exploration** — `/qa-ai:browser open <url>` for debugging
- **Test execution** — `npx playwright test` runs generated `.spec.ts` files
- **Snapshots** — `/qa-ai:browser snapshot` captures current page state

## Security Scoping

playwright-cli usage narrowed to specific commands — no broad `npx:*` permission. See [[Pinned Helper]].

## playwright-cli Capabilities

| Capability | Concept |
|------------|---------|
| Element inspection | `eval` for DOM attributes |
| Test running/debugging | `npx playwright test --debug=cli` |
| [[Request Mocking]] | `route` commands + `run-code` |
| Custom code execution | `run-code` (geolocation, permissions, frames, downloads) |
| Session management | Named sessions (`-s`), isolation, attach/detach CDP |
| [[Storage State]] | Save/restore cookies, localStorage, auth state |
| [[Test Code Generation]] | Every action generates TypeScript code |
| [[Tracing]] | DOM snapshots, network, console, screenshots |
| Video recording | WebM capture with chapter cards and HTML overlays |

## Sources
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
