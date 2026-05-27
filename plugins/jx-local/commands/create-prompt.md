---
description: Create a reusable prompt file under .agent/prompts/
argument-hint: "[--name <slug>] [--description \"...\"] [--tags \"...\"] [--scaffold-only] [--list]"
allowed-tools: Read, Write, Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py":*), Bash(mktemp -d *), Bash(rm -r *)
---

Create a reusable prompt file using the `jx-local:create-prompt` skill.

$ARGUMENTS
