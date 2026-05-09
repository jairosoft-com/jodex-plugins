---
title: "Source - PRD Generator SKILL"
type: source
tags: [skill, jx-pm, prd, requirements, product-management]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/prd/SKILL.md
provenance: source-derived
---

# Source - PRD Generator SKILL

## Metadata
- **Original path**: plugins/jx-pm/skills/prd/SKILL.md
- **SHA-256**: 57215b51577dd8794cb877e6097fa36256beac2fa8ed08495f09b9f36357b7ed
- **Size**: 6440 bytes

## Summary

The PRD Generator skill creates structured Product Requirements Documents with three modes: lite (single feature, 3-5 stories), prd (complex multi-system), and unified (BRD+PRD combining business justification with tactical detail). It enforces [[Golden Thread Traceability]] from business objectives through user stories to testable acceptance criteria, uses the [[Requirement ID System]] for all artifacts, and supports [[Skill Chaining]] via `--chain` and `--chain-all` flags.

## Key Concepts
- [[Mode Flag Pattern]] — three modes (lite, prd, unified) selected via `--mode` flag
- [[Golden Thread Traceability]] — Business Objective → User Need → Feature → AC → Success Metric
- [[Measurability Mandate]] — every requirement must be testable with concrete metrics
- [[Requirement ID System]] — US, AC, FR, NFR, OBJ, GOAL IDs with global AC counter
- [[Multi-Phase Skill]] — 6 phases: argument parsing, folder validation, clarifying questions, golden thread, generation, save/chain
- [[Skill Chaining]] — `--chain` invokes techspec, `--chain-all` invokes pipeline
- [[Configurable Default Chain]] — docs-root resolution via flag → env → default
- [[Shared Reference Extraction]] — references `_shared/id-rules.md` and `_shared/docs-root.md`
- INVEST criteria for user stories (Independent, Negotiable, Valuable, Estimable, Small, Testable)

## Pages Created
- [[Measurability Mandate]]
