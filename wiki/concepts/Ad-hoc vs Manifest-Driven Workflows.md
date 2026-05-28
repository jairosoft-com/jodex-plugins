---
title: Ad-hoc vs Manifest-Driven Workflows
type: concept
tags: [pattern, workflow, architecture]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [ad-hoc workflow, manifest-driven workflow]
provenance: synthesis
---

# Ad-hoc vs Manifest-Driven Workflows

Two modes for operations that act on a set of targets (files, resources, tasks).

## Ad-hoc

User specifies target each time. No persistent tracking.

- **Pros**: Zero setup, maximum flexibility
- **Cons**: Easy to forget files, no change detection, no progress tracking
- **Example**: `/jx-kb:ingest path/to/file.md` with manual file selection

## Manifest-Driven

A persistent list (manifest/watchlist) tracks known targets and their status.

- **Pros**: Suggests candidates, tracks progress, detects changes, enables batch operations
- **Cons**: Requires maintenance of the manifest itself
- **Example**: `_watchlist.md` suggesting pending ingest candidates

## Hybrid (Recommended)

Best approach combines both: manifest suggests, but ad-hoc always accepted. The manifest is additive — a convenience layer, not a gate. See [[Watchlist Pattern]].

## Instances in This Project

| Operation | Ad-hoc | Manifest |
|-----------|--------|----------|
| [[Ingest]] | Any file path | `_watchlist.md` pending list |
| [[Triage]] | Manual idea selection | Ideas with `status: raw` |
| [[Lint]] | Run on whole wiki | Could track specific directories |

## Related

- [[Watchlist Pattern]] — specific implementation of manifest-driven tracking
- [[Idempotent Operation]] — both modes benefit from safe re-run behavior
- [[User Confirmation Gate]] — both modes pause before writes

## Sources
- (synthesis — workflow pattern distinction from ingest watchlist discussion, 2026-05-08)
