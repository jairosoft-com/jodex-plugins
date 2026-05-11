---
title: Core Shared Conventions Plugin
type: plugin
tags: [plugin, shared-conventions, reference-only, jx-core]
created: 2026-05-11
updated: 2026-05-11
source_count: 4
aliases: [jx-core, jx-core plugin]
provenance: synthesis
---

# Core Shared Conventions Plugin

Plugin name: **jx-core**. Reference-only plugin that provides shared conventions consumed by sibling plugins.

## Contents

| File | Purpose |
|------|---------|
| `plugins/jx-core/_shared/id-rules.md` | Requirement folder validation, feature number extraction, and ID format rules |
| `plugins/jx-core/_shared/docs-root.md` | Docs-root resolution order and prompting conventions |
| `plugins/jx-core/_shared/task-json-schema.md` | Canonical task JSON structure |

## Usage

- `jx-core` has no commands or skills.
- `jx-pm` and `jx-dev` declare or rely on it for shared conventions.
- Skill files in sibling plugins reference shared files via `../../../jx-core/_shared/<file>.md`.

## Sources

- [[Source - jx-core Plugin README]]
- [[Source - jx-core Docs Root Config]]
- [[Source - jx-core ID Rules]]
- [[Source - jx-core Task JSON Schema]]
