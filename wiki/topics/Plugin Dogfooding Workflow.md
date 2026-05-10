---
title: Plugin Dogfooding Workflow
type: topic
tags: [plugin, wiki, workflow]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [dogfood loop, wiki dogfooding]
provenance: synthesis
---

# Plugin Dogfooding Workflow

This repo uses a dogfood loop: plugin source produces or improves the wiki tooling, and the wiki records insights about the plugin source.

## Loop

1. Source changes land under `plugins/`.
2. [[Knowledge Base Plugin|jx-kb]] ingests or synthesizes knowledge from the source and conversation.
3. The wiki updates [[Index]], [[Log]], and topic/concept pages.
4. Discussion surfaces gaps such as [[Raw Sources Should Be Excluded From Wiki Graph]] or [[Align qa-ai Generate Tool Contract]].
5. Those gaps become raw ideas, implementation plans, or future plugin changes.

## Value

Dogfooding keeps docs close to the implementation and gives [[Jodex Plugin Marketplace]] a live testbed for [[Filing Workflow]], [[Ingest]], [[Query]], [[Triage]], and [[Lint]].

## Risk

The loop can blur source truth and synthesis. Use frontmatter provenance consistently:

- `source-derived` for raw source ingests
- `synthesis` for user-approved conversation insights
- `model-derived` for unreviewed model output

## Related

- [[Jodex Plugin Marketplace]]
- [[Plugin Metadata Surfaces]]
- [[Three-Surface Plugin Ecosystem]]

## Derived From
- [[Knowledge Base Plugin|jx-kb]]
- [[Filing Workflow]]
- [[Ingest]]
- [[Jodex Plugin Marketplace]]
