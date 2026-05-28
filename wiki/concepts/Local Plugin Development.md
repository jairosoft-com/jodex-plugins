---
title: Local Plugin Development
type: concept
tags: [plugin, development, workflow, claude-code]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [local plugin, plugin dev mode, --plugin-dir]
provenance: synthesis
---

# Local Plugin Development

Workflow for developing and testing [[Plugin Architecture|plugins]] from a local directory without publishing to a [[Marketplace]].

## Loading from Disk

```bash
claude --plugin-dir ./path/to/plugin
```

- Accepts relative or absolute paths
- No install step — loads directly from disk
- Multiple plugins via repeated flags:

```bash
claude --plugin-dir ./plugin-a --plugin-dir ./plugin-b
```

## Precedence

Local `--plugin-dir` plugin takes precedence over installed marketplace plugin with same name (except managed-settings force-enabled plugins).

## Hot Reload

After editing plugin files mid-session:

```
/reload-plugins
```

Picks up changes without restarting [[Claude Code CLI]].

## Required Structure

Same as [[Plugin Architecture#Plugin Structure]] — must have `.claude-plugin/plugin.json` manifest. Component directories (`skills/`, `agents/`, `hooks/`) live at plugin root, not inside `.claude-plugin/`.

## Alternative: Directory-Source Marketplace

For persistent local marketplace access without `--plugin-dir` flags each session, use a [[Directory-Source Marketplace]] in `settings.local.json`. See [[Settings Portability]] for why this must be in the `.local` file.

## Transition to GitHub Marketplace

When ready for distribution, wrap in a GitHub repo with `marketplace.json` per [[Marketplace#Manifest Structure]].

## Sources
- (synthesis — derived from Claude Code documentation query, 2026-05-08)
