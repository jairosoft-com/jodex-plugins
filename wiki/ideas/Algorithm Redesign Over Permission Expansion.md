---
title: Algorithm Redesign Over Permission Expansion
type: idea
tags: [skill-design, security, permissions, design-pattern]
created: 2026-05-26
updated: 2026-05-28
source_count: 0
aliases: [permission minimization by redesign]
provenance: synthesis
status: completed
---

# Algorithm Redesign Over Permission Expansion

When a skill needs shell access only for search (e.g., grep), prefer redesigning the algorithm to use narrower tools (Read-based file scanning) rather than expanding the command's permission surface.

- Expanding `allowed-tools` to include Bash grants broader access than the skill actually needs
- Redesigning to scan `_index.md` + read individual pages achieves the same dedup/cross-reference goals within Read-only permissions
- Demonstrated in [[Knowledge Base Plugin|jx-kb]]'s insights skill: Codex review flagged unrestricted Bash → rewrote to Read-based scanning across 4 review rounds

Related: [[Pinned Helper]], [[Per-Plugin Allowed-Tools Allowlist]], [[User Confirmation Gate]]

## Sources
- Session: jx-kb insights skill (2026-05-26)
