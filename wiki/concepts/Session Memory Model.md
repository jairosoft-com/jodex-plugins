---
title: Session Memory Model
type: concept
tags: [persistence, memory, architecture]
created: 2026-05-07
updated: 2026-05-11
source_count: 1
aliases: [agent memory, cross-session persistence]
provenance: synthesis
---

# Session Memory Model

How the Claude Code agent retains and loses knowledge across interactions.

## Two Layers

### In-Session Context
Within a conversation, the agent accumulates understanding from each message. It connects dots, spots patterns, and refines approach. This context exists only in the active conversation window and is lost when the session ends.

### Cross-Session Persistence
Between conversations, the agent starts fresh. Only explicitly saved artifacts survive:

| Mechanism | Purpose | Location |
|-----------|---------|----------|
| Memory files | User preferences, feedback, project context | `/memory/` directory |
| Wiki pages | Domain knowledge, concepts, patterns | `wiki/` directory |
| AGENTS.md | Canonical cross-agent codebase instructions | Project root |
| CLAUDE.md | Claude Code shim pointing to AGENTS.md | Project root |
| Git history | Code changes, commit messages | `.git/` |

## Implication

Insights from discussion are ephemeral unless filed. The [[Filing Workflow]] converts conversation knowledge into durable wiki pages. Without explicit filing, valuable insights disappear at session end.

[[Source - Agent Instructions]] adds one repo-specific operating rule: agents should read `.agent/memory/MEMORY.md` early for local preferences and reusable project context.

## Related

- [[Filing Workflow]] — how to persist insights
- [[Memory vs Wiki Separation]] — when to use memory vs wiki
- [[Canonical Agent Instruction with Compatibility Shims]] — root instruction pattern
- [[Knowledge Management]] — broader discipline of capturing and organizing knowledge
- [[Log]] — chronological record of wiki operations

## Sources

- [[Source - Agent Instructions]]
