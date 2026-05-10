---
title: Plugin Architecture
type: concept
tags: [architecture, plugin, claude-code]
created: 2026-05-07
updated: 2026-05-09
source_count: 3
aliases: [.claude-plugin format, plugin format]
provenance: source-derived
---

# Plugin Architecture

The proprietary extensibility format used across [[Claude Code CLI]], [[Claude Code Desktop]], and [[Codex Desktop]]. A plugin is a directory with a `.claude-plugin/plugin.json` manifest containing commands, skills, and supporting infrastructure.

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

## Plugin Registry

Installed plugins tracked in a single shared file:

```
~/.claude/plugins/installed_plugins.json
```

JSON schema (version 2):
```json
{
  "version": 2,
  "plugins": {
    "name@marketplace": [
      {
        "scope": "user | project | local",
        "installPath": "...",
        "version": "...",
        "installedAt": "ISO-8601",
        "lastUpdated": "ISO-8601",
        "gitCommitSha": "...",
        "projectPath": "..."
      }
    ]
  }
}
```

This file is shared across [[Claude Code CLI]], [[Claude Code Desktop]], and [[Codex Desktop]] — single source of truth. Install via CLI marketplace commands or add directly to registry.

## Local Development

Use `--plugin-dir` flag to load from disk without marketplace install. See [[Local Plugin Development]].

## Compatible Platforms

Part of the [[Three-Surface Plugin Ecosystem]]:

- [[Claude Code CLI]] — install via `/plugin marketplace add` or `/plugin install`
- [[Claude Code Desktop]] — shared registry, plugins installed in CLI appear automatically
- [[Codex Desktop]] — shared registry, same mechanism

## Plugin Dependencies

Plugins can declare dependencies on other plugins via a `dependencies` field in `plugin.json`:

```json
{
  "name": "jx-dev",
  "version": "1.0.0",
  "dependencies": ["jx-core"]
}
```

Sibling layout assumed — all plugins under `plugins/`. See [[Cross-Plugin Shared Convention Layer]] for the reference-only plugin pattern that motivated this convention.

## Reference-Only Plugins

A plugin with no user-invocable skills or commands — only shared convention files consumed by other plugins via relative paths. Exempt from `commands/` directory requirement. Contains `plugin.json`, README, and `_shared/` convention files only. See [[Cross-Plugin Shared Convention Layer]].

## Dependencies

See [[Plugin Dependency Declaration]] for the `dependencies` array field convention in `plugin.json`.

## Not Compatible with [[Claude Desktop]]

[[Claude Desktop]] (consumer app) uses [[MCP Server]] protocol exclusively. Migration requires rewriting as MCP server.

## Sources
- [[Source - Claude CLI vs Desktop MCP Guide]]
- [[Source - Split Tech Spec Idea]]
- [[Source - Cross-Plugin Convention Layer]]
