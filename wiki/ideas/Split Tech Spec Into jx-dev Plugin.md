---
title: Split Tech Spec Into jx-dev Plugin
type: idea
status: archived
archive_reason: implemented
updated: 2026-05-09
created: 2026-05-09
groomed: 2026-05-09
reviewed: 2026-05-09
review-rounds: 3
source: user request
tags:
  - plugin-architecture
  - jx-dev
  - jx-core
  - refactor
links:
  - "[[Skill]]"
  - "[[Plugin Architecture]]"
---

# Split Tech Spec Into jx-dev Plugin

## Idea

Extract developer-facing skills from `plugins/jx-pm/` into a new `plugins/jx-dev/` plugin. Also extract shared conventions into `plugins/jx-core/`.

## Motivation

Tech spec and task breakdown are developer-facing (architecture, API contracts, data models, ADRs). PRD and ADO sync are project-management-facing. Separating concerns:

- Cleaner namespace — dev tools under `jx-dev`, PM tools under `jx-pm`
- Independent evolution — dev skills grow without bloating PM plugin
- Future home for other dev-oriented skills (e.g., code review, scaffolding)

## Grooming Decisions

### Scope: Dev Skills (No Pipeline)
Move two skills to jx-dev:
- `techspec` → `/jx-dev:spec`
- `task` → `/jx-dev:task`

Keep in jx-pm:
- `prd` → `/jx-pm:prd`
- `ado` → `/jx-pm:ado`
- `pipeline` → `/jx-pm:pipeline` (reduced to prd-only until cross-plugin chaining designed)

No deprecation stubs needed — plugins not deployed to production, no current users.

### Reduced Pipeline Behavior
`/jx-pm:pipeline` delegates to `/jx-pm:prd` with same args. All other pipeline flags (e.g., `--chain-all`) return error until chaining is designed.

### Shared Conventions: Extract to jx-core
Create new `plugins/jx-core/` plugin containing:
- `id-rules.md` — folder validation, feature-number extraction, ID generation
- `docs-root.md` — output directory resolution convention
- `task-json-schema.md` — canonical task JSON structure (consumed by jx-dev:task and jx-pm:ado)

All three files must be rewritten to be plugin-neutral:
- Remove hardcoded `jx-pm` references from prose and command names
- Rename env var `$JX_PM_DOCS_ROOT` → `$JX_DOCS_ROOT`
- Env var precedence: `$JX_DOCS_ROOT` > `$JX_PM_DOCS_ROOT` (backward compat fallback) > default `docs/`
- `$JX_PM_DOCS_ROOT` is an explicit backward-compat exception — not considered a "hardcoded jx-pm reference"
- Use generic language ("all jx skills" not "all jx-pm skills")

### jx-core: Reference-Only Plugin
jx-core is a shared-convention provider with no user-invocable skills or commands. Exempt from `commands/` directory requirement. Contains only `plugin.json`, README, and `_shared/` convention files.

### Reference Mechanism: Relative Paths from SKILL.md
All relative paths anchored from SKILL.md location. Example:
- `plugins/jx-dev/skills/spec/SKILL.md` → `../../../jx-core/_shared/id-rules.md`
  (3 levels: `spec/` → `skills/` → `jx-dev/` → `plugins/jx-core/`)

### Plugin Dependencies
Each plugin's `plugin.json` must declare dependencies using a new `dependencies` field:
```json
{
  "name": "jx-dev",
  "version": "1.0.0",
  "dependencies": ["jx-core"]
}
```
- `jx-dev` depends on `jx-core`
- `jx-pm` depends on `jx-core`
- Sibling layout assumed: all plugins under `plugins/`
- This is a new convention — existing plugins don't use `dependencies` yet

### Chaining: Fully Deferred
- Remove `--chain` and `--chain-all` from moved skills (spec, task)
- Remove `--chain` and `--chain-all` from retained `jx-pm:prd`
- `/jx-pm:pipeline` reduced to prd-only until chaining designed
- Cross-plugin chaining logged as future work

### Plugin Structure: Mirror Existing Plugins
Follow same structure as jx-pm and jx-qa — include `.claude-plugin/plugin.json`, `commands/`, README. Exception: jx-core is reference-only (no commands).

### Plugin Structure (Target)

```
plugins/
├── jx-core/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── README.md
│   └── _shared/
│       ├── id-rules.md
│       ├── docs-root.md
│       └── task-json-schema.md
├── jx-dev/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── README.md
│   ├── commands/
│   │   ├── spec.md
│   │   └── task.md
│   └── skills/
│       ├── spec/
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── template.md
│       │       └── diagram-patterns.md
│       └── task/
│           └── SKILL.md
└── jx-pm/
    ├── .claude-plugin/
    │   └── plugin.json
    ├── README.md
    ├── CLAUDE.md
    ├── commands/
    │   ├── prd.md
    │   ├── ado.md
    │   └── pipeline.md
    └── skills/
        ├── prd/SKILL.md
        ├── ado/SKILL.md
        └── pipeline/SKILL.md
```

## Acceptance Criteria

- [ ] `plugins/jx-core/` exists with `.claude-plugin/plugin.json`, README, and all shared convention files
- [ ] `plugins/jx-dev/` exists with `.claude-plugin/plugin.json`, README, `commands/`, and `skills/`
- [ ] `plugin.json` for jx-dev and jx-pm include `"dependencies": ["jx-core"]`
- [ ] `/jx-dev:spec` invocable and produces TECH_SPEC.md in correct docs folder
- [ ] `/jx-dev:task` invocable and produces task.json in correct docs folder
- [ ] `/jx-pm:prd` still invocable, no `--chain` or `--chain-all` flags
- [ ] `/jx-pm:ado` still invocable, reads task.json via jx-core schema reference
- [ ] `/jx-pm:pipeline` delegates to `/jx-pm:prd`; old flags return error
- [ ] `grep -r "jx-pm:techspec\|jx-pm:task" plugins/` returns zero matches
- [ ] All three shared convention files contain no hardcoded `jx-pm` references (except `$JX_PM_DOCS_ROOT` fallback)
- [ ] `$JX_DOCS_ROOT` works with precedence over `$JX_PM_DOCS_ROOT` fallback
- [ ] All relative path references from jx-dev/jx-pm to jx-core resolve correctly from SKILL.md locations (3 levels up)
- [ ] README exists in jx-core and jx-dev
- [ ] jx-core has no `commands/` directory (reference-only plugin)

## Future Work

- Cross-plugin chaining design (prd → spec → task → ado across jx-pm/jx-dev boundary)
- Restore pipeline to full orchestration once chaining implemented (pipeline stays in jx-pm long-term)
- jx-dev CLAUDE.md with dev-specific guidance
- Potential new jx-dev skills: code review, scaffolding, test generation
