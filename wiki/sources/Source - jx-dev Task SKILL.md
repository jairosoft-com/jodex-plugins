---
title: "Source - jx-dev Task SKILL"
type: source
tags: [jx-dev, skill, task, estimation, json]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-dev/skills/task/SKILL.md"
source_hash: "1c361ad359c5eed134c3831facf4bb2b236522fadfd6faf5bcd68b88a384a441"
---

# Source - jx-dev Task SKILL

## Metadata
- **Original path**: plugins/jx-dev/skills/task/SKILL.md
- **SHA-256**: 1c361ad359c5eed134c3831facf4bb2b236522fadfd6faf5bcd68b88a384a441

## Summary

The Task skill reads a PRD (and optionally TECH_SPEC) and produces a canonical `task.json` file for execution tracking and Azure Boards sync. It extracts all requirement IDs, assigns hour estimates and story points using defined scales, orders stories by dependency, and supports merge-aware updates that preserve existing Azure sync state and passes/notes data. Unlike the jx-pm version, `--chain` and `--chain-all` flags have been removed.

## Key Concepts
- [[Requirement ID System]] -- preserves all US, AC, FR, NFR, TC, TEST IDs exactly from source documents
- [[Tombstone Pattern]] -- removed items with Azure IDs are tombstoned, not deleted
- [[Golden Thread Traceability]] -- all IDs preserved through the conversion
- Story sizing rule -- each story must be completable in one context window
- Hour estimation scale -- 0.25 (trivial), 0.5 (simple), 1 (moderate), 2 (complex) per AC
- Story points -- 1, 2, 3, 5, 8 based on AC count and total hours
- Dependency ordering -- schema -> backend -> UI -> dashboard
- Merge-aware updates -- preserves `azureWorkItemId`, `passes`, `notes` from existing task.json
- Atomic file writes -- temp file + rename pattern
- [[Multi-Phase Skill]] -- 5 phases: source detection, parsing, existing file handling, generation, save

## Relation to jx-pm

Post-split canonical location. The jx-pm version (see [[Source - Task JSON Converter SKILL]], SHA `5b8574bc...`) included `--chain` and `--chain-all` flags for [[Skill Chaining]]. This jx-dev version removes those flags; cross-plugin chaining is deferred.

## Pages Created
None
