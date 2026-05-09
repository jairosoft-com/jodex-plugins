---
title: Fail-Closed Lookup
type: concept
tags: [pattern, safety, sync, external-system]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [fail-closed search, exact-match-or-halt]
provenance: synthesis
---

# Fail-Closed Lookup

When searching an external system by non-unique key, require exactly one match. Zero or multiple matches trigger distinct failure paths — never silently pick one.

## Problem

Title-based or tag-based lookups in external systems (ADO, Jira, etc.) can return:
- 0 results (item doesn't exist yet)
- 1 result (correct match)
- 2+ results (duplicates from prior crash, manual creation, or naming collision)

Silently picking the first match on 2+ results can bind local state to the wrong external item, causing cascading corruption (wrong updates, wrong state sync, wrong prune).

## Solution

```
matches = search(external_system, key)

if matches == 0 → create new item
if matches == 1 → reuse (bind local to this item)
if matches >= 2 → HALT, show duplicates, require manual resolution
```

## Key Properties

- **Deterministic:** same input always produces same outcome
- **Fail-closed:** ambiguity halts rather than guesses
- **Auditable:** duplicates are surfaced, not hidden
- **Human-in-the-loop:** multi-match resolution requires explicit user choice

## Application

Used by `/jx-pm:ado` crash recovery — when task.json lacks an `azureWorkItemId` for an item, searches Azure by title prefix. Must find exactly 1 match or halt.

## Related

- [[Per-Item Write-Back]] — minimizes the window where lookup is needed
- [[Idempotent Operation]] — safe re-run requires deterministic binding
- [[User Confirmation Gate]] — multi-match requires human decision
- [[Product Management Skills Plugin]] — plugin using this pattern

## Sources
