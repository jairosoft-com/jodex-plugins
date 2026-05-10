---
title: QA Test Automation
type: topic
tags: [testing, qa, automation]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [QA automation, test automation]
provenance: source-derived
---

# QA Test Automation

Broader subject area covering automated generation and execution of test cases from requirements documents.

## Pipeline in This Repo

The [[QA Testing Plugin|jx-qa]] plugin implements a BRD-to-test pipeline:
1. **Extract** — BRD/PRD markdown → xlsx test plan (acceptance criteria, functional requirements)
2. **Generate** — xlsx → [[Playwright]] `.spec.ts` files via live browser exploration
3. **Run** — `npx playwright test` to verify specs pass

## Key Patterns

- **Idempotent generation** — `/jx-qa:generate` skips test cases that already have spec files
- **Semantic locators** — live browser discovery of stable selectors (not hardcoded)
- **Azure DevOps format** — xlsx output compatible with Azure DevOps test plans

## Sources
- [[Source - JX QA README]]
