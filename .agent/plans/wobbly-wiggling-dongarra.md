# Plan: Flesh Out clean-worktree Skill

## Context

The `clean-worktree` skill at `plugins/jx-pm/skills/clean-worktree/SKILL.md` is scaffolded but empty — both phases are `<placeholder>`, arguments table is blank, evals are `[]`. The command stub at `plugins/jx-pm/commands/clean-worktree.md` has `allowed-tools: Read`, which is too restrictive for a skill that runs git commands and removes directories.

**Problem it solves:** Claude Code background agents create worktrees under `.claude/worktrees/<name>/` via `EnterWorktree`. When jobs finish or fail, these worktrees linger — sometimes as registered git worktrees with uncommitted work, sometimes as orphaned directories from failed harness setup. There is no automated cleanup today; users must run manual git commands.

**Why ExitWorktree won't work:** That tool only operates on worktrees created by `EnterWorktree` in the *current* session. Cross-session cleanup requires direct git commands.

## Files to Modify

| File | Action |
|------|--------|
| `plugins/jx-pm/skills/clean-worktree/SKILL.md` | Rewrite — full skill spec |
| `plugins/jx-pm/commands/clean-worktree.md` | Update — expand allowed-tools and argument-hint |

## 1. Command Stub Update (`commands/clean-worktree.md`)

Update frontmatter:

```yaml
---
description: Clean up git worktrees created by Claude Code background agents
argument-hint: "[--worktree <name>] [--all] [--no-merge] [--dry-run]"
allowed-tools: Read, Bash(git -C:*), Bash(git status:*), Bash(git rev-parse:*), Bash(git branch:*), Bash(git worktree list:*), Bash(git worktree remove:*), Bash(git worktree prune:*), Bash(git merge:*), Bash(git merge-base:*), Bash(git checkout:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git diff --name-only:*), Bash(find .claude/worktrees:*), Bash(realpath:*), Bash(rm -rf .claude/worktrees/:*), Bash(ls:*), Bash(test:*)
---
```

Rationale:
- `Bash(git -C:*)` covers worktree-scoped commands (`git -C <path> status`, `git -C <path> add`, etc.). Mid-pattern wildcards like `Bash(git -C * status:*)` don't work in Claude Code's permission grammar (it uses pure prefix matching), so `git -C:*` is the narrowest functional form
- `Bash(git worktree list/remove/prune:*)` pinned to cleanup operations only — no `add`, `move`, `lock`, `unlock`
- `Bash(git diff --name-only:*)` needed to capture conflict file list before merge abort
- `rm` constrained to `.claude/worktrees/` prefix
- `realpath` for canonical path resolution
- `test` for existence checks (`test -d`, `test -f`)

Body unchanged (delegates to skill via `$ARGUMENTS`).

## 2. Skill Spec Rewrite (`SKILL.md`)

### Frontmatter

```yaml
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
```

### Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--worktree` | No | all discovered | Name of a specific directory under `.claude/worktrees/` |
| `--all` | No | false | Process all worktrees without interactive selection |
| `--no-merge` | No | false | Skip merge; branch preserved with commits intact |
| `--dry-run` | No | false | Discover, classify, display planned actions — no mutations |

Bare invocation (no flags) → scan, classify, present interactive menu.

### Phase 1: Argument Parsing

- Extract `--worktree <name>`, `--all`, `--no-merge`, `--dry-run`
- Validate `--worktree` and `--all` are mutually exclusive
- `--worktree` value must match a discovered directory basename exactly — no path separators, `..`, or absolute paths

### Phase 2: Preflight Guards (fail-closed)

Six guards, checked in order. In `--dry-run` mode, guards 4-5 report warnings instead of halting.

1. **Git repo check** — `git rev-parse --is-inside-work-tree` must be `true`. Also reject bare repos: `git rev-parse --is-bare-repository` must be `false`

2. **Main checkout check** — canonicalize cwd with `realpath` and compare to the canonicalized first `worktree` path from `git worktree list --porcelain`. If they differ, agent is inside a linked worktree → halt: "Switch to the main checkout first."

3. **Resolve target branch** — `git branch --show-current` to get the current branch. If empty (detached HEAD on main checkout), halt: "Main checkout is in detached HEAD state. Check out a branch first (e.g., `git checkout main`)." Then verify the branch ref exists: `git rev-parse --verify refs/heads/{branch}`. Display and confirm: "Worktree branches will merge into `{branch}`. Correct?"

4. **Target branch clean** — `git status --porcelain` on the current checkout must be empty

5. **Non-default target warning** — if target branch is not `main` or `master`, warn and confirm: "Merge target is `{branch}`, not main/master. Proceed?"

6. **Active job warning** — warn user: "Ensure no background agents are currently using worktrees being cleaned. Cleaning an active worktree may corrupt in-progress work." Require confirmation.

### Phase 3: Discovery

1. Check `.claude/worktrees/` exists (`test -d`). If absent → halt: "No `.claude/worktrees/` directory found."
2. `find .claude/worktrees -mindepth 1 -maxdepth 1 -type d` to find all directories
3. `git worktree list --porcelain` to get registered worktrees — parse `worktree`, `HEAD`, `branch`, `locked`, `prunable` annotations
4. If no directories found → halt: "No worktrees found at `.claude/worktrees/`. Nothing to clean up."

### Phase 4: Classification

Cross-reference filesystem dirs with git worktree list using canonical paths (`realpath` both sides). For each directory:

- **Active Worktree** — canonical path IS in `git worktree list`. Record:
  - Branch name from porcelain `branch refs/heads/<name>` field (store both full ref and short name)
  - `locked` / `prunable` annotations
  - Dirty state via `git -C <path> status --porcelain`
  - Detached HEAD state (porcelain shows `HEAD` but no `branch`)
- **Stale Remnant** — canonical path NOT in `git worktree list`. Before classifying as safe-to-delete, inspect:
  - Check for `.git` file or directory. If `.git` exists (regardless of whether harness markers are also present) → classify as **Uncertain — needs confirmation**. Display: "Directory contains `.git` — may be a nested repo, moved worktree, or clone. Confirm deletion or investigate with `git worktree repair`."
  - If no `.git`: check for known Claude harness markers (`logs/`, `.agent/`, `.claude/`). If only markers → classify as **Stale Remnant (safe)**
  - If no `.git` and contains non-marker content (files or directories beyond `logs/`, `.agent/`, `.claude/`) → classify as **Uncertain — needs confirmation**. List unexpected contents and require per-target confirmation before deletion

Display classification table to user:

```
Directory                     | Status          | Branch                    | Dirty | Notes
──────────────────────────────|─────────────────|───────────────────────────|───────|──────
jx-kb-insights-skill          | Stale (safe)    | —                         | —     | harness markers only
wiki+jx-pm-plugin-page.bak    | Stale (safe)    | —                         | —     | harness markers only
nested-clone                  | Stale (confirm) | —                         | —     | has .git — investigate
feat-new-feature              | Active          | worktree-feat+new-feature | Yes   | 3 modified files
locked-work                   | Active (locked) | worktree-locked-work      | No    | locked
```

### Phase 5: Target Selection

- `--worktree <name>` → match against discovered basenames, process only that entry. If not found, halt and list available
- `--all` → add all to queue
- bare invocation → numbered interactive menu, user picks (comma-separated or 'all')

### Phase 6: Execute Cleanup

If `--dry-run`: display the planned action for each target (what would be committed, merged, removed), then halt. No mutations.

Two paths based on classification:

**Path A — Stale Remnant:**
1. **Canonical path guard (fail-closed):** Resolve with `realpath`, verify canonical parent equals canonical `.claude/worktrees`. If it resolves outside → refuse and report
2. **Uncertain directory gate:** If classified as "Stale (confirm)" (has `.git`), require explicit confirmation with explanation of what was found
3. **Preview:** Show what will be removed — list top-level contents
4. **Confirm:** Per-target confirmation required, even with `--all`
5. **Remove:** `rm -rf .claude/worktrees/<name>/`
6. **Verify:** Confirm directory no longer exists

**Path B — Active Worktree:**

Any failure at a sub-step halts processing for that target (continues to next in `--all` mode).

1. **Locked worktree guard** — if `locked` annotation present, skip target: "Worktree `{name}` is locked. Unlock with `git worktree unlock <path>` first."

2. **Detached HEAD handling** — if no `branch` in porcelain output:
   - Show HEAD SHA and dirty state
   - Offer: "Create a branch from detached HEAD before cleanup?" If yes: `git -C <path> checkout -b detached-{name}-{short-sha}`. Update tracked branch variable for subsequent steps.
   - If user declines and worktree is dirty: skip target ("Cannot commit without a branch on detached HEAD with dirty state")
   - If user declines and worktree is clean: proceed to removal (skip merge)

3. **Sensitive file scan and disposition** — scan with `find`:
   - Patterns: `-name ".env" -o -name ".env.*" -o -name "*.pem" -o -name "*.key" -o -name "*.pfx" -o -name "*.p12" -o -name "credentials*" -o -name "secrets*" -o -name ".npmrc" -o -name ".pypirc" -o -name "id_rsa" -o -name "id_ed25519"`
   - Exclude: `.git/` internals, `node_modules/`
   - If found, list all paths. **Hard stop** — require user disposition:
     - "I've copied what I need — delete originals and proceed" → re-scan; for each remaining sensitive file, confirm: "Delete `{path}` from worktree? (y/n)". Only proceed when all files have explicit disposition.
     - "Delete all — I don't need these" → proceed
     - "Abort this worktree" → skip target

4. **Stage + commit** (if dirty):
   - Check for in-progress operations: for each marker (`MERGE_HEAD`, `REBASE_HEAD`, `CHERRY_PICK_HEAD`, `REVERT_HEAD`, `rebase-merge`, `rebase-apply`), resolve path via `git -C <path> rev-parse --git-path <marker>`, then test existence with `test -e` (files) or `test -d` (directories like `rebase-merge`). If any exist, halt for target: "Worktree has an in-progress {operation}. Resolve it first."
   - Stage files: `git -C <path> add <file1> <file2> ...` (explicit pathspecs from `git -C <path> status --porcelain`, NOT `-A`)
   - Commit: `git -C <path> commit -m "chore: auto-commit worktree state before cleanup"`
   - If commit fails (hooks, signing, identity): report error, halt for target

5. **Merge** (unless `--no-merge`):
   - Verify branch ref exists: `git rev-parse --verify refs/heads/<branch>`. If not → halt for target
   - Check if already merged: `git merge-base --is-ancestor <branch> <target-branch>`. If yes → skip merge, note "already merged", proceed to removal and branch cleanup (branch IS eligible for safe deletion since it's merged)
   - Preview: `git log <target-branch>..<branch> --oneline` — show commit count and messages
   - Confirm: "Merge `{branch}` ({N} commits) into `{target-branch}`? (y/n)"
   - Execute: `git merge --no-ff <branch>`
   - On conflict: capture conflicting files from `git diff --name-only --diff-filter=U` BEFORE aborting, then `git merge --abort`, skip target, report the specific conflicting files
   - On other failure (hooks, signing): check `git -C . rev-parse --git-path MERGE_HEAD` — if merge state lingers, `git merge --abort`. Report cause, skip target.

6. **Remove worktree** — `git worktree remove <path>`
   - If fails due to submodules: report cause, do NOT offer force. Skip target with: "Submodule-related removal failure. Resolve manually."
   - If fails due to other unclean state: report the specific cause
   - If untracked/ignored files remain (non-submodule): show file list, explain force-remove will delete them, require explicit confirmation per file class
   - Force command if confirmed: `git worktree remove --force <path>`
   - Run `git worktree prune` after successful removal (per-target, not global)

7. **Branch cleanup:**
   - If `--no-merge` was used: skip this entire step. Report: "Branch `{branch}` preserved. Merge later with: `git merge {branch}`"
   - Otherwise (merge succeeded OR branch was already merged):
     - Verify: `git merge-base --is-ancestor <branch> <target-branch>`
     - Block deletion of protected branches: `main`, `master`, `develop`
     - `git branch -d <branch>` (safe delete). If fails (checked out elsewhere), report git error and leave branch intact

### Phase 7: Report

**Final prune:** `git worktree prune --dry-run` first — show what would be pruned. If items listed, run `git worktree prune`.

**Verify:** show both `ls .claude/worktrees/ 2>/dev/null` and `git worktree list` for complete picture.

**Summary table:**

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

### Failure Behavior Table

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
| In-progress merge/rebase/cherry-pick | Halt for target: "resolve first" |
| Commit fails (hooks, identity, signing) | Halt for target, report error |
| Branch ref not found | Halt for target |
| Already merged | Skip merge, proceed to removal + branch cleanup |
| Merge conflict | Capture conflicts, abort merge, skip target |
| Non-conflict merge failure | Clean up merge state, report cause, skip target |
| `git worktree remove` fails (unclean) | Report cause; offer force with explicit file list |
| rm target resolves outside `.claude/worktrees/` | Refuse |
| Stale dir has `.git` | Classify as "confirm" — require explicit confirmation |
| Protected branch deletion attempted | Block: refuse to delete main/master/develop |
| Branch checked out in another worktree | Report git error, leave branch intact |
| Submodule worktree removal fails | Report cause, do not force |

### Checklist (end of SKILL.md)

- [ ] Running from main checkout (not a linked worktree, not detached HEAD)
- [ ] Not a bare repository
- [ ] Target branch resolved, verified, and confirmed with user
- [ ] Target branch is clean
- [ ] Active-job warning acknowledged
- [ ] All directories discovered and classified using canonical paths
- [ ] Stale remnants with `.git` flagged for explicit confirmation
- [ ] Each rm target canonically verified under `.claude/worktrees/`
- [ ] Locked worktrees identified and skipped
- [ ] Detached HEAD worktrees handled (branch created or skipped)
- [ ] Sensitive files scanned with user disposition resolved
- [ ] No in-progress merge/rebase/cherry-pick in active worktrees
- [ ] Commits succeeded before merge attempts
- [ ] Merge target verified (branch exists, ancestry checked)
- [ ] User confirmed each destructive action
- [ ] Merge conflicts captured before abort
- [ ] Merge state cleaned up after failures
- [ ] Already-merged branches eligible for safe deletion
- [ ] Branch deletion only via safe `git branch -d`
- [ ] `git worktree prune` run (with preview) after removals
- [ ] Summary report displayed with both filesystem and git state

## Not in Scope

- Evals (`evals/evals.json`) — left empty; future eval scenarios should cover: dry-run, locked worktree, stale with `.git`, dirty detached HEAD, `--no-merge`, merge conflict, already-merged branch
- Remote branch cleanup — local only
- `--yes` flag (headless auto-confirm) — deferred

## Verification

After implementation:
1. Read both files back to confirm structure matches peer skills (`meet-pre`, `meet-email`)
2. Validate both command stub and SKILL.md frontmatter YAML
3. Run with `--dry-run` from the main checkout against the stale remnants in `.claude/worktrees/` to verify discovery and classification
