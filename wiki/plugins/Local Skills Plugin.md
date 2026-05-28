---
title: Local Skills Plugin
type: plugins
tags: [plugin, jx-local, scaffolding, local-skills]
created: 2026-05-27
updated: 2026-05-27
source_count: 0
aliases: [jx-local]
provenance: synthesis
---

# Local Skills Plugin (jx-local)

Plugin for scaffolding local project-level skills in a user's `.claude/skills/` directory, distinct from [[Plugin Scaffolding Plugin|jx-plugin]] which targets Jodex plugin directories. Fills the gap between the plugin ecosystem and project-scoped local skills.

- First skill: `create-skill` — 5-phase spec with `local-skill-creator.py` [[Pinned Helper]] (5 subcommands: validate-name, check-collision, check-triggers, scaffold, verify)
- Scaffolds `SKILL.md` with proper frontmatter and optional extras (evals, scripts, templates, references)
- Uses [[Lock-File Guard for Atomic Scaffolding]] with ownership tracking for concurrent safety
- Reports [[Discovery State Classification]] so users know whether the skill is usable immediately or requires a restart
- Follows [[Skill Creator Validates End-to-End Before Writing]] pattern: validate all → confirm → write

## Sources
- Session: jx-local create-skill implementation (2026-05-27)
