---
name: feedback-workflow-save-location
description: Always copy/save the workflow.js into the repo's .claude/workflows/ folder when creating a workflow, not only the auto-saved session-dir copy
metadata:
  node_type: memory
  type: feedback
  originSessionId: 6a9bd770-c9e9-446d-bd88-17674619e1ca
---

When creating a workflow with the Workflow tool, always also save the workflow script into the repo at `.claude/workflows/<name>.js` (committed/tracked) — not only the auto-saved copy under `~/.claude/projects/.../workflows/scripts/`.

Use the workflow's `meta.name` as the filename. Because `.claude/workflows/` is a tracked path, land it via the worktree → commit → merge flow (a shared-checkout write triggers the bg-isolation guard).

**Why:** The Workflow tool auto-persists each script to a per-session directory outside the repo, so it is not version-controlled, not shared with the team, and not invocable by name. A copy in `.claude/workflows/` makes the workflow tracked, reviewable, shareable, and runnable via `Workflow({name: "<name>"})`.

**How to apply:** After authoring/running a workflow, write the script to `.claude/workflows/<name>.js`, `node --check` it, then commit it. Note: a newly-added file is not picked up by name until the workflow registry refreshes (next session) — invoke by `scriptPath` in the same session.
