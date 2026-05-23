---
title: Worktree Isolation Guard Needs Initialized Worktree
type: idea
tags: [worktree, background-session, workflow, troubleshooting, bg-isolation]
created: 2026-05-22
updated: 2026-05-22
status: raw
priority: P2
effort: small
source: Session — FEAT-003 implementation (2026-05-22)
provenance: observation
---

# Worktree Isolation Guard Needs Initialized Worktree

## Problem

Background sessions have a bg-isolation guard that blocks direct edits to the main checkout. The guard expects edits to go through the worktree path configured at session start. If that path exists as a plain directory (e.g., left over from a failed previous job) but was never initialized as a git worktree, the Edit tool errors:

> "This session is now isolated in `…/worktrees/<name>`. Edit the worktree copy of this file instead of the shared-checkout path."

But the path only has a `logs/` subdirectory — no repo content.

## Recovery

```bash
# Check if the path is a real git worktree
git worktree list

# If not listed, rename the dead directory and create properly
mv .claude/worktrees/<name> .claude/worktrees/<name>.bak
git worktree add .claude/worktrees/<name> <branch>
```

Then use `EnterWorktree` with `path:` to switch into the initialized worktree.

## Root Cause

The harness pre-creates the worktree directory (for log routing) before confirming that `git worktree add` succeeded. If the job fails mid-setup, the directory exists but the worktree registration does not.
