---
title: Template-as-Reference Pattern
type: concept
tags: [pattern, plugin, skill, organization]
created: 2026-05-09
updated: 2026-05-09
source_count: 6
aliases: [references directory, template separation, SKILL.md focus]
provenance: synthesis
---

# Template-as-Reference Pattern

Store document templates, examples, and supplementary material in a `references/` subdirectory. Keep SKILL.md focused on behavior and phases only.

## Problem

Inlining templates and examples into SKILL.md creates bloat:
- Source cc-gen-brd-prd SKILL.md was ~1000 lines (templates, troubleshooting, 3 workflow examples)
- Hard to find the actual skill logic among template content
- Templates change independently from skill behavior

## Solution

```
skills/{skill}/
├── SKILL.md                     # Behavior only: phases, gates, rules (~200 lines)
└── references/
    ├── lite-template.md         # Template for lite mode
    ├── prd-template.md          # Template for standard mode
    ├── unified-template.md      # Template for unified mode
    └── example.md               # One clean example
```

SKILL.md references templates by relative path:
```markdown
Generate using the appropriate template:
- `lite` → `references/lite-template.md`
- `prd` → `references/prd-template.md`
- `unified` → `references/unified-template.md`
```

## Guidelines

| Content type | Location | Reason |
|---|---|---|
| Phases, gates, validation rules | SKILL.md | Defines behavior |
| Document templates with placeholders | references/ | Changes independently |
| Worked examples | references/ | Supplementary, not core |
| Diagram pattern libraries | references/ | Reference material |
| State transition tables | references/ | Lookup tables |

## Target Size

- SKILL.md: ~150-275 lines (behavior-focused)
- Each reference file: as long as needed (templates can be detailed)

## Result

jx-pm achieved ~76% line reduction from source while keeping full functional coverage — SKILL.md files are scannable, templates are complete.

## Related

- [[Shared Reference Extraction]] — `_shared/` for cross-skill patterns (different from per-skill `references/`)
- [[Skill]] — base concept
- [[Multi-Phase Skill]] — SKILL.md structure

## Sources
- [[Source - PRD Lite Template]]
- [[Source - PRD Standard Template]]
- [[Source - Unified BRD-PRD Template]]
- [[Source - Mermaid Diagram Patterns]]
- [[Source - Tech Spec Template]]
- [[Source - ADO Sync States Reference]]
