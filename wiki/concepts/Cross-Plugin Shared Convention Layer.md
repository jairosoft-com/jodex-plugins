---
title: Cross-Plugin Shared Convention Layer
type: concept
tags: [pattern, plugin-architecture, DRY, jx-core]
created: 2026-05-09
updated: 2026-05-09
source_count: 2
aliases: [shared convention plugin, reference-only plugin, jx-core pattern]
provenance: source-derived
---

# Cross-Plugin Shared Convention Layer

When splitting a monolithic plugin into multiple plugins, shared conventions (ID rules, output directory resolution, JSON schemas) belong in a dedicated reference-only plugin rather than being duplicated or symlinked.

## The Problem

Multiple plugins need identical conventions:
- Folder validation and ID generation rules
- Output directory resolution (`docs/` default)
- Canonical JSON schemas consumed by producers and consumers

Duplicating across plugins creates drift risk. Symlinks break across plugin boundaries.

## The Pattern: Reference-Only Plugin

A plugin with no user-invocable skills or commands — only shared convention files consumed via relative paths.

```
plugins/jx-core/              # Reference-only
├── .claude-plugin/plugin.json # No commands, no skills
├── README.md
└── _shared/
    ├── id-rules.md            # Consumed by jx-dev + jx-pm
    ├── docs-root.md           # Consumed by jx-dev + jx-pm
    └── task-json-schema.md    # Consumed by jx-dev + jx-pm
```

Consuming plugins reference via relative path from SKILL.md:
```
../../../jx-core/_shared/id-rules.md
```
(3 levels: `skill/` → `skills/` → `plugin/` → `plugins/jx-core/`)

## Plugin Dependencies Declaration

Each consuming plugin declares dependencies in `plugin.json`:

```json
{
  "name": "jx-dev",
  "version": "1.0.0",
  "dependencies": ["jx-core"]
}
```

This is a new convention — existing plugins didn't use `dependencies` before the jx-pm split. Sibling layout assumed (all plugins under `plugins/`).

## Env Var Migration Precedence

When extracting shared conventions, env vars need a precedence chain for backward compatibility:

```
$JX_DOCS_ROOT > $JX_PM_DOCS_ROOT (backward compat fallback) > default docs/
```

Can't just rename — must support both during transition.

## Key Learnings

1. **Reference-only plugins are valid** — exempt from `commands/` directory requirement
2. **Path anchoring matters** — relative paths resolve from the consuming SKILL.md, not from the shared file
3. **Deferred chaining avoids scope explosion** — cross-plugin orchestration is a separate concern from shared conventions
4. **Pipeline reduction over cross-plugin orchestration** — reduce to single-skill delegation until chaining designed
5. **Adversarial review catches resolution-induced regressions** — round 2 finds issues created by round 1 fixes

## Related

- [[Shared Reference Extraction]] — intra-plugin version of this pattern (`_shared/` within one plugin)
- [[Plugin Architecture]] — plugin structure conventions, now includes dependency declaration
- [[Configurable Default Chain]] — env var resolution used by shared conventions
- [[Skill Chaining]] — cross-plugin chaining deferred during this split
- [[Product Management Skills Plugin]] — origin of this pattern (jx-pm split)
- [[Iterative Adversarial Review]] — used to harden the split design

## Sources
- [[Source - Split Tech Spec Idea]]
- [[Source - Cross-Plugin Convention Layer]]
