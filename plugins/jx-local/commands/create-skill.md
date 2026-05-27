---
description: Scaffold a local project-level skill in .claude/skills/<name>/
argument-hint: '--name <skill-name> --description "..." [--triggers "..."] [--allowed-tools "..."] [--argument-hint "..."] [--extras evals,scripts,templates,references] [--project-root <path>]'
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/local-skill-creator.py":*), Bash(python3 -m json.tool:*), Bash(git rev-parse:*), Bash(pwd:*), Bash(ls:*), Read
---

Scaffold a local project-level skill using the `jx-local:create-skill` skill.

$ARGUMENTS
