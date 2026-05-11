---
title: "Source - jx-dev Plugin README"
type: source
tags: [jx-dev, plugin, developer-skills, overview]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-dev/README.md"
source_hash: "dfb72ba23fd36ba86c044f5d78b4cc7f1c63ee2188d7941d3ab263f433e3a98e"
---

# Source - jx-dev Plugin README

## Metadata
- **Original path**: plugins/jx-dev/README.md
- **SHA-256**: dfb72ba23fd36ba86c044f5d78b4cc7f1c63ee2188d7941d3ab263f433e3a98e

## Summary

Top-level README for the jx-dev plugin, created during the jx-pm plugin split. Contains two developer-oriented skills: `spec` (technical specification generation) and `task` (task JSON conversion). Declares a dependency on jx-core for shared conventions (ID rules, docs-root resolution, task JSON schema). Documents environment variable precedence: `$JX_DOCS_ROOT` > `$JX_PM_DOCS_ROOT` > `docs/`.

## Key Concepts
- Two-skill developer plugin: spec and task
- Dependency on [[Cross-Plugin Shared Convention Layer]] (jx-core)
- Environment variable precedence for docs-root resolution
- Post-split plugin: skills moved from jx-pm to jx-dev

## Relation to jx-pm

This plugin was created during the jx-pm split. The techspec and task skills were moved here and renamed (techspec became spec). See also [[Source - jx-pm Plugin README]] for the pre-split version.

## Pages Created
None
