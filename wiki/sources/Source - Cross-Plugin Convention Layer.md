---
title: Source - Cross-Plugin Convention Layer
type: source
tags: [plugin-architecture, jx-core, pattern]
created: 2026-05-09
updated: 2026-05-09
raw_path: wiki/raw/sources/2ba0965d-Cross-Plugin Shared Convention Layer.md
source_count: 1
aliases: [Convention Layer source]
provenance: source-derived
---

# Source - Cross-Plugin Convention Layer

Insight document capturing the shared convention layer pattern that emerged from splitting jx-pm into jx-dev + jx-core.

## Key Learnings Documented

1. Reference-only plugins are a valid plugin type — no commands, no skills, just shared convention files
2. Relative paths must be anchored from SKILL.md location (determines path depth)
3. Plugin dependencies need explicit declaration via `"dependencies"` in plugin.json
4. Env var migration needs precedence chain, not just rename
5. Deferred chaining avoids scope explosion
6. Pipeline reduction is safer than cross-plugin orchestration
7. Adversarial review catches resolution-induced regressions across rounds

## Pattern Described

Shared Convention Plugin: a reference-only plugin (`jx-core`) consumed by multiple plugins via relative paths from SKILL.md locations.

## Concepts Referenced

- [[Cross-Plugin Shared Convention Layer]], [[Plugin Architecture]]
- [[Configurable Default Chain]], [[Shared Reference Extraction]]
- [[Split Tech Spec Into jx-dev Plugin]]
