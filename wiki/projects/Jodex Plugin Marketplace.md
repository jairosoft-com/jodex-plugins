---
title: Jodex Plugin Marketplace
type: project
tags: [plugin, marketplace, dogfood]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [jodex-plugins, jodex-qa-ai]
provenance: synthesis
---

# Jodex Plugin Marketplace

This repo is a dual-plugin [[Marketplace]] for [[Claude Code CLI]], [[Claude Code Desktop]], and [[Codex Desktop]]. It distributes [[QA AI]] and [[LLM Wiki]] from one marketplace manifest.

## Current Shape

- [[QA AI]] provides the BRD/PRD to xlsx to [[Playwright]] spec pipeline.
- [[LLM Wiki]] provides project-local wiki operations: [[Ingest]], [[Triage]], [[Query]], and [[Lint]].
- The repo dogfoods [[LLM Wiki]] by maintaining this wiki as the project knowledge layer.

## Operating Model

The repo has two durable surfaces:

1. Plugin source under `plugins/`
2. Maintained wiki pages under `wiki/`

Conversation findings and design summaries are filed through [[Filing Workflow]] using `provenance: synthesis`. Source ingests remain `source-derived`.

## Discussion Watchpoints

- [[Plugin Metadata Surfaces]] need to stay aligned when descriptions or names change.
- [[Raw Sources Should Be Excluded From Wiki Graph]] should be resolved so lint and link-graph checks do not treat source snapshots as wiki pages.
- [[Align qa-ai Generate Tool Contract]] should be resolved so documented generation steps match allowed tools.

## Related

- [[Plugin Dogfooding Workflow]]
- [[Three-Surface Plugin Ecosystem]]
- [[ADR-001 Treat Marketplace Metadata As Listing Source]]

## Derived From
- [[Marketplace]]
- [[QA AI]]
- [[LLM Wiki]]
- [[Three-Surface Plugin Ecosystem]]
- [[Filing Workflow]]
