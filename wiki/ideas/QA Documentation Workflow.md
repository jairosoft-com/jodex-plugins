---
title: QA Documentation Workflow
type: idea
tags: [jx-qa, workflow, documentation, process]
created: 2026-05-20
updated: 2026-05-20
groomed: 2026-05-20
source_count: 0
aliases: [qa workflow, qa doc workflow, jx-qa workflow]
provenance: user
status: backlogged
priority: medium
---

# QA Documentation Workflow

Create a `wiki/code/` page with a numbered, step-by-step walkthrough of the jx-qa end-to-end pipeline — the day-to-day guide for a user who is already set up and wants to run a new feature through QA from scratch.

## Scope

Happy path only. Full pipeline, documented as-is:

1. **Prepare BRD/PRD** — human writes/has a BRD markdown doc
2. **Extract test cases** — `/jx-qa:extract <brd-file>` → human confirms classification → xlsx test plan written to `test-plans/`
3. **Generate specs** — `/jx-qa:generate` → live browser auto-discovers locators → `.spec.ts` files written (idempotent, skips existing)
4. **Run tests** — `/jx-qa:test` (headless) or `/jx-qa:test ui` → test results reported
5. **Debug (optional)** — `/jx-qa:browser` for manual exploration if tests fail

Human checkpoints documented as-is: classification confirm in extract; everything else automated.

## Deliverable

A new `wiki/code/JX QA Workflow.md` page, linked from [[QA Testing Plugin]] and [[JX QA Onboarding]].

## Page Outline

Structure for `wiki/code/JX QA Workflow.md`:

```
# JX QA Workflow

> Not set up yet? See [[JX QA Onboarding]] first.

## Overview
[one-line pipeline diagram: BRD → extract → xlsx → generate → specs → test → results]

## Step 1 — Prepare your BRD
[what the input doc should look like]
Expected output: a markdown file ready to pass to extract

## Step 2 — Extract test cases
Command: /jx-qa:extract <brd-file>
[human confirm step explained]
Expected output: test-plans/<name>.xlsx written, coverage report printed

## Step 3 — Generate Playwright specs
Command: /jx-qa:generate
[live browser note, idempotent note]
Expected output: tests/specs/*.spec.ts files written

## Step 4 — Run tests
Command: /jx-qa:test
Expected output: N passed, N failed summary

## Step 5 — Debug (optional)
Command: /jx-qa:browser open <url>
[when to use this step]

## Related
[[QA Testing Plugin]] | [[JX QA Onboarding]]
```

## Acceptance Criteria

- [ ] `wiki/code/JX QA Workflow.md` exists with numbered happy-path walkthrough
- [ ] Page linked from [[QA Testing Plugin]]
- [ ] Page linked from [[JX QA Onboarding]]

## Related

- [[QA Testing Plugin]] — pipeline source of truth
- [[JX QA Onboarding]] — setup guide (prerequisite to this workflow)
- [[Scaffold QA Project From Skill]] — future complement (project init)
