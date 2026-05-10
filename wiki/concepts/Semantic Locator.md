---
title: Semantic Locator
type: concept
tags: [testing, playwright, locator]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [stable locator, locator strategy]
provenance: source-derived
---

# Semantic Locator

A [[Playwright]] element locator discovered by live browser exploration rather than hardcoded CSS selectors. The [[QA Testing Plugin|jx-qa]] plugin's generate skill opens a real browser and captures stable locators during test generation.

## Why Live Discovery

- Selectors from documentation or guessing break when UI changes
- Live exploration captures actual rendered DOM structure
- Semantic locators (role, text, label) are more stable than CSS paths

## How It Works

1. `/jx-qa:generate` reads test steps from xlsx
2. Opens live browser via playwright-cli
3. Follows each test step, captures locators for target elements
4. Writes `.spec.ts` with discovered locators

## Sources
- [[Source - Generate SKILL]]
