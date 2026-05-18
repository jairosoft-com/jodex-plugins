---
description: Sync PRD to Azure Boards (Features, Stories)
argument-hint: "[--dry-run] [--tenant <org>/<project>] [--docs-root <path>] [--new-tenant]"
allowed-tools: Bash(ls:*), Read, Write, Bash(python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/frontmatter-sync.py":*), mcp__azure-devops__wit_create_work_item, mcp__azure-devops__wit_update_work_item, mcp__azure-devops__wit_get_work_item, mcp__azure-devops__wit_add_child_work_items, mcp__azure-devops__wit_get_work_items_batch_by_ids, mcp__azure-devops__search_workitem, mcp__azure-devops__core_list_projects
---

Synchronize PRD to Azure Boards using the `jx-pm:ado` skill.

$ARGUMENTS
