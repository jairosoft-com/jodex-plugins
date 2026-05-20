---
name: create-plugin
user-invocable: true
argument-hint: "[--plugin <jx-name>] [--description \"...\"] [--category <productivity|knowledge|core>] [--author \"...\"]"
description: >
  Scaffold a new Jodex plugin skeleton and register it in the root marketplace.
  Creates package metadata, README, component ABOUT files, and one marketplace entry.
  Triggers on: "create plugin", "scaffold plugin", "new plugin", "add plugin to marketplace",
  /jx-skill:create-plugin, or any request to create a new Jodex plugin skeleton.
  Do not trigger for: creating skills inside existing plugins, plugin installation, wiki operations.
---

# Plugin Creator

Scaffold a new Jodex plugin skeleton and append it to `.claude-plugin/marketplace.json`.

## Arguments

| Argument | Flag | Required | Default | Notes |
|----------|------|----------|---------|-------|
| Plugin name | `--plugin` | Yes | - | Must match `^jx-[a-z0-9]+(?:-[a-z0-9]+)*$`. |
| Description | `--description` | Yes | - | One-line plugin description. |
| Category | `--category` | No | `productivity` | One of `productivity`, `knowledge`, `core`. |
| Author | `--author` | No | `Jairosoft` | Name only. |

Use repo root `${CLAUDE_PLUGIN_ROOT}/../..` when invoking the helper.

---

## Phase 1: Parse Arguments

Extract values from invocation flags. Prompt for any missing required value:

1. `--plugin`: "What should the new plugin be called? Use `jx-...`, lowercase and hyphenated."
2. `--description`: "One-line description for the new plugin:"

If `--category` is missing, use `productivity`. If provided, it must be one of `productivity`, `knowledge`, or `core`.

If `--author` is missing, use `Jairosoft`.

---

## Phase 2: Validate Inputs

Run validations sequentially. Halt on first failure and show the exact problem.

### Step 2a - Name validation

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/plugin-creator.py" validate-name <plugin_name>
```

If the result is not `"valid": true`, ask for a corrected plugin name.

### Step 2b - Collision check

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/plugin-creator.py" check-collision <plugin_name> "${CLAUDE_PLUGIN_ROOT}/../.."
```

Reject collisions with:
- `plugins/<plugin_name>/`
- any marketplace entry with the same `name`
- any marketplace entry whose `source` resolves to `./plugins/<plugin_name>`

### Step 2c - Category check

If `--category` was provided, reject anything outside `productivity`, `knowledge`, or `core`.

---

## Phase 3: Confirm with User

Display the planned artifacts and require explicit confirmation before writing.

```
## Planned Plugin Scaffold

Plugin: <plugin>
Description: <description>
Category: <category>
Author: <author>
Marketplace source: ./plugins/<plugin>

| # | File | Action |
|---|------|--------|
| 1 | plugins/<plugin>/.claude-plugin/plugin.json | CREATE |
| 2 | plugins/<plugin>/README.md | CREATE |
| 3 | plugins/<plugin>/commands/ABOUT.md | CREATE |
| 4 | plugins/<plugin>/skills/ABOUT.md | CREATE |
| 5 | plugins/<plugin>/scripts/ABOUT.md | CREATE |
| 6 | plugins/<plugin>/agents/ABOUT.md | CREATE |
| 7 | plugins/<plugin>/hooks/ABOUT.md | CREATE |
| 8 | plugins/<plugin>/prompts/ABOUT.md | CREATE |
| 9 | plugins/<plugin>/schemas/ABOUT.md | CREATE |
| 10 | .claude-plugin/marketplace.json | APPEND entry |

No command stubs, skill stubs, dependencies, or first-skill content will be generated.

Proceed? (yes/no)
```

Do not run the scaffold command until the user confirms with an affirmative answer.

---

## Phase 4: Scaffold

Run the pinned helper:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/plugin-creator.py" scaffold <plugin_name> "${CLAUDE_PLUGIN_ROOT}/../.." --description "<description>" --category "<category>" --author "<author>"
```

The helper stages files first, moves the completed plugin directory into place, appends the marketplace entry, verifies the result, and rolls back created artifacts on failure.

---

## Phase 5: Verify and Report

### Step 5a - Helper verification

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/plugin-creator.py" verify <plugin_name> "${CLAUDE_PLUGIN_ROOT}/../.."
```

### Step 5b - JSON lint

```bash
python3 -m json.tool .claude-plugin/marketplace.json
python3 -m json.tool plugins/<plugin_name>/.claude-plugin/plugin.json
```

### Step 5c - Report

```
## Plugin Scaffolded

Plugin: <plugin>
Marketplace source: ./plugins/<plugin>

### Files Created
- plugins/<plugin>/.claude-plugin/plugin.json
- plugins/<plugin>/README.md
- plugins/<plugin>/commands/ABOUT.md
- plugins/<plugin>/skills/ABOUT.md
- plugins/<plugin>/scripts/ABOUT.md
- plugins/<plugin>/agents/ABOUT.md
- plugins/<plugin>/hooks/ABOUT.md
- plugins/<plugin>/prompts/ABOUT.md
- plugins/<plugin>/schemas/ABOUT.md

### Next Step
Run `/jx-skill:create --plugin <plugin>` to add the first skill.
```
