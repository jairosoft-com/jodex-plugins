---
title: Fix Promotion Rename Link Retargeting
type: idea
tags: [wiki, lint, promotion, wikilinks, provenance]
created: 2026-05-18
updated: 2026-05-18
source_count: 0
aliases: [promotion link corruption, idea rename link drift]
provenance: session-derived
status: raw
---

# Fix Promotion Rename Link Retargeting

When an idea is promoted to a code/ page, the idea file gets renamed with a `(Promoted)` suffix while the new code/ page takes the original basename. Historical wikilinks in `_log.md` that pointed to the idea now silently resolve to the code/ page instead, corrupting lifecycle provenance.

## Problem

Obsidian resolves wikilinks by filename. After promotion:
- `[[Azure DevOps MCP Installation for Claude Code CLI]]` in old log entries → resolves to the new code/ page, not the promoted idea
- The audit trail loses its link to the original idea context

## Possible Approaches

- Update historical log wikilinks to use the `(Promoted)` suffix at promotion time
- Keep the promoted idea at the original basename and give the code/ page a different name
- Add a lint rule that detects ambiguous post-promotion link targets

## Source

Adversarial review finding (2026-05-18) during plan review of the ADO MCP Installation idea promotion.

## Related

- [[Idea Lifecycle]]
- [[Lint]]
- [[Log]]
