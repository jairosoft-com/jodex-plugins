---
title: Triage Wiki Lint Editorial Warnings
type: idea
tags: [wiki, lint, triage, maintenance]
created: 2026-05-11
updated: 2026-05-11
source_count: 0
aliases: [wiki lint warning triage, editorial lint cleanup]
provenance: synthesis
status: backlogged
---

# Triage Wiki Lint Editorial Warnings

After raw-source exclusion and maintained-link cleanup, the remaining lint warnings should be triaged as editorial maintenance rather than mixed with tool noise.

## Scope

- Orphan maintained pages: decide whether to add inbound links, keep them intentionally standalone, merge them, or archive them.
- Unresolved conflict callouts: resolve contradictions, preserve them with a dated note, or move them to explicit follow-up work.
- Thin pages: expand pages with real context, merge them into stronger pages, or archive low-value entries.
- Raw ideas: classify stale raw ideas through [[Triage]].

## Current Evidence

The 2026-05-11 lint operation reported warnings for orphan pages, unresolved conflict callouts, thin pages, and stale ideas. These warnings should be reviewed after [[Raw Sources Should Be Excluded From Wiki Graph]] is implemented so the warning set reflects maintained wiki content only.

## Acceptance Criteria

- Each remaining warning is either fixed or intentionally documented.
- New or updated links preserve the existing [[Schema]] and [[Cross-Reference Pass]] conventions.
- `_backlog.md` and `_index.md` stay aligned with any promoted, archived, or merged ideas.

## Related

- [[Lint]]
- [[Health Score]]
- [[Conflict Callout]]
- [[Raw Sources Should Be Excluded From Wiki Graph]]

## Sources

- 2026-05-11 lint operation recorded in `_log.md`
