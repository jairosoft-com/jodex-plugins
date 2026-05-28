---
title: NotebookLM Integration
type: concept
tags: [notebooklm, reference, tooling]
created: 2026-05-07
updated: 2026-05-07
source_count: 0
aliases: [notebook integration, notebooklm]
provenance: synthesis
---

# NotebookLM Integration

Google NotebookLM notebooks associated with this project for research, podcast generation, and knowledge synthesis.

## Associated Notebooks

| Notebook | ID | Purpose |
|----------|----|---------|
| Agent Skill Plugin Marketplace Architecture | `6743b2db-d313-4033-b5b6-392a3094e366` | Plugin + marketplace architecture reference |
| Mastering Skill.MD | `08b523ad-27c3-497c-85be-49a445347e34` | Skill file authoring patterns and best practices |

## Access

```bash
notebooklm use <notebook_id>
notebooklm ask "your question"
notebooklm source list          # see what sources are loaded
```

## Capabilities

NotebookLM can generate from project sources:
- **Podcasts** — audio overviews of plugin architecture
- **Reports** — briefing docs, study guides
- **Quizzes/Flashcards** — for skill development review
- **Mind maps** — concept relationships
- **Chat** — Q&A against loaded sources with citations

## CLI Tool

Managed via `notebooklm-py` CLI (`notebooklm` command). Requires Google OAuth authentication (`notebooklm login`).

## Related

- [[Plugin Architecture]] — plugin format documented in these notebooks
- [[Skill]] — skill authoring covered in Mastering Skill.MD notebook
- [[Marketplace]] — marketplace architecture in notebook #1
- [[NotebookLM Research Oracle]] — pattern for querying NotebookLM during wiki work
