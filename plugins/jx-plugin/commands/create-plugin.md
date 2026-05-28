---
description: Scaffold a new Jodex plugin skeleton and append it to the marketplace
argument-hint: "[--plugin <jx-name>] [--description \"...\"] [--category <productivity|knowledge|core>] [--author \"...\"]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/plugin-creator.py":*), Bash(python3 -m json.tool:*), Bash(ls:*), Read
---

Scaffold a new plugin skeleton using the `jx-plugin:create-plugin` skill.

$ARGUMENTS
