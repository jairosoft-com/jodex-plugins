---
title: "Source - jx-dev Spec Command"
type: source
tags: [jx-dev, command, spec, techspec]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-dev/commands/spec.md"
source_hash: "70a8d851fbdc2934eac2870dcbd5eebc32cba79693892e7fd85bffc18c9ef684"
---

# Source - jx-dev Spec Command

## Metadata
- **Original path**: plugins/jx-dev/commands/spec.md
- **SHA-256**: 70a8d851fbdc2934eac2870dcbd5eebc32cba79693892e7fd85bffc18c9ef684

## Summary

Defines the `/jx-dev:spec` slash command, which generates a framework-agnostic Technical Design Document from a PRD. Supports `--docs-root` argument. Unlike the former `/jx-pm:techspec`, this command has no `--chain` or `--chain-all` flags -- cross-plugin chaining was removed during the plugin split.

## Key Concepts
- Technical specification generation from PRD input
- Renamed from `techspec` to `spec` during plugin split
- No skill chaining flags (cross-plugin chaining deferred)
- Slash command frontmatter format (description, argument-hint, allowed-tools)

## Relation to jx-pm

Post-split canonical location. The former `/jx-pm:techspec` command (see [[Source - jx-pm Techspec Command]]) included `--chain` and `--chain-all` flags that are absent here.

## Pages Created
None
