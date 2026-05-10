---
title: Source - Extract SKILL
type: source
tags: [skill, qa-ai, extract]
created: 2026-05-07
updated: 2026-05-08
raw_path: wiki/raw/sources/0a57b19a-SKILL.md
provenance: source-derived
---

# Source - Extract SKILL

## Metadata
- **Original path**: plugins/jx-qa/skills/extract/SKILL.md
- **SHA-256**: 0a57b19a6eb5c7fcc6765546d2f27c91103efa59cfd29a36a0b5b489e48dbb66
- **Size**: 9,527 bytes

## Summary

6-phase [[Skill]] for extracting E2E test cases from BRD/PRD documents into xlsx test plans. Covers requirement extraction (AC/FR/NFR patterns), [[E2E Test Case]] classification with [[User Confirmation Gate]], test plan structure discovery, test step generation, xlsx writing via [[xlsx-writer.py]], and reporting. Test plans now use `test-plans/` directory (changed from `raw/data/`). Includes xlsx auto-discovery logic.

## Pages Created
- E2E Test Case
