---
description: Clean up git worktrees created by Claude Code background agents
argument-hint: "[--worktree <name>] [--all] [--no-merge] [--dry-run]"
allowed-tools: Read, Bash(git -C:*), Bash(git status:*), Bash(git rev-parse:*), Bash(git branch:*), Bash(git worktree list:*), Bash(git worktree remove:*), Bash(git worktree prune:*), Bash(git merge:*), Bash(git merge-base:*), Bash(git log:*), Bash(git diff --name-only:*), Bash(find .claude/worktrees:*), Bash(realpath:*), Bash(rm -rf .claude/worktrees/:*), Bash(rm .claude/worktrees/:*), Bash(ls:*), Bash(test:*)
---

Clean up worktrees using the `jx-pm:clean-worktree` skill.

$ARGUMENTS
