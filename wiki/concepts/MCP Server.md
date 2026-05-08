---
title: MCP Server
type: concept
tags: [protocol, mcp, architecture]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [Model Context Protocol Server]
provenance: source-derived
---

# MCP Server

A standalone server implementing the Model Context Protocol. The exclusive extensibility mechanism for [[Claude Desktop]]. Exposes [[MCP Tool]]s that Claude can invoke.

## Communication

- **stdio** — standard input/output (most common for local servers)
- **HTTP/SSE** — for remote/networked servers

## Migration Path

To bring a [[Claude Code CLI]] plugin to Desktop:
1. Rewrite entry point using official MCP SDK (TypeScript/Python)
2. Register CLI [[Skill]]s as [[MCP Tool]]s
3. Host on GitHub or npm
4. Users manually add to `claude_desktop_config.json`

## Sources
- [[Source - Claude CLI vs Desktop MCP Guide]]
