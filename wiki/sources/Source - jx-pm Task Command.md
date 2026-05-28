---
title: "Source - jx-pm Task Command"
type: source
tags: [jx-pm, command, task, skill-chaining]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/commands/task.md
provenance: source-derived
---

# Source - jx-pm Task Command

## Metadata
- **Original path**: plugins/jx-pm/commands/task.md
- **SHA-256**: 3f9bc98fc3180ec2ad795a1883aa76a7c16aedaad0166cca88d4b73ea760eaf3
- **Size**: 536 bytes

## Summary

Defines the `/jx-pm:task` slash command, which converts PRD and TECH_SPEC documents into a canonical `task.json` for execution tracking. Supports `--chain` to auto-invoke `/jx-pm:ado` after completion, `--chain-all` for the full pipeline, and `--force-overwrite` to replace existing task files.

## Key Concepts
- Task decomposition from requirements documents (PRD + TECH_SPEC → task.json)
- Skill chaining via `--chain` and `--chain-all` flags
- Force-overwrite flag for idempotent regeneration
- Canonical task.json as execution tracking artifact

## Pages Created
None
