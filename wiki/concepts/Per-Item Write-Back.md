---
title: Per-Item Write-Back
type: concept
tags: [pattern, safety, crash-recovery, sync]
created: 2026-05-09
updated: 2026-05-25
source_count: 2
aliases: [per-item writeback, immediate writeback, atomic item sync]
provenance: synthesis
---

# Per-Item Write-Back

A crash-safety pattern: persist state to disk immediately after each individual external operation, not after a batch completes.

## Problem

When syncing local state to an external system (e.g., creating Azure work items from task.json), batching write-backs creates a window where:
1. External items exist (created in Azure)
2. Local file has no record of them (IDs not yet written)
3. Crash in this window → retry creates duplicates

## Solution

Write the external ID back to the local file after EACH individual create/update:

```
For each item:
  1. Create in external system → get ID
  2. Write ID to local file immediately
  3. Move to next item
```

## Trade-offs

| Aspect | Batch write-back | Per-item write-back |
|--------|-----------------|---------------------|
| Crash window | Wide (entire batch) | Narrow (single item) |
| Disk I/O | 1 write | N writes |
| Atomicity | All-or-nothing | Incremental |
| Recovery | Must re-scan external system | At most 1 orphan |

## Implementation Notes

- Write via temp file + rename for atomicity (don't corrupt on mid-write crash)
- Combined with [[Tombstone Pattern]] for items that exist externally but are removed locally

## Application

Used by `/jx-pm:ado` — writes `azureWorkItemId` to task.json after each Azure work item creation.

### Two-Step Story Creation (2026-05-25)

The `jx-core/_shared/ado.md` spec applies per-item write-back to a multi-field creation flow:
- **Step 2a**: Create story + parent-link → get work item ID → write-back to PRD frontmatter immediately
- **Step 2b**: Update story with AC field, tags, story points

Write-back happens after 2a, *before* 2b. If the session crashes between 2a and 2b, the story ID is already persisted. The next sync enters update mode and fills in the missing fields automatically. This eliminates the crash window without requiring tag-based duplicate search.

## Related

- [[Idempotent Operation]] — safe re-run after crash
- [[Tombstone Pattern]] — preserving external bindings for removed items
- [[Product Management Skills Plugin]] — plugin using this pattern

## Sources
- [[Source - Azure Boards Sync SKILL]]
- [[Source - FEAT-006 Session Insights]]
