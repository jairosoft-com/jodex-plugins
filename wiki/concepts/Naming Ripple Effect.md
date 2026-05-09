---
title: Naming Ripple Effect
type: concept
tags: [pattern, naming, plugin, maintenance]
created: 2026-05-08
updated: 2026-05-09
source_count: 0
aliases: [rename cascade, naming dependencies]
provenance: synthesis
---

# Naming Ripple Effect

Renaming a [[Marketplace]] or plugin cascades changes through multiple files and systems. Understanding these touch points prevents partial renames that break installations.

## Marketplace Rename Touch Points

When renaming a marketplace (e.g., `jairosoft-com-jodex-qa-ai` → `jodex-plugins`):

| What | File | Field |
|------|------|-------|
| Marketplace name | `.claude-plugin/marketplace.json` | `name` |
| Git remote URL | `.git/config` | `remote.origin.url` |
| Wiki reference | `wiki/concepts/Marketplace.md` | prose |
| Install commands | README, docs | `@<marketplace-name>` |

## Plugin Rename Touch Points

When renaming a plugin (e.g., `qa-ai` → `new-name`):

| What | File | Field |
|------|------|-------|
| Plugin manifest | `plugins/<name>/.claude-plugin/plugin.json` | `name` |
| Marketplace entry | `.claude-plugin/marketplace.json` | `plugins[].name` |
| Directory name | `plugins/<name>/` | directory |
| Slash commands | User-facing | `/old-name:skill` → `/new-name:skill` |
| Codex equivalent | `.codex-plugin/plugin.json` | `name` (if dual support) |

## Case Sensitivity

Plugin names are **case-sensitive**. `qa-ai` and `Qa-Ai` are different names. A case mismatch between any of the three required locations causes:

```
Plugin "qa-ai" not found in marketplace "jodex-plugins"
```

All three must match exactly:
1. Directory name: `plugins/qa-ai/`
2. Plugin manifest: `plugins/qa-ai/.claude-plugin/plugin.json` → `"name": "qa-ai"`
3. Marketplace entry: `.claude-plugin/marketplace.json` → `plugins[].name: "qa-ai"`

Convention: always use **lowercase with hyphens** (e.g., `qa-ai`, not `Qa-Ai` or `QA_AI`).

## Key Risk

Plugin name = slash command prefix. Renaming breaks existing user installations. Users must uninstall old name and reinstall new name.

## Example from This Project

Marketplace renamed from `jairosoft-com-jodex-qa-ai` to `jodex-plugins`:
- Updated `.claude-plugin/marketplace.json`
- Updated wiki [[Marketplace]] page
- Fixed git remote URL (`jodex-qa-ai/jodex-plugins` → `jairosoft-com/jodex-plugins`)
- Install commands changed: `@jairosoft-com-jodex-qa-ai` → `@jodex-plugins`

## Related

- [[Marketplace]] — distribution mechanism
- [[Plugin Architecture]] — plugin format and naming
- [[Codex Plugin Compatibility]] — naming differences across platforms
