---
title: Codex Plugin Compatibility
type: concept
tags: [plugin, codex, compatibility, cross-platform]
created: 2026-05-07
updated: 2026-05-07
source_count: 0
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

## Dual Support Approaches

1. **Symlink** — `.codex-plugin/` → `.claude-plugin/`, `AGENTS.md` → `CLAUDE.md` (single source of truth, lightweight)
2. **Duplicate** — maintain both sets independently (more control, higher drift risk)

## Current State (This Repo)

As of 2026-05-07, this repo supports **Claude Code only**. No `.codex-plugin/`, `AGENTS.md`, or `.agents/` directories exist. Skill file content is mostly compatible — main gaps are directory structure and instruction file naming.

## What's Needed for Dual Support

1. Add `.codex-plugin/plugin.json` per plugin (mirror of `.claude-plugin/`)
2. Add `AGENTS.md` at root (mirror of `CLAUDE.md`)
3. Add `.agents/plugins/marketplace.json` (marketplace manifest)
4. Review skill frontmatter for Codex-specific requirements

## Also Note

- **codex-plugin-cc** ([openai/codex-plugin-cc](https://github.com/openai/codex-plugin-cc)) — official Codex plugin that installs *into* Claude Code (reverse direction), enabling Codex delegation from Claude Code

## Related

- [[Plugin Architecture]] — Claude Code plugin format
- [[Marketplace]] — plugin distribution mechanism
- [[Claude Code CLI]] — primary platform for these plugins
