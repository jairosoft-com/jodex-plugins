---
title: "Source - llm-wiki Ingest Command"
type: source
tags: [jx-kb, command, ingest]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-kb/commands/ingest.md
provenance: source-derived
---

# Source - llm-wiki Ingest Command

## Metadata
- **Original path**: plugins/jx-kb/commands/ingest.md
- **SHA-256**: 06a0276f128a157f33f2dca93bd8b94dd6c05da8c95b475e0a4de48773114f32
- **Size**: 345 bytes

## Summary

Defines the `/jx-kb:ingest` slash command, which ingests a source document into the LLM Wiki. Accepts a source path and optional wiki path as arguments. Delegates to the `jx-kb:ingest` skill and uses `wiki-tools.py` for processing.

## Key Concepts
- Source document ingestion into wiki
- Knowledge extraction from raw sources
- wiki-tools.py as the backing script for wiki operations
- Slash command with positional arguments (source_path, wiki_path)

## Pages Created
None
