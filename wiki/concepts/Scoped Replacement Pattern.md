---
title: Scoped Replacement Pattern
type: concept
tags: [pattern, naming, safety, refactoring]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [scoped replacement, safe bulk rename]
provenance: synthesis
---

# Scoped Replacement Pattern

When bulk-renaming tokens across a codebase, blind find-replace corrupts identifiers where the target token is a substring of a larger identifier.

## The Problem

Replacing `qa-ai` globally also corrupts `jodex-qa-ai` (repo name) into `jodex-jx-qa`. The old token disappears from grep, so verification passes — the corruption is silent.

## The Pattern

1. **Scope each replacement** — define exactly which syntactic positions get replaced (slash commands, manifest names, directory paths, install coordinates) and which do not (repo names, upstream concept references)
2. **Use token-specific checks** — instead of one grep for the old token, run separate checks for each actionable form: `/old-name:`, `old-name@`, `plugins/old-name/`, `"name": "old-name"`
3. **Add negative corruption checks** — grep for known bad outputs (`jodex-jx-qa`, `karpathy/jx-kb`) that would indicate blind replacement damage
4. **Never filter whole lines** — filtering `grep -v "jodex-qa-ai"` hides any stale plugin ID that happens to share a line with the repo name

## When It Applies

- Plugin/package renames where the old name is embedded in a longer identifier
- Any bulk rename where the token appears in multiple semantic contexts (slug, path component, prose, upstream reference)

## Example from This Project

The `qa-ai` → `jx-qa` rename required scoped rules because `qa-ai` appeared as:
- Plugin slug: `qa-ai` (replace)
- Slash command: `/qa-ai:extract` (replace)
- Install coordinate: `qa-ai@jodex-plugins` (replace)
- Repo name: `jodex-qa-ai` (preserve)

## Related

- [[Naming Ripple Effect]] — rename cascade touch points
- [[Iterative Adversarial Review]] — caught this issue during plan review
