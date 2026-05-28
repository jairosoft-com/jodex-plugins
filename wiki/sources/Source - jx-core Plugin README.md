---
title: "Source - jx-core Plugin README"
type: source
tags: [jx-core, plugin, reference-only, shared-conventions]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-core/README.md"
source_hash: "a9fe90a36e3f812eeb8226f4fe837830745aaf149a3abb3b4dcb8f4ee3d790c0"
---

# Source - jx-core Plugin README

## Metadata
- **Original path**: plugins/jx-core/README.md
- **SHA-256**: a9fe90a36e3f812eeb8226f4fe837830745aaf149a3abb3b4dcb8f4ee3d790c0
- **Size**: 946 bytes
- **Raw snapshot**: wiki/raw/sources/a9fe90a3-README.md

## Summary

Top-level README for the jx-core plugin, a reference-only plugin created during the jx-pm split. jx-core has no commands or skills -- it provides shared convention files (`id-rules.md`, `docs-root.md`, `task-json-schema.md`) consumed by sibling plugins `jx-pm` and `jx-dev` via relative path references.

Documents the three shared convention files and their purposes, the sibling plugin layout (`jx-core`, `jx-pm`, `jx-dev`), and the relative path convention (`../../../jx-core/_shared/<file>.md` from SKILL.md).

## Key Concepts
- [[Cross-Plugin Shared Convention Layer]] -- jx-core is the canonical instance of the reference-only plugin pattern
- [[Plugin Architecture]] -- reference-only plugins are a valid type, exempt from `commands/` directory requirement
- [[Plugin Dependency Declaration]] -- sibling plugins declare `"dependencies": ["jx-core"]`
- [[Plugin Pipeline Sequence]] -- jx-core sits at the base of the PM-Dev pipeline dependency graph
- Relative path convention -- `../../../jx-core/_shared/<file>.md` resolves from `plugins/<plugin>/skills/<skill>/SKILL.md`

## Pages Created
None
