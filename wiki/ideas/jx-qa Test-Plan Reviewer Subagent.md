---
title: jx-qa Test-Plan Reviewer Subagent
type: idea
tags: [jx-qa, agent, test-plan, quality, read-only]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
provenance: session-observation
status: raw
priority: P1
---

# jx-qa Test-Plan Reviewer Subagent

A **read-only** subagent that reviews an xlsx test plan (post-`extract`, pre-`generate`) for
quality / testability and AC traceability, producing an advisory report — no edits.

**Why it's safe where [[jx-qa Spec-Generator Subagent]] wasn't:** the xlsx parse (the only Bash need)
happens in the pinned-helper **command** *before* delegation; the agent receives the already-parsed
plan content and gets only `Read` / `Grep` / `Glob` — **no Bash, no Write, no browser** → no
command-injection surface, no untrusted-shell, no writes to executable paths.

**Fills a real gap:** the `test` skill's negative evals route "review the test plan / what's missing"
and "check coverage" *away*, but nothing actually does it today.

Reviews: vague/unverifiable assertions, bundled steps (one-assertion-per-step), missing negative/edge
cases, non-E2E steps that slipped in, step-1 navigation/locator weakness, and AC/FR traceability.

Relates to [[QA Testing Plugin]], [[jx-qa Spec-Generator Subagent]] (deferred risky sibling),
[[Harden Interactive jx-qa Generate Path]].

## Sources
- Session — jx-qa sub-agent candidate analysis (2026-05-29)
