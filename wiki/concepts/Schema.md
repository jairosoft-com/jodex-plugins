---
title: Schema
type: concept
tags: [architecture, wiki, configuration]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [wiki schema, _schema.md]
provenance: source-derived
---

# Schema

The configuration document (`_schema.md`) that tells the LLM how the wiki is structured, what conventions to follow, and what workflows to execute. Read at the start of every operation ([[Ingest]], [[Query]], [[Triage]], [[Lint]]).

## Contents

- **Taxonomy** — defines the directory buckets (ideas, concepts, entities, topics, plugins, platforms, projects, decisions, code, sources)
- **Page Conventions** — naming (Title Case), required YAML frontmatter, cross-reference syntax (`[[wikilinks]]`)
- **Contradiction Handling** — `> [!conflict]` callout blocks
- **Tiebreaker Rule** — uncertain classification routes to `ideas/` with `status: raw`
- **Custom Rules** — domain-specific routing and classification added after initialization

## Role in Architecture

The schema is the key configuration file — it transforms the LLM from a generic chatbot into a disciplined wiki maintainer. The user and LLM co-evolve the schema over time as patterns emerge.

## Sources
- [[Source - LLM Wiki]]
