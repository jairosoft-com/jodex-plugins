---
title: WSL
type: platform
tags: [windows, linux, bridge]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [Windows Subsystem for Linux, WSL2]
provenance: source-derived
---

# WSL

Windows Subsystem for Linux. Serves as the integration bridge between [[Claude Desktop]] (Windows) and Linux-based tooling (Docker, Playwright, MCP servers).

## How It's Used

`wsl.exe` is a native Windows executable that [[Claude Desktop]] can invoke directly. It bridges into the Ubuntu distribution where [[MCP Server]]s, Docker containers, and browser automation tools run.

## Configuration Pattern

In `claude_desktop_config.json`:
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

Key flags:
- `-d Ubuntu` — targets specific WSL distribution
- `-- bash -c "..."` — runs command in Linux shell via stdio (required by MCP)

## Sources
- [[Source - Claude Desktop WSL Integration]]
