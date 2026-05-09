---
title: "Source - QA AI Hooks Directory"
type: source
tags: [qa-ai, hooks, lifecycle, plugin-structure]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/qa-ai/hooks/ABOUT.md
provenance: source-derived
---

# Source - QA AI Hooks Directory

## Metadata
- **Original path**: plugins/qa-ai/hooks/ABOUT.md
- **SHA-256**: a5168d316415f9c18db38fa10112ab338d8cbc57e6ad9bd4799fc6d7e7e47231
- **Size**: 700 bytes

## Summary

Describes the hooks directory for the qa-ai plugin. Hooks are shell commands triggered by Claude Code lifecycle events, defined in a `hooks.json` file. Available events include SessionStart, SessionEnd, and Stop. Use cases include auto-linting after test generation, session setup/teardown, and review gates before stopping.

## Key Concepts
- Hooks as lifecycle event triggers
- `hooks.json` configuration format
- SessionStart, SessionEnd, and Stop events
- Stop event can block if hook fails (review gate pattern)
- Timeout configuration per hook

## Pages Created
None
