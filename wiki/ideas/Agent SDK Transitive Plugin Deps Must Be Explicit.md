---
title: Agent SDK Transitive Plugin Deps Must Be Explicit
type: idea
tags: [agent-sdk, plugins, testing, jx-pm, skill-runner]
created: 2026-05-22
updated: 2026-05-22
source_count: 0
provenance: session-observation
status: raw
---

# Agent SDK Transitive Plugin Deps Must Be Explicit

When invoking a skill via `@anthropic-ai/claude-agent-sdk`, every plugin in the dependency chain must appear in the `plugins` array — the SDK does not auto-resolve transitive dependencies.

`jx-pm` depends on `jx-dev`. Omitting `jx-dev` from the list causes the skill to fail silently with "Unknown command: /jx-pm:ado" even though `jx-pm` loads.

Required list for `/jx-pm:ado`:
```
{ type: 'local', path: '.../jx-pm' }
{ type: 'local', path: '.../jx-core' }
{ type: 'local', path: '.../jx-dev' }   // ← required, not auto-loaded
```
