---
name: clean-worktree
user-invocable: true
argument-hint: "[--worktree <name>] [--all] [--no-merge] [--dry-run]"
description: >
  Clean up git worktrees created by Claude Code background agents.
  Commits dirty state, merges to target branch, removes worktrees, and purges
  stale remnant directories from .claude/worktrees/.
  Triggers on: "clean worktree", "cleanup worktrees", "remove worktree",
  "cln wrk tree", /jx-pm:clean-worktree.
  Do not trigger for: creating worktrees, entering worktrees.
---

<!-- markdownlint-disable MD013 -->

# Clean Worktree

Clean up git worktrees created by Claude Code background agents. Handles two scenarios:

- **Active worktrees**: Registered in git with real branches — commit dirty state, merge to target branch, remove the worktree, optionally delete the branch.
- **Stale remnants**: Orphaned directories in `.claude/worktrees/` that are NOT registered git worktrees — left behind by failed harness jobs. Safe to remove after inspection.

Do not use for:

- Creating or entering worktrees (use `EnterWorktree`)
- General git operations unrelated to worktree cleanup
- Cleaning worktrees from a session that created them (use `ExitWorktree` instead)

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--worktree` | No | all discovered | Name of a specific directory under `.claude/worktrees/` |
| `--all` | No | false | Process all worktrees without interactive selection |
| `--no-merge` | No | false | Skip merge; branch preserved with commits intact |
| `--dry-run` | No | false | Discover, classify, display planned actions — no mutations |

Bare invocation (no flags): scan, classify, present interactive menu for user selection.

---

## Phase 1: Argument Parsing

Parse arguments from invocation:

- Extract `--worktree <name>` if provided
- Extract `--all` flag (boolean)
- Extract `--no-merge` flag (boolean)
- Extract `--dry-run` flag (boolean)
- Validate: `--worktree` and `--all` are mutually exclusive. If both supplied, halt:
  > "Error: `--worktree` and `--all` are mutually exclusive. Use one or the other."
- `--worktree` value must match a discovered directory basename exactly — no path separators, `..`, absolute paths, whitespace, or shell metacharacters (`;&|$(){}` etc.). Reject any value that does not match `^[a-zA-Z0-9._+-]+$`

---

## Phase 2: Preflight Guards

Six fail-closed guards, checked in order. In `--dry-run` mode, guards 4–5 report warnings instead of halting.

### Guard 2a — Git repository check

Run `git rev-parse --is-inside-work-tree`. Must return `true`.
Run `git rev-parse --is-bare-repository`. Must return `false`.

If either fails, halt:
> "Error: Not inside a non-bare git repository."

### Guard 2b — Main checkout check

Get the repo toplevel: `git rev-parse --show-toplevel` and canonicalize with `realpath`. Store as `$REPO_ROOT`.

Get the first `worktree` path from `git worktree list --porcelain` and canonicalize it with `realpath`.

Compare the two canonical paths. If they differ, the agent is inside a linked worktree. Halt:
> "Error: You are running inside a linked worktree, not the main checkout. Switch to the main project directory first, then re-run this skill."

Verify the current working directory equals `$REPO_ROOT` (canonicalize cwd with `realpath .` and compare). If cwd is a subdirectory, halt:
> "Error: This skill must run from the repository root (`{$REPO_ROOT}`), not a subdirectory. Change to the root first."

This ensures all relative paths (`.claude/worktrees/...`) resolve correctly and match the command allowlist.

### Guard 2c — Resolve target branch

Run `git branch --show-current` to get the current branch name.

If empty (detached HEAD on main checkout), halt:
> "Error: Main checkout is in detached HEAD state. Check out a branch first (e.g., `git checkout main`)."

**Validate target branch name:** must match `^[a-zA-Z0-9/_+.-]+$`. If it contains characters outside this set, halt:
> "Error: Target branch name `{branch}` contains unsafe characters. Check out a branch with a safe name."

All target branch name interpolations in subsequent phases MUST be double-quoted (e.g., `git merge-base --is-ancestor "{branch}" "{target-branch}"`).

Verify the branch ref exists: `git rev-parse --verify "refs/heads/{branch}"`.

Display and confirm with user:
> "Worktree branches will merge into `{branch}`. Correct?"

This is the merge target for Phase 6. Do not assume `main`.

### Guard 2d — Target branch clean

Run `git status --porcelain` on the current checkout. If output is non-empty, halt:
> "Error: Target branch `{branch}` has uncommitted changes. Commit or stash them before running worktree cleanup."

In `--dry-run` mode: warn but continue.

### Guard 2e — Non-default target warning

If target branch is not `main` or `master`, warn and confirm:
> "Merge target is `{branch}`, not main/master. Proceed?"

In `--dry-run` mode: warn but continue.

### Guard 2f — Active job warning

Warn user:
> "Ensure no background agents are currently using worktrees being cleaned. Cleaning an active worktree may corrupt in-progress work. Proceed?"

Require confirmation before continuing.

---

## Phase 3: Discovery

Guard 2b has verified that cwd is the repo toplevel. All discovery and cleanup commands use relative paths (e.g., `.claude/worktrees/...`), which match the command allowlist prefixes.

### Step 3a — Directory existence

`test -d .claude/worktrees/`

If absent, halt:
> "No `.claude/worktrees/` directory found. Nothing to clean up."

### Step 3b — Filesystem scan

`find .claude/worktrees -mindepth 1 -maxdepth 1 -type d`

If no directories found, halt:
> "No worktrees found at `.claude/worktrees/`. Nothing to clean up."

### Step 3c — Git worktree inventory

Run `git worktree list --porcelain` to get the list of registered worktrees. Parse each entry to extract:

- `worktree <path>` — the absolute path
- `HEAD <sha>` — the current commit
- `branch refs/heads/<name>` — the branch (may be absent for detached HEAD)
- `locked` — if present, worktree is locked
- `prunable` — if present, worktree metadata is orphaned

The main checkout entry (first record) is excluded from processing.

---

## Phase 4: Classification

Cross-reference the filesystem scan (3b) with the git inventory (3c) using canonical paths (`realpath` on both sides). For each directory in `.claude/worktrees/<name>/`:

### Active Worktree

Canonical path IS in `git worktree list`. Record:

- Branch name from porcelain `branch refs/heads/<name>` field (store both full ref and short name — do NOT infer branch from directory name). **Validate branch name:** reject any branch whose short name does not match `^[a-zA-Z0-9/_+.-]+$` and skip the target with: "Skipping worktree with unsafe branch name: `{name}`". All branch names MUST be double-quoted when interpolated into shell commands (e.g., `git merge --no-ff "{branch}"`)
- `locked` / `prunable` annotations
- Dirty state via `git -C <path> status --porcelain`
- Detached HEAD state (porcelain shows `HEAD` but no `branch` line)

### Stale Remnant

Canonical path NOT in `git worktree list`. Before classifying as safe-to-delete, inspect:

1. Check for `.git` file or directory. If `.git` exists (regardless of whether harness markers are also present) → classify as **Uncertain — needs confirmation**. Display: "Directory contains `.git` — may be a nested repo, moved worktree, or clone. Confirm deletion or investigate with `git worktree repair`."

2. If no `.git`: check for known Claude harness markers (`logs/`, `.agent/`, `.claude/`). If only markers are present → classify as **Stale Remnant (safe)**.

3. If no `.git` and contains non-marker content (files or directories beyond `logs/`, `.agent/`, `.claude/`) → classify as **Uncertain — needs confirmation**. List unexpected contents and require per-target confirmation before deletion.

### Display classification table

```
Directory                     | Status          | Branch                    | Dirty | Notes
──────────────────────────────|─────────────────|───────────────────────────|───────|──────
jx-kb-insights-skill          | Stale (safe)    | —                         | —     | harness markers only
wiki+jx-pm-plugin-page.bak    | Stale (safe)    | —                         | —     | harness markers only
nested-clone                  | Stale (confirm) | —                         | —     | has .git — investigate
feat-new-feature              | Active          | worktree-feat+new-feature | Yes   | 3 modified files
locked-work                   | Active (locked) | worktree-locked-work      | No    | locked
```

---

## Phase 5: Target Selection

### If `--worktree <name>` was provided

Match against discovered directory basenames. If not found, halt:
> "Error: No worktree directory named `{name}` found in `.claude/worktrees/`."

List available directories. Process only the matched entry.

### If `--all` was provided

Add ALL discovered entries (active, stale safe, and stale confirm) to the processing queue.

### If neither (bare invocation)

Display the classification table from Phase 4. Present a numbered menu:
```
Select worktrees to clean up (comma-separated numbers, or 'all'):
1. jx-kb-insights-skill  [stale — safe]
2. wiki+jx-pm-plugin-page.bak  [stale — safe]
3. nested-clone  [stale — needs confirmation]
4. feat-new-feature  [active, dirty]
5. locked-work  [active, locked]
```

Wait for user selection before proceeding.

---

## Phase 6: Execute Cleanup

If `--dry-run`: display the planned action for each target (what would be committed, merged, removed), then halt. No mutations.

**Path safety rule:** All worktree directory basenames (whether from `--worktree` argument OR filesystem discovery) MUST be validated against `^[a-zA-Z0-9._+-]+$` before use in any shell command. Skip any discovered directory whose basename fails this check and warn: "Skipping directory with unsafe name: `{name}`". This validation guarantees no whitespace, metacharacters, or leading dashes, making unquoted interpolation safe for `rm` and `find` commands. For `git -C` commands, quote the path as good practice (e.g., `git -C "$REPO_ROOT/.claude/worktrees/<name>/" status`).

### Path A — Stale Remnant Cleanup

For each stale remnant in the processing queue:

**A1. Canonical path guard (fail-closed):**

Resolve the target path with `realpath`. Verify the canonical parent equals the canonical `.claude/worktrees` directory. If the resolved path is outside `.claude/worktrees/`, refuse:
> "Error: Refusing to remove path outside `.claude/worktrees/`: `{resolved_path}`."

**A2. Uncertain directory gate:**

If classified as "Stale (confirm)" (has `.git` or non-marker content), require explicit confirmation with explanation of what was found. Display the unexpected contents.

**A3. Preview:**

Show what will be removed — list top-level contents of the directory.

**A4. Confirm:**

Per-target confirmation required, even with `--all`:
> "Remove stale directory `.claude/worktrees/{name}/`? (y/n)"

**A5. Remove:**

`rm -rf .claude/worktrees/<name>/` (safe-name validation in Phase 1 guarantees basename matches `^[a-zA-Z0-9._+-]+$` — no whitespace, metacharacters, or leading dashes, so quoting is unnecessary for the rm target)

**A6. Verify:**

Confirm directory no longer exists: `test -d .claude/worktrees/<name>/`.

### Path B — Active Worktree Cleanup

For each active worktree in the processing queue. Any failure at a sub-step halts processing for that target (continues to next in `--all` mode).

**B1. Locked worktree guard:**

If `locked` annotation present, skip target:
> "Worktree `{name}` is locked. Unlock with `git worktree unlock <path>` first."

**B2. Detached HEAD handling:**

If no `branch` in porcelain output:

- Show HEAD SHA and dirty state
- Offer: "Create a branch from detached HEAD before cleanup?" If yes: `git -C <path> checkout -b detached-{name}-{short-sha}`. Update the tracked branch variable for subsequent steps.
- If user declines and worktree is dirty: skip target ("Cannot commit without a branch on detached HEAD with dirty state.")
- If user declines and worktree is clean: verify HEAD is already reachable from the target branch via `git merge-base --is-ancestor <HEAD-sha> <target-branch>`. If reachable → proceed to removal (skip merge, commits are safe). If NOT reachable → halt for target: "Detached HEAD contains commits not reachable from `{target-branch}`. Create a branch to preserve them, or confirm loss." Offer one more chance to create a branch; if declined again, skip target.

**B3. Sensitive file scan and disposition:**

Scan with `find`:
```
find .claude/worktrees/<name>/ \
  -not -path '*/.git/*' \
  -not -path '*/node_modules/*' \
  \( -name ".env" -o -name ".env.*" \
     -o -name "*.pem" -o -name "*.key" \
     -o -name "*.pfx" -o -name "*.p12" \
     -o -name "credentials*" -o -name "secrets*" \
     -o -name ".npmrc" -o -name ".pypirc" \
     -o -name "id_rsa" -o -name "id_ed25519" \)
```

If found, list all paths. **Hard stop** — require user disposition:

- "I've copied what I need — delete originals and proceed" → re-scan; for each remaining sensitive file, confirm: "Delete `{path}` from worktree? (y/n)". Only proceed when all files have explicit disposition.
- "Delete all — I don't need these" → remove each sensitive file from the worktree (`rm <path>`), then re-scan to confirm none remain before proceeding
- "Abort this worktree" → skip target

Do NOT proceed to commit/remove until disposition is fully resolved.

**B4. Stage and commit (if dirty):**

Check for in-progress operations: for each marker (`MERGE_HEAD`, `REBASE_HEAD`, `CHERRY_PICK_HEAD`, `REVERT_HEAD`, `rebase-merge`, `rebase-apply`), resolve path via `git -C <path> rev-parse --git-path <marker>`, then test existence with `test -e` (files) or `test -d` (directories like `rebase-merge`, `rebase-apply`). If any exist, halt for target:
> "Worktree has an in-progress {operation}. Resolve it first."

Stage files: `git -C <path> add <file1> <file2> ...` (explicit pathspecs from `git -C <path> status --porcelain`, NOT `-A`).

Commit: `git -C <path> commit -m "chore: auto-commit worktree state before cleanup"`.

If commit fails (hooks, signing, identity): report error, halt for this target.

**B5. Merge (unless `--no-merge`):**

Verify branch ref exists: `git rev-parse --verify refs/heads/<branch>`. If not → halt for target.

Check if already merged: `git merge-base --is-ancestor <branch> <target-branch>`. If yes → skip merge, note "already merged", proceed to removal and branch cleanup (branch IS eligible for safe deletion since it's merged).

Preview: `git log <target-branch>..<branch> --oneline` — show commit count and messages.

Confirm:
> "Merge `{branch}` ({N} commits) into `{target-branch}`? (y/n)"

Execute: `git merge --no-ff <branch>`.

On conflict: capture conflicting files from `git diff --name-only --diff-filter=U` BEFORE aborting, then `git merge --abort`. Skip target. Report the specific conflicting files.

On other failure (hooks, signing): check `git rev-parse --git-path MERGE_HEAD` — if merge state lingers, `git merge --abort`. Report cause, skip target.

**B6. Remove worktree:**

`git worktree remove <path>`.

- If fails due to submodules: report cause, do NOT offer force. Skip target: "Submodule-related removal failure. Resolve manually."
- If fails due to other unclean state: report the specific cause.
- If untracked/ignored files remain (non-submodule): show file list, explain force-remove will delete them, require explicit confirmation per file class.
- Force command if confirmed: `git worktree remove --force <path>`.
- Run `git worktree prune` after successful removal (per-target, not global).

**B7. Branch cleanup:**

If `--no-merge` was used: skip this entire step. Report:
> "Branch `{branch}` preserved. Merge later with: `git merge {branch}`"

Otherwise (merge succeeded OR branch was already merged):

- Verify: `git merge-base --is-ancestor <branch> <target-branch>`
- Block deletion of protected branches: `main`, `master`, `develop`
- `git branch -d <branch>` (safe delete — only works if merged)
- If fails (branch checked out in another worktree): report git error and leave branch intact

---

## Phase 7: Cleanup and Report

### Step 7a — Final prune

Run `git worktree prune --dry-run` first. Show what would be pruned. If items listed, confirm with user, then run `git worktree prune`.

### Step 7b — Verify state

Show both:
- `ls .claude/worktrees/ 2>/dev/null` — remaining filesystem directories
- `git worktree list` — registered worktrees

### Step 7c — Summary report

Display a summary table:

```
Directory                     | Action              | Branch                    | Result
──────────────────────────────|─────────────────────|───────────────────────────|──────────────
jx-kb-insights-skill          | Removed (stale)     | —                         | Done
wiki+jx-pm-plugin-page.bak    | Removed (stale)     | —                         | Done
feat-new-feature              | Merged + removed    | worktree-feat+new-feature | Done, branch deleted
locked-work                   | Skipped             | worktree-locked-work      | Locked
other-feature                 | Skipped             | worktree-other            | Merge conflict

Remaining worktrees: {count or "none"}
```

---

## Failure Behavior

| Condition | Response |
|-----------|----------|
| Not in a git repo / bare repo | Halt with error |
| Running from inside a linked worktree | Halt: switch to main checkout first |
| Main checkout in detached HEAD | Halt: check out a branch first |
| Target branch has uncommitted changes | Halt with error (warn in `--dry-run`) |
| No `.claude/worktrees/` directory | Halt: nothing to clean |
| No worktree dirs found | Halt: nothing to clean |
| `--worktree` target not found | Halt, list available |
| `--worktree` + `--all` both given | Halt: mutually exclusive |
| Locked worktree | Skip target: "unlock first" |
| Detached HEAD + dirty | Offer to create branch; if declined, skip |
| Detached HEAD + clean | Proceed to removal, skip merge |
| Sensitive files found | Hard stop: require disposition |
| In-progress merge/rebase/cherry-pick/revert | Halt for target: "resolve first" |
| Commit fails (hooks, identity, signing) | Halt for target, report error |
| Branch ref not found | Halt for target |
| Already merged | Skip merge, proceed to removal + branch cleanup |
| Merge conflict | Capture conflicts, abort merge, skip target |
| Non-conflict merge failure | Clean up merge state, report cause, skip target |
| `git worktree remove` fails (submodule) | Report cause, do not force |
| `git worktree remove` fails (unclean) | Report cause; offer force with explicit file list |
| rm target resolves outside `.claude/worktrees/` | Refuse |
| Stale dir has `.git` | Classify as "confirm" — require explicit confirmation |
| Stale dir has non-marker content | Classify as "confirm" — list contents, require confirmation |
| Protected branch deletion attempted | Block: refuse to delete main/master/develop |
| Branch checked out in another worktree | Report git error, leave branch intact |

---

## Completion Checklist

- [ ] Running from main checkout (not a linked worktree, not detached HEAD)
- [ ] Not a bare repository
- [ ] Target branch resolved, verified, and confirmed with user
- [ ] Target branch is clean
- [ ] Active-job warning acknowledged
- [ ] All directories discovered and classified using canonical paths
- [ ] Stale remnants with `.git` or non-marker content flagged for explicit confirmation
- [ ] Each rm target canonically verified under `.claude/worktrees/`
- [ ] Locked worktrees identified and skipped
- [ ] Detached HEAD worktrees handled (branch created or skipped)
- [ ] Sensitive files scanned with user disposition resolved
- [ ] No in-progress merge/rebase/cherry-pick/revert in active worktrees
- [ ] Commits succeeded before merge attempts
- [ ] Merge target verified (branch exists, ancestry checked)
- [ ] User confirmed each destructive action
- [ ] Merge conflicts captured before abort
- [ ] Merge state cleaned up after failures
- [ ] Already-merged branches eligible for safe deletion
- [ ] Branch deletion only via safe `git branch -d`
- [ ] `git worktree prune` run (with preview) after removals
- [ ] Summary report displayed with both filesystem and git state
