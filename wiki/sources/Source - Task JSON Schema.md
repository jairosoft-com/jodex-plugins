---
title: "Source - Task JSON Schema"
type: source
tags: [skill, jx-pm, schema, json, task]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/schemas/task-json-schema.md
provenance: source-derived
---

# Source - Task JSON Schema

## Metadata
- **Original path**: plugins/jx-pm/schemas/task-json-schema.md
- **SHA-256**: f151c0aa5a5c06eee76a0c9b26d50e3fa1b6667530a97b998c2e5b80afed6b8a
- **Size**: 3255 bytes

## Summary

Defines the canonical JSON schema for jx-pm task breakdown files. Specifies required fields (project, featureName, featureId, description, detailedPrdPath, userStories), optional fields for Azure sync and Jodex execution, the user story object structure with acceptance criteria, the tombstone object format for removed items, and estimation scales for hours and story points.

## Key Concepts
- Canonical task.json structure — required and optional fields for project, feature, and Azure metadata
- User story object — id, title, description, technicalSpecSection anchor, acceptanceCriteria array, priority, storyPoints, totalEstimatedHours, passes, notes
- [[Tombstone Pattern]] — `{removed: true}` objects preserving Azure bindings for pruning
- Hour estimation scale — 0.25 (trivial) to 2 (complex) per acceptance criterion
- Story points scale — 1 to 8 based on AC count and file scope
- Story sizing rule — each story completable in one context window
- Dependency ordering — schema → server actions → UI → dashboard
- Optional Jodex block — branchName and progressPath for autonomous execution

## Pages Created
None
