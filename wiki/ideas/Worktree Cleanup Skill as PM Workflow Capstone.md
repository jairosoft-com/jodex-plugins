---
title: Worktree Cleanup Skill as PM Workflow Capstone
type: idea
tags: [jx-pm, worktree, workflow, automation]
created: 2026-05-25
updated: 2026-05-25
source_count: 0
aliases: []
provenance: synthesis
status: raw
---

# Worktree Cleanup Skill as PM Workflow Capstone

The PM-to-delivery flow (`/jx-pm:prd` → `/jx-pm:ado` → `/jx-dev:spec` → `/jx-dev:task`) lacks a closing step that handles the git mechanics of shipping the work. The new `clean-worktree` skill (`/jx-pm:clean-worktree`) fills this gap: commit all changes, merge to main, remove the worktree. This positions it as the natural "done" step after implementation completes in a worktree-isolated branch.

Consider whether the pipeline skill (`/jx-pm:pipeline`) should offer `clean-worktree` as an optional final stage.

## Sources
- Session observation, 2026-05-25
