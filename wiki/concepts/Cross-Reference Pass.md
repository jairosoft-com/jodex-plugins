---
title: Cross-Reference Pass
type: concept
tags: [wiki, linking, maintenance]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [backlinks pass, bidirectional linking]
provenance: source-derived
---

# Cross-Reference Pass

Post-creation step in [[Ingest]] (Phase 6) that ensures bidirectional wikilinks across the wiki.

## How It Works

1. Run `wiki-tools.py backlinks <wiki_path>` to get full link graph
2. For each newly created page, check if other existing pages mention its title in prose without a wikilink
3. If so, read those pages and add missing wikilinks where the name appears naturally

## Purpose

Ensures every page has inbound links, not just outbound. Critical for [[Obsidian]] graph view and for [[Query]] link graph traversal.

## Sources
- [[Source - Ingest SKILL]]
