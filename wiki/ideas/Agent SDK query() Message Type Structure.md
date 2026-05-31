---
title: Agent SDK query() Message Type Structure
type: idea
tags: [agent-sdk, testing, skill-runner, output-capture]
created: 2026-05-22
updated: 2026-05-28
source_count: 0
provenance: session-observation
status: completed
---

# Agent SDK query() Message Type Structure

The `query()` iterator from `@anthropic-ai/claude-agent-sdk` yields messages with these relevant shapes for capturing skill output:

| `msg.type` | Useful field | Content |
|---|---|---|
| `assistant` | `msg.message.content[].text` | Per-turn text output from the model |
| `result` | `msg.result` | Final result string after skill completes |
| `system` (subtype `init`) | `msg.slash_commands`, `msg.plugins` | Loaded commands and plugins — useful for verifying plugin load |

`"content" in msg` at the top level does not work — content is nested under `msg.message.content`.

Related: [[Claude Code Hot-Loads New Plugin Skills Mid-Session]] — the loaded commands/plugins this `init` message exposes can also appear mid-session.
