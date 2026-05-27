---
title: Discovery State Classification
type: concept
tags: [pattern, claude-code, skill-discovery, local-skills]
created: 2026-05-27
updated: 2026-05-27
source_count: 0
aliases: []
provenance: synthesis
---

# Discovery State Classification

Three-state classification for reporting whether a scaffolded local skill is discoverable in the current Claude Code session. Applied with explicit precedence to avoid ambiguous reporting.

- **External target** (highest priority): project root is outside the current session — "Start Claude in `<path>` or use `/add-dir`"
- **Newly created `.claude/skills/`** (medium): directory chain was just created — "Restart Claude Code to discover this skill"
- **Usable now** (lowest priority): `.claude/skills/` already existed — "Skill is ready — invoke with `/<name>`"

Session-added directories (via `/add-dir`) are not detectable from helper script tools, so the classification is limited to 3 observable categories: active cwd/git-root, ancestor directory, and external path.

Used by [[Local Skills Plugin]] `create-skill` in Phase 2d (discovery preflight) and Phase 5 (verify & report).

## Sources
- Session: jx-local create-skill implementation (2026-05-27)
