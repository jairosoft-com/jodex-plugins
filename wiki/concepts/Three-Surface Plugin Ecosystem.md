---
title: Three-Surface Plugin Ecosystem
type: concept
tags: [architecture, plugin, platform, ecosystem]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [plugin ecosystem, shared plugin surfaces]
provenance: synthesis
---

# Three-Surface Plugin Ecosystem

The [[Plugin Architecture]] runs across three surfaces that share a single plugin registry (`~/.claude/plugins/installed_plugins.json`):

| Surface | Type | Install Method |
|---------|------|----------------|
| [[Claude Code CLI]] | Terminal | `/plugin marketplace add` + `/plugin install` |
| [[Claude Code Desktop]] | Desktop app | Shared registry — appears automatically |
| [[Codex Desktop]] | Desktop app | Shared registry — appears automatically |

## Key Insight

Installing a plugin in any one surface makes it available in all three. The registry is the single source of truth — not the individual app.

## Contrast: [[Claude Desktop]]

[[Claude Desktop]] (consumer app) is **not** part of this ecosystem. It uses [[MCP Server]] protocol exclusively and has a separate, closed Connectors directory managed by [[Anthropic]].

## Implication for Plugin Authors

Write once, distribute once via [[Marketplace]], available on three surfaces. No per-surface packaging or configuration needed.

## Related

- [[Plugin Architecture]] — the shared format
- [[Marketplace]] — distribution mechanism
- [[Local Plugin Development]] — `--plugin-dir` also works across surfaces

## Sources
- (synthesis — discovered from user observation that CLI install reflects in Desktop, 2026-05-08)
