---
title: File-Based Data Transport
type: idea
tags: [security, shell-injection, skill-design, pattern, pinned-helper]
created: 2026-05-27
updated: 2026-05-27
status: raw
priority: P2
effort: small
source: Session — jx-local create-prompt adversarial review (2026-05-27)
provenance: observation
---

# File-Based Data Transport

When a Claude Code skill needs to pass user-controlled content (descriptions, body text, tags) to a [[Pinned Helper]] script, write the data to temp files via the Write tool and pass only file paths as shell args.

## Why

Shell interpolation of user content is unsafe regardless of quoting strategy:
- `--arg "<value>"` expands `$()`, backticks, and `$VAR` before the helper sees it
- `echo "<value>" | python3 helper` has the same expansion problem plus allowlist mismatch
- Even stdin piping via assignment `VAR=$(mktemp)` can be blocked by command allowlists

## The Pattern

1. Write metadata to a JSON file via the Write tool (no shell involved)
2. Write body content to a separate file via the Write tool
3. Invoke the helper with only literal file paths: `python3 helper write --metadata-file path --body-file path`
4. Helper reads files directly — zero shell interpolation of user content

## Related

- [[Cross-Plugin Pinned Helper]]
- [[Staging File Deletion Confinement]]
- [[Ensure-Dir Bootstrap Pattern]]
