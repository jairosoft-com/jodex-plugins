---
title: Settings Portability
type: concept
tags: [pattern, configuration, plugin]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [settings.json vs settings.local.json, portable settings]
provenance: synthesis
---

# Settings Portability

[[Claude Code CLI]] uses two settings files with different commit strategies:

| File | Committed | Contains |
|------|-----------|----------|
| `.claude/settings.json` | Yes | Portable config: `enabledPlugins`, shared permissions |
| `.claude/settings.local.json` | No (gitignored) | Machine-specific: absolute paths, personal preferences |

## What Goes Where

### settings.json (portable)
- `enabledPlugins` — which plugins are active for this project
- Shared permissions that all contributors need

### settings.local.json (machine-specific)
- `extraKnownMarketplaces` with `"source": "directory"` — contains absolute paths
- `plansDirectory` — absolute path to plans
- `outputStyle`, `spinnerTipsEnabled`, `prefersReducedMotion` — personal preferences
- Any config containing absolute paths to user home directories

## Why This Matters

Committing absolute paths (e.g., `/Users/jairo/projects/...`) breaks for anyone cloning the repo. They get errors or silently missing plugins because the path doesn't exist on their machine.

## Related

- [[Plugin Architecture]] — plugin system that depends on these settings
- [[Three-Surface Plugin Ecosystem]] — settings shared across CLI/Desktop/Codex
- [[Directory-Source Marketplace]] — common source of absolute paths in settings
- [[Local Plugin Development]] — another approach that avoids committed paths

## Sources
- (synthesis — discovered when preparing repo for commit, 2026-05-08)
