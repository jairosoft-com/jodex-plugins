---
title: Surgical Rollback Pattern
type: idea
tags: [pattern, rollback, safety, git]
created: 2026-05-26
updated: 2026-05-26
source_count: 0
aliases: [targeted rollback, operation-scoped rollback]
provenance: synthesis
status: raw
---

# Surgical Rollback Pattern

When documenting rollback instructions, scope the revert to exactly the changes made by the current operation — do not use broad resets that discard unrelated uncommitted work.

## Key Claims

- `git checkout -- <file>` is dangerous in rollback instructions: it discards ALL uncommitted changes to the file, not just those made by the current operation
- Prefer targeted surgical undo: remove only the specific entry or change added by the operation (e.g., remove just the new plugin entry from `marketplace.json` rather than reverting the whole file)
- Pattern: provide an inline script or editor instruction that identifies and removes the specific delta, leaving all other changes intact
- Emerged from adversarial review R2-F6 during jx-plugin scaffold plan hardening

## Related

- [[Idempotent Operation]] — related safe-rerun pattern
- [[Per-Item Write-Back]] — related crash-recovery pattern
- [[Path Confinement]] — related safety scoping principle

## Sources

- Session: jx-plugin scaffolding (2026-05-26)
