---
name: create-skill
user-invocable: true
argument-hint: '--name <skill-name> --description "..." [--triggers "..."] [--allowed-tools "..."] [--argument-hint "..."] [--extras evals,scripts,templates,references] [--project-root <path>]'
description: >
  Scaffold a local project-level skill in .claude/skills/<name>/. Creates SKILL.md
  with proper frontmatter and optional extras (evals, scripts, templates, references directories).
  Triggers on: "create local skill", "scaffold local skill", "new local skill", "add local skill",
  /jx-local:create-skill, or any request to create a skill in a project's .claude/skills/ directory.
  Do not trigger for: creating skills inside Jodex plugins (use jx-plugin:create-skill), plugin scaffolding, wiki operations.
---

# Local Skill Creator

Scaffold a new skill in the user's project at `<project-root>/.claude/skills/<name>/`.

## Arguments

| Argument | Flag | Required | Default | Notes |
|----------|------|----------|---------|-------|
| Skill name | `--name` | Yes | — | Lowercase hyphenated, must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Prompted if missing. |
| Description | `--description` | Yes | — | Skill description. Prompted if missing. |
| Triggers | `--triggers` | No | (none) | CSV trigger phrases. When omitted, a "Use when..." sentence is auto-generated. |
| Allowed tools | `--allowed-tools` | No | (none) | Tool allowlist. When omitted, `allowed-tools:` field is omitted from frontmatter. |
| Argument hint | `--argument-hint` | No | (none) | Bracketed args (e.g., `[--mode lite]`). |
| Extras | `--extras` | No | (none) | CSV from `{evals, scripts, templates, references}`. Creates optional dirs. |
| Project root | `--project-root` | No | (auto-detect) | Override project root. Defaults to `git rev-parse --show-toplevel` or cwd. |

---

## Phase 1: Parse Arguments

1. **Detect project root.** If `--project-root` provided, use it. Otherwise, try `git rev-parse --show-toplevel` first; if that fails (not a git repo), fall back to `pwd`. Run each as a separate command:
   ```bash
   git rev-parse --show-toplevel
   ```
   If that exits non-zero:
   ```bash
   pwd
   ```
   Verify the resolved directory exists and is a directory.

2. **Extract `--name`.** If missing, prompt: "What should this skill be called? (lowercase, hyphens ok, e.g., `deploy-check`)"

3. **Extract `--description`.** If missing, prompt: "One-line description of what this skill does:"

4. **Extract `--triggers`.** Optional. If missing, a "Use when..." sentence will be auto-generated from the name and description.

5. **Extract `--allowed-tools`.** Optional. If missing, `allowed-tools:` field is omitted from generated frontmatter.

6. **Extract `--argument-hint`.** Optional. If missing, `argument-hint:` field is omitted from generated frontmatter.

7. **Extract `--extras`.** Optional. If provided, validate each item against the closed set `{evals, scripts, templates, references}`. Reject unknown values with: "Unknown extra '<value>'. Valid extras: evals, scripts, templates, references."

---

## Phase 2: Validate Inputs

Run all validations sequentially. Halt on first failure, show the exact problem and how to fix it.

### Step 2a — Name validation

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/local-skill-creator.py" validate-name <skill_name>
```

On failure (JSON `"valid": false`), display the error and ask for a corrected name.

### Step 2b — Collision check

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/local-skill-creator.py" check-collision <skill_name> "<PROJECT_ROOT>"
```

Checks both `.claude/skills/<name>/` and `.claude/commands/<name>.md`. On collision (JSON `"collision": true`): display the collision details and ask the user to choose a different name. Do not offer a replacement path — the scaffold helper does not support overwriting existing skills.

### Step 2c — Trigger conflict check

Compute the effective trigger text:
- If `--triggers` was provided, use it directly.
- If not, compute the auto-generated "Use when..." text that `scaffold` will produce.

Then run:
```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/local-skill-creator.py" check-triggers <skill_name> "<effective_triggers>" "<PROJECT_ROOT>"
```

On exact conflicts: halt and display. On substring conflicts: warn but allow the user to proceed.

### Step 2d — Discovery preflight

Classify the target project root:
1. **Active cwd/git-root** — the resolved `PROJECT_ROOT` matches the current working directory or its git root. Skill will be discoverable immediately (if `.claude/skills/` already exists) or after restart (if newly created).
2. **Ancestor directory** — `PROJECT_ROOT` is an ancestor of cwd. Skill is discoverable.
3. **External path** — `PROJECT_ROOT` is not the current project or an ancestor. Warn: "This skill will be created at `<path>` which is outside the current project. You will need to start Claude Code in that directory or use `/add-dir` to discover it."

---

## Phase 3: Confirm with User

Display the planned artifacts and require explicit confirmation before writing.

```
## Planned Artifacts

Project: <PROJECT_ROOT>
Skill: <name>
Discovery: <usable now | restart required | external target>

| # | File | Action |
|---|------|--------|
| 1 | .claude/skills/<name>/SKILL.md | CREATE |
| 2 | .claude/skills/<name>/evals/evals.json | CREATE (if --extras includes evals) |
| 3 | .claude/skills/<name>/scripts/.gitkeep | CREATE (if --extras includes scripts) |
| 4 | .claude/skills/<name>/templates/.gitkeep | CREATE (if --extras includes templates) |
| 5 | .claude/skills/<name>/references/.gitkeep | CREATE (if --extras includes references) |

Only rows for files that will actually be created should appear.

Proceed? (yes/no)
```

Do NOT proceed until user confirms with an affirmative answer.

---

## Phase 4: Scaffold

Run the helper script:

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/local-skill-creator.py" scaffold <skill_name> "<PROJECT_ROOT>" --description "<description>" [--triggers "<triggers_csv>"] [--allowed-tools "<tools>"] [--argument-hint "<hint>"] [--extras "<extras_csv>"]
```

The helper:
1. Creates all files in an atomic staging directory (`tempfile.mkdtemp`).
2. Acquires an exclusive lock file to prevent races.
3. Moves them into final position at `.claude/skills/<name>/`.
4. On any failure, rolls back — no partial artifacts remain.

On success: proceed to Phase 5.
On failure: display the error and any rollback details.

---

## Phase 5: Verify and Report

### Step 5a — Run verify subcommand

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/local-skill-creator.py" verify <skill_name> "<PROJECT_ROOT>" [--extras "<extras_csv>"]
```

### Step 5b — JSON lint (only if evals were created)

```bash
python3 -m json.tool "<PROJECT_ROOT>/.claude/skills/<name>/evals/evals.json"
```

### Step 5c — Report

```
## Local Skill Scaffolded

Project: <PROJECT_ROOT>
Skill: <name>

### Files Created
- .claude/skills/<name>/SKILL.md
- .claude/skills/<name>/evals/evals.json (if extras)
- .claude/skills/<name>/scripts/.gitkeep (if extras)
- .claude/skills/<name>/templates/.gitkeep (if extras)
- .claude/skills/<name>/references/.gitkeep (if extras)

### Discovery Status
- "Skill is ready — invoke with `/<name>`" (if .claude/skills/ already existed)
- "Restart Claude Code to discover this skill" (if .claude/skills/ was newly created)
- "External target — start Claude in `<path>` or use `/add-dir`" (if non-current project)

### Next Steps
1. Edit SKILL.md to add full phase logic and instructions
2. Add eval test cases to evals/evals.json (if created)
3. Test the skill with: /<name>
```
