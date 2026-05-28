---
title: Conflict Callout
type: concept
tags: [wiki, contradiction, pattern]
created: 2026-05-07
updated: 2026-05-12
source_count: 1
aliases: [contradiction handling, conflict block]
provenance: source-derived
---

# Conflict Callout

Pattern for handling contradictions between sources. When new information contradicts existing claims during [[Ingest]], a callout block is added rather than silently overwriting.

## Syntax

```markdown
> [!conflict] <topic>
> Source A claims X.
> Source B claims Y.
> Needs resolution.
```

## Rules

- Never silently overwrite existing claims
- Both sources must be cited in the callout
- "Needs resolution" flags for human review during [[Triage]] or [[Lint]]
- Renders as styled callout block in [[Obsidian]]

## Resolution

A conflict callout should not remain after the wiki has enough evidence to pick an authority. If live repository files supersede an older source page, replace the callout with a dated source-refresh note and cite the current source. If the contradiction is still real, keep the callout and link it from a maintenance idea or backlog item.

## Lint Handling

[[Lint]] treats conflict callouts as warnings because they require human judgment. Example syntax in documentation should avoid fake wikilinks, otherwise a structural broken-link check can mistake the example for a real page reference.

## Sources
- [[Source - Ingest SKILL]]
