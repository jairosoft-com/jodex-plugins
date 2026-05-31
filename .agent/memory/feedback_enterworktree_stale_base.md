---
name: feedback-enterworktree-stale-base
description: EnterWorktree branches from origin/main (fresh baseRef); unpushed local commits make the new worktree stale — sync it before editing
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 6a9bd770-c9e9-446d-bd88-17674619e1ca
---

`EnterWorktree` creates the worktree from **origin/main** (the `fresh` baseRef default), NOT local HEAD. When the working pattern is "land commits on local main without pushing" (this user's flow — push only when asked), each new worktree is created **one or more commits behind local main** and contains stale file content.

**Why:** During the coverage-plan review loop I entered a worktree expecting local HEAD (`aa67afa`) but got `origin/main` (`fd2754a`, one commit behind), and nearly edited stale content + would have hit a non-fast-forward on merge.

**How to apply:** Right after `EnterWorktree`, if local main has unpushed commits, run `git -C <worktree> reset --hard <local-main-sha>` (no edits yet → safe) before reading/editing. Or verify `git -C <wt> rev-parse HEAD` equals the intended base. Or push local main first. Relates to [[feedback_plan_vs_execute]] and the land-on-main-via-worktree pattern used this session.
