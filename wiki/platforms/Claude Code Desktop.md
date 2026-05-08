---
title: Claude Code Desktop
type: platform
tags: [claude, desktop, plugin-system]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [Code Desktop, Claude Code desktop app]
provenance: synthesis
---

# Claude Code Desktop

Desktop application version of [[Claude Code CLI]]. Available on Mac and Windows.

## Shared Plugin Registry

Claude Code Desktop and [[Claude Code CLI]] share the same plugin registry at `~/.claude/plugins/installed_plugins.json`. Plugins installed via CLI (`/plugin install`) appear in Desktop and vice versa. If a plugin is not installed in CLI, it will not be available in Desktop.

See [[Plugin Architecture#Plugin Registry]] for file format details.

This means the [[Plugin Architecture]] and [[Marketplace]] system applies equally to both surfaces.

## Distinction from [[Claude Desktop]]

| | Claude Code Desktop | Claude Desktop |
|---|---|---|
| **Extensibility** | [[Plugin Architecture]] (`.claude-plugin`) | [[MCP Server]] only |
| **Plugin registry** | Shared with [[Claude Code CLI]] | Connectors directory (closed) |
| **Target user** | Developers | General users |

[[Codex Desktop]] also shares the same plugin registry.

## Sources
- (synthesis — observed behavior, 2026-05-08)
