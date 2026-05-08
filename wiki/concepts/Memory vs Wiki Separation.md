---
title: Memory vs Wiki Separation
type: concept
tags: [architecture, persistence, memory, wiki]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [persistence separation, memory wiki boundary]
provenance: synthesis
---

# Memory vs Wiki Separation

Clear boundary between agent memory files and wiki pages — two persistence mechanisms serving different purposes.

## When to Use Each

| Use | Mechanism | Location |
|-----|-----------|----------|
| User preferences, corrections | **Memory** (feedback) | `/memory/` |
| User role, background | **Memory** (user) | `/memory/` |
| External system pointers | **Memory** (reference) | `/memory/` |
| Project status, deadlines | **Memory** (project) | `/memory/` |
| Domain concepts, patterns | **Wiki** (concept) | `wiki/concepts/` |
| Tool/product documentation | **Wiki** (entity/platform) | `wiki/entities/`, `wiki/platforms/` |
| Architecture decisions | **Wiki** (decision) | `wiki/decisions/` |
| Ingested source knowledge | **Wiki** (source) | `wiki/sources/` |

## Key Distinction

- **Memory** = how the agent should behave (preferences, workflow rules, thresholds)
- **Wiki** = what the agent should know (domain knowledge, patterns, architecture)

## Examples from This Project

| Item | Saved To | Why |
|------|----------|-----|
| "Use `gh` for PRs" | Memory (feedback) | Agent behavior preference |
| "Code changes need a plan first" | Memory (feedback) | Workflow rule |
| NotebookLM notebook IDs | Memory (reference) | External system pointer |
| Codex plugin format differences | Wiki (concept) | Domain knowledge |
| Polyglot dependency strategy | Wiki (concept) | Architecture pattern |

## Cross-Reference Rule

Memory can point to wiki pages, but wiki should not reference memory files. Memory is agent-specific; wiki is project-level shared knowledge.

## Related

- [[Session Memory Model]] — broader persistence architecture
- [[Filing Workflow]] — how conversation insights reach wiki
- [[Knowledge Management]] — discipline of organizing knowledge
