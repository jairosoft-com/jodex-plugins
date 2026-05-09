---
title: Tombstone Pattern
type: concept
tags: [pattern, safety, sync, audit]
created: 2026-05-09
updated: 2026-05-09
source_count: 3
aliases: [soft delete, tombstoning, tombstone]
provenance: synthesis
---

# Tombstone Pattern

Mark items as removed instead of deleting them, preserving external system bindings and audit trail.

## Problem

When local state is synced to an external system (e.g., Azure DevOps), deleting a local item loses the mapping to its external counterpart. The external item becomes an orphan — invisible to reconciliation, cleanup, or audit.

## Solution

Instead of deleting synced items, mark them as tombstones:

```json
{
  "id": "US-006-03",
  "removed": true,
  "azureWorkItemId": 200456,
  "azureWorkItemUrl": "https://dev.azure.com/..."
}
```

## Rules

1. **Has external binding** (e.g., `azureWorkItemId`) → tombstone, never delete
2. **No external binding** → safe to delete silently
3. Tombstones are inert — not synced, not created, just preserved
4. Explicit `--prune` action closes external items and removes tombstones
5. `--dry-run` reports tombstones as "stale external items"

## Benefits

- Audit trail: know what was removed and when
- Reconciliation: `--prune` can close/unlink external items
- Safety: accidental PRD edits don't orphan Azure work items silently
- Reversibility: tombstone can be un-removed if PRD change was a mistake

## Related

- [[Per-Item Write-Back]] — crash-safe pattern for creating external bindings
- [[Idempotent Operation]] — safe re-run pattern
- [[User Confirmation Gate]] — prune requires confirmation
- [[Product Management Skills Plugin]] — plugin using this pattern

## Sources
- [[Source - Task JSON Converter SKILL]]
- [[Source - Azure Boards Sync SKILL]]
- [[Source - Task JSON Schema]]
