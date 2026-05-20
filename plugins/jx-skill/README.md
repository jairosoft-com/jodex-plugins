# jx-skill — Skill Scaffolding Plugin for Claude Code

Scaffold new skills inside existing Jodex plugins with convention enforcement, trigger uniqueness checking, and validated boilerplate.

## Pipeline

```
user invocation --> [/jx-skill:create] --> SKILL.md + command.md + evals.json
                                                |
                                          validates against
                                                |
                                    all plugins/*/skills/*/SKILL.md
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

## Security

- Python execution pinned to `scripts/skill-creator.py` only
- All output paths resolved and confined to target plugin directory
- Shell metacharacter rejection on all inputs
- No Write permission in command — all writes go through pinned helper
- Atomic staging with rollback on failure
