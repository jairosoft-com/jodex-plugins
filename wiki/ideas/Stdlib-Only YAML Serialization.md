---
title: Stdlib-Only YAML Serialization
type: idea
tags: [pattern, yaml, stdlib, frontmatter]
created: 2026-05-27
updated: 2026-05-28
source_count: 0
aliases: []
provenance: synthesis
status: completed
---

# Stdlib-Only YAML Serialization

Building YAML frontmatter for SKILL.md files without a PyYAML dependency, using narrow escaping rules for the known field set. Preserves the stdlib-only constraint of [[Pinned Helper]] scripts.

- Single-quote wrap values containing `: # " ' [ ] { }`, leading/trailing spaces, or `---`; double internal `'` characters
- `argument-hint` must use single-quotes (not double) because hints commonly contain embedded double quotes like `[--description "..."]`
- Multiline `description:` uses folded scalar (`>`) with 2-space indentation
- `allowed-tools:` uses folded scalar for multi-tool lists
- Parse-back verification: extract text between `---` fences, check required fields (`name`, `description`, `user-invocable`) are present and non-empty

Trade-off: this approach is fragile compared to a real YAML library but avoids adding an external dependency to plugin helper scripts. The narrow field set makes it tractable.

## Sources
- Session: jx-local create-skill implementation (2026-05-27)
