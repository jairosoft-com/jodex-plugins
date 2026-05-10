# Agents

Custom AI subagents with their own system prompts, tool restrictions, and model selection.

## Format

Each `.md` file in this directory defines one agent:

```yaml
---
name: agent-name
description: When to use this agent (model uses this to decide activation)
model: sonnet
tools: Bash
skills:
  - skill-name-1
  - skill-name-2
---

System prompt for the agent goes here.
```

## When to use

- Generating Tech Spec
- Generating Task Breakdown

## Reference

See jx-dev plugin's `agents/ABOUT.md` for format details.
