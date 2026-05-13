# jx-core

Shared plugin — conventions and executable skill logic consumed by sibling role plugins. No user-invocable commands.

## Contents

| File | Purpose |
|------|---------|
| `_shared/id-rules.md` | Folder validation, feature-number extraction, ID format and type definitions |
| `_shared/docs-root.md` | Output directory resolution order and prompting conventions |
| `_shared/task-json-schema.md` | Canonical task.json schema for task breakdowns |
| `_shared/ado.md` | Azure Boards sync skill logic (consumed by `jx-pm` via stub) |
| `_shared/task.md` | Task JSON converter skill logic (consumed by `jx-dev` via stub) |

## Sibling Layout

```
plugins/
  jx-core/          # this plugin (shared conventions + executable logic)
  jx-pm/            # PM skills: prd, ado (stub → jx-core), pipeline
  jx-dev/           # Dev skills: spec, task (stub → jx-core)
```

## Relative Path Convention

Skill files in sibling plugins reference jx-core shared files via:

```
../../../jx-core/_shared/<file>.md
```

This resolves from `plugins/<plugin>/skills/<skill>/SKILL.md` up three levels to `plugins/`, then into `jx-core/_shared/`.
