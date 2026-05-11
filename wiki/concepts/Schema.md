---
title: Schema
type: concept
tags: [architecture, wiki, configuration]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
aliases: [wiki schema, _schema.md]
provenance: source-derived
---

# Schema

The configuration document (`_schema.md`) that tells the LLM how the wiki is structured, what conventions to follow, and what workflows to execute. Read at the start of every operation ([[Ingest]], [[Query]], [[Triage]], [[Lint]]).

## Contents

- **Taxonomy** — defines the directory buckets (ideas, concepts, entities, topics, plugins, platforms, projects, decisions, code, sources)
- **Page Conventions** — naming (Title Case), required YAML frontmatter, and wikilink cross-reference syntax
- **Contradiction Handling** — `> [!conflict]` callout blocks
- **Tiebreaker Rule** — uncertain classification routes to `ideas/` with `status: raw`
- **Custom Rules** — domain-specific routing and classification added after initialization

## Role in Architecture

The schema is the key configuration file — it transforms the LLM from a generic chatbot into a disciplined wiki maintainer. The user and LLM co-evolve the schema over time as patterns emerge.

## Init Process

Created by `/jx-kb:init` with user-provided wiki name. Template includes:
- Complete [[Taxonomy Routing]] definitions for all 10 buckets
- YAML frontmatter spec (title, type, tags, created, updated, source_count, aliases, provenance)
- Wikilink cross-reference syntax
- `> [!conflict]` callout pattern for contradictions
- Tiebreaker rule → route uncertain items to `ideas/`
- `## Custom Rules` placeholder for domain-specific extensions

## Sources
- [[Source - LLM Wiki]]
- [[Source - Init SKILL]]
