---
title: Index
type: concept
tags: [architecture, wiki, navigation]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [wiki index, _index.md]
provenance: source-derived
---

# Index

The content catalog (`_index.md`) listing every page in the wiki with a link, one-line summary, and optional metadata. Organized by taxonomy category.

## How It's Used

- The LLM reads the index first when answering a [[Query]] to find relevant pages
- Updated on every [[Ingest]] — new pages added, summaries written
- Works surprisingly well at moderate scale (~100 sources, ~hundreds of pages)
- Avoids the need for embedding-based RAG infrastructure at small-to-medium scale

## Structure

Each taxonomy section lists pages alphabetically:
```
- Page Name — One-line summary (#tag1, #tag2)
```

Frontmatter tracks `page_count` and `updated` date.

## Scaling

At larger scale, the index may be supplemented by [[Wiki Search Tools]] such as qmd for hybrid BM25/vector search.

## Sources
- [[Source - LLM Wiki]]
