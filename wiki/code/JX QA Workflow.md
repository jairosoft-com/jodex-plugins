---
title: JX QA Workflow
type: code
tags: [jx-qa, workflow, process, playwright]
created: 2026-05-21
updated: 2026-05-21
source_count: 0
aliases: [qa workflow, jx-qa workflow, qa pipeline walkthrough]
provenance: synthesis
---

# JX QA Workflow

> Not set up yet? See [[JX QA Onboarding]] first.

## Overview

Pipeline: BRD → `/jx-qa:extract` → xlsx → `/jx-qa:generate` → `.spec.ts` → `/jx-qa:test` → results

> Command syntax sourced from `plugins/jx-qa/README.md` (see [[Source - JX QA README]]).
> Check there for the full flag reference.

## Step 1 — Prepare your BRD

Command: none — prepare a BRD/PRD markdown file and place it in `raw/articles/`.

Expected output: a markdown file ready to pass to `/jx-qa:extract`.

## Step 2 — Extract test cases

Command: `/jx-qa:extract <brd-file>`

Human checkpoint: Claude presents test case classifications; user approves or requests revisions.

Expected output: xlsx test plan written to `test-plans/`; coverage report printed.

## Step 3 — Generate Playwright specs

Command: `/jx-qa:generate`

Notes: opens live browser to auto-discover locators; idempotent (skips existing specs).

Expected output: `.spec.ts` files written to `tests/`.

## Step 4 — Run tests

Command: `/jx-qa:test` (or `/jx-qa:test ui` / `/jx-qa:test headed` for debugging).

Expected output: N passed / N failed summary printed.

## Step 5 — Debug (optional)

Command: `/jx-qa:browser open <url>`

When to use: only if `/jx-qa:test` reports failures; use for manual locator exploration.

Expected output: browser session open; use snapshot or manual inspection to find locators.

## Related

- [[QA Testing Plugin]] — pipeline reference, command flags, and security model
- [[JX QA Onboarding]] — environment setup prerequisite

## Sources

- [[QA Testing Plugin]]
- [[JX QA Onboarding]]
- [[Source - JX QA README]]
