---
description: Run PRD generation pipeline
argument-hint: "[--mode lite|prd|unified] [--docs-root <path>]"
allowed-tools: Bash(ls:*), Bash(mkdir:*), Read, Write
---

Run the PRD pipeline using the `jx-pm:pipeline` skill.

## Deprecated Flags

The following flags are no longer supported. Using them will produce an error:

| Flag | Error |
|------|-------|
| `--skip-ado` | Removed. ADO sync is now a separate skill (`/jx-pm:ado`). Run it independently. |
| `--chain-all` | Removed. Full workflow requires manual steps: `/jx-pm:prd` → `/jx-dev:spec` → `/jx-dev:task` → `/jx-pm:ado`. |

$ARGUMENTS
