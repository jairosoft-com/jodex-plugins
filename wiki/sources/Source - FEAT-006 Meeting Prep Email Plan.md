---
title: "Source - FEAT-006 Meeting Prep Email Plan"
type: source
tags: [jx-pm, meet-email, plan, adversarial-review, email]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: []
provenance: source-derived
---

# Source - FEAT-006 Meeting Prep Email Plan

Implementation plan for the `meet-email` skill in the [[Product Management Skills Plugin|jx-pm]] plugin. Converts meeting preparation Markdown (from `meet-pre`) to email-safe inline-styled HTML and sends via Microsoft Graph API.

## Key Design Decisions

- Markdown to email-safe HTML with inline styles (no external deps, no flexbox/grid, table-based layout)
- Original `.md` file attached for raw reference
- Suffix-aware file selection: parses `(date, suffix)` tuples to handle `meet-pre` reruns
- Sender account resolution via `mcp__mail__list_all_accounts` with explicit `account_id` binding
- HTML entity escaping of all ADO-sourced content (titles, descriptions, assignee names)
- Allowlist rendering: only safe HTML tags emitted from source content
- `--dry-run` flag for safe testing; headless auto-send deferred to v2
- Freshness warning when prep file date does not equal today
- No Bash in command wrapper allowed-tools (tight trust boundary for outbound email)
- Verified mail tool schemas against `mail-mcp` source code (`GraphSendMessageInput`, `AttachmentInput`)

## Adversarial Review History

6 rounds of [[Iterative Adversarial Review]] via Codex. Findings converged from structural to repeating platform constraint.

## ADO Sync Incident

Initial ADO sync improvised work item format instead of following `jx-core/_shared/ado.md` spec. Required batch update of 8 work items (Feature 205002 + 7 stories) to match the 204900 convention: structured 6-section Feature template, ACs in dedicated field, story points, `prd:` tags.

## Raw Source

File: `.agent/plans/rosy-forging-grove.md` in worktree `plan-meet-email`

## Sources

- [[Source - FEAT-006 Meeting Prep Email Plan]]
