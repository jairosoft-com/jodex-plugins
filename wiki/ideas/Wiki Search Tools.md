---
title: Wiki Search Tools
type: idea
tags: [tooling, search, scaling]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: []
status: backlogged
provenance: source-derived
---

# Wiki Search Tools

At small scale, the [[Index]] file is sufficient for wiki navigation. As the wiki grows, proper search may be needed.

## Candidates

- **qmd** — local search engine for markdown files with hybrid BM25/vector search and LLM re-ranking, all on-device. Has both CLI (LLM shells out) and MCP server (native tool). See: qmd on GitHub.
- **Custom script** — the LLM can help vibe-code a naive search script as needed

## When Needed

When the index file becomes too large for the LLM to efficiently scan — likely at 200+ pages.

## Sources
- [[Source - LLM Wiki]]
