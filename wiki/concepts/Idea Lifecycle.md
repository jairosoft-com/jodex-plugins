---
title: Idea Lifecycle
type: concept
tags: [wiki, workflow, classification]
created: 2026-05-07
updated: 2026-05-12
source_count: 1
aliases: [idea status, idea workflow]
provenance: source-derived
---

# Idea Lifecycle

The progression of ideas through the wiki from extraction to resolution.

## States

```
raw → promoted | backlogged | archived
```

| Status | Meaning | Action |
|--------|---------|--------|
| `raw` | Newly extracted, unclassified | Awaits [[Triage]] |
| `promoted` | Well-formed, moved to target taxonomy | `promoted_to` field links to new location |
| `backlogged` | Interesting but underdeveloped | Added to `_backlog.md` with priority (P0-P3) |
| `archived` | Duplicate, noise, or irrelevant | `archive_reason` field records why |

## Key Rules

- Original idea file is **never deleted** — serves as redirect/audit trail
- [[Lint]] flags ideas stuck in `raw` for >14 days
- Promoted ideas keep their original file with `status: promoted` and `promoted_to` pointer

## Why Preserve Ideas

The wiki treats ideas as decision history, not disposable scratch notes. Keeping the original idea page makes it possible to explain why a concept exists, when it was promoted, and what alternatives or open questions were present before promotion.

## Maintenance Signal

An old raw idea is not automatically bad, but it is a useful review queue. During [[Triage]], raw ideas should be promoted when they have reusable knowledge value, backlogged when they imply work, or archived when they are duplicate, stale, or not worth keeping active.

## Sources
- [[Source - Triage SKILL]]
