---
title: "Source - jx-pm Plugin README"
type: source
tags: [jx-pm, plugin, pipeline, overview]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/README.md
provenance: source-derived
---

# Source - jx-pm Plugin README

## Metadata
- **Original path**: plugins/jx-pm/README.md
- **SHA-256**: bd744d1de54ff1d95cd38b7b94ba6f965280ac44d969f99bbb36f0044152bb33
- **Size**: 1336 bytes

## Summary

Top-level README for the jx-pm plugin, which provides product management skills for generating PRDs, tech specs, task breakdowns, and syncing to Azure Boards. Documents the five skills (prd, techspec, task, ado, pipeline), their commands, the pipeline chain order, output file structure, configuration options, and installation instructions.

## Key Concepts
- Five-skill plugin architecture: prd, techspec, task, ado, pipeline
- Pipeline chain: prd → techspec → task → ado
- `--chain` and `--chain-all` flags for skill chaining
- Output directory convention: `docs/{NNN}_{feature_name}/`
- Configuration via `--docs-root` flag or `JX_PM_DOCS_ROOT` env var
- ADO tenant binding on first sync

## Pages Created
None
