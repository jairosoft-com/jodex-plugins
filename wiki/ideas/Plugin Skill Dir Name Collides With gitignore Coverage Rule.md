---
title: Plugin Skill Dir Name Collides With gitignore Coverage Rule
type: idea
tags: [gitignore, plugins, troubleshooting, claude-code]
created: 2026-05-30
updated: 2026-05-30
source_count: 0
aliases: []
provenance: synthesis
status: raw
---

# Plugin Skill Dir Name Collides With gitignore Coverage Rule

A plugin skill directory whose name matches a conventional `.gitignore` entry is
**silently untracked**. Building `plugins/jx-qa/skills/coverage/` tripped the
standard `coverage/` rule (test-coverage output), so `SKILL.md` + `evals.json`
never staged even though the command file and README did — leaving a command
pointing at a non-existent skill.

- Watch for skill/dir names that collide with common ignores: `coverage/`,
  `build/`, `dist/`, `out/`, `tmp/`, `cache/`.
- `git commit` gives **no error** — the files just don't stage. Catch it by
  checking `git ls-files <path>` after committing/merging.
- **Fix:** a targeted negation in `.gitignore`, e.g.
  `!plugins/jx-qa/skills/coverage/` plus `!plugins/jx-qa/skills/coverage/**`.

Related: [[Settings Portability]].

## Sources
- Session: jx-qa coverage build + Codex-worktree & plugin-loading gotchas (2026-05-30)
