---
title: Ingest
type: concept
tags: [operation, wiki, pipeline]
created: 2026-05-07
updated: 2026-05-08
source_count: 2
aliases: [ingestion, ingest operation]
provenance: source-derived
---

# Ingest

The operation of absorbing a raw source document into the wiki. Unlike [[Query]], which retrieves and synthesizes on demand, ingest permanently integrates knowledge into the wiki's persistent pages.

## How It Works

A source is read, key information is extracted, and the results are distributed across multiple wiki pages — creating new ones and updating existing ones. A single source may touch 10-15 pages. The [[Index]] and [[Log]] are updated as part of every ingest.

## Relationship to RAG

Traditional RAG retrieves raw document chunks at query time and generates answers from scratch each request. Ingest is the opposite — knowledge is compiled once and kept current, not re-derived on every query. The wiki accumulates and compounds knowledge across sources.

## Key Properties

- Sources are read from their original location (read-only during analysis)
- A snapshot is copied to [[Raw Sources]] for provenance
- [[SHA-256 Fingerprinting]] prevents duplicate ingestion
- A [[User Confirmation Gate]] pauses before any writes
- [[Conflict Callout]] blocks added when new info contradicts existing claims
- Cross-references are added bidirectionally after page creation

## Source Selection

Ingest accepts **any file path** within the project root — not limited to pre-registered locations.

The optional `_watchlist.md` tracks monitored directories and pending files as a convenience (see [[Watchlist Pattern]]). When no source path is provided, ingest checks the watchlist to suggest candidates. The watchlist is additive — it helps surface new/changed files but does not restrict what can be ingested. This is an instance of the [[Ad-hoc vs Manifest-Driven Workflows|hybrid workflow]] approach.

## Supported Source Types

- **Markdown / Plain Text** (`.md`, `.txt`, `.text`) — full content extraction
- **Source Code** (`.py`, `.ts`, `.js`, `.sh`, `.go`, `.rs`, `.java`, etc.) — module purpose, exports, patterns, API surface

Unsupported formats (PDF, DOCX, images, HTML) require conversion to markdown first.

## Sources
- [[Source - LLM Wiki]]
- [[Source - LLM Wiki README]]
