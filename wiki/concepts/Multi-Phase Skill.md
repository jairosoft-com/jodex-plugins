---
title: Multi-Phase Skill
type: concept
tags: [pattern, skill, architecture]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [phased skill, phase-based skill]
provenance: source-derived
---

# Multi-Phase Skill

The structural pattern used by all [[Skill]] implementations. Each skill is broken into numbered phases (typically 4-10) with clear inputs, outputs, and gates between them.

## Ingest Example (9 Phases)

1. **Validate & Fingerprint** — check wiki exists, [[SHA-256 Fingerprinting|fingerprint]] source, dedup check
2. **Analyze Source** — extract entities, concepts, ideas from content
3. **Plan Wiki Updates** — present table, [[User Confirmation Gate|wait for approval]]
4. **Snapshot Source** — copy to [[Raw Sources]]
5. **Create/Update Pages** — write pages with frontmatter and wikilinks
6. **[[Cross-Reference Pass]]** — bidirectional linking
7. **Update [[Index]]** — maintain catalog
8. **Append to [[Log]]** — audit trail
9. **Report** — structured summary

## Benefits

- Clear error handling boundaries between phases
- User can abort at confirmation gates without partial writes
- Each phase has defined inputs and outputs
- Phases can reference shared concepts across skills

## Sources
- [[Source - Ingest SKILL]]
