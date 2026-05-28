---
title: Executable Setup Documentation
type: concept
tags: [documentation, onboarding, verification, cli, security]
created: 2026-05-12
updated: 2026-05-12
source_count: 0
aliases: [verified setup docs, executable onboarding docs, CLI-verified documentation]
provenance: synthesis
---

# Executable Setup Documentation

Executable Setup Documentation is the pattern that onboarding command examples are treated as runnable integration surfaces, not prose. Any command that installs tooling, authenticates, registers MCP servers, changes local configuration, or handles credentials should be verified against the current CLI grammar before it becomes maintained guidance.

## Pattern

For onboarding and setup pages:

1. Verify command grammar with the live CLI help or current official documentation before publishing examples.
2. Keep flags and arguments in the exact order required by the installed tool.
3. Pair setup commands with read-only verification commands such as `gh auth status`, `az account show`, `claude mcp list`, or `claude mcp get <server>`.
4. Separate public configuration from secret entry.
5. Do not put generated Git credentials, PATs, passwords, or MCP tokens in clone URLs, screenshots, tickets, chat transcripts, or copy-paste command examples.
6. Prefer credential managers, secure prompts, or short-lived environment variables that are unset after use.
7. Re-run wiki checks after editing the maintained setup page.

## Jodex Instance

The [[JX PM Onboarding]] review surfaced two durable documentation risks:

- `claude mcp add` examples must match the local Claude Code CLI grammar. Options such as `--scope` and `--env` belong before the MCP server name for the current CLI shape.
- GitHub MCP setup examples should not model a PAT as an inline command value that can land in shell history or logs.

The lesson is broader than one command fix. Setup docs for [[MCP Server|MCP servers]], Azure Repos, GitHub Desktop, and Claude Code should be reviewed like executable examples with security side effects.

## Related

- [[JX PM Onboarding]]
- [[Identity And Access Ladder]]
- [[MCP Tool Surface Alignment Gate]]
- [[Client-Specific MCP Boundary]]
- [[Layered Developer Onboarding]]
- [[Pinned Helper]]

## Sources

- [[JX PM Onboarding]]
- [[Identity And Access Ladder]]
- [[MCP Tool Surface Alignment Gate]]
