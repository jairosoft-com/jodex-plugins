---
description: Scaffold a new skill inside an existing Jodex plugin with convention enforcement
argument-hint: "[--plugin <name>] [--skill <name>] [--triggers \"...\"] [--description \"...\"]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/skill-creator.py":*), Bash(python3 -m json.tool:*), Bash(ls:*), Read
---

Scaffold a new skill inside an existing plugin using the `jx-skill:create` skill.

$ARGUMENTS
