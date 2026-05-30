---
title: Codex Adversarial Review Fails on Stale config.toml Skill Paths
type: idea
tags: [codex, config, troubleshooting]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
aliases: []
provenance: session-observation
status: raw
---

# Codex Adversarial Review Fails on Stale config.toml Skill Paths

The codex-companion `adversarial-review` aborts in ~1s with "failed to load configuration: No such file or
directory" when `~/.codex/config.toml` has `[[skills.config]]` entries whose `path` points to **deleted**
`SKILL.md` files (e.g. removed figma / google-drive skills).

- `setup --json` reports `ready: true` (it checks auth + CLI, not skill-path validity), so it looks like an
  auth/runtime failure but isn't.
- Fix: remove the dead `[[skills.config]]` blocks (often `enabled = false` already); back up the file first.

Distinct from [[Codex Shared Runtime Auth Recovery]] (stale broker auth) — this is a config-load failure on
missing skill paths.

## Sources
- Session: jx-qa reviewer build + tool-scoping security (2026-05-29)
