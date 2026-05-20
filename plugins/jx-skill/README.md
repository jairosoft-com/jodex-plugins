# jx-skill — Skill and Plugin Scaffolding for Claude Code

Scaffold new skills inside existing Jodex plugins and new plugin skeletons in the marketplace with convention enforcement and pinned-helper validation.

## Pipeline

```
user invocation --> [/jx-skill:create] --> SKILL.md + command.md + evals.json
                                                |
                                          validates against
                                                |
                                    all plugins/*/skills/*/SKILL.md

user invocation --> [/jx-skill:create-plugin] --> plugin skeleton + marketplace entry
                                                       |
                                                 validates against
                                                       |
                                      plugins/* + .claude-plugin/marketplace.json
```

## Requirements

- **Python 3** (stdlib only — no external dependencies)

## Commands

### `/jx-skill:create`

Scaffold a new skill inside an existing plugin.

```
/jx-skill:create --plugin jx-pm --skill idea --triggers "capture idea, new idea" --description "Capture and file a raw idea"
/jx-skill:create
```

**What it does:**
1. Validates skill name format
2. Checks for name collisions across all plugins
3. Checks trigger phrases for overlap with existing skills
4. Confirms planned artifacts with user
5. Scaffolds SKILL.md, command stub, and evals skeleton
6. Post-scaffold validation

### `/jx-skill:create-plugin`

Scaffold a new plugin skeleton and append it to the root marketplace.

```
/jx-skill:create-plugin --plugin jx-example --description "Example automation plugin"
/jx-skill:create-plugin --plugin jx-search --description "Search workflow helpers" --category productivity --author "Jairosoft"
```

**What it does:**
1. Validates plugin name format (`jx-...`, lowercase and hyphenated)
2. Checks for plugin directory, marketplace name, and marketplace source collisions
3. Confirms planned artifacts with the user before writing
4. Creates package metadata, README, and component ABOUT files only
5. Appends the marketplace entry with `source: "./plugins/<plugin>"`
6. Verifies exact v1 artifacts and JSON validity

The generated README points contributors to `/jx-skill:create --plugin <plugin>` for the first real skill.

## Security

- Python execution pinned to `scripts/skill-creator.py` and `scripts/plugin-creator.py` only
- All output paths resolved and confined to the target plugin directory or repository root
- Shell metacharacter rejection on path inputs and strict regex validation for generated names
- No Write permission in command — all writes go through pinned helper
- Atomic staging with rollback on failure
