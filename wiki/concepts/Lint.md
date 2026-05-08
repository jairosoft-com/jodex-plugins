---
title: Lint
type: concept
tags: [operation, wiki, maintenance]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [lint operation, wiki lint, health check]
provenance: source-derived
---

# Lint

Periodic health-check operation for the wiki. The LLM audits the wiki for structural and content issues.

## What It Checks

- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Important concepts mentioned but lacking their own page
- Missing cross-references
- Data gaps that could be filled with a web search
- [[Index]] drift (pages exist but aren't indexed, or vice versa)

## Value

The LLM suggests new questions to investigate and new sources to look for. Lint keeps the wiki healthy as it grows — preventing the entropy that causes human-maintained wikis to decay.

## Sources
- [[Source - LLM Wiki]]
