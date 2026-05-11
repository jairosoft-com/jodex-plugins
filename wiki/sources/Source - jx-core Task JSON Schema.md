---
title: "Source - jx-core Task JSON Schema"
type: source
tags: [jx-core, shared, schema, json, task]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-core/_shared/task-json-schema.md"
source_hash: "7b70f41280dae4b94c2a619073eaf5f68b502f897cfc0fe4474d40652f492589"
---

# Source - jx-core Task JSON Schema

## Metadata
- **Original path**: plugins/jx-core/_shared/task-json-schema.md
- **SHA-256**: 7b70f41280dae4b94c2a619073eaf5f68b502f897cfc0fe4474d40652f492589
- **Size**: 3276 bytes
- **Raw snapshot**: wiki/raw/sources/7b70f412-task-json-schema.md

## Provenance Note

This is the **canonical post-split location** of the task.json schema. The pre-split content (when this file lived at `plugins/jx-pm/schemas/task-json-schema.md`) is captured in [[Source - Task JSON Schema]]. The content is substantively identical but now resides in the cross-plugin shared layer (`jx-core`) so both `jx-pm` (ado skill) and `jx-dev` (task skill) reference the same canonical copy.

## Summary

Defines the canonical JSON schema for task breakdown files. Specifies:

- **Required fields**: project, featureName, featureId, description, detailedPrdPath, userStories
- **Optional fields**: technicalSpecPath, technicalConstraints, testCases, jodex block, Azure sync metadata
- **User story object**: id, title, description, technicalSpecSection anchor, acceptanceCriteria array, priority, storyPoints, totalEstimatedHours, passes, notes, Azure bindings
- **Tombstone pattern**: `{removed: true}` objects preserving Azure bindings for `--prune` reconciliation
- **Hour estimation scale**: 0.25 (trivial) to 2 (complex) per acceptance criterion
- **Story points scale**: 1 to 8 based on AC count and file scope
- **Story sizing rule**: each story completable in one context window
- **Dependency ordering**: schema > server actions > UI > dashboard

## Key Concepts
- [[Tombstone Pattern]] -- `{removed: true}` objects preserving external bindings for pruning
- [[Cross-Plugin Shared Convention Layer]] -- this file is one of three shared conventions in jx-core
- [[Requirement ID System]] -- task.json preserves all IDs from PRD and tech spec
- [[Golden Thread Traceability]] -- task.json is a critical link in the traceability chain

## Pages Created
None
