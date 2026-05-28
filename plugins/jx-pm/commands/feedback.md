---
description: Capture feedback and create ADO Feature work item
argument-hint: "<feedback text>"
allowed-tools: Read, Write, Bash(python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py":*), mcp__azure-devops__wit_create_work_item, mcp__azure-devops__search_workitem, mcp__azure-devops__wit_get_work_item, mcp__azure-devops__core_list_projects
---

Capture user feedback and create an ADO Feature work item using the `jx-pm:feedback` skill.

$ARGUMENTS
