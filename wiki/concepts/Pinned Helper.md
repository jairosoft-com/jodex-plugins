---
title: Pinned Helper
type: concept
tags: [security, pattern, execution]
created: 2026-05-07
updated: 2026-05-21
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

- [[wiki-tools.py]] — stdlib-only Python helper for the [[Knowledge Base Plugin|jx-kb]] plugin
- `xlsx-writer.py` — openpyxl helper for the [[QA Testing Plugin|jx-qa]] plugin
- `skill-creator.py` — stdlib-only Python helper for the jx-skill plugin

## Why It Matters

Pinned helpers keep a plugin useful without granting the model an unrestricted interpreter. The plugin author can review one script, define its allowed arguments, and keep path validation inside a small code surface instead of trusting arbitrary shell construction.

This also gives reviewers a clear permission boundary. If a command needs broader access, that change is visible in the command frontmatter and should be reviewed as a security change rather than hidden inside workflow prose.

## Boundary

The pattern does not make the helper safe by itself. The helper still needs [[Path Confinement]], structured argument parsing, predictable JSON output, and narrow behavior. Pinning only reduces which executable can run; it does not replace script-level validation.

**cwd() trap:** Plugin helpers must not confine paths against `Path.cwd()` — Claude Code sets cwd to the user's project, not the plugin install dir. Use `CLAUDE_PLUGIN_ROOT` or resolve paths absolutely. See [[Path Confinement#cwd() Fragility in Plugin Helpers (2026-05-20)]].

## Related

- [[Cross-Plugin Pinned Helper]] — extended pattern for invoking helpers from dependency plugins via sibling traversal

## Sources
- [[Source - JX KB README]]
- [[Source - JX QA README]]
