---
title: Skill
type: concept
tags: [plugin, component, implementation]
created: 2026-05-07
updated: 2026-05-25
source_count: 2
aliases: [skills, SKILL.md]
provenance: source-derived
---

# Skill

A reusable, multi-phase instructional module within a [[Claude Code CLI]] plugin. Skills contain the implementation logic that powers [[Slash Command]]s.

## Structure

Each skill lives in its own subdirectory under `skills/`:
```
skills/skill-name/
├── SKILL.md         # YAML frontmatter + phase-by-phase instructions
├── evals/           # Optional: evaluation test cases (evals.json)
└── references/      # Optional: supplementary reference docs
```

## SKILL.md Format

YAML frontmatter declares metadata:
```yaml
---
name: skill-name
user-invocable: true
argument-hint: <arg1> [arg2]
description: >
  Description + trigger patterns
allowed-tools: <pinned executables & file ops>
---
```

Followed by multi-phase implementation instructions (typically 4-10 phases).

## Execution Discipline

SKILL.md is a contract. Before executing any skill, read its SKILL.md completely and follow its phases, field mappings, and confirmation gates exactly. See [[Spec-First Skill Execution]].

## Relationship to Other Components

- One [[Slash Command]] maps to one skill
- Skills reference [[Hook]]s for lifecycle events
- Skills use pinned helper scripts for execution (security pattern)

## Sources
- [[Source - Claude CLI vs Desktop MCP Guide]]
- [[Source - Spec-First Feedback]]
