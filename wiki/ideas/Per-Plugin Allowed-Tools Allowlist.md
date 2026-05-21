---
title: Per-Plugin Allowed-Tools Allowlist
type: idea
tags: [jx-skill, security, permissions, developer-experience]
created: 2026-05-20
updated: 2026-05-20
source_count: 0
aliases: [permission policy, tool allowlist, command permissions]
provenance: synthesis
status: backlogged
---

# Per-Plugin Allowed-Tools Allowlist

Add permission-aware scaffolding to `/jx-skill:create` so generated command stubs can select from audited per-plugin tool profiles rather than defaulting to minimal `Read` only.

## Motivation

- Generated command stubs currently default to `allowed-tools: Read` — safe but requires manual expansion
- No enforcement that expanded permissions stay within a plugin's intended scope
- Could pair with future `/jx-skill:validate` to audit existing command permissions

## Possible Approach

- Define per-plugin tool profiles (e.g., jx-kb allows `wiki-tools.py`, jx-qa allows `playwright-cli`)
- Scaffolder offers profile selection during creation
- Reject broad Bash/MCP grants unless pinned to a specific script

## Context

Surfaced during Codex adversarial review of `/jx-skill:create` plan (round 4). Not a blocker — v1 defaults to minimal permissions and authors expand manually, matching existing DX.

## Sources

- Codex adversarial review round 4 (2026-05-20)
