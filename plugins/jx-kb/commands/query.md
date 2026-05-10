---
description: Query the LLM Wiki — search index, read pages, synthesize answer with citations
argument-hint: "<question> [wiki_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*), Read, Write
---

Query the wiki using the `jx-kb:query` skill.

$ARGUMENTS
