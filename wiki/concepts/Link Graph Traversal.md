---
title: Link Graph Traversal
type: concept
tags: [wiki, query, navigation]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [graph traversal, link traversal]
provenance: source-derived
---

# Link Graph Traversal

The technique used during [[Query]] to discover relevant pages beyond direct keyword matches.

## How It Works

1. `wiki-tools.py wikilinks <wiki_path>` generates the full link graph
2. **Seed pages** — found via keyword matching against [[Index]]
3. **One-hop expansion** — follow outbound `[[wikilinks]]` from seed pages to find related content
4. **Tag matching** — include pages matching question tags from the index
5. **Cap** — read 3-8 pages for typical questions, up to 15 for broad ones

## Why It Works

The wiki's cross-references encode semantic relationships that keyword search alone would miss. Following links surfaces pages that are contextually relevant even if they don't contain the query terms.

## Sources
- [[Source - Query SKILL]]
