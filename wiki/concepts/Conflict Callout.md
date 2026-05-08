---
title: Conflict Callout
type: concept
tags: [wiki, contradiction, pattern]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [contradiction handling, conflict block]
provenance: source-derived
---

# Conflict Callout

Pattern for handling contradictions between sources. When new information contradicts existing claims during [[Ingest]], a callout block is added rather than silently overwriting.

## Syntax

```markdown
> [!conflict] <topic>
> [[Source - Article A]] claims X.
> [[Source - Article B]] claims Y.
> Needs resolution.
```

## Rules

- Never silently overwrite existing claims
- Both sources must be cited in the callout
- "Needs resolution" flags for human review during [[Triage]] or [[Lint]]
- Renders as styled callout block in [[Obsidian]]

## Sources
- [[Source - Ingest SKILL]]
