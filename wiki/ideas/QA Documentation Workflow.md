---
title: QA Documentation Workflow
type: idea
tags: [jx-qa, workflow, documentation, process]
created: 2026-05-20
updated: 2026-05-20
source_count: 0
aliases: [qa workflow, qa doc workflow, jx-qa workflow]
provenance: user
status: backlogged
---

# QA Documentation Workflow

Create a `wiki/code/` page with a numbered, step-by-step walkthrough of the jx-qa end-to-end pipeline — the day-to-day guide for a user who is already set up and wants to run a new feature through QA from scratch.

## Scope

Full pipeline, documented as-is:

1. **Prepare BRD/PRD** — human writes/has a BRD markdown doc
2. **Extract test cases** — `/jx-qa:extract <brd-file>` → human confirms classification → xlsx test plan written to `test-plans/`
3. **Generate specs** — `/jx-qa:generate` → live browser auto-discovers locators → `.spec.ts` files written (idempotent, skips existing)
4. **Run tests** — `/jx-qa:test` (headless) or `/jx-qa:test ui` → test results reported
5. **Debug (optional)** — `/jx-qa:browser` for manual exploration if tests fail

Human checkpoints documented as-is: classification confirm in extract; everything else automated.

## Deliverable

A new `wiki/code/JX QA Workflow.md` page, linked from [[QA Testing Plugin]] and [[JX QA Onboarding]].

## Related

- [[QA Testing Plugin]] — pipeline source of truth
- [[JX QA Onboarding]] — setup guide (prerequisite to this workflow)
- [[Scaffold QA Project From Skill]] — future complement (project init)
