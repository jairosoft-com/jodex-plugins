---
title: Mode Flag Pattern
type: concept
tags: [pattern, plugin, skill, design]
created: 2026-05-09
updated: 2026-05-09
source_count: 6
aliases: [mode flag, skill mode, multi-mode skill]
provenance: synthesis
---

# Mode Flag Pattern

Merge N similar skills into a single skill with a `--mode` flag when they share 80%+ structure but differ in depth or scope.

## When to Merge

Merge into one skill with mode flag:
- Skills share the same phases/workflow
- Differ primarily in template selection or section depth
- Same input type, same output type (just different detail level)
- User would otherwise need to remember N similar command names

## When to Keep Separate

Keep as separate skills:
- Different input types or output types
- Different workflow phases
- Different tool requirements (e.g., one needs Azure MCP, another doesn't)
- Fundamentally different user intent

## Structure

```markdown
## Phase 1: Mode Selection
Parse --mode flag. Default: [most common mode].

## Phase 2-N: Shared Phases
[Identical logic across all modes]

## Phase X: Mode-Branched Phase
- If mode == lite: [simpler version]
- If mode == full: [detailed version]
- If mode == unified: [combined version]
```

## Decision Matrix

| Signal | Merge | Keep Separate |
|--------|-------|---------------|
| 80%+ shared phases | Yes | — |
| Same input/output types | Yes | — |
| Different tool permissions | — | Yes |
| Different user intent | — | Yes |
| Template selection is the main diff | Yes | — |
| Workflow structure diverges | — | Yes |

## Case Study: PRD Generation

Three source skills (`cc-gen-prd-lite`, `cc-gen-prd`, `cc-gen-brd-prd`) shared:
- Same folder validation
- Same clarifying questions pattern
- Same ID generation system
- Same user story format
- Same save/chain behavior

Differed only in:
- Template selection (lite vs full vs unified)
- Number of questions asked
- Whether BRD Part I was included

Result: merged into `/jx-pm:prd --mode lite|prd|unified`.

## Related

- [[Skill Generalization]] — broader process that uses this pattern
- [[Multi-Phase Skill]] — structural pattern within each mode
- [[Skill]] — base concept

## Sources
- [[Source - PRD Lite Template]]
- [[Source - PRD Standard Template]]
- [[Source - Unified BRD-PRD Template]]
- [[Source - Pipeline Command]]
- [[Source - PRD Generator SKILL]]
- [[Source - Pipeline SKILL]]
