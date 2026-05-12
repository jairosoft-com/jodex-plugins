---
title: Obsidian
type: entity
tags: [tool, editor, markdown]
created: 2026-05-07
updated: 2026-05-12
source_count: 2
aliases: [Obsidian.md]
provenance: source-derived
---

# Obsidian

A markdown-based knowledge management application that serves as the primary viewer/IDE for LLM wikis. In the wiki workflow, Obsidian is the IDE, the LLM is the programmer, and the wiki is the codebase.

## Key Features for Wiki Use

- **Graph view** — visualizes wiki page connections; best way to see wiki shape, hubs, and orphans
- **Wikilinks** — resolves double-bracket page links to matching `.md` files natively
- **Web Clipper** — browser extension that converts web articles to markdown for the [[Raw Sources]] collection
- **Download attachments** — hotkey to download all images in a clipped article to local disk
- **[[Marp Integration|Marp]] plugin** — renders markdown slide decks
- **[[Dataview Queries|Dataview]] plugin** — runs queries over page YAML frontmatter

## Integration Pattern

User has Obsidian open on one side and the LLM agent on the other. The LLM makes edits, and the user browses results in real time — following links, checking graph view, reading updated pages.

## [[Knowledge Base Plugin|jx-kb]] Plugin Compatibility

- Wikilinks resolve natively in Obsidian
- YAML frontmatter compatible with [[Dataview Queries|Dataview]] plugin
- Conflict callouts render as styled callout blocks
- Graph view shows full wiki knowledge graph
- Aliases in frontmatter enable alternate page name resolution

## Sources
- [[Source - LLM Wiki]]
- [[Source - JX KB README]]
