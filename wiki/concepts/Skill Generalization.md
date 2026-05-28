---
title: Skill Generalization
type: concept
tags: [pattern, plugin, porting, reuse]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [skill porting, generalization, project-specific to generic]
provenance: synthesis
---

# Skill Generalization

The process of transforming project-specific skills into generic, reusable plugins that work across any project.

## The Problem

Skills written for one project accumulate project-specific assumptions:
- Hardcoded framework patterns (Next.js, React, etc.)
- Fixed output paths (`prds/`, project-specific directories)
- References to project-specific tools (`dev-browser` skill)
- Internal naming conventions (`cc-gen-*` prefix)
- Tightly coupled inter-skill references

## The Process

```
1. Inventory source skills → identify groupings
2. Read all source skills fully before designing
3. Identify what's project-specific vs generic
4. Merge related skills (see Mode Flag Pattern)
5. Extract shared patterns into _shared/ references
6. Replace hardcoded values with configurable defaults
7. Simplify templates (cut bloat, keep core)
8. Rename with new namespace
9. Validate: grep for old references
```

## What to Generalize

| Aspect | Project-specific | Generic |
|--------|-----------------|---------|
| Framework | Next.js 15 patterns | Framework-agnostic (Mermaid, JSON Schema, OpenAPI) |
| Output path | `prds/` | Configurable via flag/env/default |
| Tool refs | `dev-browser` skill | Generic: "lint, typecheck, tests" |
| Naming | `cc-gen-*` | `jx-pm:*` |
| Inter-skill | Hardcoded skill names | Namespace-qualified references |

## What to Keep

- Core workflow phases (the "what" not the "how")
- ID systems and traceability contracts
- Validation rules and safety patterns
- Document structure and section requirements

## Key Insight: Read Before Design

Don't lock scope before reading all source material. The jx-pm project started as "3 skills" but expanded to "5 skills" after discovering `cc-gen-prd-task` and `cc-azure-board-sync` existed in the source.

## Case Study: cc-gen-* → jx-pm

| Source (6 skills) | Target (5 skills) | Change |
|---|---|---|
| cc-gen-prd-lite | /jx-pm:prd --mode lite | Merged 3 into 1 |
| cc-gen-prd | /jx-pm:prd --mode prd | via [[Mode Flag Pattern]] |
| cc-gen-brd-prd | /jx-pm:prd --mode unified | |
| cc-gen-tech-spec | /jx-pm:techspec | Framework stripped |
| cc-gen-prd-task | /jx-pm:task | Renamed output, added merge safety |
| cc-azure-board-sync | /jx-pm:ado | Added safety contracts |

Result: ~76% line reduction while adding safety features.

## Related

- [[Mode Flag Pattern]] — when to merge similar skills
- [[Skill Chaining]] — inter-skill pipeline pattern
- [[Plugin Architecture]] — .claude-plugin format
- [[Product Management Skills Plugin]] — case study

## Sources
