---
title: wiki-tools.py
type: code
tags: [script, python, helper]
created: 2026-05-07
updated: 2026-05-07
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

## Security

- All paths validated via [[Path Confinement]] (`Path.relative_to()`)
- Symlink resolution before containment check
- Shell metacharacter rejection
- Output as JSON for reliable parsing

## Sources
- [[Source - LLM Wiki README]]
