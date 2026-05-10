---
title: Shared Reference Extraction
type: concept
tags: [pattern, plugin, skill, DRY]
created: 2026-05-09
updated: 2026-05-09
source_count: 3
aliases: [shared patterns, _shared directory, reference inclusion]
provenance: synthesis
---

# Shared Reference Extraction

Extract repeated logic across multiple skills into a shared reference file. Skills reference it by path instead of duplicating content.

## Problem

Multiple skills in a plugin repeat identical logic:
- Folder path validation (regex, error messages, confirmation flow)
- ID generation rules (format, counter behavior, types)
- Configuration resolution (flag → env → default)

Duplicating this across 4-5 skills means 150+ lines repeated per skill, with drift risk when one copy is updated but others aren't.

## Solution

Create `skills/_shared/` directory with reference markdown files. Each skill says:

```markdown
Apply rules from `_shared/id-rules.md`:
```

The shared file contains the canonical specification. Skills reference it, don't copy it.

## Structure

```
plugins/{plugin}/skills/
├── _shared/
│   ├── id-rules.md        # Folder validation, feature-number extraction, ID format
│   └── docs-root.md       # Configurable output root resolution
├── prd/
│   └── SKILL.md           # References _shared/id-rules.md
├── techspec/
│   └── SKILL.md           # References _shared/id-rules.md
└── task/
    └── SKILL.md           # References _shared/id-rules.md
```

## Benefits

- Single source of truth for shared behavior
- Update once, applies everywhere
- Skills stay focused on unique behavior (~200 lines vs ~400+)
- Easier to audit for consistency

## Naming Convention

- Prefix with `_` to signal "not a standalone skill"
- Name by what it specifies, not which skills use it
- Keep each file focused on one cohesive concern

## Cross-Plugin Extraction

When shared references need to be consumed by multiple plugins (not just skills within one plugin), extract to a dedicated reference-only plugin. See [[Cross-Plugin Shared Convention Layer]] for the pattern where `_shared/` moves from `plugins/jx-pm/skills/_shared/` to `plugins/jx-core/_shared/`.

## Related

- [[Skill Generalization]] — extraction is part of the generalization process
- [[Plugin Architecture]] — directory structure conventions
- [[Product Management Skills Plugin]] — uses `_shared/id-rules.md` and `_shared/docs-root.md`
- [[Cross-Plugin Shared Convention Layer]] — cross-plugin version of this pattern

## Sources
- [[Source - Docs Root Config]]
- [[Source - ID Rules]]
- [[Source - Cross-Plugin Convention Layer]]
