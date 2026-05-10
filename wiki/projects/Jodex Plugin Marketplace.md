---
title: Jodex Plugin Marketplace
type: project
tags: [plugin, marketplace, dogfood]
created: 2026-05-08
updated: 2026-05-09
source_count: 0
aliases: [jodex-plugins, jodex-qa-ai]
provenance: synthesis
---

# Jodex Plugin Marketplace

This repo is a tri-plugin [[Marketplace]] for [[Claude Code CLI]], [[Claude Code Desktop]], and [[Codex Desktop]]. It distributes [[QA Testing Plugin|jx-qa]], [[Knowledge Base Plugin|jx-kb]], and [[Product Management Skills Plugin|jx-pm]] from one marketplace manifest.

## Current Shape

- [[QA Testing Plugin|jx-qa]] provides the BRD/PRD to xlsx to [[Playwright]] spec pipeline.
- [[Knowledge Base Plugin|jx-kb]] provides project-local wiki operations: [[Ingest]], [[Triage]], [[Query]], and [[Lint]].
- [[Product Management Skills Plugin|jx-pm]] provides PM/PO workflows: PRD generation, tech specs, task conversion, and Azure DevOps sync (5 skills).
- The repo dogfoods [[Knowledge Base Plugin|jx-kb]] by maintaining this wiki as the project knowledge layer.

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
- [[QA Testing Plugin|jx-qa]]
- [[Knowledge Base Plugin|jx-kb]]
- [[Product Management Skills Plugin]]
- [[Three-Surface Plugin Ecosystem]]
- [[Filing Workflow]]
