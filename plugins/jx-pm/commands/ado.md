---
description: Sync task.json to Azure Boards (Features, Stories, Tasks)
argument-hint: "[--dry-run] [--tenant <org>/<project>] [--docs-root <path>] [--prune] [--new-tenant]"
allowed-tools: Bash(ls:*), Read, Write, mcp__azure-devops__wit_create_work_item, mcp__azure-devops__wit_update_work_item, mcp__azure-devops__wit_get_work_item, mcp__azure-devops__wit_add_child_work_items, mcp__azure-devops__wit_work_items_link, mcp__azure-devops__wit_get_work_items_batch_by_ids, mcp__azure-devops__search_workitem
---

Synchronize task.json to Azure Boards using the `jx-pm:ado` skill.

$ARGUMENTS
