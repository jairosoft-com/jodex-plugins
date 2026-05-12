---
title: Client-Specific MCP Boundary
type: concept
tags: [mcp, claude-code, azure-devops, integration, boundary]
created: 2026-05-12
updated: 2026-05-12
source_count: 0
aliases: [client-specific MCP installation, MCP client boundary, MCP transport boundary]
provenance: synthesis
---

# Client-Specific MCP Boundary

Client-Specific MCP Boundary is the rule that an MCP server's availability for one client or transport does not prove it is ready for every Claude-facing surface. MCP setup instructions must name the client, transport, authentication path, and verification command they apply to.

## Pattern

Document MCP setup by exact runtime surface:

| Surface | Setup Boundary |
|---------|----------------|
| [[Claude Code CLI]] | `claude mcp add`, `claude mcp list`, and `/mcp` inside a Code session |
| [[Claude Code Desktop]] | Shared Claude Code MCP registry from `~/.claude.json` or `.mcp.json` |
| [[Claude Desktop]] | Separate `claude_desktop_config.json` connector configuration |
| VS Code or Visual Studio | Client-specific remote MCP configuration documented by that product |

Do not promote a remote MCP preview or hosted transport into onboarding for another client until the vendor documents that client path.

## Jodex Instance

For Azure DevOps, the onboarding conclusion is client-specific:

- Claude Code developers should install the local stdio Azure DevOps MCP server with `claude mcp add azure-devops -- npx -y @azure-devops/mcp <organization>`.
- Claude Code Desktop can use the same Claude Code MCP registry.
- Microsoft's hosted remote Azure DevOps MCP preview is documented for Visual Studio and Visual Studio Code, so it is not the Claude Code onboarding path until that support is documented.

## Why It Matters

Jodex workflows cross several integration surfaces: plugin registry, local slash commands, MCP servers, and hosted Azure DevOps. Treating "MCP exists" as a generic fact risks giving a developer setup steps that work in one client but fail in another. The safer pattern is to bind each instruction to the client where it was verified.

## Related

- [[MCP Server]]
- [[MCP Tool]]
- [[Claude Code CLI]]
- [[Claude Code Desktop]]
- [[JX Dev Onboarding]]
- [[MCP Tool Surface Alignment Gate]]

## Sources

- [[JX Dev Onboarding]]
- [Microsoft Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp)
- [Azure DevOps MCP Server getting started - Claude Code](https://github.com/microsoft/azure-devops-mcp/blob/main/docs/GETTINGSTARTED.md#-using-mcp-server-with-claude-code)
- [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp)
- [Azure DevOps remote MCP server preview](https://learn.microsoft.com/en-us/azure/devops/mcp-server/remote-mcp-server?view=azure-devops)
