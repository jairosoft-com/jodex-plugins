---
title: Claude Code Hot-Loads New Plugin Skills Mid-Session
type: idea
tags: [claude-code, plugins, skills, troubleshooting]
created: 2026-05-30
updated: 2026-05-30
source_count: 0
aliases: []
provenance: synthesis
status: raw
---

# Claude Code Hot-Loads New Plugin Skills Mid-Session

A newly authored plugin command/skill (`/jx-qa:coverage`) became available **within
the same session** — it appeared in the skill registry and was invocable — without
restarting Claude Code (observed on v2.1.158). This contradicts the common
assumption that plugins load only at session start.

- Practical impact: you can author a skill and run its runtime smoke in the **same
  session** — no fresh session required — when the plugin source loads from the
  working tree.
- The refresh is **not instantaneous**: the skill surfaced after subsequent
  activity, not the instant the file was written. Don't assume it's missing just
  because it isn't in the list yet.

Related: [[Agent SDK query() Message Type Structure]].

## Sources
- Session: jx-qa coverage build + Codex-worktree & plugin-loading gotchas (2026-05-30)
