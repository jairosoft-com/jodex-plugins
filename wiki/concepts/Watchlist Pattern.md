---
title: Watchlist Pattern
type: concept
tags: [pattern, workflow, tracking]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [ingest watchlist, manifest tracking]
provenance: synthesis
---

# Watchlist Pattern

A manifest-driven tracking list that suggests candidates for an operation without restricting it. The list monitors paths, detects new or changed files, and presents them — but the user can always specify any target.

## Properties

- **Additive** — suggestions only, never a gate
- **Stateful** — tracks what has been processed vs. pending
- **Change-aware** — can detect modifications via hash comparison (see [[SHA-256 Fingerprinting]])
- **Overridable** — ad-hoc targets always accepted regardless of watchlist

## Instance: Ingest Watchlist

The `_watchlist.md` file in the wiki tracks monitored directories, already-ingested sources, and pending files for [[Ingest]]. When no source path is provided, ingest consults the watchlist to suggest candidates.

## Potential Applications

Beyond ingest, the pattern applies to any scan-based operation:
- [[Lint]] — track directories to monitor for health checks
- [[Triage]] — track idea sources to watch for new raw ideas
- Test plans — track requirement docs for new test case extraction
- Deploy checklists — track artifacts to verify before release

## Related

- [[Ingest]] — primary consumer of this pattern
- [[Ad-hoc vs Manifest-Driven Workflows]] — broader workflow distinction
- [[Idempotent Operation]] — watchlist enables safe re-runs (skip already-processed)

## Sources
- (synthesis — emergent pattern from ingest workflow improvement, 2026-05-08)
