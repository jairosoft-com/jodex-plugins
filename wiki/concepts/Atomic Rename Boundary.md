---
title: Atomic Rename Boundary
type: concept
tags: [pattern, naming, git, safety]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [atomic rename, rename atomicity]
provenance: synthesis
---

# Atomic Rename Boundary

When renaming a plugin or package, all runtime-critical changes must land in a single commit. Splitting directory moves from manifest updates creates broken intermediate states.

## The Problem

A two-commit strategy — commit 1 moves directories, commit 2 updates manifests — leaves commit 1 in a broken state: the marketplace points at `./plugins/old-name` which no longer exists. Any checkout, bisect, rollback, or CI run at that commit fails plugin resolution.

## The Rule

The **rename triad** must be atomic (one commit):
1. Directory rename (`git mv plugins/old plugins/new`)
2. Plugin manifest (`plugin.json` name field)
3. Marketplace manifest (`marketplace.json` name + source path)
4. Settings files (permission keys referencing plugin name)

## What Can Be Split

Documentation and content changes (READMEs, wiki pages, slash command references in prose) can safely go in a follow-up commit. These don't affect runtime resolution — they're cosmetic until the next human reads them.

## Commit Strategy

```
Commit 1: git mv + plugin.json + marketplace.json + settings  (atomic runtime rename)
Commit 2: READMEs, wiki, docs, source pages                   (content updates)
```

## Related

- [[Naming Ripple Effect]] — full list of rename touch points
- [[Scoped Replacement Pattern]] — safe bulk replacement rules
- [[Plugin Architecture]] — plugin resolution mechanism
