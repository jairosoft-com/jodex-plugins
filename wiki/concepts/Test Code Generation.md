---
title: Test Code Generation
type: concept
tags: [testing, playwright, automation]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [code generation, codegen]
provenance: source-derived
---

# Test Code Generation

Every action performed with playwright-cli generates corresponding [[Playwright]] TypeScript code. This code can be copied directly into test files.

## How It Works

```bash
playwright-cli fill e1 "user@example.com"
# Ran Playwright code:
# await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
```

## Workflow

1. Open browser, take snapshot to see elements
2. Perform actions — each generates TypeScript code
3. Collect generated code into a `.spec.ts` file
4. Add assertions manually (generated code captures actions, not expectations)

## Connection to [[Semantic Locator]]

Generated code uses role-based locators (`getByRole`) when possible — more resilient than CSS selectors. This is the mechanism by which the [[QA AI]] plugin's `/qa-ai:generate` command discovers stable locators.

## Assertion Helpers

```bash
playwright-cli --raw generate-locator e5    # stable locator expression
playwright-cli --raw eval "el => el.textContent" e5  # expected text
playwright-cli --raw snapshot e5             # aria snapshot for matching
```

## Sources
- [[Source - Test Generation Reference]]
