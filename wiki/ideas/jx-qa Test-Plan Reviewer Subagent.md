---
title: jx-qa Test-Plan Reviewer Subagent
type: idea
tags: [jx-qa, agent, test-plan, quality, tool-less]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
provenance: session-observation
status: raw
priority: P1
---

# jx-qa Test-Plan Reviewer Subagent

A **tool-less** subagent that reviews an xlsx test plan (post-`extract`, pre-`generate`) for
quality / testability and AC traceability, producing an **unverified, advisory, NON-GATING** report —
no edits. A quality aid, not a quality gate.

**Why milder than [[jx-qa Spec-Generator Subagent]]:** no Write / browser / test-execution → no
arbitrary-code-execution or spec-corruption surface. But adversarial review showed **read-only ≠ safe**
(prompt-injected workbook text could drive `Read`/`Grep`/`Glob` to exfiltrate off-scope files into the
report), so the agent is **tool-less** (no `Read` either): the command ingests the xlsx + BRD via
**deterministic, path-validated, read-only pinned helpers** (Option A — no broad `Read`/`ls`) and inlines
the exact content into the agent. **Residual:** the parent command still *sees* untrusted content; that
prompt-injection exposure is acknowledged (not closed by construction) and **accepted for trusted,
internal test plans**, eval-gated. Full closure needs the same runtime no-shell prerequisite as
spec-generator.

**Fills a real gap:** the `test` skill's negative evals route "review the test plan / what's missing"
and "check coverage" *away*, but nothing actually does it today.

Reviews: vague/unverifiable assertions, bundled steps (one-assertion-per-step), missing negative/edge
cases, non-E2E steps that slipped in, step-1 navigation/locator weakness, and AC/FR traceability.

Relates to [[QA Testing Plugin]], [[jx-qa Spec-Generator Subagent]] (deferred risky sibling),
[[Harden Interactive jx-qa Generate Path]].

## Sources
- Session — jx-qa sub-agent candidate analysis (2026-05-29)
