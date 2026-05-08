---
title: Log
type: concept
tags: [architecture, wiki, audit]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [wiki log, _log.md, operation log]
provenance: source-derived
---

# Log

Append-only chronological record (`_log.md`) of wiki operations — ingests, queries, lint passes, triage sessions.

## Design

Each entry starts with a consistent prefix (e.g., `## [2026-04-02] ingest | Article Title`), making the log parseable with simple unix tools:
```
grep "^## \[" log.md | tail -5
```

## Purpose

- Timeline of wiki evolution
- Helps the LLM understand what's been done recently
- Records SHA-256 hashes for [[Ingest]] dedup detection
- Audit trail for provenance tracking

## Sources
- [[Source - LLM Wiki]]
