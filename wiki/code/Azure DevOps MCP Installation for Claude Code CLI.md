---
title: Azure DevOps MCP Installation for Claude Code CLI
type: code
tags: [documentation, onboarding, mcp, azure-devops, claude-code, cli]
created: 2026-05-18
updated: 2026-05-18
source_count: 0
aliases: [ADO MCP Setup Guide, Azure DevOps MCP CLI Setup]
provenance: synthesis
---

# Azure DevOps MCP Installation for Claude Code CLI

Quick-reference for installing and verifying the Azure DevOps MCP server in [[Claude Code CLI]]. For full environment setup, complete [[JX Foundational Onboarding]] first. For why this guide is CLI-specific, see [[Client-Specific MCP Boundary]].

## Prerequisites

| Prerequisite | Verify |
|---|---|
| Node.js 20+ | `node --version` |
| Azure CLI signed in | `az account show` |
| Azure DevOps defaults set | `az devops project show` |
| Org short name known | `https://dev.azure.com/contoso` → use `contoso` |

## Install (Azure CLI Auth — Recommended)

macOS / Linux:

```bash
claude mcp add azure-devops --scope user -- npx -y @azure-devops/mcp <organization> --authentication azcli -d core work work-items search
```

Windows (native, not WSL):

```powershell
claude mcp add azure-devops --scope user -- cmd /c npx -y @azure-devops/mcp <organization> --authentication azcli -d core work work-items search
```

Replace `<organization>` with the org short name. `--scope user` makes the server available across all projects. The `-d core work work-items search` domain filter loads only the tools needed by Jodex commands.

## PAT Fallback

Use a Personal Access Token when Azure CLI auth is unavailable:

```bash
export AZURE_DEVOPS_EXT_PAT="<your-token>"
claude mcp add azure-devops --scope user -- npx -y @azure-devops/mcp <organization> --authentication pat -d core work work-items search
```

> **PAT security:**
> - Generate at `User settings → Personal access tokens` with scope **Work Items: Read & Write** and **Project and Team: Read** only.
> - Set an expiration date and rotate before it lapses.
> - Never put tokens in repo files, `.env` committed to Git, shell history, chat transcripts, or screenshots. Use a credential manager or unset the env var after the session.

## Verification Checklist

1. **Server registered** — `claude mcp list` shows `azure-devops`.
2. **Server connected** — `/mcp` inside Claude Code shows `azure-devops` connected.
3. **Org confirmed** — ask Claude Code to list Azure DevOps projects. Confirm the organization and project match the target configured via `az devops configure --defaults`.
4. **Dry-run gate** — `/jx-pm:ado --dry-run --docs-root docs` confirms the tool surface is reachable and [[Tenant Binding|tenant binding]] matches the correct ADO instance before any live writes.

## Wrong Org?

Remove and re-add with the correct organization:

```bash
claude mcp remove azure-devops
claude mcp add azure-devops --scope user -- npx -y @azure-devops/mcp <correct-organization> --authentication azcli -d core work work-items search
```

## Sources

- [[JX Foundational Onboarding]]
- [[JX Dev Onboarding]]
- [[Client-Specific MCP Boundary]]
- [[Executable Setup Documentation]]
