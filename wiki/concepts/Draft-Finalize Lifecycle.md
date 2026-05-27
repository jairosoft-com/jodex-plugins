---
title: Draft-Finalize Lifecycle
type: concept
tags: [pattern, safety, crash-recovery, incremental, artifact]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: [draft lifecycle, draft-finalize pattern, .draft- prefix]
provenance: source-derived
---

# Draft-Finalize Lifecycle

A durable artifact creation pattern: write to a `.draft-*` file from the start, persist incrementally, then rename to the final path on completion. Deletion on cancellation leaves no artifact behind.

## Problem

Skills that create artifacts incrementally (e.g., meeting notes captured one-at-a-time) risk data loss if the session is interrupted before the final write. Waiting until the end to write loses everything; writing to the final path immediately creates artifacts that appear complete but aren't.

## Solution

```
1. Create .draft-YYYY-MM-DD-{HHmmss}-{random4}.md at initialization
2. Re-write the full document to the draft path after each input
3. On finalize: mv .draft-... → YYYY-MM-DD.md (with suffix if exists)
4. On cancel/decline: rm .draft-... (no artifact left behind)
```

The `.draft-` prefix signals to other tools and humans that the document is in-progress. The timestamp + random suffix prevents collision between concurrent sessions.

## Properties

| Property | Behavior |
|----------|----------|
| Crash recovery | Draft file contains all content up to last input |
| Concurrent safety | Unique draft names per session |
| Clean cancellation | Draft deleted, no partial artifact |
| Finalize | Atomic rename to clean path |
| Discoverability | `.draft-*` prefix distinguishes in-progress from finalized |

## Application

Used by `/jx-pm:meet-notes` for incremental meeting note capture. Emerged from [[Iterative Adversarial Review]] Round 1 finding that in-memory-only capture loses all notes on interruption.

## Related

- [[Per-Item Write-Back]] — similar crash-safety pattern for external system sync
- [[Idempotent Operation]] — draft path includes timestamp for safe re-run
- [[Product Management Skills Plugin]] — meet-notes skill uses this pattern

## Sources

- [[Source - Meet-Notes Session Insights]]
