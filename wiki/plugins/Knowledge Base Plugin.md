---
title: Knowledge Base Plugin
type: plugin
tags: [knowledge-base, wiki, jx-kb]
created: 2026-05-07
updated: 2026-05-09
source_count: 1
aliases: [jx-kb, jx-kb plugin, llm-wiki]
provenance: source-derived
---

# Knowledge Base Plugin

A [[Claude Code CLI]] plugin for building and maintaining personal knowledge bases. Based on Karpathy's LLM Wiki pattern. The LLM incrementally builds a persistent wiki from raw sources.

## Pipeline

```
raw source → /jx-kb:ingest → wiki pages
                                    ↓
                              /jx-kb:triage → promote / backlog / archive
                                    ↓
                              /jx-kb:query → synthesized answers with [[citations]]
                                    ↓
                              /jx-kb:lint → health report + auto-fixes
```

## Commands

| Command | [[Skill]] | Purpose |
|---------|-----------|---------|
| `/jx-kb:init` | init | Initialize wiki directory structure |
| `/jx-kb:ingest` | ingest | [[Ingest]] source document into wiki |
| `/jx-kb:triage` | triage | [[Triage]] raw ideas |
| `/jx-kb:query` | query | [[Query]] wiki with citations |
| `/jx-kb:lint` | lint | [[Lint]] health-check |

## Requirements

- **Python 3** (stdlib only — no external dependencies)
- [[wiki-tools.py]] — [[Pinned Helper]] script

## Security Model

- No broad interpreter permissions — Python pinned to [[wiki-tools.py]] only
- [[Path Confinement]] — `Path.relative_to()`, symlink resolution, metacharacter rejection
- [[User Confirmation Gate]] — no wiki mutations before explicit approval
- All paths validated against project root

## [[Obsidian]] Compatibility

- `[[wikilinks]]` resolve natively
- YAML frontmatter compatible with [[Dataview Queries|Dataview]]
- `> [!conflict]` renders as callout blocks
- Graph view shows full knowledge graph
- Aliases in frontmatter for alternate names

## Related Topics

- [[Knowledge Management]] — broader subject area

## Sources
- [[Source - JX KB README]]
