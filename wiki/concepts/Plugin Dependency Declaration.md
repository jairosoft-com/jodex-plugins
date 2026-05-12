---
title: Plugin Dependency Declaration
type: concept
tags: [plugin, convention, dependency, architecture]
created: 2026-05-09
updated: 2026-05-12
source_count: 3
aliases: [plugin dependencies, dependency field]
provenance: source-derived
---

# Plugin Dependency Declaration

Convention for declaring inter-plugin dependencies in `plugin.json` using a `dependencies` array field.

## Format

```json
{
  "name": "jx-dev",
  "version": "1.0.0",
  "description": "Developer skills: generate technical specifications and task breakdowns from PRDs.",
  "author": { "name": "Jairosoft", "email": "ramon@jairosoft.com" },
  "dependencies": ["jx-core"]
}
```

## Rules

- `dependencies` is an array of plugin names (strings)
- Dependent plugins assume sibling layout: all under `plugins/`
- Reference-only plugins (like jx-core) have NO dependencies field
- This is a new convention — existing plugins prior to jx-pm split did not use it

The field is documentation and install-order contract, not a runtime import system. A consuming plugin still references files by explicit relative path, but the dependency declaration tells maintainers, installers, and reviewers which sibling plugin must be present for those paths to resolve.

## Current Dependency Graph

```
jx-core (no deps)
  ↑
  ├── jx-dev (depends on jx-core)
  └── jx-pm (depends on jx-core)

jx-qa (no deps)
jx-kb (no deps)
```

## Why Not Symlinks or Duplication

| Approach | Problem |
|----------|---------|
| Duplicate shared files | Content drift between copies |
| Symlink | Hard filesystem dependency, breaks on some platforms |
| Dependency declaration | Explicit, verifiable, single source of truth in jx-core |

## Verification Use

Dependency declarations make split-plugin reviews concrete. Reviewers can compare `plugin.json` dependencies against every cross-plugin file reference and reject a split when a plugin consumes `jx-core` conventions without declaring the dependency.

## Related

- [[Cross-Plugin Shared Convention Layer]] — the pattern this convention enables
- [[Plugin Architecture]] — broader plugin structure
- [[Configurable Default Chain]] — shared convention consumed via this dependency

## Sources
- [[Source - Plugin Split Implementation Plan]]
- [[Source - jx-core Plugin README]]
- [[Source - jx-dev Plugin README]]
