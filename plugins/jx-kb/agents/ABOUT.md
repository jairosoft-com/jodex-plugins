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

- Background batch ingestion (process multiple sources sequentially)
- Wiki maintenance passes (lint + auto-fix in one run)
- Specialized subagent for scoped knowledge extraction tasks

## Reference

See jx-qa plugin's `agents/ABOUT.md` for format details.
