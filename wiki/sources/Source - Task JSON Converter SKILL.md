---
title: "Source - Task JSON Converter SKILL"
type: source
tags: [skill, jx-pm, task, estimation, json]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/task/SKILL.md
provenance: source-derived
---

# Source - Task JSON Converter SKILL

## Metadata
- **Original path**: plugins/jx-pm/skills/task/SKILL.md
- **SHA-256**: 5b8574bc9d4cd0bf6c39724324e5b0555e8969ef81806ad8affd820b980e781b
- **Size**: 6717 bytes

## Summary

The Task JSON Converter reads a PRD (and optionally TECH_SPEC) and produces a canonical `task.json` file for execution tracking and Azure Boards sync. It extracts all requirement IDs, assigns hour estimates and story points using defined scales, orders stories by dependency, and supports merge-aware updates that preserve existing Azure sync state and passes/notes data.

## Key Concepts
- [[Requirement ID System]] — preserves all US, AC, FR, NFR, TC, TEST IDs exactly from source documents
- [[Tombstone Pattern]] — removed items with Azure IDs are tombstoned, not deleted
- Story sizing rule — each story must be completable in one context window
- Hour estimation scale — 0.25 (trivial), 0.5 (simple), 1 (moderate), 2 (complex) per AC
- Story points — 1, 2, 3, 5, 8 based on AC count and total hours
- Dependency ordering — schema → backend → UI → dashboard
- Merge-aware updates — preserves `azureWorkItemId`, `passes`, `notes` from existing task.json
- Atomic file writes — temp file + rename pattern
- [[Multi-Phase Skill]] — 5 phases: source detection, parsing, existing file handling, generation, save/chain
- [[Skill Chaining]] — `--chain` invokes ADO skill, `--chain-all` invokes pipeline
- [[Golden Thread Traceability]] — all IDs preserved through the conversion

## Pages Created
None
