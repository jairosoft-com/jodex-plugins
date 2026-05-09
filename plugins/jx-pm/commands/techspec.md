---
description: Generate a framework-agnostic technical specification from a PRD
argument-hint: "[--docs-root <path>] [--chain] [--chain-all]"
allowed-tools: Bash(ls:*), Bash(mkdir:*), Read, Write
---

Generate a Technical Design Document using the `jx-pm:techspec` skill.

If `--chain` was provided, after the TECH_SPEC skill completes, invoke `/jx-pm:task` with the same folder path.
If `--chain-all` was provided, after the TECH_SPEC skill completes, invoke `/jx-pm:pipeline` with remaining skills.

$ARGUMENTS
