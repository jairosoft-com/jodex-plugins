---
title: Slash Command
type: concept
tags: [plugin, component, user-facing]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [command, commands, slash commands]
provenance: source-derived
---

# Slash Command

A user-facing command in [[Claude Code CLI]] plugins, invoked as `/plugin-name:command-name`. Thin wrapper that routes to a [[Skill]] implementation.

## Command File Format

Each command is a `.md` file in `commands/`:
```yaml
---
description: Short help text
argument-hint: "<arg1> [arg2]"
allowed-tools: Bash(...), Read, Write
---
```

Followed by routing text that passes `$ARGUMENTS` to the skill.

## Relationship to MCP

The [[Claude Desktop]] equivalent is an [[MCP Tool]] — a named capability exposed by an [[MCP Server]].

## Sources
- [[Source - Claude CLI vs Desktop MCP Guide]]
- [[Source - Browser Command]]
- [[Source - Extract Command]]
- [[Source - Generate Command]]
