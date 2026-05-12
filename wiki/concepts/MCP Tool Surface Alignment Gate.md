---
title: MCP Tool Surface Alignment Gate
type: concept
tags: [mcp, tool-surface, verification, azure-devops, safety]
created: 2026-05-12
updated: 2026-05-12
source_count: 0
aliases: [MCP tool alignment, tool surface gate, MCP allowlist gate]
provenance: synthesis
---

# MCP Tool Surface Alignment Gate

MCP Tool Surface Alignment Gate is the rule that MCP setup is not complete when a server starts. A workflow that depends on MCP tools must verify that the connected server exposes the exact capabilities expected by the plugin command before any external write operation runs.

## Pattern

For plugin workflows with MCP dependencies:

1. Identify the plugin command's `allowed-tools` surface.
2. Install and connect the MCP server.
3. Confirm the server appears in the client.
4. Compare the exposed tool names and capabilities with the command allowlist.
5. Run a read-only smoke test.
6. Run the workflow in dry-run mode before any live write.

This is a gate, not a troubleshooting afterthought.

## Jodex Instance

`/jx-pm:ado` declares explicit Azure DevOps MCP tools for work-item create, update, get, batch-get, search, and linking. The onboarding guide now treats this as a setup gate:

- `claude mcp list` must show the Azure DevOps server.
- `/mcp` must show the server connected inside Claude Code.
- Claude Code should be able to list projects or search work items before writes.
- The installed MCP tool names must match the `/jx-pm:ado` command allowlist.
- If the Azure DevOps MCP package changes tool naming, the plugin command manifest must be updated before live sync.

## Why It Matters

Jodex slash commands use narrow tool permissions as a safety boundary. That boundary only works when the documented MCP server and the command manifest agree on tool names. A mismatch can make a workflow fail at runtime or tempt a developer to broaden permissions instead of correcting the exact integration contract.

## Related

- [[MCP Tool]]
- [[Client-Specific MCP Boundary]]
- [[Product Management Skills Plugin]]
- [[User Confirmation Gate]]
- [[Fail-Closed Lookup]]
- [[Tenant Binding]]
- [[JX Dev Onboarding]]

## Sources

- [[JX Dev Onboarding]]
- [[Source - ADO Command]]
- [[Source - Azure Boards Sync SKILL]]
