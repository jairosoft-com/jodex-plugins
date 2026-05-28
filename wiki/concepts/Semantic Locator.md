---
title: Semantic Locator
type: concept
tags: [testing, playwright, locator]
created: 2026-05-07
updated: 2026-05-12
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

The important shift is from generated guesses to observed UI facts. The test generator can still use model reasoning to decide which element matters, but the final selector should come from the rendered page that Playwright actually sees.

## How It Works

1. `/jx-qa:generate` reads test steps from xlsx
2. Opens live browser via playwright-cli
3. Follows each test step, captures locators for target elements
4. Writes `.spec.ts` with discovered locators

## Failure Mode

Semantic locators are only as good as the accessibility surface of the application under test. If the UI lacks stable roles, labels, names, or test IDs, the generator should report locator uncertainty instead of falling back silently to brittle CSS chains.

## Related

- [[Test Code Generation]] — uses locator discovery when writing specs
- [[Request Mocking]] — complementary testing pattern for controlling network behavior

## Sources
- [[Source - Generate SKILL]]
