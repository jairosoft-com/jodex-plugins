---
title: Skill Creator for Jodex Plugins
type: idea
tags: [developer-experience, plugins, tooling, scaffolding, skill-authoring, jx-plugin]
created: 2026-05-20
updated: 2026-05-20
source_count: 1
aliases: [skill creator, skill scaffolder, jx-plugin:create-skill]
provenance: synthesis
status: completed
---

# Skill Creator for Jodex Plugins

Build a skill (`/jx-plugin:create-skill`) that scaffolds new Jodex plugin skills inside existing plugins, enforcing conventions, generating boilerplate, and validating integration with the ecosystem.

## Motivation

- 16 skills across 5 plugins today; manual authoring is error-prone and slow
- No enforcement of SKILL.md frontmatter shape, command stub format, or trigger uniqueness
- Growing ecosystem needs a repeatable, validated creation workflow

## ADO Link

Feature #204325 in Jodex project (`dev.azure.com/jairo/Jodex`)

## Groomed Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Plugin home | **jx-plugin** (new plugin) | Clean separation — tooling about tooling doesn't pollute role plugins |
| Scope | **Skill-only** (v1) | Scaffold new skills inside existing plugins; full plugin scaffolding deferred |
| UX mode | **Hybrid** | Flags for known values, interactive prompts for gaps |
| Validation | **Halt and report** | Fail-closed on conflicts — consistent with ecosystem pattern |
| Command | `/jx-plugin:create-skill` | Descriptive plugin name; leaves room for future `/jx-plugin:validate`, `/jx-plugin:list` |

## Artifacts Generated (per skill)

- `plugins/{plugin}/skills/{name}/SKILL.md` — frontmatter + phase skeleton
- `plugins/{plugin}/commands/{name}.md` — stub with allowed-tools frontmatter
- `plugins/{plugin}/skills/{name}/evals/evals.json` — empty eval skeleton

## Arguments

| Argument | Required | Notes |
|----------|----------|-------|
| `--plugin` | No | Target plugin (e.g., `jx-pm`). Prompted if missing. |
| `--skill` | No | Skill name (e.g., `idea`). Prompted if missing. |
| `--triggers` | No | Comma-separated trigger phrases. Prompted if missing. |
| `--description` | No | One-line skill description. Prompted if missing. |

## Validation Gates

- Skill name unique across all plugins (scan `plugins/*/skills/`)
- Target plugin directory exists
- SKILL.md frontmatter matches required schema (name, user-invocable, argument-hint, description)
- Trigger patterns don't overlap existing skills
- Command stub has required frontmatter (description, argument-hint, allowed-tools)
- On conflict: **halt**, show exactly what collides, require user to fix before retrying

## Adversarial Review Findings (2026-05-20)

Codex adversarial review surfaced 4 findings. All incorporated as design constraints below.

### [HIGH] Path confinement and no-overwrite safety

**Problem**: Skill names are not constrained to safe slugs. Names containing `..`, `/`, or matching existing command-only stubs (e.g., `browser` in jx-qa) could write outside intended directories or silently overwrite files.

**Design constraint**:
- Enforce `^[a-z][a-z0-9-]*$` regex for skill names — no dots, slashes, spaces, or uppercase
- Resolve every output path and assert it remains under the target plugin subdirectory (path confinement via `resolve()` + `relative_to()`)
- Fail if any target file or directory already exists — no silent overwrites
- Use exclusive creation with rollback: if any file write fails mid-scaffold, remove all files created in this run

### [HIGH] Trigger conflict detection misses existing formats

**Problem**: Existing skills use inconsistent trigger formats — `Triggers on:` (plural), `Trigger on:` (singular), broad wording, quoted/unquoted phrases. A naive parser matching only one format will miss real collisions.

**Design constraint**:
- Parser must handle both `Trigger(s)? on:` (singular and plural) in frontmatter description fields
- Normalize triggers: lowercase, strip quotes, trim whitespace
- Match on substring overlap, not just exact equality — `"run e2e"` should conflict with `"run e2e tests"`
- Add regression test cases covering every current `plugins/*/skills/*/SKILL.md` trigger format
- Future: consider moving triggers to structured frontmatter field (e.g., `triggers: [...]`) for machine-parseable extraction

### [MEDIUM] Do not ship unimplemented commands as user-invocable

**Problem**: Shipping a `/jx-plugin:validate` command stub with no real validation engine gives users a discoverable command that silently does nothing useful.

**Design constraint**:
- v1 ships only `/jx-plugin:create-skill` — one command, one skill
- `/jx-plugin:validate` and `/jx-plugin:list` remain in "Future Enhancements" only
- No command stubs for unimplemented features — a command `.md` file implies a working skill behind it

### [MEDIUM] Wiki provenance must not reference missing source pages

**Problem**: If a wiki plugin page references a source page like `Source - jx-plugin Plugin README` but that source page doesn't exist, the wiki graph has a broken provenance link.

**Design constraint**:
- When creating wiki pages for the new plugin, either:
  - Create the corresponding source page from `plugins/jx-plugin/README.md`, OR
  - Use `provenance: synthesis` and reference only existing source pages
- Run wiki-tools.py `broken-links` check post-filing to verify no dangling references

## Story Sketch

1. Scaffold new skill inside existing plugin (SKILL.md + command + evals) — with path confinement, no-overwrite, and rollback
2. Validate skill conventions (name regex, collision check, trigger uniqueness with multi-format parser)
3. Hybrid UX mode (flag + prompt)
4. Post-scaffold integration check (JSON lint, frontmatter validation, broken-link check)

## Future Enhancements

- Full plugin scaffolding (plugin.json, README, placeholder dirs)
- `/jx-plugin:validate` — lint existing skills against conventions
- `/jx-plugin:list` — inventory all skills across plugins
- Structured `triggers:` frontmatter field across all plugins (eliminates parser fragility)

## Risks

- Template drift as conventions evolve
- AGENTS.md "plan-before-code" gate — the creator generates code; should it self-gate?
- Trigger substring overlap detection may be too aggressive — need tuning threshold

## Sources

- ADO Feature #204325
- Codex adversarial review (2026-05-20): 2 high, 2 medium findings
