---
title: "Source - jx-core ID Rules"
type: source
tags: [jx-core, shared, id-system, validation]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-core/_shared/id-rules.md"
source_hash: "b3348e7c2bb352781697d492296ccda728b42ad32c846bfe6f6f9b1602efac65"
---

# Source - jx-core ID Rules

## Metadata
- **Original path**: plugins/jx-core/_shared/id-rules.md
- **SHA-256**: b3348e7c2bb352781697d492296ccda728b42ad32c846bfe6f6f9b1602efac65
- **Size**: 2150 bytes
- **Raw snapshot**: wiki/raw/sources/b3348e7c-id-rules.md

## Provenance Note

This is the **canonical post-split location** of the ID rules specification. The pre-split content (when this file lived at `plugins/jx-pm/skills/_shared/id-rules.md`) is captured in [[Source - ID Rules]]. The content is substantively identical but now resides in the cross-plugin shared layer (`jx-core`) so both `jx-pm` and `jx-dev` reference the same canonical copy.

## Summary

Shared reference file defining folder validation rules, feature-number extraction, and the complete ID generation system used across all jx skills. Specifies:

- **Folder validation**: `{NNN}_{feature_name}` pattern with regex `^(\d{3})_(.+)$`, reject 000
- **ID format**: `{TYPE}-{feature_number}-{seq}` with 3-digit feature numbers and 2-digit sequences
- **ID types**: OBJ, GOAL, US, AC, FR, NFR, RISK (created by prd skill); TC, TEST (created by spec skill)
- **Global AC counter** (critical): AC IDs increment globally across all user stories, never reset per story
- **Cross-document rules**: spec references but never creates PRD IDs; task preserves all IDs; ado maps all IDs

## Key Concepts
- [[Requirement ID System]] -- `{TYPE}-{feature_number}-{seq}` format, global AC counter
- [[Shared Reference Extraction]] -- canonical reference included by prd, spec, task, and ado skills
- [[Cross-Plugin Shared Convention Layer]] -- this file is one of three shared conventions in jx-core
- [[Golden Thread Traceability]] -- the ID system enables end-to-end tracing from objectives to test cases

## Pages Created
None
