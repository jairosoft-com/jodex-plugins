---
title: Cross-Plugin Shared Convention Layer
type: idea
status: promoted
updated: 2026-05-09
promoted_to: concepts/Cross-Plugin Shared Convention Layer.md
created: 2026-05-09
source: jx-pm split implementation
provenance: source-derived
tags:
  - plugin-architecture
  - jx-core
  - pattern
links:
  - "[[Plugin Architecture]]"
  - "[[Configurable Default Chain]]"
  - "[[Split Tech Spec Into jx-dev Plugin]]"
---

# Cross-Plugin Shared Convention Layer

## Insight

When splitting a monolithic plugin into multiple plugins, shared conventions (ID rules, output directory resolution, JSON schemas) need a dedicated reference-only plugin (jx-core) rather than duplication or symlinks.

## Key Learnings from jx-pm Split

1. **Reference-only plugins are a valid plugin type** — no commands, no skills, just shared convention files consumed via relative paths
2. **Relative paths must be anchored from SKILL.md** — the consuming file's location determines path depth (3 levels: `skill/ → skills/ → plugin/ → plugins/jx-core/`)
3. **Plugin dependencies need explicit declaration** — new `"dependencies": ["jx-core"]` field in plugin.json; existing plugins didn't have this convention
4. **Env var migration needs precedence chain** — `$JX_DOCS_ROOT` > `$JX_PM_DOCS_ROOT` (backward compat) > default; can't just rename
5. **Deferred chaining avoids scope explosion** — cross-plugin orchestration is a separate concern from shared conventions
6. **Pipeline reduction is safer than cross-plugin orchestration** — reduce pipeline to single-skill delegation until chaining is designed
7. **Adversarial review catches resolution-induced regressions** — round 2 found issues created by round 1 fixes (e.g., pipeline lost its task.json producer)

## Pattern: Shared Convention Plugin

```
plugins/jx-core/           # Reference-only
├── .claude-plugin/plugin.json  # No dependencies field
├── README.md
└── _shared/
    ├── convention-a.md     # Consumed by multiple plugins
    ├── convention-b.md
    └── schema-c.md
```

Consuming plugins reference via: `../../../jx-core/_shared/convention-a.md` from SKILL.md location.
