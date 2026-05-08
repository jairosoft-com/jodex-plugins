// Full-fidelity port of plugins/qa-ai/skills/generate/SKILL.md
// Adapted for MCP: references to Bash(playwright-cli:*) replaced with MCP tool calls.

export const GENERATE_SKILL_PROMPT = `
# Write Playwright Tests from Test Cases

This skill turns a structured xlsx test plan into runnable Playwright TypeScript spec files. It works by:
1. Parsing the xlsx to extract test cases and their steps
2. Checking which tests already have spec files (so re-running is safe)
3. For each new test case: opening a live browser, following the test steps, capturing stable element locators, and writing the spec

**Heads up:** Each test case takes a few minutes — the skill opens a real browser and explores the live site to find the right locators.

## Step 1 — Discover and parse the test plan

First, find the xlsx file. If the user provided a path, use it. Otherwise, ask the user for the path.

Once you have the xlsx path, use the \`read_excel_test_plan\` tool to read the file and parse the contents.

The xlsx uses a hierarchical row structure:
- **Parent row**: has a \`Title\` value (e.g., \`"Check Logo in Homepage"\`) — this is a test case header
- **Child rows**: have a \`Test Step\` number plus \`Step Action\` and \`Step Expected\` — these are the steps for the preceding parent

Group child rows under their most recent parent to reconstruct each test case with its ordered steps.

## Step 2 — Check which tests already have spec files

Use the \`run_playwright_command\` tool to list existing files:
\`\`\`
run_playwright_command(command: "npx", args: ["-y", "playwright-cli", "open"])
\`\`\`

Or simply check the \`tests/\` directory for existing specs.

For each test case, derive its target filename using this rule:
\`\`\`
title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.spec.ts'
\`\`\`

**Example:** \`"Check Logo in Homepage"\` → \`check-logo-in-homepage.spec.ts\`

If the derived filename already exists in \`tests/\`, skip that test case and tell the user it was skipped. This makes the skill idempotent — safe to re-run without overwriting existing specs.

## Step 3 — Generate each new test case

For each test case without an existing spec:

### 3a. Navigate to the page

Use the \`run_playwright_command\` tool:
\`\`\`
run_playwright_command(command: "playwright-cli", args: ["open"])
run_playwright_command(command: "playwright-cli", args: ["goto", "<URL from the first step's Step Action>"])
run_playwright_command(command: "playwright-cli", args: ["snapshot"])
\`\`\`

### 3b. Work through the test steps

For each step in \`Step Action\`:
- Perform the described action (scroll, navigate, locate an element, etc.) using \`run_playwright_command\`
- Take a snapshot after the action to see what's on the page

Building assertions — there are two patterns:

**Generic step** ("Verify step completes successfully"): Find the element most relevant to what the step was doing. Run \`run_playwright_command(command: "playwright-cli", args: ["generate-locator", "<ref>"])\` and use it with \`toBeVisible()\`.

**Specific text assertion** (e.g., "This text should be visible 'Casa Colina Care LLC. All rights reserved.'"): Take a snapshot of the containing region (like the footer). Find the ref whose visible text matches the expected string. Run \`run_playwright_command(command: "playwright-cli", args: ["generate-locator", "<ref>"])\` and use it with \`toHaveText('...')\`.

The reason to use \`generate-locator\` rather than copying refs directly is that it produces semantic, stable locators like \`page.getByRole('contentinfo')\` instead of fragile positional refs. Semantic locators survive minor DOM changes.

### 3c. Close browser and write the spec

\`\`\`
run_playwright_command(command: "playwright-cli", args: ["close"])
\`\`\`

Write \`tests/<derived-filename>.spec.ts\`:

> **Line 3 MUST be \`// Test Case TBD - <Title>\` exactly.** The word \`TBD\` cannot be omitted — it is the placeholder that ADO Work Item linking replaces later. A comment like \`// Test Case - Title\` (missing \`TBD\`) will silently break the linking pipeline.

\`\`\`typescript
import { test, expect } from '@playwright/test';

// Test Case TBD - <Title>
test('<short lowercase description of what the test checks>', async ({ page }) => {
  await page.goto('<URL>');

  // assertions derived from steps
});
\`\`\`

Format is always \`// Test Case TBD - <exact title from xlsx>\`.

Keep the test description concise and readable — something like \`'footer shows copyright notice'\` rather than restating the full test case title.

## Step 4 — Verify

Run the new spec to confirm it passes:

\`\`\`
run_playwright_command(command: "npx", args: ["playwright", "test", "tests/<new-spec>.spec.ts"])
\`\`\`

Report pass/fail. If it fails, inspect the error, fix the locators or assertions, and re-run.

## Reference: target output style

Use \`tests/check-logo-in-homepage.spec.ts\` as the style reference:

\`\`\`typescript
import { test, expect } from '@playwright/test';

// Test Case 203397 - Check Logo in Homepage
test('logo renders in homepage header', async ({ page }) => {
  await page.goto('https://casacolinacare-com.vercel.app');

  const header = page.getByRole('banner');
  await expect(header).toBeVisible();

  const logo = header.getByRole('link', { name: 'Casa Colina Care' });
  await expect(logo).toBeVisible();
});
\`\`\`
`;
