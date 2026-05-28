---
title: Meet-Pre Eval Output Path and Naming Convention
type: idea
tags: [jx-pm, meet-pre, evals, testing, file-naming]
created: 2026-05-28
updated: 2026-05-28
status: raw
priority: P2
effort: small
source: Session — jx-local-create-prompt (2026-05-28)
provenance: user-request
---

# Meet-Pre Eval Output Path and Naming Convention

Add evaluations for the meeting preparation skill (`jx-pm:meet-pre`) that verify:

1. **Output folder**: meeting prep files are written to the correct directory (`wiki/raw/meeting_preparation/`)
2. **File naming convention**: filenames follow a consistent date/timestamp format for the report

These evals catch regressions where the skill silently writes to the wrong location or drifts from the naming convention.
