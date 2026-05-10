---
name: generate
user-invocable: true
description: Reads an xlsx test plan and generates Playwright TypeScript spec files by live-exploring the site with playwright-cli. Use this skill whenever the user wants to generate, create, or write Playwright tests from a test plan, spreadsheet, or structured test cases — even if they just say "write the tests" or "generate the specs" without mentioning the xlsx. Also triggers on /jx-qa:generate, "write playwright tests", "generate tests from test plan", "generate playwright tests from test cases", or any request to automate test case generation from a plan file.
allowed-tools: Bash(playwright-cli:*) Bash(npx playwright test:*) Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/xlsx-writer.py":*) Bash(ls:*) Read Write
---

# Write Playwright Tests from Test Cases

This skill turns a structured xlsx test plan into runnable Playwright TypeScript spec files. It works by:
1. Parsing the xlsx to extract test cases and their steps
2. Checking which tests already have spec files (so re-running is safe)
3. For each new test case: opening a live browser, following the test steps, capturing stable element locators, and writing the spec

**Heads up:** Each test case takes a few minutes — the skill opens a real browser and explores the live site to find the right locators.

## Step 1 — Discover and parse the test plan

First, find the xlsx file using a two-stage approach:

**Stage A — glob:**
```bash
ls test-plans/*.xlsx 2>/dev/null
```
- 0 results → go to Stage B
- 1 result → use that file
- 2+ results → list them and ask the user which to use, then proceed once they answer

**Stage B — parse from user's message:**
- Look for a `.xlsx` filename in what the user typed
- If found → use it
- If not found → stop and tell the user: "No xlsx found in test-plans/ and none mentioned in your request. Please specify the test plan file."

Once you have the xlsx path, parse it:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/xlsx-writer.py" read <path-to-xlsx>
```

Output is a JSON array of arrays. First element is the header row (column names),
remaining elements are data rows. Map each data row to an object using headers
as keys to reconstruct `{Title, "Test Step", "Step Action", "Step Expected", ...}`.

The xlsx uses a hierarchical row structure:
- **Parent row**: has a `Title` value (e.g., `"Check Logo in Homepage"`) — this is a test case header
- **Child rows**: have a `Test Step` number plus `Step Action` and `Step Expected` — these are the steps for the preceding parent

Group child rows under their most recent parent to reconstruct each test case with its ordered steps.

## Step 2 — Check which tests already have spec files

```bash
ls tests/
```

For each test case, derive its target filename using this rule:
```
title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.spec.ts'
```

**Example:** `"Check Logo in Homepage"` → `check-logo-in-homepage.spec.ts`

If the derived filename already exists in `tests/`, skip that test case and tell the user it was skipped. This makes the skill idempotent — safe to re-run without overwriting existing specs.

## Step 3 — Generate each new test case

For each test case without an existing spec:

### 3a. Navigate to the page

```bash
playwright-cli open
playwright-cli goto <URL from the first step's Step Action>
playwright-cli snapshot
```

### 3b. Work through the test steps

For each step in `Step Action`:
- Perform the described action (scroll, navigate, locate an element, etc.)
- Take a snapshot after the action to see what's on the page

Building assertions — there are two patterns:

**Generic step** ("Verify step completes successfully"): Find the element most relevant to what the step was doing. Run `playwright-cli generate-locator <ref>` and use it with `toBeVisible()`.

**Specific text assertion** (e.g., "This text should be visible 'Casa Colina Care LLC. All rights reserved.'"): Take a snapshot of the containing region (like the footer). Find the ref whose visible text matches the expected string. Run `playwright-cli generate-locator <ref>` and use it with `toHaveText('...')`.

The reason to use `generate-locator` rather than copying refs directly is that it produces semantic, stable locators like `page.getByRole('contentinfo')` instead of fragile positional refs. Semantic locators survive minor DOM changes.

### 3c. Close browser and write the spec

```bash
playwright-cli close
```

Write `tests/<derived-filename>.spec.ts`:

> **Line 3 MUST be `// Test Case TBD - <Title>` exactly.** The word `TBD` cannot be omitted — it is the placeholder that ADO Work Item linking replaces later. A comment like `// Test Case - Title` (missing `TBD`) will silently break the linking pipeline.

```typescript
import { test, expect } from '@playwright/test';

// Test Case TBD - <Title>
test('<short lowercase description of what the test checks>', async ({ page }) => {
  await page.goto('<URL>');

  // assertions derived from steps
});
```

Format is always `// Test Case TBD - <exact title from xlsx>`.

Keep the test description concise and readable — something like `'footer shows copyright notice'` rather than restating the full test case title.

## Step 4 — Verify

Run the new spec to confirm it passes:

```bash
npx playwright test tests/<new-spec>.spec.ts
```

Report pass/fail. If it fails, inspect the error, fix the locators or assertions, and re-run.

## Reference: target output style

Use `tests/check-logo-in-homepage.spec.ts` as the style reference:

```typescript
import { test, expect } from '@playwright/test';

// Test Case 203397 - Check Logo in Homepage
test('logo renders in homepage header', async ({ page }) => {
  await page.goto('https://casacolinacare-com.vercel.app');

  const header = page.getByRole('banner');
  await expect(header).toBeVisible();

  const logo = header.getByRole('link', { name: 'Casa Colina Care' });
  await expect(logo).toBeVisible();
});
```
