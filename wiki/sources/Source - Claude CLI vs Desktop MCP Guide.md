---
title: Source - Claude CLI vs Desktop MCP Guide
type: source
tags: [architecture, migration, mcp]
created: 2026-05-07
updated: 2026-05-07
raw_path: wiki/raw/sources/7b7bcbf6-claude_cli_vs_desktop_mcp_guide.md
provenance: source-derived
---

# Source - Claude CLI vs Desktop MCP Guide

## Metadata
- **Original path**: ai_docs/claude_cli_vs_desktop_mcp_guide.md
- **SHA-256**: 7b7bcbf6519313d03262c507eb83bfed1b88733cc5a9243bf26db89edb9d2b63
- **Size**: 3,104 bytes

## Summary

Explains the fundamental architectural difference between Claude Code CLI (proprietary `.claude-plugin` format) and Claude Desktop (MCP-only). Covers migration path from CLI plugin to MCP server, and WSL integration for running MCP servers from Ubuntu inside Desktop on Windows 11.

## Key Topics

- [[Plugin Architecture]] vs [[MCP Server]] architecture
- [[Claude Code CLI]] components: [[Skill]], [[Slash Command]], [[Hook]], Agents, Prompts
- [[Claude Desktop]] Connectors directory (closed marketplace by [[Anthropic]])
- Migration: rewrite as MCP SDK, register skills as [[MCP Tool]]s
- WSL bridging via `wsl.exe` for cross-platform development

## Entities/Concepts Extracted
- 2 platform pages (Claude Code CLI, Claude Desktop)
- 5 concept pages (MCP Server, MCP Tool, Plugin Architecture, Skill, Slash Command, Hook)
- 1 entity page (Anthropic)
