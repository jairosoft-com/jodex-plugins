---
title: "Source - ADO Command"
type: source
tags: [jx-pm, ado, command, azure-boards]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/commands/ado.md
provenance: source-derived
---

# Source - ADO Command

## Metadata
- **Original path**: plugins/jx-pm/commands/ado.md
- **SHA-256**: 690a24f7aeadab80aecf61861a749c9eecb06f8f48cd34d34b0e77f45ee9b2a6
- **Size**: 593 bytes

## Summary

Command definition file for the `/jx-pm:ado` slash command. Syncs task.json to Azure Boards, creating and updating Features, Stories, and Tasks. Supports flags for dry-run, tenant override, docs-root path, pruning, and new-tenant setup. Grants access to Bash (ls only), Read, Write, and specific Azure DevOps MCP tools for work item CRUD and linking.

## Key Concepts
- Slash command: `/jx-pm:ado`
- Allowed tools whitelist pattern (security boundary)
- `$ARGUMENTS` placeholder for runtime argument injection
- Flags: `--dry-run`, `--tenant`, `--docs-root`, `--prune`, `--new-tenant`
- MCP tool access: wit_create, wit_update, wit_get, wit_add_child, wit_link, wit_get_batch, search_workitem

## Pages Created
None
