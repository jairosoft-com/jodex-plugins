---
title: "Source - jx-pm Techspec Command"
type: source
tags: [jx-pm, command, techspec, skill-chaining]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/commands/techspec.md
provenance: source-derived
---

# Source - jx-pm Techspec Command

## Metadata
- **Original path**: plugins/jx-pm/commands/techspec.md
- **SHA-256**: cb8e8920d09d5f98224c652a2bf229fd00b7110abf85ad1bc881eed28009a2a9
- **Size**: 515 bytes

## Summary

Defines the `/jx-pm:techspec` slash command, which generates a framework-agnostic Technical Design Document from a PRD. Supports `--chain` to auto-invoke `/jx-pm:task` after completion, and `--chain-all` to run the full pipeline. Sits in the middle of the PRD → techspec → task chain.

## Key Concepts
- Technical specification generation from PRD input
- Framework-agnostic design document output
- Skill chaining: techspec chains to task (or full pipeline)
- Position in the jx-pm pipeline: PRD → techspec → task → ado

## Pages Created
None
