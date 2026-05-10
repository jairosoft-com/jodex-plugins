---
title: Agent Definition
type: concept
tags: [plugin, component, subagent, orchestration]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
aliases: [agent, agents, custom agent, subagent definition]
provenance: source-derived
---

# Agent Definition

A custom AI subagent within a [[Claude Code CLI]] plugin, defined as a `.md` file in the `agents/` directory. Each agent has its own system prompt, tool restrictions, model selection, and [[Skill]] references.

## Agent File Format

Each agent is a `.md` file in `agents/`:
```yaml
---
name: agent-name
description: When to use this agent
model: sonnet
tools: Bash
skills:
  - skill-name-1
  - skill-name-2
---
```

Followed by the system prompt body.

## Part of [[Plugin Architecture]]

Agents live in the `agents/` directory alongside `commands/`, `skills/`, `hooks/`, `prompts/`, and `schemas/`. They enable background pipeline runs, specialized scoped tasks, and delegation with different tool restrictions or models.

## Use Cases

- Background pipeline orchestration (e.g., chaining extract then generate end-to-end)
- Specialized subagent for complex, scoped tasks
- Delegating work that needs a different model or tool allowlist
- Composing multiple [[Skill]]s into a single agent workflow

## Relationship to [[Skill Chaining]]

Agents can reference multiple skills, enabling [[Skill Chaining]] within a single subagent context rather than through sequential [[Slash Command]] invocations.

## Sources
- [[Source - JX QA Agents Directory]]
