---
title: Skill Chaining
type: concept
tags: [pattern, plugin, workflow, pipeline]
created: 2026-05-09
updated: 2026-05-09
source_count: 13
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

## Cross-Plugin Chaining (Deferred)

When jx-pm was split into jx-dev + jx-pm, all `--chain` and `--chain-all` flags were removed from moved skills. Cross-plugin chaining (e.g., `/jx-pm:prd` → `/jx-dev:spec` → `/jx-dev:task` → `/jx-pm:ado`) is logged as future work. `/jx-pm:pipeline` reduced to prd-only delegation until chaining across plugin boundaries is designed. See [[Cross-Plugin Shared Convention Layer]].

## Related

- [[Multi-Phase Skill]] — intra-skill phasing (different pattern)
- [[Product Management Skills Plugin]] — first plugin using chaining
- [[Plugin Architecture]] — .claude-plugin format
- [[Cross-Plugin Shared Convention Layer]] — deferred cross-plugin chaining

## Sources
- [[Source - jx-pm Plugin README]]
- [[Source - Pipeline Command]]
- [[Source - jx-pm PRD Command]]
- [[Source - jx-pm Task Command]]
- [[Source - jx-pm Techspec Command]]
- [[Source - PRD Generator SKILL]]
- [[Source - Tech Spec Generator SKILL]]
- [[Source - Task JSON Converter SKILL]]
- [[Source - Pipeline SKILL]]
- [[Source - Split Tech Spec Idea]]
- [[Source - jx-dev Plugin README]]
- [[Source - jx-dev Spec SKILL]]
- [[Source - jx-dev Task SKILL]]
