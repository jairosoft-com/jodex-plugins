---
title: Three-Surface Plugin Ecosystem
type: concept
tags: [architecture, plugin, platform, ecosystem]
created: 2026-05-08
updated: 2026-05-12
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

## Operational Nuance

Shared plugin registry does not collapse every setup path into one instruction. CLI and Desktop can share installed plugins, but MCP setup still has a [[Client-Specific MCP Boundary]], and developer onboarding still benefits from a [[Layered Developer Onboarding]] sequence that separates platform install, plugin install, wiki init, external MCP setup, and workflow verification.

## Related

- [[Plugin Architecture]] — the shared format
- [[Marketplace]] — distribution mechanism
- [[Local Plugin Development]] — `--plugin-dir` also works across surfaces
- [[Client-Specific MCP Boundary]] — MCP setup is client-specific even when plugins are shared
- [[Layered Developer Onboarding]] — dependency-ordered setup pattern

## Sources
- (synthesis — discovered from user observation that CLI install reflects in Desktop, 2026-05-08)
