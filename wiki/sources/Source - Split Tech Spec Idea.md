---
title: Source - Split Tech Spec Idea
type: source
tags: [plugin-architecture, jx-dev, jx-core, refactor]
created: 2026-05-09
updated: 2026-05-09
raw_path: wiki/raw/sources/a916add6-Split Tech Spec Into jx-dev Plugin.md
source_count: 1
aliases: [Split Tech Spec source]
provenance: source-derived
---

# Source - Split Tech Spec Idea

Completed idea document describing the extraction of developer-facing skills (techspec, task) from `jx-pm` into a new `jx-dev` plugin, and shared conventions into a new `jx-core` reference-only plugin.

## Key Decisions Documented

- **Scope**: Move techspec → `/jx-dev:spec`, task → `/jx-dev:task`; keep prd, ado, pipeline in jx-pm
- **Shared conventions**: Extract id-rules, docs-root, task-json-schema to `plugins/jx-core/_shared/`
- **Reference mechanism**: Relative paths anchored from SKILL.md (3 levels up to reach jx-core)
- **Plugin dependencies**: New `"dependencies": ["jx-core"]` field in plugin.json
- **Env var migration**: `$JX_DOCS_ROOT` > `$JX_PM_DOCS_ROOT` (backward compat) > default `docs/`
- **Pipeline reduction**: `/jx-pm:pipeline` delegates to prd only until cross-plugin chaining designed
- **Chaining deferred**: All `--chain` / `--chain-all` flags removed; cross-plugin chaining logged as future work

## Entities/Concepts Referenced

- jx-dev plugin (new), jx-core plugin (new), jx-pm plugin (existing)
- [[Plugin Architecture]], [[Skill Chaining]], [[Shared Reference Extraction]], [[Configurable Default Chain]]
- [[Cross-Plugin Shared Convention Layer]], [[Iterative Adversarial Review]]
