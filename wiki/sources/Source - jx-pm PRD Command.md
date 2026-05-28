---
title: "Source - jx-pm PRD Command"
type: source
tags: [jx-pm, command, prd, skill-chaining]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/commands/prd.md
provenance: source-derived
---

# Source - jx-pm PRD Command

## Metadata
- **Original path**: plugins/jx-pm/commands/prd.md
- **SHA-256**: 934d81291b648ba277e41cba50f1427048c6ca83ead4e56f6c5b8ea9b8eea568
- **Size**: 519 bytes

## Summary

Defines the `/jx-pm:prd` slash command, which generates a Product Requirements Document in one of three modes: lite, standard PRD, or unified BRD-PRD. Supports `--chain` to auto-invoke `/jx-pm:techspec` after completion, and `--chain-all` to run the full pipeline. Uses Bash, Read, and Write tools.

## Key Concepts
- PRD generation with mode flags (lite, prd, unified)
- Skill chaining via `--chain` and `--chain-all` flags
- Configurable default chain pattern
- Slash command frontmatter format (description, argument-hint, allowed-tools)

## Pages Created
None
