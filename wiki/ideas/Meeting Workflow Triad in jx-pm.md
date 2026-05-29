---
title: Meeting Workflow Triad in jx-pm
type: idea
tags: [jx-pm, meeting, workflow, pattern]
created: 2026-05-25
updated: 2026-05-28
source_count: 0
aliases: []
provenance: synthesis
status: completed
---

# Meeting Workflow Triad in jx-pm

jx-pm now has three meeting-focused skills forming a complete lifecycle:

1. **meet-pre** — prepare (pull data from Azure Boards)
2. **meet-notes** — capture (real-time notes during meeting)
3. **meet-email** — distribute (prep/notes as HTML email)

This prepare → capture → distribute pattern could become a reusable sub-pipeline, similar to how the PRD pipeline chains generation → spec → task → sync.

## Sources

- Session observation, 2026-05-25
