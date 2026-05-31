---
title: Codex Adversarial Review Fails From Inside a Git Worktree
type: idea
tags: [codex, worktree, troubleshooting, adversarial-review]
created: 2026-05-30
updated: 2026-05-30
source_count: 0
aliases: []
provenance: synthesis
status: raw
---

# Codex Adversarial Review Fails From Inside a Git Worktree

The codex-companion `adversarial-review` aborts in ~1s with `failed to load
configuration: No such file or directory (os error 2)` when its working directory
is **inside a git worktree** (e.g. `.claude/worktrees/*`). The same
`~/.codex/config.toml` reviews successfully from the **repo root**, so it is not a
config defect and not auth.

- Root cause is the **worktree cwd**, not `config.toml` (which loads fine from the
  main checkout) and not auth — `setup` reports `ready: true` and `app-server`
  init / `thread/start` both succeed.
- Misdiagnoses easily as a config/auth failure; it is neither.
- **Fix:** run Codex reviews from the **repo root**. For review-and-fix loops,
  review at the repo root and ff-merge each fix to `main` so re-reviews see the
  latest.

Distinct cause from [[Codex Adversarial Review Fails on Stale config.toml Skill Paths]].
Related: [[Worktree Isolation Guard Needs Initialized Worktree]].

## Sources
- Session: jx-qa coverage build + Codex-worktree & plugin-loading gotchas (2026-05-30)
