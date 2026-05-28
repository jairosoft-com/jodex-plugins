---
title: "Source - JX QA Agents Directory"
type: source
tags: [jx-qa, agents, subagent, plugin-structure]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-qa/agents/ABOUT.md
provenance: source-derived
---

# Source - JX QA Agents Directory

## Metadata
- **Original path**: plugins/jx-qa/agents/ABOUT.md
- **SHA-256**: 755233f259675ca863d34fb3113c96aecdc4411bbc9a821fda95948add18e46d
- **Size**: 674 bytes

## Summary

Describes the agents directory for the qa-ai plugin. Each `.md` file defines a custom AI subagent with its own system prompt, tool restrictions, model selection, and skill references. Use cases include background pipeline runs (chaining extract to generate end-to-end), specialized scoped tasks, and delegating work that needs different tool restrictions or models.

## Key Concepts
- Agent definition format (YAML frontmatter + system prompt body)
- Agent properties: name, description, model, tools, skills
- Background pipeline orchestration via agents
- Tool and model scoping per agent
- Skill composition within agents

## Pages Created
- [[Agent Definition]] (new concept page)
