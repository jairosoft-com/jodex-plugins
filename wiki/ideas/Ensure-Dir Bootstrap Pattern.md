---
title: Ensure-Dir Bootstrap Pattern
type: idea
tags: [pattern, skill-design, pinned-helper, filesystem]
created: 2026-05-27
updated: 2026-05-28
status: completed
priority: P3
effort: small
source: Session — jx-local create-prompt code review R3 (2026-05-27)
provenance: observation
---

# Ensure-Dir Bootstrap Pattern

A helper subcommand that creates a target directory and returns its absolute path, solving first-use bootstrapping and cwd-relative path ambiguity in one call.

## The Problem

Skills that write staging files (via the Write tool) to a directory that may not exist yet face two issues:
1. The Write tool fails if the parent directory doesn't exist
2. Relative paths like `.agent/prompts/` resolve differently depending on the agent's cwd

## The Pattern

Add an `ensure-dir` subcommand to the helper:
1. Resolves project root via `git rev-parse --show-toplevel`
2. Creates the target directory (`mkdir -p`)
3. Validates the resolved path doesn't escape the project root (symlink check)
4. Returns the absolute path as JSON: `{"path": "/abs/path/to/.agent/prompts"}`

The skill parses the returned path and uses it for all subsequent staging file operations.

## Related

- [[File-Based Data Transport]]
- [[Cross-Plugin Pinned Helper]]
