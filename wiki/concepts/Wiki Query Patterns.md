---
title: Wiki Query Patterns
type: concept
tags: [wiki, query, patterns]
created: 2026-05-07
updated: 2026-05-07
source_count: 0
aliases: [query patterns, wiki search patterns]
provenance: synthesis
---

# Wiki Query Patterns

Observed patterns in how wiki queries surface knowledge and when they generate new insights versus retrieving existing content.

## Query Types

### Retrieval Query
Pulls existing wiki content. No new knowledge generated. Example: "How to install plugins?" → returns [[Marketplace]] and [[Claude Code CLI]] content verbatim.

### Exploratory Query
Probes for connections or gaps. May reveal missing pages, weak cross-references, or undocumented patterns. Example: "What patterns do our plugins share?" → might surface a missing concept page.

### Generative Query
Asks wiki to synthesize across pages. New insight emerges from combining existing knowledge. Example: "Are there any new insights we can file back?" → triggers review of conversation for wiki-worthy content.

## When Queries Surface New Knowledge

Queries generate new insights when:
- Discussion reveals patterns not yet captured in wiki pages
- Cross-page synthesis produces novel connections
- Gaps in wiki coverage become visible through failed lookups

Queries return existing knowledge when:
- Question maps directly to an existing page
- Content is already well-documented with cross-references

## Using Query Results

- **Existing content** → no action needed
- **New insight** → use [[Filing Workflow]] to persist
- **Gap found** → create page or add to `_backlog.md`

## Related

- [[Query]] — the wiki query operation itself
- [[Link Graph Traversal]] — how query discovers pages via wikilinks
- [[Filing Workflow]] — persisting insights found during queries
