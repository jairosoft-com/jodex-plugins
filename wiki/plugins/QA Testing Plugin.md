---
title: QA Testing Plugin
type: plugin
tags: [testing, playwright, jx-qa]
created: 2026-05-07
updated: 2026-05-12
source_count: 10
aliases: [jx-qa, jx-qa plugin, qa-ai]
provenance: source-derived
---

# QA Testing Plugin

A [[Claude Code CLI]] plugin for QA test automation. Extracts E2E test cases from BRD/PRD documents, generates [[Playwright]] specs, provides browser automation, and runs Playwright E2E tests.

## Pipeline

```
BRD/PRD markdown → /jx-qa:extract → xlsx test plan → /jx-qa:generate → Playwright .spec.ts files → /jx-qa:test → test report
                                                            ↓ uses
                                                      playwright-cli (browser automation)
```

## Commands

| Command | [[Skill]] | Purpose |
|---------|-----------|---------|
| `/jx-qa:extract` | extract | BRD → xlsx test plan |
| `/jx-qa:generate` | generate | xlsx → [[Playwright]] .spec.ts files |
| `/jx-qa:browser` | playwright-cli | Browser automation (internal) |
| `/jx-qa:test` | test | Run [[Playwright]] tests headless, UI, or headed |

## Source Refresh Note

Earlier wiki lint found that [[Source - JX QA README]] preserved an older three-command README while live command files already included `/jx-qa:test`. The live `plugins/jx-qa/README.md` has now been refreshed to document `/jx-qa:test`, so the command inventory is no longer a maintained-page conflict.

## Test Plan Directory

Test plans stored in `test-plans/` (changed from `raw/data/`). Both extract and generate skills auto-discover xlsx files in this directory.

## Requirements

- **Python 3** + `openpyxl`
- **Node.js** 18+
- **[[Playwright]]** (`npx playwright install`)

## Onboarding

Use [[JX QA Onboarding]] for QA-user setup: marketplace install, local project layout, Git hygiene, `jx-kb` wiki initialization, dependency installation, first `jx-qa` workflow, and issue-reporting expectations.

## Security Model

- Python pinned to [[xlsx-writer.py]] only ([[Pinned Helper]])
- `npx` narrowed to `npx playwright test` (runner, not installer)
- `/jx-qa:test` allows only `Bash(npx playwright test:*)`
- All user inputs passed as quoted argv, never shell-interpolated
- Helper script validates paths, rejects metacharacters

## Related Topics

- [[QA Test Automation]] — broader subject area
- [[Browser Automation]] — Playwright ecosystem

## Related Ideas

- [[Scaffold QA Project From Skill]] — future setup accelerator for new QA projects
- [[Gemma 4 for Playwright Script Generation]] — local model idea for Playwright spec generation
- [[Distilled Local Model for Test Script Generation]] — distillation strategy for local spec generation

## Key Concepts

- [[E2E Test Case]] — classification of requirements as E2E-testable or not
- [[Semantic Locator]] — stable locators via live browser discovery
- [[Idempotent Operation]] — safe re-runs (skips existing specs)
- [[Multi-Phase Skill]] — all skills follow numbered-phase pattern
- [[Playwright]] test execution — headless, UI, and headed validation

## Sources
- [[Source - Root README]]
- [[Source - JX QA README]]
- [[Source - Extract SKILL]]
- [[Source - Extract SKILL Sequence]]
- [[Source - Generate SKILL]]
- [[Source - Playwright CLI SKILL]]
- [[Source - Test Command]]
- [[Source - Test SKILL]]
- [[Source - JX QA Prompts Directory]]
- [[Source - JX QA Schemas Directory]]
