---
description: Ingest a source document into the LLM Wiki — extracts knowledge, creates/updates pages, updates index
argument-hint: "<source_path> [wiki_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*), Read, Write
---

Ingest a source document into the wiki using the `llm-wiki:ingest` skill.

$ARGUMENTS
