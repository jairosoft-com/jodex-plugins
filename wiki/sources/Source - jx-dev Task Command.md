---
title: "Source - jx-dev Task Command"
type: source
tags: [jx-dev, command, task]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-dev/commands/task.md"
source_hash: "425c0de4186d3e47b699f6d4f11ee71c56ed8079653db66bfa3e6dbac5a0c4fd"
---

# Source - jx-dev Task Command

## Metadata
- **Original path**: plugins/jx-dev/commands/task.md
- **SHA-256**: 425c0de4186d3e47b699f6d4f11ee71c56ed8079653db66bfa3e6dbac5a0c4fd

## Summary

Defines the `/jx-dev:task` slash command, which converts PRD and TECH_SPEC documents into a canonical `task.json` for execution tracking. Supports `--docs-root` and `--force-overwrite` arguments. Unlike the former `/jx-pm:task`, this command has no `--chain` or `--chain-all` flags -- cross-plugin chaining was removed during the plugin split.

## Key Concepts
- Task decomposition from requirements documents (PRD + TECH_SPEC -> task.json)
- Force-overwrite flag for idempotent regeneration
- No skill chaining flags (cross-plugin chaining deferred)
- Canonical task.json as execution tracking artifact

## Relation to jx-pm

Post-split canonical location. The former `/jx-pm:task` command (see [[Source - jx-pm Task Command]]) included `--chain` and `--chain-all` flags that are absent here.

## Pages Created
None
