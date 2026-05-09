---
title: QA AI
type: plugin
tags: [testing, playwright, qa]
created: 2026-05-07
updated: 2026-05-08
source_count: 4
aliases: [qa-ai, qa-ai plugin]
provenance: source-derived
---

# QA AI

A [[Claude Code CLI]] plugin for QA test automation. Extracts E2E test cases from BRD/PRD documents, generates [[Playwright]] specs, and provides browser automation.

## Pipeline

```
BRD/PRD markdown → /qa-ai:extract → xlsx test plan → /qa-ai:generate → Playwright .spec.ts files
                                                            ↓ uses
                                                      playwright-cli (browser automation)
```

## Commands

| Command | [[Skill]] | Purpose |
|---------|-----------|---------|
| `/qa-ai:extract` | extract | BRD → xlsx test plan |
| `/qa-ai:generate` | generate | xlsx → [[Playwright]] .spec.ts files |
| `/qa-ai:browser` | playwright-cli | Browser automation (internal) |

## Test Plan Directory

Test plans stored in `test-plans/` (changed from `raw/data/`). Both extract and generate skills auto-discover xlsx files in this directory.

## Requirements

- **Python 3** + `openpyxl`
- **Node.js** 18+
- **[[Playwright]]** (`npx playwright install`)

## Security Model

- Python pinned to [[xlsx-writer.py]] only ([[Pinned Helper]])
- `npx` narrowed to `npx playwright test` (runner, not installer)
- All user inputs passed as quoted argv, never shell-interpolated
- Helper script validates paths, rejects metacharacters

## Related Topics

- [[QA Test Automation]] — broader subject area
- [[Browser Automation]] — Playwright ecosystem

## Key Concepts

- [[E2E Test Case]] — classification of requirements as E2E-testable or not
- [[Semantic Locator]] — stable locators via live browser discovery
- [[Idempotent Operation]] — safe re-runs (skips existing specs)
- [[Multi-Phase Skill]] — all skills follow numbered-phase pattern

## Sources
- [[Source - QA AI README]]
- [[Source - Extract SKILL]]
- [[Source - Generate SKILL]]
- [[Source - Playwright CLI SKILL]]
