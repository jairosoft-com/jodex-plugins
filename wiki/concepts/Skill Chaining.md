---
title: Skill Chaining
type: concept
tags: [pattern, plugin, workflow, pipeline]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [skill pipeline, chain flag, inter-skill chaining]
provenance: synthesis
---

# Skill Chaining

A pattern where one [[Skill]]'s output feeds directly as input to the next skill via a `--chain` flag. Each skill remains independently invocable, but chaining enables end-to-end pipeline execution.

## Distinction from Multi-Phase Skill

- [[Multi-Phase Skill]]: multiple phases **within** a single skill (e.g., ingest has extract → route → write phases)
- **Skill Chaining**: multiple **separate skills** linked by output→input contract

## Pipeline Example (jx-pm)

```
/jx-pm:prd → /jx-pm:techspec → /jx-pm:task → /jx-pm:ado
```

Each arrow represents a file handoff:
1. bprd outputs `PRD.md` → techspec consumes it
2. techspec outputs `TECH_SPEC.md` → prd-task consumes both
3. prd-task outputs `task.json` → ado consumes it

## Design Principles

- Each skill works standalone without `--chain`
- Chain passes file path, not content (avoids context window bloat)
- Partial chains allowed (e.g., bprd→techspec only)
- Future: `/jx-pm:pipeline` convenience skill runs full chain

## Related

- [[Multi-Phase Skill]] — intra-skill phasing (different pattern)
- [[Product Management Skills Plugin]] — first plugin using chaining
- [[Plugin Architecture]] — .claude-plugin format

## Sources
