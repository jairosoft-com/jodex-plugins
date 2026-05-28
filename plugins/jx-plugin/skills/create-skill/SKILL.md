---
name: create-skill
user-invocable: true
argument-hint: "[--plugin <name>] [--skill <name>] [--triggers \"...\"] [--description \"...\"]"
description: >
  Scaffold a new skill inside an existing Jodex plugin. Creates SKILL.md,
  command stub, and evals skeleton with convention enforcement, trigger
  uniqueness checking, and validated boilerplate.
  Triggers on: "create skill", "scaffold skill", "new skill", "add skill to plugin",
  /jx-plugin:create-skill, or any request to scaffold or create a new skill in a Jodex plugin.
  Do not trigger for: plugin scaffolding, skill validation, skill listing, wiki operations.
---

# Skill Creator

Scaffold a new skill inside an existing Jodex plugin with convention enforcement.

## Arguments

| Argument | Flag | Required | Default | Notes |
|----------|------|----------|---------|-------|
| Target plugin | `--plugin` | Yes | — | Plugin directory name (e.g., `jx-pm`). Prompted if missing. |
| Skill name | `--skill` | Yes | — | Lowercase, hyphens ok (e.g., `idea`). Prompted if missing. |
| Trigger phrases | `--triggers` | Yes | — | Comma-separated (e.g., `"capture idea, new idea"`). Prompted if missing. |
| Description | `--description` | Yes | — | One-line summary. Prompted if missing. |
| Argument hint | `--argument-hint` | No | `""` | Bracketed args (e.g., `"[--mode lite]"`). |

---

## Phase 1: Parse Arguments

Extract values from invocation flags. For any missing required value, prompt interactively.

### Plugin selection

If `--plugin` is not provided:
1. List available plugins:
   ```
   ls "${CLAUDE_PLUGIN_ROOT}/.."
   ```
2. Present as numbered list, excluding `jx-core` (no user-facing skills) and `jx-plugin` (this plugin)
3. Ask: "Which plugin should this skill be added to?"

### Skill name

If `--skill` is not provided:
1. Ask: "What should this skill be called? (lowercase, hyphens ok, e.g., `idea`)"

### Triggers

If `--triggers` is not provided:
1. Ask: "What phrases should trigger this skill? (comma-separated)"
2. Remind: "The slash command `/<plugin>:<name>` is auto-added — only provide natural language triggers."

### Description

If `--description` is not provided:
1. Ask: "One-line description of what this skill does:"

---

## Phase 2: Validate Inputs

Run all validations sequentially. **Halt on first failure** — show the exact problem and how to fix it.

### Step 2a — Name validation

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/skill-creator.py" validate-name <skill_name>
```

On failure, display the error and ask user for a corrected name.

### Step 2b — Plugin existence

Verify `${CLAUDE_PLUGIN_ROOT}/../<plugin_name>` exists and contains `.claude-plugin/plugin.json`.

If not found: "Plugin '<plugin_name>' not found. Available plugins: <list>."

### Step 2c — Name collision check

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/skill-creator.py" check-collision <skill_name> "${CLAUDE_PLUGIN_ROOT}/.."
```

On collision: "Skill '<name>' already exists in <plugin> at <path>. Choose a different name."

### Step 2d — Trigger conflict check

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/skill-creator.py" check-triggers "<triggers_csv>" "${CLAUDE_PLUGIN_ROOT}/.."
```

On conflict: display each conflicting trigger with the existing skill it overlaps. Ask user to revise triggers.

---

## Phase 3: Confirm with User

Display the planned artifacts and require explicit confirmation before writing any files.

```
## Planned Artifacts

| # | File | Action |
|---|------|--------|
| 1 | plugins/<plugin>/skills/<name>/SKILL.md | CREATE |
| 2 | plugins/<plugin>/commands/<name>.md | CREATE |
| 3 | plugins/<plugin>/skills/<name>/evals/evals.json | CREATE |

Plugin: <plugin>
Skill: <name>
Command: /<plugin>:<name>
Triggers: <trigger list>

Proceed? (yes/no)
```

Do NOT proceed until user confirms. This is the "plan-before-code" gate.

---

## Phase 4: Scaffold

Run the helper script to create all files atomically:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/skill-creator.py" scaffold <skill_name> "${CLAUDE_PLUGIN_ROOT}/../<plugin_name>" --description "<description>" --triggers "<triggers_csv>" --argument-hint "<hint>"
```

The helper:
1. Creates files in a temp staging directory
2. Moves them into final position only after all succeed
3. On any failure, rolls back — no partial artifacts

On success: proceed to Phase 5.
On failure: display the error and any rollback details.

---

## Phase 5: Post-Scaffold Validation

### Step 5a — Verify files exist

Read each created file to confirm it was written:
- `plugins/<plugin>/skills/<name>/SKILL.md`
- `plugins/<plugin>/commands/<name>.md`
- `plugins/<plugin>/skills/<name>/evals/evals.json`

### Step 5b — JSON lint

```bash
python3 -m json.tool plugins/<plugin>/skills/<name>/evals/evals.json
```

### Step 5c — Frontmatter check

Read the generated SKILL.md and verify it contains: `name:`, `user-invocable:`, `description:`.

### Step 5d — Report

```
## Skill Scaffolded

Plugin: <plugin>
Skill: <name>
Command: /<plugin>:<name>

### Files Created
- plugins/<plugin>/skills/<name>/SKILL.md
- plugins/<plugin>/commands/<name>.md
- plugins/<plugin>/skills/<name>/evals/evals.json

### Next Steps
1. Edit SKILL.md to add full phase logic
2. Edit commands/<name>.md to expand allowed-tools as needed
3. Edit evals/evals.json to add test cases
4. Add the skill to the plugin's README.md
```
