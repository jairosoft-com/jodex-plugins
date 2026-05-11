---
title: Product Management Skills Plugin
type: plugin
tags: [plugin, product-management, brd, prd, ado, jx-pm]
created: 2026-05-09
updated: 2026-05-11
source_count: 3
aliases: [PM plugin, PO plugin, product owner skills, jx-pm]
provenance: synthesis
status: active
promoted_from: ideas/
---

# Product Management Skills Plugin

Plugin name: **jx-pm**. Product-management plugin for PRD generation, reduced pipeline orchestration, and Azure DevOps synchronization.

Developer-facing specification and task breakdown work moved to [[Developer Skills Plugin|jx-dev]]. Shared conventions moved to [[Core Shared Conventions Plugin|jx-core]].

## Current Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| prd | `/jx-pm:prd` | Generate BRD/PRD documents in lite, PRD, or unified modes |
| pipeline | `/jx-pm:pipeline` | Run the PM-side pipeline wrapper |
| ado | `/jx-pm:ado` | Sync canonical `task.json` to Azure Boards |

## Full Workflow

The complete PM-to-delivery workflow spans three plugins:

```
/jx-pm:prd   -> PRD.md
/jx-dev:spec -> TECH_SPEC.md
/jx-dev:task -> task.json
/jx-pm:ado   -> Azure work items
```

## Dependencies

- [[Core Shared Conventions Plugin|jx-core]] provides ID rules, docs-root resolution, and the task JSON schema.
- [[Developer Skills Plugin|jx-dev]] owns the technical specification and task conversion steps.

## Safety Contracts

- `task.json` is authoritative for Azure Boards binding once synchronized.
- ADO sync should preview tenant/org/project before writes.
- Work item IDs are written back to `task.json` so retries can resume without duplicating work.
- Force-recreate and state-sync style operations require explicit confirmation.

## Historical Notes

The original jx-pm design bundled PRD generation, technical specification generation, task conversion, and ADO sync in one plugin. The plugin split extracted technical specification and task conversion to `jx-dev`, and shared conventions to `jx-core`.

| Capability | Before | Current |
|------------|--------|---------|
| PRD generation | jx-pm | jx-pm |
| Technical specification | jx-pm | jx-dev |
| Task JSON conversion | jx-pm | jx-dev |
| ADO sync | jx-pm | jx-pm |
| Shared conventions | jx-pm local files | jx-core |

## Sources

- [[Source - jx-pm Plugin README]]
- [[Source - jx-dev Plugin README]]
- [[Source - jx-core Plugin README]]
