---
description: Run full PM pipeline (PRD → Tech Spec → Task JSON → Azure sync)
argument-hint: "[--mode lite|prd|unified] [--docs-root <path>] [--skip-ado]"
allowed-tools: Bash(ls:*), Bash(mkdir:*), Read, Write, mcp__azure-devops__wit_create_work_item, mcp__azure-devops__wit_update_work_item, mcp__azure-devops__wit_get_work_item, mcp__azure-devops__wit_add_child_work_items, mcp__azure-devops__wit_work_items_link, mcp__azure-devops__wit_get_work_items_batch_by_ids, mcp__azure-devops__search_workitem
---

Run the full PM pipeline using the `jx-pm:pipeline` skill.

$ARGUMENTS
