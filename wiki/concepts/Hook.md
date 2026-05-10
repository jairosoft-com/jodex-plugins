---
title: Hook
type: concept
tags: [plugin, component, lifecycle]
created: 2026-05-07
updated: 2026-05-07
source_count: 3
aliases: [hooks, lifecycle hook]
provenance: source-derived
---

# Hook

A lifecycle event handler within a [[Claude Code CLI]] plugin. Hooks execute shell commands in response to events like SessionStart, SessionStop, and other lifecycle transitions.

## Part of [[Plugin Architecture]]

Hooks live in the `hooks/` directory of a plugin. They provide automation around [[Skill]] execution and session management.

## Sources
- [[Source - Claude CLI vs Desktop MCP Guide]]
- [[Source - JX QA Hooks Directory]]
- [[Source - jx-kb Hooks Guide]]
