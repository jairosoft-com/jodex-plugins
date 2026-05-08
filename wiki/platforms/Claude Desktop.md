---
title: Claude Desktop
type: platform
tags: [claude, desktop, mcp]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
aliases: [Desktop]
provenance: source-derived
---

# Claude Desktop

Anthropic's desktop application for Claude. Relies exclusively on the Model Context Protocol ([[MCP Server]]) for extensibility.

## Architecture

- Connects to standalone [[MCP Server]]s via standard I/O (`stdio`) or HTTP/SSE
- Each server exposes [[MCP Tool]]s that Claude can invoke
- No support for the `.claude-plugin` format used by [[Claude Code CLI]]

## Distribution

- **Connectors directory** — closed, curated marketplace managed by [[Anthropic]] (Jira, Slack, Google Drive, etc.)
- **No open public registry** for independent developers to publish
- Custom MCP servers must be manually added to `claude_desktop_config.json`

## WSL Integration

For developers in WSL Ubuntu running Desktop on Windows 11, `wsl.exe` bridges into the Linux environment:
```json
{
  "mcpServers": {
    "server-name": {
      "command": "wsl.exe",
      "args": ["-d", "Ubuntu", "--", "bash", "-c", "cd /path && npm run start-mcp"]
    }
  }
}
```

## Migration from CLI Plugins

To use a [[Claude Code CLI]] plugin (e.g., `jodex-qa-ai`) in Desktop:
1. Wrap plugin logic in an [[MCP Server]] using MCP SDK (TypeScript/Python)
2. Register CLI [[Skill]]s as [[MCP Tool]]s
3. Configure Desktop to execute the server inside [[WSL]] via `wsl.exe`

> [!conflict] WSL config example path
> [[Source - Claude CLI vs Desktop MCP Guide]] and [[Source - Claude Desktop WSL Integration]] both provide the same WSL `wsl.exe` configuration JSON block with identical structure. No factual conflict — both sources agree on the approach.

## Sources
- [[Source - Claude CLI vs Desktop MCP Guide]]
- [[Source - Claude Desktop WSL Integration]]
