---
title: PRD Quality Gate Filtering Fails on Doc-Only Stories
type: idea
status: completed
tags: [jx-pm, prd, quality-gates, bug, filtering]
created: 2026-05-22
updated: 2026-05-28
source_count: 0
aliases: [doc-only quality gate bug, false positive quality gates]
provenance: user
---

# PRD Quality Gate Filtering Fails on Doc-Only Stories

The PRD skill adds Quality Gates (lint, typecheck, unit tests) to doc-only stories that produce no code. Two root causes:

## Problem 1: Format rationale keyword detection is fragile

The `[code-only]` gate filter requires doc-only keywords (`documentation`, `spec`, `wiki`, `markdown`) AND no code signals (`code`, `implementation`, `UI`). Failures:

- Rationales like "no executable **code** is produced" contain the word `code` → mixed-signal → treated as code story
- Rationales like "graceful degradation behavior" contain no doc-only keywords at all → gates included by default
- The skill generates the rationale AND parses it — but doesn't ensure consistency

## Problem 2: Metadata drops `[code-only]` / `[ui-only]` tags

Generated PRD metadata shows `Lint passes` instead of `Lint passes [code-only]`. Without tags, downstream ADO/task consumers treat gates as unconditional.

## Observed In

`docs/004_feature_description_template/BRD_PRD.md` — all 4 stories received Quality Gates despite the entire feature being a spec document change.

## Related

- [[Conditional AC Format Selection]]
- [[Sub-Headers as Dual-Purpose Contracts]]
