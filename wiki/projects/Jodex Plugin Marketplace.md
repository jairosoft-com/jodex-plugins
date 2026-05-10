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

## Repository Metrics (2026-05-09)

| Metric | Value |
|--------|-------|
| Total files | 627 |
| Disk size | 23M |
| Plugins | 3 (jx-qa, jx-kb, jx-pm) |
| Skills | 14 |
| Commands | 14 |
| Wiki pages | 191 (164 maintained, 27 raw) |
| Wikilinks | 1,095 (6.2/page avg) |
| Wiki health | 87/100 |
| Commits | 38 over 11 days |
| Architecture | Pure declarative (md + json + py, no build tooling) |

### Plugin Maturity

| Plugin | Skills | Evals | README | Status |
|--------|--------|-------|--------|--------|
| [[Knowledge Base Plugin|jx-kb]] | 5 | 4/5 | Complete | Most mature |
| [[QA Testing Plugin|jx-qa]] | 4 | 3/4 | Mostly complete | Medium |
| [[Product Management Skills Plugin|jx-pm]] | 3 | 0/3 | Updated | Split: spec+task moved to jx-dev |

### Known Issues

- jx-pm not enabled in settings.json
- jx-pm has zero evals across all skills
- jx-pm README missing install, requirements, ADO dependency docs
- jx-pm branding inconsistency ("Pm.Ai Harness" vs "Product Management")
- 17 orphan wiki pages need cross-references
- 1 stale worktree (3.5M)

## Discussion Watchpoints

- [[Plugin Metadata Surfaces]] need to stay aligned when descriptions or names change.
- [[Raw Sources Should Be Excluded From Wiki Graph]] should be resolved so lint and link-graph checks do not treat source snapshots as wiki pages.
- [[Align jx-qa Generate Tool Contract]] should be resolved so documented generation steps match allowed tools.

## Related

- [[Plugin Dogfooding Workflow]]
- [[Three-Surface Plugin Ecosystem]]
- [[ADR-001 Treat Marketplace Metadata As Listing Source]]

## Sources
- [[Source - Root README]]

## Derived From
- [[Marketplace]]
- [[QA Testing Plugin|jx-qa]]
- [[Knowledge Base Plugin|jx-kb]]
- [[Product Management Skills Plugin]]
- [[Three-Surface Plugin Ecosystem]]
- [[Filing Workflow]]
