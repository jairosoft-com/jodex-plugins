---
title: Plugin Dependency Declaration
type: concept
tags: [plugin, convention, dependency, architecture]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
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

## Related

- [[Cross-Plugin Shared Convention Layer]] — the pattern this convention enables
- [[Plugin Architecture]] — broader plugin structure
- [[Configurable Default Chain]] — shared convention consumed via this dependency

## Sources
- [[Source - Plugin Split Implementation Plan]]
