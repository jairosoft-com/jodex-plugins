---
description: Generate a PRD (lite, standard, or unified BRD-PRD)
argument-hint: "[--mode lite|prd|unified] [--docs-root <path>] [--chain] [--chain-all]"
allowed-tools: Bash(ls:*), Bash(mkdir:*), Read, Write
---

Generate a Product Requirements Document using the `jx-pm:prd` skill.

If `--chain` was provided, after the PRD skill completes, invoke `/jx-pm:techspec` with the same folder path.
If `--chain-all` was provided, after the PRD skill completes, invoke `/jx-pm:pipeline` with remaining skills.

$ARGUMENTS
