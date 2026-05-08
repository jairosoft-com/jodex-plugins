---
title: Path Confinement
type: concept
tags: [security, pattern, validation]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [path safety contract, path containment]
provenance: source-derived
---

# Path Confinement

A security pattern ensuring all file operations stay within the project root directory. Prevents path traversal attacks and accidental access to files outside the project.

## Implementation

- Uses `Path.relative_to()` — not string prefix matching (immune to sibling-prefix bypass like `/project-evil/` matching `/project/`)
- Resolves symlinks before checking containment
- Rejects shell metacharacters in user-supplied paths
- Normalizes paths to prevent `..` escape sequences

## Used By

- [[wiki-tools.py]] — validates all paths before file operations
- [[LLM Wiki]] plugin — all source paths checked during [[Ingest]]

## Sources
- [[Source - LLM Wiki README]]
