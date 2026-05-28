---
name: ado
user-invocable: true
argument-hint: "[--dry-run] [--tenant <org>/<project>] [--docs-root <path>] [--new-tenant]"
description: >
  Synchronize PRD.md / BRD_PRD.md to Azure Boards. Creates Feature and User Story hierarchy.
  Triggers on: sync to azure boards, create azure work items, populate boards from PRD.
  Do not trigger for: PRD generation, tech spec generation, task breakdown, wiki operations.
---

# Azure Boards Sync

**Fail-closed guard:** Before proceeding, verify `../../../jx-core/_shared/ado.md` is readable.
If the file cannot be read, halt immediately:
> "Error: jx-core shared ADO skill not found. Ensure the jx-core plugin is installed."

Follow all instructions in `../../../jx-core/_shared/ado.md`.
