---
title: Source - Generate SKILL
type: source
tags: [skill, qa-ai, generate]
created: 2026-05-07
updated: 2026-05-08
raw_path: wiki/raw/sources/76a32c9d-SKILL.md
provenance: source-derived
---

# Source - Generate SKILL

## Metadata
- **Original path**: plugins/qa-ai/skills/generate/SKILL.md
- **SHA-256**: 76a32c9d3bb71e4a753b4c26ff41542dca39ee014d0206a03541b0b5865b8e26
- **Size**: 5,990 bytes

## Summary

[[Skill]] for generating [[Playwright]] TypeScript spec files from xlsx test plans. Opens live browser, follows test steps, captures [[Semantic Locator]]s, writes .spec.ts files. [[Idempotent Operation]] — skips test cases with existing specs. Now uses [[xlsx-writer.py]] for xlsx parsing (replaced npx xlsx). Test plans in `test-plans/` directory (changed from `raw/data/`).

## Pages Created
- Semantic Locator, Idempotent Operation
