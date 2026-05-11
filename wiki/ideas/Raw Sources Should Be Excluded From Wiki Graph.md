---
title: Raw Sources Should Be Excluded From Wiki Graph
type: idea
tags: [wiki, lint, graph]
created: 2026-05-08
updated: 2026-05-11
source_count: 0
aliases: [exclude raw sources from graph]
provenance: synthesis
status: backlogged
---

# Raw Sources Should Be Excluded From Wiki Graph

`wiki/raw/sources/` stores immutable source snapshots, but graph and lint helper commands should treat those files as provenance, not wiki pages.

## Observation

`wiki-tools.py` page graph operations currently walk markdown files under `wiki/` broadly. When raw snapshots are markdown files, they can appear in page lists, frontmatter checks, broken-link checks, backlink maps, and orphan reports.

## Why It Matters

Raw snapshots may contain example wiki-link syntax, incomplete frontmatter, or content that should not be maintained as wiki pages. Including them pollutes [[Lint]] output and weakens trust in [[Health Score]].

## Generalized Insight

This is an instance of [[Wiki Signal Quality]]: provenance material must remain auditable without being scored as maintained knowledge. The fix should preserve `wiki/raw/sources/` for [[Ingest]] snapshots while excluding it from graph, backlink, broken-link, frontmatter, and orphan checks.

## 2026-05-11 Lint Evidence

A lint pass reported 33 errors, 20 warnings, and a 0/100 health score, with much of the strict score dominated by `wiki/raw/` snapshots and example-link noise. The raw snapshots are intentionally ignored by git and should remain provenance inputs, not maintained wiki pages.

An implementation plan exists at `.agent/plans/fix-wiki-lint-raw-exclusion.md`.

## Potential Fix

Update page discovery in [[wiki-tools.py]] so wiki-page commands exclude `raw/` and only scan taxonomy directories plus maintained page files. Keep snapshot and fingerprint commands able to read raw sources.

## Related

- [[Raw Sources]]
- [[Wiki Signal Quality]]
- [[Path Confinement]]
- [[Jodex Plugin Marketplace]]
- [[Plugin Dogfooding Workflow]]

## Derived From
- [[Raw Sources]]
- [[Wiki Signal Quality]]
- [[wiki-tools.py]]
- [[Lint]]
- [[Health Score]]
