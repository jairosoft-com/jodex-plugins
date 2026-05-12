---
title: QA Test Automation
type: topic
tags: [testing, qa, automation]
created: 2026-05-07
updated: 2026-05-12
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

## Scope

QA automation in this repo covers both generation and execution. The pipeline starts with requirements interpretation, but it only becomes useful when generated specs can be reviewed, run, debugged, and improved in normal source-control workflows.

The topic also separates product quality from tooling quality. A failing generated Playwright spec might reveal a product defect, a weak requirement, an unstable locator, or a plugin-generation issue. Good reports preserve that distinction so the right team can act on the failure.

## Related Ideas

- [[Scaffold QA Project From Skill]] — reduce first-run setup friction
- [[Gemma 4 for Playwright Script Generation]] — evaluate local model generation
- [[Distilled Local Model for Test Script Generation]] — train a narrower model for repetitive spec generation

## Sources
- [[Source - JX QA README]]
