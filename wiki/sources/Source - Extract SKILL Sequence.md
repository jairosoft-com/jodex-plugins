---
title: Source - Extract SKILL Sequence
type: source
tags: [skill, qa-ai, extract, sequence-diagram]
created: 2026-05-08
updated: 2026-05-08
raw_path: wiki/raw/sources/a720ef67-SEQUENCE.md
provenance: source-derived
---

# Source - Extract SKILL Sequence

## Metadata
- **Original path**: plugins/qa-ai/skills/extract/SEQUENCE.md
- **SHA-256**: a720ef6721402f1c5161554e746ddd19f0a7ccaeb7ae31010c5c320f8457af9d
- **Size**: 2,153 bytes

## Summary

Mermaid sequence diagram documenting the 6-phase execution flow of the [[QA AI]] extract [[Skill]]. Shows actor interactions between User, Extract Skill, Filesystem, and openpyxl across all phases: requirement extraction, [[E2E Test Case]] classification with [[User Confirmation Gate]], test plan structure discovery, step generation, Excel writing with [[Idempotent Operation|fork-not-mutate]] pattern, and verification with coverage report.

## Key Interactions

- **Phase 2 gate**: Skill presents classification table, blocks until user confirms
- **Phase 3 branching**: Alt paths for xlsx provided vs auto-discovery
- **Phase 5 branching**: Alt paths for forking existing vs creating new workbook
- **4 participants**: User, Skill, Filesystem, openpyxl

## Pages Updated
- [[Multi-Phase Skill]] — added Extract 6-phase example with sequence diagram

## Sources
- [[Source - Extract SKILL]]
