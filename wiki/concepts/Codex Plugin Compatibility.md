---
title: Codex Plugin Compatibility
type: concept
tags: [plugin, codex, compatibility, cross-platform]
created: 2026-05-07
updated: 2026-05-11
source_count: 1
aliases: [claude-to-codex, codex plugin format]
provenance: synthesis
---

# Codex Plugin Compatibility

Claude Code plugins (`.claude-plugin` format) are not natively compatible with OpenAI Codex. The two platforms use different directory structures, manifest paths, and instruction files.

## Format Comparison

| Aspect | Claude Code | Codex |
|--------|-------------|-------|
| Manifest dir | `.claude-plugin/` | `.codex-plugin/` |
| Manifest file | `plugin.json` | `plugin.json` |
| Instructions | `CLAUDE.md` | `AGENTS.md` |
| Skills dir | `~/.claude/skills/` | `~/.agents/skills/` |
| Marketplace | `.claude-plugin/marketplace.json` | `.agents/plugins/marketplace.json` |
| Settings format | JSON | TOML |

## Conversion Tools

- **[johnpyp/claude-to-codex](https://github.com/johnpyp/claude-to-codex)** — auto-converts Claude Code skills/agents to Codex equivalents
- **[ariccb/sync-claude-skills-to-codex](https://github.com/ariccb/sync-claude-skills-to-codex)** — syncs via symlinks

## Instruction Discovery Approaches

1. **Canonical file + shim** — keep `AGENTS.md` canonical and make `CLAUDE.md` point to it. This is the current repo pattern.
2. **Symlink** — link one instruction filename to another. Lightweight, but less explicit than a shim.
3. **Duplicate** — maintain both files independently. More control, higher drift risk.

## Current State (This Repo)

As of 2026-05-11, this repo has cross-agent instruction discovery via [[Canonical Agent Instruction with Compatibility Shims]]: root `AGENTS.md` is the canonical instruction file and root `CLAUDE.md` points Claude Code agents to it.

This means Claude-style and AGENTS-aware coding agents can orient themselves to the repo using the same guidance. It does **not** mean the Claude Code plugin packages are natively runnable inside Codex. Native Codex plugin support would still require Codex-specific plugin packaging.

[[Source - Agent Instructions]] is the source-backed repository instruction file for the AGENTS-aware side of that discovery path.

## What's Needed for Native Codex Plugin Support

1. Add `.codex-plugin/plugin.json` per plugin (mirror of `.claude-plugin/`)
2. Add `.agents/plugins/marketplace.json` (marketplace manifest)
3. Review skill frontmatter for Codex-specific requirements
4. Test plugin execution under a Codex-compatible plugin runner

## Also Note

- **codex-plugin-cc** ([openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc)) — official Codex plugin that installs *into* Claude Code (reverse direction), enabling Codex delegation from Claude Code

## Related

- [[Plugin Architecture]] — Claude Code plugin format
- [[Marketplace]] — plugin distribution mechanism
- [[Claude Code CLI]] — primary platform for these plugins
- [[Canonical Agent Instruction with Compatibility Shims]] — shared instruction-file pattern

## Sources

- [[Source - Agent Instructions]]
