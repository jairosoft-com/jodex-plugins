---
title: "Source - llm-wiki Agents Guide"
type: source
tags: [llm-wiki, agents, subagent, plugin-architecture]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/llm-wiki/agents/ABOUT.md
provenance: source-derived
---

# Source - llm-wiki Agents Guide

## Metadata
- **Original path**: plugins/llm-wiki/agents/ABOUT.md
- **SHA-256**: 36641535699c6b6f3bf635f592fb5c65a1a1a05bc66152e8714e7d097a231ffb
- **Size**: 661 bytes

## Summary

Documents the agent definition format for the llm-wiki plugin. Each `.md` file in the agents directory defines a subagent with YAML frontmatter (name, description, model, tools, skills) and a system prompt body. Use cases include background batch ingestion, wiki maintenance passes, and scoped knowledge extraction tasks.

## Key Concepts
- Agent definition format: YAML frontmatter + system prompt body
- Agent properties: name, description, model selection, tool restrictions, skill bindings
- Use cases: batch ingestion, lint + auto-fix, scoped extraction
- Subagent activation based on description matching

## Pages Created
None
