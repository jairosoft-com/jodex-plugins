---
title: Filing Workflow
type: concept
tags: [wiki, workflow, persistence]
created: 2026-05-07
updated: 2026-05-07
source_count: 0
aliases: [file insight, file back to wiki]
provenance: synthesis
---

# Filing Workflow

The process of persisting conversation insights back into the wiki. Two methods exist:

## Method 1: Direct Filing

During conversation, ask the agent to create or update a wiki page. The agent routes content to the correct taxonomy bucket, adds frontmatter, updates [[Index]] and [[Log]].

Example: *"File that pattern as a concept"* → agent creates page in `concepts/`.

## Method 2: Source Ingestion

Use `/jx-kb:ingest` to process a document in `wiki/raw/`. The agent extracts entities, concepts, and patterns automatically.

## Provenance Rules

Filed insights use specific provenance values:

| Origin | Provenance |
|--------|-----------|
| Ingested from raw source | `source-derived` |
| Conversation insight, human-approved | `synthesis` |
| Model-generated, not yet reviewed | `model-derived` |

Conversation insights get `provenance: synthesis` because they represent model analysis explicitly approved by the user. No page may claim `source-derived` without a corresponding entry in its `## Sources` section.

## Related

- [[Ingest]] — bulk extraction from source documents
- [[Taxonomy Routing]] — how content gets routed to buckets
- [[Raw Sources]] — immutable source layer for ingested docs
