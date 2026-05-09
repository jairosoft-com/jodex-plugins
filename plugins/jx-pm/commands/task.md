---
description: Convert PRD + TECH_SPEC into task.json for execution tracking
argument-hint: "[--docs-root <path>] [--chain] [--chain-all] [--force-overwrite]"
allowed-tools: Bash(ls:*), Bash(mkdir:*), Read, Write
---

Convert requirements documents into canonical task.json using the `jx-pm:task` skill.

If `--chain` was provided, after the task skill completes, invoke `/jx-pm:ado` with the same folder path.
If `--chain-all` was provided, after the task skill completes, invoke `/jx-pm:pipeline` with remaining skills.

$ARGUMENTS
