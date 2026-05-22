---
title: Codex Review Gate Loops on Empty Diffs
type: idea
tags: [codex, review-gate, operational, bug]
created: 2026-05-22
updated: 2026-05-22
status: backlogged
priority: P3
effort: small
source: ADO sync session (2026-05-22)
aliases: [review gate loop, stop hook empty diff]
provenance: synthesis
---

# Codex Review Gate Loops on Empty Diffs

When the Codex stop-time review gate fires and there are no uncommitted code changes, it returns status 1 with empty output. The stop hook treats this as a blocking error and retries, creating an infinite loop that prevents the session from exiting.

## Observed Behavior

1. All code changes committed and merged to main
2. User attempts to stop session
3. Review gate fires, finds no diff, returns `{ status: 1, rawOutput: "", touchedFiles: [] }`
4. Stop hook blocks, user sees error, tries again
5. Loop repeats — 5 consecutive failures observed before manual intervention

Compounded by a revoked refresh token (broker died mid-session), each retry also failed auth, producing cascading errors.

## Suggested Mitigation

The review gate should treat "no uncommitted changes" as a pass (ALLOW), not a failure. An empty diff is not a risk — it means everything is already committed.

## Scope

This is an upstream issue in the Codex Claude Code plugin (`stop-review-gate-hook.mjs`), not in jx-* plugin code. Filed here as an operational observation for awareness.
