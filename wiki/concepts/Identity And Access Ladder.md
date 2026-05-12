---
title: Identity And Access Ladder
type: concept
tags: [onboarding, identity, access-control, setup, workflow]
created: 2026-05-12
updated: 2026-05-12
source_count: 0
aliases: [access ladder, identity ladder, onboarding access ladder]
provenance: synthesis
---

# Identity And Access Ladder

Identity And Access Ladder is the pattern that product onboarding must verify account identity, enterprise membership, repository access, local credentials, and MCP tool access in dependency order before the first plugin workflow can be trusted.

This is a product-owner refinement of [[Layered Developer Onboarding]]. The durable lesson from [[JX PM Onboarding]] is that a PM setup guide is not only a tool-install checklist. It is an access-readiness sequence crossing Claude/Anthropic, GitHub, Azure DevOps, local Git clients, and Claude Code MCP servers.

## Pattern

Use this order for product-owner onboarding:

1. Create or sign in to the Anthropic account with the assigned company identity.
2. Confirm enterprise membership before installing or troubleshooting Claude Code.
3. Create and verify the GitHub account used by GitHub Desktop, GitHub CLI, and VS Code.
4. Confirm Azure DevOps project and Azure Repos access before clone attempts.
5. Install and verify local credentials with Git SCM, Git Credential Manager, `gh auth status`, and `az account show`.
6. Clone the repo only after the identity-bearing URL and credential path are correct.
7. Add MCP servers only after CLI auth, repo access, and local clone are verified.
8. Run the first Jodex workflow only after tool access and service access agree.

## Correlated Systems

| System | Onboarding Question |
|--------|---------------------|
| Anthropic | Is the Gerasoft email added to Anthropic Enterprise by CHOF or Ramon? |
| GitHub | Is the GitHub account verified and used for Desktop, CLI, and VS Code sign-in? |
| Azure DevOps | Can the user open the project and see `Repos` -> `Files`? |
| GitHub Desktop | Is Git Credential Manager enabled before cloning Azure Repos by URL? |
| Azure CLI | Does `az account show` prove the active Azure sign-in? |
| GitHub CLI | Does `gh auth status` prove the active GitHub sign-in? |
| MCP | Do `claude mcp get azure-devops` and `claude mcp get github` show the expected local tool surfaces? |

## Failure Prevention

- Do not troubleshoot Claude Code before Enterprise membership is confirmed.
- Do not troubleshoot GitHub Desktop clone failures before Azure Repos access and the username-bearing clone URL are verified.
- Do not document `az auth status`; Azure CLI uses `az account show` for the active sign-in check.
- Do not configure Azure DevOps MCP or GitHub MCP before the underlying CLI, credential, and service access checks pass.
- Do not use generated Git credentials, PATs, or MCP tokens in docs, screenshots, tickets, or chat transcripts.

## Related

- [[JX PM Onboarding]]
- [[Layered Developer Onboarding]]
- [[Executable Setup Documentation]]
- [[Client-Specific MCP Boundary]]
- [[MCP Tool Surface Alignment Gate]]

## Sources

- [[JX PM Onboarding]]
- [[Layered Developer Onboarding]]
- [[Client-Specific MCP Boundary]]
- [[MCP Tool Surface Alignment Gate]]
