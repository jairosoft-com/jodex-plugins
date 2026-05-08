---
title: Query
type: concept
tags: [operation, wiki, retrieval]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
aliases: [query operation, wiki query]
provenance: source-derived
---

# Query

The operation of asking questions against the wiki and receiving synthesized answers with citations. The LLM reads the [[Index]] first to find relevant pages, then drills into them to compose an answer.

## How It Works

1. Read [[Index]] to identify relevant pages
2. Read those pages and follow [[Cross-References|cross-references]]
3. Synthesize an answer with `[[citations]]` to wiki pages
4. Optionally produce different output formats: markdown page, comparison table, slide deck ([[Marp Integration|Marp]]), chart, canvas

## Compounding Value

Good answers can be filed back into the wiki as new pages — comparisons, analyses, discovered connections. This makes explorations compound in the knowledge base just like ingested sources. When filed back, pages must be marked with `provenance: synthesis` per the [[Schema]] rules.

## Page Discovery

Uses [[Link Graph Traversal]]: keyword match → tag match → one-hop link expansion. Typical queries read 3-8 pages, broad queries up to 15.

## Answer Format

Structured markdown with sections: Answer (direct, with citations), Details, Conflicts, Gaps, Pages Consulted.

## Filing Answers

When filing an answer back as a wiki page:
- `source_count: 0` (derived from other wiki pages, not raw sources)
- Uses `## Derived From` section instead of `## Sources`
- Must be marked `provenance: synthesis` per [[Schema]] rules

## Sources
- [[Source - LLM Wiki]]
- [[Source - Query SKILL]]
