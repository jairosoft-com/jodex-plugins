---
title: Log
type: concept
tags: [architecture, wiki, audit]
created: 2026-05-07
updated: 2026-05-26
source_count: 1
aliases: [wiki log, _log.md, operation log]
provenance: source-derived
---

# Log

Prepend-only record (`_log.md`) of wiki operations — ingests, insights, queries, lint passes, triage sessions. Entries are newest-first so that reading the head gives recent context without scanning the entire file.

## Design

New entries are inserted immediately after the `# Wiki Log` header, before existing entries. Each entry starts with a consistent prefix (e.g., `## 2026-04-02 — Ingest: Article Title`), making the log parseable with simple unix tools:
```
head -50 _log.md   # recent operations (newest-first)
```

Skills that write to the log must prepend, not append — this ensures head-read patterns in Phase 1 of skills like [[Ingest]] and insights always see the most recent filings.

## Purpose

- Timeline of wiki evolution
- Helps the LLM understand what's been done recently
- Records SHA-256 hashes for [[Ingest]] dedup detection
- Audit trail for provenance tracking

## Sources
- [[Source - LLM Wiki]]
- Session: jx-kb insights skill (2026-05-26)
