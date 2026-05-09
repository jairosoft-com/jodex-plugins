---
title: "Source - Azure Boards Sync SKILL"
type: source
tags: [skill, jx-pm, ado, azure-devops, sync, external-system]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/ado/SKILL.md
provenance: source-derived
---

# Source - Azure Boards Sync SKILL

## Metadata
- **Original path**: plugins/jx-pm/skills/ado/SKILL.md
- **SHA-256**: 4ab0cb42f26e601f7d8b907bfcb81c21da8a7e4390c4af4e75d40d4648e934aa
- **Size**: 9486 bytes

## Summary

The Azure Boards Sync skill synchronizes task.json to Azure DevOps Boards via MCP tools. It creates a Feature → User Stories → Tasks hierarchy, supports five modes (normal, partial, update, force recreate, state sync), and includes tenant binding, hierarchy reconciliation, per-item write-back, crash recovery via [[Fail-Closed Lookup]], and bottom-up state synchronization from `passes` flags.

## Key Concepts
- [[Tenant Binding]] — task.json is authoritative for Azure org/project binding; memory is suggestion only
- [[Per-Item Write-Back]] — writes `azureWorkItemId` to task.json after each individual create
- [[Fail-Closed Lookup]] — crash recovery searches Azure by title; exactly 1 match or halt
- [[Tombstone Pattern]] — tombstoned items skipped for creation, reported in dry-run, closeable with `--prune`
- [[User Confirmation Gate]] — destructive operations require typed confirmation (recreate, sync, rebind, prune)
- Hierarchy reconciliation — verifies parent-child links in Azure before creating new items
- State sync — bottom-up state transitions (Tasks → Stories → Feature) based on `passes` flags
- Gherkin synthesis — generates Gherkin from behavioral acceptance criteria for Azure Story AC field
- Five sync modes — Normal, Partial, Update, Force recreate, State sync
- [[Multi-Phase Skill]] — 8 phases: validation, tenant binding, sync detection, reconciliation, create/update, state sync, prune, report
- [[Configurable Default Chain]] — docs-root resolution and tenant override via `--tenant` flag

## Pages Created
- [[Tenant Binding]]
