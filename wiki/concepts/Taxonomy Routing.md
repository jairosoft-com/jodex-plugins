---
title: Taxonomy Routing
type: concept
tags: [classification, wiki, pattern]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [taxonomy, classification routing]
provenance: source-derived
---

# Taxonomy Routing

The system of rules that determines which taxonomy directory a piece of extracted knowledge belongs in. Defined in the [[Schema]] and applied during [[Ingest]].

## Default Buckets

| Directory | Contains |
|-----------|----------|
| `ideas/` | Raw, untriaged ideas (`status: raw`) |
| `concepts/` | Abstract principles, patterns, techniques |
| `entities/` | Named things: people, orgs, products, places |
| `topics/` | Broader subject areas aggregating entities/concepts |
| `plugins/` | Plugin specifications and design docs |
| `platforms/` | Platform-specific documentation |
| `projects/` | Project pages with goals, status, timelines |
| `decisions/` | Architectural Decision Records |
| `code/` | Source code documentation |
| `sources/` | One summary page per ingested source |

## Tiebreaker Rule

When uncertain which bucket → route to `ideas/` with `status: raw`. User classifies during [[Triage]].

## Custom Rules

Domain-specific routing can override defaults via the `## Custom Rules` section in [[Schema]]. Example: "Route Skill, Slash Command, Hook as `concepts/`."

## Sources
- [[Source - Init SKILL]]
