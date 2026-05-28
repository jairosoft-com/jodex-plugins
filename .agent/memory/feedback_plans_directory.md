---
name: feedback-plans-directory
description: Plans directory is configured in settings.local.json — use .agent/plans/ not ~/.claude/plans/
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 70d98647-8f88-4f1d-a2d1-f72f9d74cea8
---

The plans directory is set to `.agent/plans/` via `plansDirectory` in `.claude/settings.local.json`. Do not use the default `~/.claude/plans/` path.

**Why:** User has a repo-local plans directory configured for version control and IDE visibility.

**How to apply:** Before writing a plan file, check `settings.local.json` for `plansDirectory`. Write to that path (relative to repo root) instead of the system default.
