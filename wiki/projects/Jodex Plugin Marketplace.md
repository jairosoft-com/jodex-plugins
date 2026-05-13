---
title: Jodex Plugin Marketplace
type: project
tags: [plugin, marketplace, dogfood]
created: 2026-05-08
updated: 2026-05-11
source_count: 4
aliases: [jodex-plugins, jodex-qa-ai]
provenance: synthesis
---

# Jodex Plugin Marketplace

This repo is a five-plugin [[Marketplace]] for [[Claude Code CLI]], [[Claude Code Desktop]], and [[Codex Desktop]]. It distributes [[QA Testing Plugin|jx-qa]], [[Knowledge Base Plugin|jx-kb]], [[Product Management Skills Plugin|jx-pm]], [[Developer Skills Plugin|jx-dev]], and [[Core Shared Conventions Plugin|jx-core]] from one marketplace manifest.

## Current Shape

- [[QA Testing Plugin|jx-qa]] provides the BRD/PRD to xlsx to [[Playwright]] spec pipeline.
- [[Knowledge Base Plugin|jx-kb]] provides project-local wiki operations: [[Ingest]], [[Triage]], [[Query]], and [[Lint]].
- [[Product Management Skills Plugin|jx-pm]] provides PM/PO workflows: PRD generation, pipeline orchestration, and Azure DevOps sync.
- [[Developer Skills Plugin|jx-dev]] provides technical specification and task breakdown workflows.
- [[Core Shared Conventions Plugin|jx-core]] provides shared conventions for docs-root resolution, ID rules, and task JSON schema.
- The repo dogfoods [[Knowledge Base Plugin|jx-kb]] by maintaining this wiki as the project knowledge layer.

## Operating Model

The repo has two durable surfaces:

1. Plugin source under `plugins/`
2. Maintained wiki pages under `wiki/`

Conversation findings and design summaries are filed through [[Filing Workflow]] using `provenance: synthesis`. Source ingests remain `source-derived`.

For agent orientation, [[Source - Agent Instructions]] defines live repo files as authoritative over stale wiki/source snapshots when plugin inventory drifts. See [[Repository Source of Truth Precedence]].

## Repository Inventory (2026-05-11)

| Metric | Value |
|--------|-------|
| Plugins | 5 (jx-qa, jx-kb, jx-pm, jx-dev, jx-core) |
| Skills | 14 |
| Commands | 14 |
| Architecture | Pure declarative (md + json + py, no build tooling) |

### Plugin Maturity

| Plugin | Commands | README | Status |
|--------|----------|--------|--------|
| [[Knowledge Base Plugin|jx-kb]] | 5 | Complete | Wiki operations |
| [[QA Testing Plugin|jx-qa]] | 4 | Complete | QA automation |
| [[Product Management Skills Plugin|jx-pm]] | 3 | Current | PRD and ADO workflows |
| [[Developer Skills Plugin|jx-dev]] | 2 | Current | Spec and task workflows |
| [[Core Shared Conventions Plugin|jx-core]] | 0 | Current | Shared conventions + executable skill logic (ADO sync, task conversion) |

### Known Issues

- Only jx-qa and jx-kb are enabled in `.claude/settings.json`; install or enable other plugins deliberately when dogfooding.
- jx-pm branding inconsistency ("Pm.Ai Harness" vs "Product Management")
- 17 orphan wiki pages need cross-references
- 1 stale worktree (3.5M)

## Contributors

| Name | Email | Role | Focus Areas |
|------|-------|------|-------------|
| Ramon Aseniero | ramon@jairosoft.com | Primary developer | All plugins, wiki, marketplace, skill architecture |
| Vicsante Aseniero | vaseniero@jairosoft.com | Contributor | MCP server, Claude Desktop integration, WSL docs (US-203436) |

Both under **Jairosoft** organization.

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
- [[Source - Agent Instructions]]
- [[Source - jx-dev Plugin README]]
- [[Source - jx-core Plugin README]]

## Derived From
- [[Marketplace]]
- [[QA Testing Plugin|jx-qa]]
- [[Knowledge Base Plugin|jx-kb]]
- [[Product Management Skills Plugin]]
- [[Developer Skills Plugin|jx-dev]]
- [[Core Shared Conventions Plugin|jx-core]]
- [[Three-Surface Plugin Ecosystem]]
- [[Filing Workflow]]
- [[Repository Source of Truth Precedence]]
