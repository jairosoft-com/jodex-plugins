---
title: Agent SDK query() Message Type Structure
type: idea
tags: [agent-sdk, testing, skill-runner, output-capture]
created: 2026-05-22
source_count: 0
provenance: session-observation
status: raw
---

# Agent SDK query() Message Type Structure

The `query()` iterator from `@anthropic-ai/claude-agent-sdk` yields messages with these relevant shapes for capturing skill output:

| `msg.type` | Useful field | Content |
|---|---|---|
| `assistant` | `msg.message.content[].text` | Per-turn text output from the model |
| `result` | `msg.result` | Final result string after skill completes |
| `system` (subtype `init`) | `msg.slash_commands`, `msg.plugins` | Loaded commands and plugins — useful for verifying plugin load |

`"content" in msg` at the top level does not work — content is nested under `msg.message.content`.
