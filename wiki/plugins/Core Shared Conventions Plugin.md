---
title: Core Shared Conventions Plugin
type: plugin
tags: [plugin, shared-conventions, shared-logic, jx-core]
created: 2026-05-11
updated: 2026-05-12
source_count: 4
aliases: [jx-core, jx-core plugin]
provenance: synthesis
---

# Core Shared Conventions Plugin

Plugin name: **jx-core**. Shared plugin that provides conventions and executable skill logic consumed by sibling role plugins. No user-invocable commands.

## Contents

| File | Purpose |
|------|---------|
| `plugins/jx-core/_shared/id-rules.md` | Requirement folder validation, feature number extraction, and ID format rules |
| `plugins/jx-core/_shared/docs-root.md` | Docs-root resolution order and prompting conventions |
| `plugins/jx-core/_shared/task-json-schema.md` | Canonical task JSON structure |
| `plugins/jx-core/_shared/ado.md` | Azure Boards sync skill logic (consumed by `jx-pm` via stub) |
| `plugins/jx-core/_shared/task.md` | Task JSON converter skill logic (consumed by `jx-dev` via stub) |

## Usage

- `jx-core` has no user-invocable commands — it is the dependency, not the consumer.
- `jx-pm` and `jx-dev` declare it as a dependency and consume its shared files via thin SKILL.md stubs.
- Skill files in sibling plugins reference shared files via `../../../jx-core/_shared/<file>.md`.
- Destructive-operation confirmation gates (rebind, prune, recreate, sync) live in the shared `ado.md` logic. Role-plugin command files own the `allowed-tools` declaration.

## Sources

- [[Source - jx-core Plugin README]]
- [[Source - jx-core Docs Root Config]]
- [[Source - jx-core ID Rules]]
- [[Source - jx-core Task JSON Schema]]
