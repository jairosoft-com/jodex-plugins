---
title: Triage
type: concept
tags: [operation, wiki, classification]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
aliases: [triage operation, idea triage]
provenance: source-derived
---

# Triage

The operation of classifying raw ideas extracted during [[Ingest]]. Ideas start with `status: raw` and are reviewed by the user to determine their fate.

## Outcomes

- **Promote** — well-formed knowledge moves to its correct taxonomy bucket (e.g., `ideas/` → `concepts/`)
- **Backlog** — interesting but underdeveloped, stays in ideas with `status: backlogged` and a priority level
- **Archive** — duplicates, noise, or irrelevant, marked `status: archived` with reason

## Role in the Wiki

Triage is the human curation checkpoint. While [[Ingest]] is largely automated, triage ensures the wiki reflects deliberate choices about what knowledge is worth maintaining.

## [[Multi-Phase Skill]] Structure (6 Phases)

1. Load ideas — scan `ideas/` for `status: raw` pages
2. Present for triage — show summary, source, tags, key claims; ask Promote/Backlog/Archive/Skip
3. Execute decisions — move/update pages per user choices
4. Update [[Index]]
5. Update `_backlog.md`
6. Append to [[Log]]

See [[Idea Lifecycle]] for full state machine.

## Sources
- [[Source - LLM Wiki]]
- [[Source - Triage SKILL]]
