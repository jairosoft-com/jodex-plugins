---
title: Claude Code CLI
type: platform
tags: [claude, cli, plugin-system]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
aliases: [Claude Code, CLI]
provenance: source-derived
---

# Claude Code CLI

Anthropic's command-line interface for Claude. Uses a proprietary [[Plugin Architecture]] (`.claude-plugin` format) for extensibility.

## Components

- **[[Skill]]** — multi-phase instructional modules that power slash commands
- **[[Slash Command]]** — user-facing command wrappers (`/plugin-name:command`)
- **[[Hook]]** — lifecycle event handlers (SessionStart, Stop, etc.)
- **Agents** — custom subagents
- **Prompts** — shared prompt fragments

## Distribution

Plugins installed from GitHub via marketplace command:
```
claude /plugin marketplace add <repo>
```

## Key Difference from [[Claude Desktop]]

CLI uses the `.claude-plugin` format; Desktop relies exclusively on [[MCP Server]] protocol. These are completely different architectures. Migrating from CLI to Desktop requires converting to an MCP server.

## Sources
- [[Source - Claude CLI vs Desktop MCP Guide]]
- [[Source - Claude Desktop WSL Integration]]
