---
title: Marketplace
type: concept
tags: [distribution, plugin, registry]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
aliases: [plugin marketplace]
provenance: source-derived
---

# Marketplace

The distribution mechanism for [[Claude Code CLI]] plugins. A marketplace is a GitHub repository containing a `marketplace.json` manifest that references one or more plugins.

## Installation

```bash
claude /plugin marketplace add <github-repo>
claude /plugin install <plugin-name>@<marketplace-name>
```

## Uninstall

```bash
/plugin uninstall <plugin>@<marketplace>
/plugin marketplace remove <marketplace>
```

## Contrast with [[Claude Desktop]]

Desktop has a closed, curated Connectors directory managed by [[Anthropic]]. No open public registry for independent developers.

## Manifest Structure

`marketplace.json` at `.claude-plugin/marketplace.json`:
```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "<marketplace-name>",
  "description": "<description>",
  "owner": { "name": "<org>", "email": "<email>" },
  "plugins": [
    { "name": "<plugin>", "category": "<category>", "source": "./plugins/<name>" }
  ]
}
```

## This Repo's Marketplace

- **Name**: jairosoft-com-jodex-qa-ai
- **Plugins**: [[QA AI]] (category: productivity), [[LLM Wiki]] (category: knowledge)
- **Owner**: Jairosoft

## Sources
- [[Source - QA AI README]]
- [[Source - Marketplace Config]]
