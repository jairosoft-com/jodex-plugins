---
title: Schema Sources Rule Exception for Source Pages
type: idea
status: raw
created: 2026-05-10
updated: 2026-05-11
tags: [wiki, schema, lint, sources]
provenance: session-derived
---

# Schema Sources Rule Exception for Source Pages

## Problem

Schema requires every page to end with `## Sources` section linking to raw sources. Source pages (`sources/`) ARE the source — the rule is structurally self-referential for them. Lint flags 65 source pages as violations, inflating warning count and obscuring real issues.

## Options

1. **Schema exception** — add rule: "Source pages exempt from ## Sources requirement"
2. **Self-referencing link** — each source page links to its own raw source in `raw/sources/`
3. **Different required section** — source pages use `## Raw Source` instead of `## Sources`

## Impact

- 65 lint warnings eliminated
- 34 zero-outbound-link warnings reduced (source pages would get outbound links via option 2 or 3)
- Health score jumps from 82 to ~90+

## See Also

- [[Schema]]
- [[Lint]]
- [[Raw Sources]]
