---
title: Repository Source of Truth Precedence
type: concept
tags: [source-of-truth, repository, agent, wiki]
created: 2026-05-11
updated: 2026-05-11
source_count: 1
aliases: [repo authority precedence, source-of-truth order, stale wiki override]
provenance: source-derived
---

# Repository Source of Truth Precedence

A repository safety rule for agents: when maintained documentation, source snapshots, or wiki pages disagree with live repository files, use the live repository files as the current authority.

In this repo, [[Source - Agent Instructions]] defines the active precedence rule for plugin inventory and operating guidance.

## Current Precedence

For plugin inventory and agent orientation, prefer:

1. `README.md`
2. `plugins/*/README.md`
3. `.claude-plugin/marketplace.json`
4. `plugins/*/.claude-plugin/plugin.json`
5. `plugins/*/commands/*.md`
6. `plugins/*/skills/*/SKILL.md`
7. `plugins/jx-core/_shared/`

Maintained wiki pages should be reconciled when they drift. Raw sources and older source snapshots preserve provenance, but they are not automatically current.

## Historical Source Summaries

`wiki/sources/` pages may intentionally preserve old command names, old plugin layouts, or pre-split implementation details because they summarize the source as it existed when ingested. Treat those pages as provenance summaries unless a maintained wiki page explicitly promotes the claim as current.

When source-summary history disagrees with live files, keep the historical note intact and update the maintained guidance layer instead.

## Agent Behavior

- Treat stale wiki/source snapshots as evidence of history, not current plugin truth.
- Update maintained wiki/schema/index pages when current repo inventory changes.
- Add conflict or staleness notes when a retained historical claim must remain visible.
- Use [[Schema]] for wiki maintenance rules and [[Filing Workflow]] for direct synthesis filings.

## Related

- [[Canonical Agent Instruction with Compatibility Shims]]
- [[Jodex Plugin Marketplace]]
- [[Plugin Metadata Surfaces]]
- [[Raw Sources]]
- [[Source - Agent Instructions]]
- [[Wiki Signal Quality]]

## Sources

- [[Source - Agent Instructions]]
