---
description: Health-check the LLM Wiki — find orphans, broken links, contradictions, stale claims, stale ideas
argument-hint: "[wiki_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*), Read, Write
---

Lint the wiki using the `llm-wiki:lint` skill.

$ARGUMENTS
