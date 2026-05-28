# Plan: Move jx-skill skills into jx-plugin, delete jx-skill

## Context

The `jx-skill` plugin currently owns two skills (`create` and `create-plugin`) plus their Python helper scripts. A newer `jx-plugin` plugin was scaffolded as the intended home for plugin/skill tooling but is currently empty. This plan consolidates both skills into `jx-plugin` under clearer names, then removes the now-empty `jx-skill` plugin entirely.

**Slash command mapping:**
- `/jx-skill:create` --> `/jx-plugin:create-skill`
- `/jx-skill:create-plugin` --> `/jx-plugin:create-plugin`

---

## Step 1: Move files from jx-skill to jx-plugin

### Skills
- `plugins/jx-skill/skills/create/` --> `plugins/jx-plugin/skills/create-skill/` (rename dir)
- `plugins/jx-skill/skills/create-plugin/` --> `plugins/jx-plugin/skills/create-plugin/`

### Commands
- `plugins/jx-skill/commands/create.md` --> `plugins/jx-plugin/commands/create-skill.md`
- `plugins/jx-skill/commands/create-plugin.md` --> `plugins/jx-plugin/commands/create-plugin.md`

### Scripts
- `plugins/jx-skill/scripts/skill-creator.py` --> `plugins/jx-plugin/scripts/skill-creator.py`
- `plugins/jx-skill/scripts/plugin-creator.py` --> `plugins/jx-plugin/scripts/plugin-creator.py`

---

## Step 2: Update content inside moved files

### `plugins/jx-plugin/skills/create-skill/SKILL.md`
- Frontmatter `name: create` --> `name: create-skill`
- Trigger line: `/jx-skill:create` --> `/jx-plugin:create-skill`
- Self-exclusion rule (Phase 1 plugin list): exclude `jx-plugin` instead of `jx-skill`
- All other `/jx-skill:create` references --> `/jx-plugin:create-skill`

### `plugins/jx-plugin/skills/create-plugin/SKILL.md`
- Trigger line: `/jx-skill:create-plugin` --> `/jx-plugin:create-plugin`
- Phase 5 report "Next Steps" line: `/jx-skill:create` --> `/jx-plugin:create-skill`
- All `/jx-skill:` references --> `/jx-plugin:`

### `plugins/jx-plugin/commands/create-skill.md`
- Description and body: `jx-skill:create` --> `jx-plugin:create-skill`

### `plugins/jx-plugin/commands/create-plugin.md`
- Description and body: `jx-skill:create-plugin` --> `jx-plugin:create-plugin`

### `plugins/jx-plugin/scripts/skill-creator.py`
- Docstring: "jx-skill:create" --> "jx-plugin:create-skill"
- argparse description: "jx-skill plugin" --> "jx-plugin plugin"

### `plugins/jx-plugin/scripts/plugin-creator.py`
- Docstring: "jx-skill:create-plugin" --> "jx-plugin:create-plugin"
- Generated README text: `/jx-skill:create` --> `/jx-plugin:create-skill`
- Generated ABOUT.md text: `/jx-skill:create` --> `/jx-plugin:create-skill`
- argparse description: "jx-skill plugin" --> "jx-plugin plugin"

### Evals (both `evals.json` files)
- All `/jx-skill:create-plugin` --> `/jx-plugin:create-plugin`
- All `/jx-skill:create` --> `/jx-plugin:create-skill`

---

## Step 3: Update jx-plugin plugin metadata

### `plugins/jx-plugin/.claude-plugin/plugin.json`
- Update description to: "Skill and plugin scaffolding: create skills inside existing Jodex plugins and new plugin skeletons with marketplace registration."

### `plugins/jx-plugin/README.md`
- Rewrite to reflect both skills (adapted from current `jx-skill/README.md` with updated command names)

### `plugins/jx-plugin/skills/ABOUT.md`
- Remove the "Add the first skill" placeholder text

### `plugins/jx-plugin/commands/ABOUT.md`
- Remove the "Add the first command" placeholder text

### `plugins/jx-plugin/scripts/ABOUT.md`
- Replace placeholder with note about the two helper scripts

---

## Step 4: Update repo-level references

### `.claude-plugin/marketplace.json`
- Remove the `jx-skill` entry
- Update `jx-plugin` entry description to: "Skill and plugin scaffolding: create skills inside existing Jodex plugins and new plugin skeletons with marketplace registration."

### `AGENTS.md`
- Line 12: Update plugin list (replace `jx-skill` with `jx-plugin` in the enumeration)
- Line 36: Update `jx-skill` boundary description --> `jx-plugin`
- Line 50: Update validation checklist paths from `plugins/jx-skill/scripts/` --> `plugins/jx-plugin/scripts/`

### `README.md`
- Plugin table: replace `jx-skill` row with `jx-plugin` (updated description)
- Command listing section: `/jx-skill:create` --> `/jx-plugin:create-skill`, `/jx-skill:create-plugin` --> `/jx-plugin:create-plugin`
- Any example invocations referencing jx-skill

---

## Step 5: Update wiki references (light touch)

Update tags and command names but leave historical log narrative as-is.

- `wiki/_index.md`: Update `#jx-skill` tags --> `#jx-plugin`, update command refs
- `wiki/_backlog.md`: Update `#jx-skill` tags --> `#jx-plugin`, update command refs
- `wiki/_log.md`: Leave historical log entries untouched

---

## Step 6: Delete jx-skill

- Remove the entire `plugins/jx-skill/` directory

---

## Step 7: Validate

1. `python3 -m json.tool .claude-plugin/marketplace.json`
2. `python3 -m json.tool plugins/jx-plugin/.claude-plugin/plugin.json`
3. `python3 -m py_compile plugins/jx-plugin/scripts/skill-creator.py plugins/jx-plugin/scripts/plugin-creator.py`
4. `grep -rn "jx-skill" plugins/ AGENTS.md README.md .claude-plugin/` -- should return zero hits
5. `grep -rn "jx-skill" wiki/_index.md wiki/_backlog.md` -- should return zero hits
6. Verify both Python helpers still respond to `--help`
