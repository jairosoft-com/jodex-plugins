# Fix Codex Review Findings on Test Skill

## Context

Codex review flagged two P2 issues on the new `qa-ai:test` skill:

1. **SKILL.md uses `npm run test` / `npm run test:ui`** — these assume npm scripts exist in the target project. The headed mode already uses `npx playwright test --headed` (correct), but default and UI modes don't. Should use `npx` consistently so the skill works in any project with Playwright installed.

2. **Trigger phrase "run test" is too broad** — catches unit test requests (`run unit tests`) even though eval 7 says it shouldn't. Need to narrow triggers to explicitly mention Playwright or E2E.

## Changes

### 1. SKILL.md — switch to `npx` and narrow triggers

**File**: `plugins/qa-ai/skills/test/SKILL.md`

- **Triggers**: Change from `"run test", "run playwright test"` to `"run playwright test", "run e2e test", "run e2e"`. Drop bare "run test".
- **Negative triggers**: Add `"run unit tests", "run integration tests"` to existing exclusion list.
- **Default command**: `npm run test` → `npx playwright test`
- **UI command**: `npm run test:ui` → `npx playwright test --ui`
- **Headed command**: already correct (`npx playwright test --headed`)

### 2. commands/test.md — update allowed-tools

**File**: `plugins/qa-ai/commands/test.md`

- `allowed-tools`: Change `Bash(npm run test:*)` → `Bash(npx playwright test:*)` (drop npm, keep npx)
- Already has `Bash(npx playwright test:*)` — just remove the npm one

### 3. evals.json — update assertions to match npx commands

**File**: `plugins/qa-ai/skills/test/evals/evals.json`

| Eval | Change |
|------|--------|
| 0 (run-playwright-test-default) | `npm run test` → `npx playwright test` in expected + assertions |
| 1 (run-test-default) | Prompt: `"run test"` → `"run e2e test"`. Update expected to `npx playwright test` |
| 2 (run-playwright-test-ui) | `npm run test:ui` → `npx playwright test --ui` in expected + assertions |
| 3-7 | Update assertion descriptions referencing `npm run test` → `npx playwright test` |

## Verification

- Read all three files after edits to confirm consistency
- Check that every `npm run test` reference is gone (replaced with `npx playwright test`)
- Confirm trigger phrases in SKILL.md match eval prompts
- Confirm negative eval prompts don't match positive triggers
