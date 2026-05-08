---
title: Lint
type: concept
tags: [operation, wiki, maintenance]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
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

## Health Score

Generates a score from 0 to 100. Factors include broken links, orphan pages, missing frontmatter, index drift, and unresolved conflicts.

## Additional Checks

- Ideas stuck in `status: raw` for >14 days are flagged
- Offers auto-fixes for common structural issues

## [[Multi-Phase Skill]] Structure (6 Phases)

1. Structural checks — orphans, broken links, frontmatter validation, page census
2. Index drift — pages on disk vs. in index, stale summaries
3. Content quality — conflicts, stale pages/ideas, missing wikilinks, thin pages, duplicates
4. Generate [[Health Score]] report
5. Offer auto-fixes (with [[User Confirmation Gate]])
6. Append to [[Log]]

## Sources
- [[Source - LLM Wiki]]
- [[Source - LLM Wiki README]]
- [[Source - Lint SKILL]]
