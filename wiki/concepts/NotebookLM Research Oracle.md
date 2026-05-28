---
title: NotebookLM Research Oracle
type: concept
tags: [pattern, notebooklm, wiki, research]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [notebook oracle, augmented query]
provenance: synthesis
---

# NotebookLM Research Oracle

Pattern of querying [[NotebookLM Integration|NotebookLM]] notebooks as an external knowledge source during wiki work. Combines wiki's structured knowledge with NotebookLM's source-backed reasoning for richer answers.

## How It Works

1. User asks a question (e.g., "what's the strategy for polyglot deps?")
2. Agent checks wiki for existing pages
3. Agent queries relevant NotebookLM notebook for deeper analysis
4. Answer synthesizes both sources
5. Result filed back to wiki via [[Filing Workflow]]

## When to Use

- Wiki lacks depth on a topic but a NotebookLM notebook has ingested relevant sources
- Question requires cross-referencing multiple external documents
- Need authoritative citations beyond what wiki pages capture

## When NOT to Use

- Wiki already has comprehensive coverage
- Question is purely operational (paths, commands, config)
- No relevant notebook exists

## Example from This Project

Question: "What's the strategy for Python + TypeScript dependency management?"
- Wiki had no page → gap
- NotebookLM "Agent Skill Plugin Marketplace Architecture" notebook had ingested architecture docs
- Answer combined NotebookLM's polyglot monorepo recommendation with project-specific context
- Result → [[Polyglot Dependency Strategy]] wiki page

## Related

- [[NotebookLM Integration]] — associated notebooks
- [[Query]] — wiki query operation
- [[Filing Workflow]] — how results get persisted
