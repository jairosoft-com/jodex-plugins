---
title: Update Wiki Inventory for Seven-Plugin Marketplace
type: idea
tags: [wiki, plugins, inventory, jx-plugin]
created: 2026-05-20
updated: 2026-05-26
source_count: 0
aliases: [six plugin update, seven plugin update, wiki plugin count]
provenance: synthesis
status: backlogged
---

# Update Wiki Inventory for Seven-Plugin Marketplace

Update stale plugin-count references in maintained wiki pages. Originally tracked 5→6 (jx-plugin addition); inventory list needs updating after the plugin scaffolding migration (2026-05-26).

## Current plugin inventory (live)

jx-qa, jx-kb, jx-pm, jx-dev, jx-core, jx-plugin (6 total)

## Pages to update

- `wiki/_schema.md:101` — concrete plugin inventory list (still lists only jx-qa, jx-kb, jx-pm, jx-dev, jx-core)
- `wiki/projects/Jodex Plugin Marketplace.md` — says "five-plugin" in title and body; inventory table shows 5 plugins
- `wiki/_index.md` Plugins section — missing entry for jx-plugin

Urgency: 2/10 — stale text, no functional impact. Can be caught during next wiki lint pass.

## Sources

- Codex review round 5 finding P3 (2026-05-20)
- Session: jx-plugin scaffolding (2026-05-26)
