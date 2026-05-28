---
title: "Source - ID Rules"
type: source
tags: [skill, jx-pm, shared, id-system, validation]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/_shared/id-rules.md
provenance: source-derived
---

# Source - ID Rules

## Metadata
- **Original path**: plugins/jx-pm/skills/_shared/id-rules.md
- **SHA-256**: 0a5684966807b50dc150c7d8e6c3e7c4bfbe97cc7d61d4691584cf30275ce7c9
- **Size**: 2086 bytes

## Summary

Shared reference file defining folder validation rules, feature-number extraction, and the complete ID generation system used across all jx-pm skills. Specifies the `{NNN}_{feature_name}` folder pattern, the `{TYPE}-{feature_number}-{seq}` ID format, the critical global AC counter rule, and cross-document ID ownership rules.

## Key Concepts
- [[Requirement ID System]] — `{TYPE}-{feature_number}-{seq}` format with 3-digit feature numbers and 2-digit sequences
- Folder validation — `{NNN}_{feature_name}` pattern with regex `^(\d{3})_(.+)$`, reject 000
- Global AC counter — AC IDs increment globally across all user stories, never reset per story
- [[Shared Reference Extraction]] — canonical reference included by prd, techspec, task, and ado skills
- ID type ownership — prd creates OBJ/GOAL/US/AC/FR/NFR/RISK; techspec creates TC/TEST only
- Cross-document rules — techspec references but never creates PRD IDs; task preserves all IDs; ado maps all IDs

## Pages Created
None
