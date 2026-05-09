---
title: Configurable Default Chain
type: concept
tags: [pattern, configuration, plugin, portability]
created: 2026-05-09
updated: 2026-05-09
source_count: 2
aliases: [config resolution order, flag-env-default, three-level config]
provenance: synthesis
---

# Configurable Default Chain

A three-level resolution order for any configurable value: CLI flag (highest) → environment variable → hardcoded default (lowest).

## Resolution Order

```
1. --flag <value>        (explicit per-invocation)
2. $ENV_VARIABLE         (per-project/session)
3. Hardcoded default     (universal fallback)
```

## Why Three Levels

| Level | Use case | Persistence |
|---|---|---|
| CLI flag | One-off override, testing | None (single invocation) |
| Env var | Project-wide convention | Shell session or .env |
| Default | Works out of the box | Permanent |

## Example: docs-root in jx-pm

```
1. --docs-root ./requirements/   → uses ./requirements/
2. $JX_PM_DOCS_ROOT=./specs/     → uses ./specs/
3. (neither set)                  → uses docs/
```

## Design Rules

- Default must be sensible for 80% of projects (don't force config)
- Env var name: `{PLUGIN_PREFIX}_{SETTING_NAME}` in SCREAMING_SNAKE
- Flag always wins (even if env var is set)
- Document all three levels in `_shared/` reference file

## Anti-Patterns

- **No default:** forces every user to configure before first use
- **Only CLI flag:** no way to set project-wide without repeating every invocation
- **Only env var:** invisible configuration, hard to discover
- **Memory-only:** stale across sessions, no audit trail (use for suggestions, not authority)

## Application

Used by all jx-pm skills for `docs-root` resolution. Could apply to any configurable: output format, template selection, ADO project, etc.

## Related

- [[Settings Portability]] — settings.json vs settings.local.json split (different pattern, same goal)
- [[Shared Reference Extraction]] — where config resolution is documented (`_shared/docs-root.md`)
- [[Product Management Skills Plugin]] — uses this for docs-root

## Sources
- [[Source - Docs Root Config]]
- [[Source - PRD Generator SKILL]]
