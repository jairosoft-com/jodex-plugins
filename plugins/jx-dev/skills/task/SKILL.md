---
name: task
user-invocable: true
argument-hint: "[--docs-root <path>] [--force-overwrite]"
description: >
  Convert a PRD.md or BRD_PRD.md (and optionally TECH_SPEC.md) into canonical task.json
  for execution and Azure Boards sync. Preserves all requirement IDs, adds hour estimates
  and story points. Triggers on: convert prd, create task json, task breakdown, jodex format.
  Do not trigger for: PRD generation, tech spec generation, Azure sync, wiki operations.
---

# Task JSON Converter

**Fail-closed guard:** Before proceeding, verify `../../../jx-core/_shared/task.md` is readable.
If the file cannot be read, halt immediately:
> "Error: jx-core shared task skill not found. Ensure the jx-core plugin is installed."

Follow all instructions in `../../../jx-core/_shared/task.md`.
