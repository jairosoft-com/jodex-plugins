---
title: LLM Wiki
type: plugin
tags: [knowledge-base, wiki, llm]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [llm-wiki, llm-wiki plugin]
provenance: source-derived
---

# LLM Wiki

A [[Claude Code CLI]] plugin for building and maintaining personal knowledge bases. Based on Karpathy's LLM Wiki pattern. The LLM incrementally builds a persistent wiki from raw sources.

## Pipeline

```
raw source → /llm-wiki:ingest → wiki pages
                                    ↓
                              /llm-wiki:triage → promote / backlog / archive
                                    ↓
                              /llm-wiki:query → synthesized answers with [[citations]]
                                    ↓
                              /llm-wiki:lint → health report + auto-fixes
```

## Commands

| Command | [[Skill]] | Purpose |
|---------|-----------|---------|
| `/llm-wiki:init` | init | Initialize wiki directory structure |
| `/llm-wiki:ingest` | ingest | [[Ingest]] source document into wiki |
| `/llm-wiki:triage` | triage | [[Triage]] raw ideas |
| `/llm-wiki:query` | query | [[Query]] wiki with citations |
| `/llm-wiki:lint` | lint | [[Lint]] health-check |

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
- [[Source - LLM Wiki README]]
