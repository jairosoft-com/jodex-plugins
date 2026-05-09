---
title: "Source - Docs Root Config"
type: source
tags: [skill, jx-pm, shared, configuration]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/_shared/docs-root.md
provenance: source-derived
---

# Source - Docs Root Config

## Metadata
- **Original path**: plugins/jx-pm/skills/_shared/docs-root.md
- **SHA-256**: bdc3d6535b07835db7586b62e2d8221f29b30f7062b0ef5125e83880669d3cc8
- **Size**: 839 bytes

## Summary

Shared configuration file referenced by all jx-pm skills for output directory resolution. Defines the three-level resolution order (`--docs-root` flag → `$JX_PM_DOCS_ROOT` env var → `docs/` default) and the standard output folder structure for PRD, TECH_SPEC, and task.json files.

## Key Concepts
- [[Configurable Default Chain]] — three-level resolution: CLI flag → env var → hardcoded default
- [[Shared Reference Extraction]] — canonical reference for docs-root logic, included by all skills
- Output folder structure — `{docs_root}/{NNN}_{feature_name}/` containing PRD.md, TECH_SPEC.md, task.json
- Path passing between skills — when `--chain` is active, folder path is passed without re-prompting

## Pages Created
None
