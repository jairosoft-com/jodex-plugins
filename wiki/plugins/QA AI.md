---
title: QA AI
type: plugin
tags: [testing, playwright, qa]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
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

## Requirements

- **Python 3** + `openpyxl`
- **Node.js** 18+
- **[[Playwright]]** (`npx playwright install`)

## Security Model

- Python pinned to [[xlsx-writer.py]] only ([[Pinned Helper]])
- `npx` narrowed to `npx playwright test` (runner, not installer)
- All user inputs passed as quoted argv, never shell-interpolated
- Helper script validates paths, rejects metacharacters

## Sources
- [[Source - QA AI README]]
