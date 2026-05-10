---
title: "Source - jx-kb Hooks Guide"
type: source
tags: [jx-kb, hooks, lifecycle, plugin-architecture]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-kb/hooks/ABOUT.md
provenance: source-derived
---

# Source - jx-kb Hooks Guide

## Metadata
- **Original path**: plugins/jx-kb/hooks/ABOUT.md
- **SHA-256**: d7a6ebc89e72c7d8694ea46ec86a6cdec03ae5ca206e6fe518a01ab9ed6f9723
- **Size**: 722 bytes

## Summary

Documents the hooks system for the llm-wiki plugin. Hooks are shell commands triggered by Claude Code lifecycle events (SessionStart, SessionEnd, Stop), configured via a `hooks.json` file. Use cases include auto-linting on session start, index rebuilding after wiki changes, and review gates before stopping.

## Key Concepts
- Hook lifecycle events: SessionStart, SessionEnd, Stop
- hooks.json configuration format with command and timeout fields
- Stop hook as a blocking review gate (can prevent Claude from stopping)
- Wiki-specific hook use cases: auto-lint, index rebuild, consistency checks

## Pages Created
None
