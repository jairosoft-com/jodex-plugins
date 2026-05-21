---
title: Idea Lifecycle
type: concept
tags: [wiki, workflow, classification]
created: 2026-05-07
updated: 2026-05-21
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
| `promoted` | Well-formed, moved to target taxonomy | `promoted_to` field links to new wiki location, OR `prd:` field links to a generated BRD_PRD |
| `backlogged` | Interesting but underdeveloped | Added to `_backlog.md` with priority (P0-P3) |
| `archived` | Duplicate, noise, or irrelevant | `archive_reason` field records why |

## Key Rules

- Original idea file is **never deleted** — serves as redirect/audit trail
- [[Lint]] flags ideas stuck in `raw` for >14 days
- Promoted ideas keep their original file with `status: promoted` and a promotion pointer

## Promotion Variants

Two paths to `promoted`:

| Path | When | Frontmatter field |
|------|------|-------------------|
| Wiki promotion | Idea has reusable knowledge value → becomes a concept/topic/code page | `promoted_to: wiki/concepts/Foo.md` |
| PRD promotion | Idea implies a feature → a BRD_PRD is generated from it | `prd: docs/NNN_feature_name/BRD_PRD.md` |

Both paths keep the idea file in `wiki/ideas/` as an audit trail. The `prd:` variant does not require a new wiki page — the deliverable is the requirements doc, not a knowledge page.

## Why Preserve Ideas

The wiki treats ideas as decision history, not disposable scratch notes. Keeping the original idea page makes it possible to explain why a concept exists, when it was promoted, and what alternatives or open questions were present before promotion.

## Maintenance Signal

An old raw idea is not automatically bad, but it is a useful review queue. During [[Triage]], raw ideas should be promoted when they have reusable knowledge value, backlogged when they imply work, or archived when they are duplicate, stale, or not worth keeping active.

## Sources
- [[Source - Triage SKILL]]
