---
title: Pinned Helper
type: concept
tags: [security, pattern, execution]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
aliases: [pinned executable, pinned script]
provenance: source-derived
---

# Pinned Helper

A security pattern in [[Claude Code CLI]] plugins where script execution is restricted to specific named files rather than broad interpreter permissions.

## How It Works

Instead of granting `python3:*` or `node:*` (which allows arbitrary code execution), the `allowed-tools` field in [[Slash Command]] definitions pins execution to a specific script:
```
Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*)
```

This means the LLM can only run that one script with any arguments — it cannot execute arbitrary Python code.

## Examples in This Repo

- [[wiki-tools.py]] — stdlib-only Python helper for the [[LLM Wiki]] plugin
- `xlsx-writer.py` — openpyxl helper for the [[QA AI]] plugin

## Sources
- [[Source - LLM Wiki README]]
- [[Source - QA AI README]]
