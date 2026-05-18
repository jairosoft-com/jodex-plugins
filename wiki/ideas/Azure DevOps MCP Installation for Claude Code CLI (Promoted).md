---
title: Azure DevOps MCP Installation for Claude Code CLI (Promoted)
type: idea
tags: [documentation, onboarding, mcp, azure-devops, claude-code, cli]
created: 2026-05-14
updated: 2026-05-18
groomed: 2026-05-17
source_count: 0
aliases: [ADO MCP Setup Guide, Azure DevOps MCP CLI Setup]
provenance: model-derived
status: promoted
promoted_to: "code/Azure DevOps MCP Installation for Claude Code CLI.md"
---

# Azure DevOps MCP Installation for Claude Code CLI

Simple guide for installing and verifying the Azure DevOps MCP server in Claude Code CLI.

## Scope

### Installation

Prerequisites, then a single `claude mcp add` command per platform (macOS/Linux and Windows). Use `--authentication azcli` as the default path, with a PAT fallback note.

### Verification

Ordered checklist:

1. `claude mcp list` — server appears
2. `/mcp` in Claude Code — server connected
3. Ask Claude Code to list ADO projects — confirm the org and project name match the intended target
4. `/jx-pm:ado --dry-run --docs-root docs` — confirms tool surface and tenant binding before any live writes

## Acceptance Criteria

- [ ] One page, fits on a single screen
- [ ] Copy-paste install commands that work first try
- [ ] 4-step verification checklist ending with dry-run gate to confirm tenant binding
- [ ] PAT fallback uses env var (`AZURE_DEVOPS_EXT_PAT`), never inline tokens; includes warnings on expiration, least-privilege scope, and no secrets in repo files, shell history, or screenshots
- [ ] Cross-links to [[JX Foundational Onboarding]] and [[Client-Specific MCP Boundary]] for deeper context

## Destination

Promote to `code/` bucket as a how-to page.

## Related

- [[Client-Specific MCP Boundary]]
- [[Executable Setup Documentation]]
- [[JX Foundational Onboarding]]
