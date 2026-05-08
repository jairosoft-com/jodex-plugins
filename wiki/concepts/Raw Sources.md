---
title: Raw Sources
type: concept
tags: [architecture, wiki, provenance]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [raw source layer, source layer]
provenance: source-derived
---

# Raw Sources

The immutable collection of source documents that feed the wiki. Articles, papers, images, data files. The LLM reads from them but never modifies them.

## Three-Layer Architecture

1. **Raw Sources** (this layer) — curated source documents, immutable, source of truth
2. **The Wiki** — LLM-generated markdown pages, summaries, cross-references
3. **The [[Schema]]** — configuration telling the LLM how to operate

## Storage

During [[Ingest]], sources are snapshotted to `wiki/raw/sources/<sha256_prefix>-<filename>`. The SHA-256 hash provides dedup and provenance. Original files remain untouched.

## Sources
- [[Source - LLM Wiki]]
