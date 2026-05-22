---
title: Codex Shared Runtime Auth Recovery
type: idea
tags: [codex, auth, workflow, troubleshooting, review-gate]
created: 2026-05-22
updated: 2026-05-22
status: raw
priority: P2
effort: small
source: Session — FEAT-003 adversarial review loop (2026-05-22)
provenance: observation
---

# Codex Shared Runtime Auth Recovery

## Problem

`codex login` (browser flow) succeeds but the Codex companion still reports `loggedIn: false`. This happens when `--enable-review-gate` has been used, which starts a shared broker runtime at a socket path. The running broker holds an independent auth state and does not pick up credentials written by `codex login`.

Observed failure mode: `task-resume-candidate` returns `"refresh token was already used"` — a stale refresh token cached in the broker, not just an expired session.

## Solution

1. Find the broker PID: `cat $(find /var/folders -name broker.pid 2>/dev/null | head -1)`
2. Kill it: `kill <pid>`
3. Re-login: `codex login`

The next Codex task command starts a fresh broker with the new credentials.

## Why Not Just `codex logout && codex login`

`codex logout` clears local credentials but does not kill the running broker. The broker continues using its cached (now-invalid) token until killed.
