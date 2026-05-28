---
title: wiki-tools.py
type: code
tags: [script, python, helper]
created: 2026-05-07
updated: 2026-05-12
source_count: 1
aliases: [wiki-tools]
provenance: source-derived
---

# wiki-tools.py

[[Pinned Helper]] script for the [[Knowledge Base Plugin|jx-kb]] plugin. Python 3, stdlib-only (no external dependencies).

## Location

`plugins/jx-kb/scripts/wiki-tools.py`

## Commands

| Command | Purpose |
|---------|---------|
| `fingerprint <path>` | SHA-256 hash + file size for dedup |
| `snapshot <source> <wiki>` | Copy source to `wiki/raw/sources/<sha256_prefix>-<filename>` |
| `backlinks <wiki>` | Generate full wikilink graph for cross-reference pass |
| `orphans <wiki>` | Find pages with no inbound links |
| `broken-links <wiki>` | Find wikilinks that point to missing maintained pages |
| `frontmatter-check <wiki>` | Validate required frontmatter on maintained pages |
| `page-list <wiki>` | List maintained pages on disk |

## Maintained Page Scope

Structural checks intentionally exclude `wiki/raw/` snapshots. Raw snapshots preserve source-file bytes and examples, so treating them as maintained pages creates false frontmatter, broken-link, and orphan warnings. The helper still writes raw snapshots through `snapshot`; it just keeps them out of graph-health commands.

## Security

- All paths validated via [[Path Confinement]] (`Path.relative_to()`)
- Symlink resolution before containment check
- Shell metacharacter rejection
- Output as JSON for reliable parsing

## Sources
- [[Source - JX KB README]]
