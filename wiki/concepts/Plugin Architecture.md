---
title: Plugin Architecture
type: concept
tags: [architecture, plugin, claude-code]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [.claude-plugin format, plugin format]
provenance: source-derived
---

# Plugin Architecture

The proprietary extensibility format used by [[Claude Code CLI]]. A plugin is a directory with a `.claude-plugin/plugin.json` manifest containing commands, skills, and supporting infrastructure.

## Plugin Structure

```
plugin-name/
├── .claude-plugin/plugin.json    # Manifest (name, version, description, author)
├── commands/                     # [[Slash Command]] definitions (.md files)
├── skills/                       # [[Skill]] implementations (subdirectories)
├── scripts/                      # Helper scripts (pinned executables)
├── agents/                       # Custom subagents
├── hooks/                        # [[Hook]] lifecycle handlers
├── prompts/                      # Shared prompt fragments
├── schemas/                      # Output schemas
└── README.md
```

## Not Compatible with [[Claude Desktop]]

Desktop uses [[MCP Server]] protocol exclusively. Migration requires rewriting as MCP server.

## Sources
- [[Source - Claude CLI vs Desktop MCP Guide]]
