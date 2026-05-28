---
title: Dynamic Worklist Generation
type: concept
tags: [pattern, refactoring, safety]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [dynamic worklist, generated worklist]
provenance: synthesis
---

# Dynamic Worklist Generation

When planning bulk operations (renames, migrations, refactors), generate the file worklist from the codebase at execution time rather than hardcoding counts or file lists in the plan.

## The Problem

A plan that says "update 16 source pages" assumes a static count derived during planning. Between planning and execution — or even during the same session — the count can be wrong because:
- Files were added/removed since the count was taken
- The initial scan missed files matching the pattern
- Nested matches weren't counted

## The Pattern

```bash
# Wrong: hardcoded list
FILES="Source - JX QA README.md Source - JX QA Agents.md ..."

# Right: dynamic worklist
FILES=$(rg -l 'raw_path: plugins/(qa-ai|llm-wiki)' wiki/sources/)
echo "Found $(echo "$FILES" | wc -l) files to update"
```

## Rules

1. **Derive, don't enumerate** — use `grep`, `rg`, `find`, or `git ls-files` to discover affected files
2. **Log the count** — print how many files matched so the operator can sanity-check
3. **Plan describes the pattern, not the list** — "all files matching `raw_path: plugins/qa-ai`" not "these 16 files"

## Example from This Project

During the jx namespace rebrand, the plan hardcoded 16 source pages for path updates. Dynamic worklist generation via `rg -l` found 36 files — the other 20 were command, skill, and reference source pages also containing old plugin paths.

## Related

- [[Scoped Replacement Pattern]] — safe bulk replacement
- [[Watchlist Pattern]] — manifest-driven file tracking
- [[Ad-hoc vs Manifest-Driven Workflows]] — discovery vs enumeration
