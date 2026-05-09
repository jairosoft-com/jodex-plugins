---
title: "Source - Pipeline Command"
type: source
tags: [jx-pm, pipeline, command, chain]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/commands/pipeline.md
provenance: source-derived
---

# Source - Pipeline Command

## Metadata
- **Original path**: plugins/jx-pm/commands/pipeline.md
- **SHA-256**: 81ce71fc18dad0c95e964066a2c77e49517e5039bb168a31a6cf1049a7b45ca9
- **Size**: 587 bytes

## Summary

Command definition file for the `/jx-pm:pipeline` slash command. Runs the full PM pipeline (PRD → Tech Spec → Task JSON → Azure sync) in a single invocation. Supports mode selection (lite, prd, unified), docs-root override, and skip-ado flag. Grants access to Bash (ls and mkdir), Read, Write, and the same Azure DevOps MCP tools as the ado command.

## Key Concepts
- Slash command: `/jx-pm:pipeline`
- Full chain execution in one command
- Mode flag: `--mode lite|prd|unified`
- `--skip-ado` flag to stop before Azure sync
- Superset of ado command tools (adds Bash mkdir)
- `$ARGUMENTS` placeholder pattern

## Pages Created
None
