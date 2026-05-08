---
title: Browser Automation
type: topic
tags: [testing, playwright, browser]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
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

## Sources
- [[Source - Playwright CLI SKILL]]
