---
title: Scaffolded Skills Need Allowed-Tools Expansion
type: idea
tags: [jx-skill, scaffolding, allowed-tools, command-stub]
created: 2026-05-25
updated: 2026-05-25
source_count: 0
aliases: []
provenance: synthesis
status: raw
---

# Scaffolded Skills Need Allowed-Tools Expansion

The skill creator generates command stubs with `allowed-tools: Read` as the default. Skills that need to perform git operations (like `clean-worktree`) or run shell commands require manual expansion of the allowed-tools list post-scaffold. This is a known friction point — consider whether the scaffold should accept an `--allowed-tools` flag or infer a broader default based on the skill description keywords (e.g., "commit", "merge", "build" → include Bash).

## Sources
- Session observation, 2026-05-25
