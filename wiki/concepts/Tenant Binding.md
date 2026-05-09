---
title: Tenant Binding
type: concept
tags: [pattern, safety, sync, external-system, azure-devops]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
aliases: [tenant lock, org binding, project binding]
provenance: source-derived
---

# Tenant Binding

A safety pattern where the local data file (task.json) is authoritative for which external tenant (Azure organization/project) it is bound to. Agent memory provides suggestions, but task.json state is the source of truth.

## Binding Lifecycle

1. **First sync** — no Azure metadata in task.json. Agent memory suggests last-used org/project. User confirms or overrides. Binding written to task.json on first successful create.
2. **Subsequent syncs** — read `azureOrganization`/`azureProject` from task.json. If MCP connection targets a different tenant, HALT with mismatch error.
3. **Re-binding** (`--new-tenant`) — destructive operation requiring typed confirmation. Creates backup, strips existing Azure IDs, tombstones previous tenant references, proceeds with fresh sync.

## Design Principle

**File is authoritative. Memory is suggestion only.** This prevents accidental cross-tenant sync when an agent's memory drifts or when multiple projects share similar names.

## Related

- [[Per-Item Write-Back]] — binding is written immediately after first successful external create
- [[User Confirmation Gate]] — `--new-tenant` requires typed "rebind" confirmation
- [[Tombstone Pattern]] — re-binding tombstones previous tenant's Azure IDs

## Sources
- [[Source - Azure Boards Sync SKILL]]
