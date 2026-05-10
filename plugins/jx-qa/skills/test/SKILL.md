---
name: test
user-invocable: true
argument-hint: "[ui] [headed]"
description: >
  Run Playwright E2E tests.
  Trigger on: "run playwright test", "run e2e test", "run e2e".
  Do not trigger for: test plan reviews, coverage
  analysis, Playwright script generation, unit/integration test generation,
  or unit/integration test execution.
---

# Run Playwright Test

Run Playwright tests in different modes. Default (no args) runs headless. Pass `ui` for interactive UI mode or `headed` for visible browser execution.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| ui | No | Headless | Opens Playwright UI for interactive test selection and debugging |
| headed | No | Headless | Runs tests with visible browser window |

## Run Playwright test (default)

Runs all tests headless. No browser window opens. Fastest mode for CI or quick validation.

```bash
npx playwright test
```

## Run Playwright test with ui

Opens Playwright interactive UI mode. Lets you pick tests, watch them run, inspect traces, and debug step-by-step.

```bash
npx playwright test --ui
```

## Run Playwright test with headed

Runs tests with a visible browser window. Useful for watching test execution without full UI debugger.

```bash
npx playwright test --headed
```