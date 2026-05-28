---
title: Reject Core and Self Plugin Targets in Scaffold
type: idea
tags: [jx-plugin, validation, plugin-boundaries, safety]
created: 2026-05-20
updated: 2026-05-20
source_count: 0
aliases: [core target guard, self-scaffold guard]
provenance: synthesis
status: backlogged
---

# Reject Core and Self Plugin Targets in Scaffold

Add a blocklist check to `/jx-plugin:create-skill` so `--plugin jx-core` and `--plugin jx-plugin` are rejected even when passed as explicit flags, not just filtered from the interactive list.

## Context

SKILL.md Phase 1 excludes `jx-core` (no user-facing commands) and `jx-plugin` (self) from the interactive plugin picker. But if the user passes `--plugin jx-core` directly, Phase 1 is skipped and Step 2b only checks directory existence. This allows scaffolding into boundary-violating targets.

Low risk — requires intentional misuse via flags. The LLM won't suggest it. Could be a simple blocklist in the helper's `scaffold` subcommand or `check-collision`.

Urgency: 4/10

## Sources

- Codex review round 6 finding P2 (2026-05-20)
