---
title: Plugin Consolidation Pattern
type: idea
tags: [plugin, migration, pattern, refactoring]
status: raw
created: 2026-05-26
updated: 2026-05-26
source_count: 0
aliases: [plugin merge, skill migration]
provenance: synthesis
---

# Plugin Consolidation Pattern

Merging two plugins — moving skills from a source plugin to a target, then retiring the source — is a distinct operation from renaming a single plugin. The target may already exist with its own metadata and content that needs reconciliation.

- Process: copy artifacts → update all internal references → update external references → delete source → validate no stale references remain
- When the target plugin already exists (e.g., as a skeleton), its description, README, and ABOUT files must be reconciled with the incoming skills rather than simply overwritten
- Skill names may change during migration (e.g., `create` → `create-skill`), compounding the [[Naming Ripple Effect]] cascade
- The marketplace entry for the source plugin must be removed, and the target entry updated to reflect its new capabilities

## Post-Consolidation Cleanup

Code-level consolidation (marketplace, manifests, docs) is necessary but not sufficient. Stale references can persist in surfaces outside the repository:

- **Global user settings** (`~/.claude/settings.json`): `enabledPlugins` entries for the retired plugin survive repo-scoped changes and cause `/doctor` errors ("Plugin not found in marketplace")
- **Bytecode cache**: Python `.pyc` files from retired plugin helper scripts survive git-tracked deletion; the source directory may appear non-empty even after all source files are removed
- **Verification**: `/doctor` detects orphaned plugin references, providing a completeness check for the consolidation

## Example

`jx-skill` (2 skills: `create`, `create-plugin`) merged into `jx-plugin` (empty skeleton). `create` was renamed to `create-skill` during the move. 49 files changed across plugins, manifests, docs, and wiki.

## Related

- [[Naming Ripple Effect]] — rename cascade touch points, including skill-migration-specific additions
- [[Scoped Replacement Pattern]] — substring hazard avoidance during bulk renames
- [[Plugin Architecture]] — plugin format and structure

## Sources

- Session: jx-skill to jx-plugin migration (2026-05-26)
- Session: doctor-fix cleanup (2026-05-26)
