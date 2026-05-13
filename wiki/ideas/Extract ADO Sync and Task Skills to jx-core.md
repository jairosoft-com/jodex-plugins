---
title: Extract ADO Sync and Task Skills to jx-core
type: idea
status: backlogged
updated: 2026-05-12
created: 2026-05-12
groomed: 2026-05-12
source: user request
provenance: synthesis
source_count: 0
aliases:
  - Extract ADO Sync and Task Skills to jx-core
tags:
  - plugin-architecture
  - jx-core
  - jx-dev
  - jx-pm
  - refactor
  - cross-role
links:
  - "[[Plugin Architecture]]"
  - "[[Skill]]"
  - "[[Core Shared Conventions Plugin|jx-core]]"
  - "[[Developer Skills Plugin|jx-dev]]"
---

# Extract ADO Sync and Task Skills to jx-core

## Idea

Centralize `ado` and `task` skill logic in `plugins/jx-core/_shared/` so any role plugin can adopt them without duplicating logic. Role plugins keep their own command entry points and thin SKILL.md stubs that delegate to the shared core files. `jx-core` gains no user-invocable commands but is explicitly reclassified to hold executable shared logic alongside conventions.

## Motivation

`ado` and `task` are not role-exclusive. Any role may need to:
- Sync work items with Azure DevOps (`ado`)
- Generate or consume `task.json` for execution tracking (`task`)

Keeping full logic in role-specific plugins means every new role that needs ADO sync must copy 200+ lines of SKILL.md. Centralizing in `jx-core/_shared/` keeps logic DRY while preserving role-plugin ownership of command surfaces.

## Grooming Decisions

### Approach: Option B — Shared Core, Role-Plugin Wrappers

- Move skill logic bodies to `jx-core/_shared/ado.md` and `jx-core/_shared/task.md`
- `jx-pm/skills/ado/SKILL.md` → thin stub: delegates to `../../../jx-core/_shared/ado.md`
- `jx-dev/skills/task/SKILL.md` → thin stub: delegates to `../../../jx-core/_shared/task.md`
- `jx-pm/commands/ado.md` and `jx-dev/commands/task.md` — **unchanged**
- Users still invoke `/jx-pm:ado` and `/jx-dev:task` — no surface change
- `jx-core` gains no user-invocable commands — remains command-free

### jx-core Contract Change (explicit)

This implementation **reclassifies `jx-core`** from pure-reference (ID rules, path conventions, schemas) to shared-convention-plus-executable-logic. This is an intentional, approved boundary expansion. The following must be updated as part of this work:

- `plugins/jx-core/README.md` — remove "reference-only" language; describe new scope
- `plugins/jx-core/.claude-plugin/plugin.json` — update `description` to reflect expanded role
- `wiki/plugins/Core Shared Conventions Plugin.md` — update wiki page to match new contract

### Security: Destructive Gates Live in the Shared File, Not Wrappers

`ado` has destructive operations (`--prune`, `--new-tenant`, force-recreate, state-sync). The confirmation gates (`rebind`, `prune`, `recreate`, `sync`) currently live inside `jx-pm/skills/ado/SKILL.md`. When that body moves to `jx-core/_shared/ado.md`, the gates move with it — they are part of the shared logic, not the role wrapper.

Role-plugin wrappers own only:
- `allowed-tools` declaration (Azure MCP write tools stay in the command file)
- `$ARGUMENTS` passthrough

The shared `jx-core/_shared/ado.md` must contain all four confirmation gates intact. Thin stubs in role plugins cannot bypass them.

### Why Not Option A (expand jx-core to have commands)

Codex adversarial review flagged: exposing `/jx-core:ado` and `/jx-core:task` directly creates plugin-boundary regression and risks compatibility issues across manifests and command discovery.

### Adding a New Role Later

When a second role (e.g., jx-qa) needs ADO sync:
1. Add `"jx-core"` to `dependencies` in `jx-qa/.claude-plugin/plugin.json`
2. Add `jx-qa/commands/ado.md` (mirror `allowed-tools` from `jx-pm/commands/ado.md` exactly)
3. Add `jx-qa/skills/ado/SKILL.md` (thin stub pointing to `../../../jx-core/_shared/ado.md`)
4. Zero logic changes in jx-core

The `jx-core` dependency declaration is **required** — without it, a fresh marketplace install of the role plugin will not have `jx-core/_shared/ado.md` available and ADO sync will fail silently.

## Acceptance Criteria

### Core Logic Migration
- [ ] `jx-core/_shared/ado.md` contains full ADO sync skill logic (moved from `jx-pm/skills/ado/SKILL.md`)
- [ ] `jx-core/_shared/task.md` contains full task conversion skill logic (moved from `jx-dev/skills/task/SKILL.md`)
- [ ] `jx-pm/skills/ado/SKILL.md` is a thin stub delegating to `../../../jx-core/_shared/ado.md`
- [ ] `jx-dev/skills/task/SKILL.md` is a thin stub delegating to `../../../jx-core/_shared/task.md`

### Surface Unchanged
- [ ] `jx-pm/commands/ado.md` unchanged — `/jx-pm:ado` still invocable with same arguments and allowed-tools
- [ ] `jx-dev/commands/task.md` unchanged — `/jx-dev:task` still invocable with same arguments and allowed-tools
- [ ] `jx-core` has no `commands/` directory and no user-invocable skills

### jx-core Contract Update
- [ ] `plugins/jx-core/README.md` updated — "reference-only" language removed, new scope described
- [ ] `plugins/jx-core/.claude-plugin/plugin.json` description updated
- [ ] `wiki/plugins/Core Shared Conventions Plugin.md` updated to reflect expanded contract

### Security
- [ ] `jx-core/_shared/ado.md` contains all four confirmation gates: `rebind` (`--new-tenant`), `prune` (`--prune`), `recreate` (force-recreate), `sync` (state-sync)
- [ ] Thin role stubs cannot bypass gates — no gate logic in stubs, all gate logic in shared file
- [ ] `allowed-tools` in `jx-pm/commands/ado.md` unchanged — Azure MCP write tools declared at command level, not in jx-core
- [ ] Any new role wrapper for `ado` must mirror `allowed-tools` from `jx-pm/commands/ado.md` exactly

### Manifest Dependencies
- [ ] `jx-pm/.claude-plugin/plugin.json` already declares `"jx-core"` in dependencies (verify unchanged)
- [ ] `jx-dev/.claude-plugin/plugin.json` already declares `"jx-core"` in dependencies (verify unchanged)
- [ ] Any future role plugin referencing `jx-core/_shared/*` must declare `"dependencies": ["jx-core"]`

### Schema
- [ ] `task-json-schema.md` in `jx-core/_shared/` remains single source of truth for task structure
- [ ] All relative path references in shared files resolve correctly
