---
title: QA Testing Plugin
type: plugin
tags: [testing, playwright, jx-qa]
created: 2026-05-07
updated: 2026-05-09
source_count: 4
aliases: [jx-qa, jx-qa plugin, qa-ai]
provenance: source-derived
---

# QA Testing Plugin

A [[Claude Code CLI]] plugin for QA test automation. Extracts E2E test cases from BRD/PRD documents, generates [[Playwright]] specs, and provides browser automation.

## Pipeline

```
BRD/PRD markdown → /jx-qa:extract → xlsx test plan → /jx-qa:generate → Playwright .spec.ts files
                                                            ↓ uses
                                                      playwright-cli (browser automation)
```

## Commands

| Command | [[Skill]] | Purpose |
|---------|-----------|---------|
| `/jx-qa:extract` | extract | BRD → xlsx test plan |
| `/jx-qa:generate` | generate | xlsx → [[Playwright]] .spec.ts files |
| `/jx-qa:browser` | playwright-cli | Browser automation (internal) |

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
- [[Source - JX QA README]]
- [[Source - Extract SKILL]]
- [[Source - Extract SKILL Sequence]]
- [[Source - Generate SKILL]]
- [[Source - Playwright CLI SKILL]]
- [[Source - JX QA Prompts Directory]]
- [[Source - JX QA Schemas Directory]]
