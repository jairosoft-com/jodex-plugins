# jx-core

Reference-only plugin — no commands or skills.

Provides shared conventions consumed by sibling plugins (`jx-pm`, `jx-dev`) via relative path references.

## Contents

| File | Purpose |
|------|---------|
| `_shared/id-rules.md` | Folder validation, feature-number extraction, ID format and type definitions |
| `_shared/docs-root.md` | Output directory resolution order and prompting conventions |
| `_shared/task-json-schema.md` | Canonical task.json schema for task breakdowns |

## Sibling Layout

```
plugins/
  jx-core/          # this plugin (reference-only)
  jx-pm/            # PM skills: prd, ado, pipeline
  jx-dev/           # Dev skills: spec, task
```

## Relative Path Convention

Skill files in sibling plugins reference jx-core shared files via:

```
../../../jx-core/_shared/<file>.md
```

This resolves from `plugins/<plugin>/skills/<skill>/SKILL.md` up three levels to `plugins/`, then into `jx-core/_shared/`.
