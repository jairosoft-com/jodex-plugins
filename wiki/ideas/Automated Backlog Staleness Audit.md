---
title: Automated Backlog Staleness Audit
type: idea
tags: [jx-kb, wiki, backlog, automation, lint]
created: 2026-05-22
updated: 2026-05-22
status: backlogged
priority: P2
effort: medium
source: Manual backlog audit session (2026-05-22)
aliases: [stale backlog check, idea status audit]
provenance: synthesis
---

# Automated Backlog Staleness Audit

A manual audit of 31 backlogged wiki ideas found 9 (29%) were already implemented in the codebase. Nearly a third of the backlog was phantom work — ideas marked backlogged whose scoped files and changes already exist.

## Proposed Solution

Add a `jx-kb:lint` rule or standalone check that cross-references backlogged ideas against the codebase. For each idea with status `backlogged`, check whether the files listed in its Scope section exist and the described changes are present.

### Detection Heuristic

1. Parse the idea's `## Scope` / `### New Files` / `### Modified Files` tables
2. For "New Files" entries: check if the file exists at the listed path
3. For "Modified Files" entries: grep for key phrases from the "Changes" column
4. Score: if all scoped files exist and key changes are present, flag as "likely completed"
5. Report as a lint warning, not auto-promotion — human confirms before status change

### Integration Options

- Add as a new lint rule in `jx-kb:lint` (alongside orphan detection, broken links, etc.)
- Run periodically or on-demand via `/jx-kb:lint --check-backlog`
- Output: list of ideas flagged as likely completed with evidence

## Scope

### Modified Files

| File | Changes |
|------|---------|
| `plugins/jx-kb/scripts/wiki-tools.py` | Add `backlog-audit` subcommand that reads ideas with status: backlogged, parses Scope tables, checks file existence |
| `plugins/jx-kb/skills/lint/SKILL.md` | Add backlog staleness as an optional lint category |

## Dependencies

Requires ideas to have structured Scope sections with file paths. Ideas without Scope tables are skipped.
