---
title: Prefix-Only Permission Grammar
type: concept
tags: [claude-code, permissions, allowed-tools, pattern]
created: 2026-05-26
updated: 2026-05-26
source_count: 0
aliases: [prefix matching, allowed-tools grammar]
provenance: synthesis
---

# Prefix-Only Permission Grammar

Claude Code's `allowed-tools` entries in command stubs use pure prefix matching against the raw command string. A pattern like `Bash(git status:*)` matches any command that literally starts with `git status`.

## Rules

- The `*` at the end means "anything after this prefix" — it is NOT a glob within the pattern
- Mid-pattern wildcards (e.g., `Bash(git -C * status:*)`) are treated as literal text and never match real invocations
- The match checks the command string before shell interpretation — quotes are part of the literal

## Consequences for Skill Design

For commands like `git -C <path> <subcommand>`, the narrowest functional form is `Bash(git -C:*)` which grants all git subcommands in any directory. There is no way to pin to specific subcommands when a variable path precedes them.

Similarly, `Bash(rm -rf .claude/worktrees/:*)` matches `rm -rf .claude/worktrees/foo` but NOT `rm -rf ".claude/worktrees/foo"` (the quote changes the prefix).

This creates a fundamental trade-off: instruction-level constraints in [[Skill]] specs must compensate where permission-level constraints cannot be expressed. The [[User Confirmation Gate]] pattern and safe-name validation regexes serve as behavioral mitigations.

## Observed In

- `clean-worktree` skill (2026-05-26): 7 consecutive review rounds flagged `Bash(git -C:*)` breadth with identical recommendations — a [[Severity Escalation Convergence Signal]] confirming platform constraint
- No peer plugin in the marketplace uses mid-pattern wildcards (verified via grep)

## Related

- [[Path Confinement]] — complementary pattern for path safety at the script level
- [[Severity Escalation Convergence Signal]] — exit criterion when this constraint blocks convergence
- [[Pinned Helper]] — alternative: route through a validated script to narrow permissions

## Sources

- Session: clean-worktree skill implementation (2026-05-26)
