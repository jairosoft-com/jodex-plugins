---
title: Runtime Smoke Must Validate Output Content Not Just Discovery
type: concept
tags: [testing, quality, evals, pattern]
created: 2026-05-30
updated: 2026-05-30
source_count: 0
aliases: []
provenance: synthesis
---

# Runtime Smoke Must Validate Output Content Not Just Discovery

A runtime smoke for a new command/skill must check the **output content**, not just
that the command loads and fails closed. A discovery-only smoke (is it registered?
does it reject bad args?) passes while the tool emits a plausible-but-wrong result,
because registration and file-shape checks never exercise the logic.

- Layer the smoke: **(1) discovery + fail-closed**, then **(2) content-aware** —
  run against a **known-answer fixture** and assert the exact result.
- For the coverage analyzer, the fixture pins one Covered / one Uncovered / one
  legitimately-`N/A` / one E2E-testable-NFR-that-must-not-be-`N/A`, and asserts the
  exact statuses + the coverage denominator — catching a placeholder matrix that a
  structure-only check would pass.
- Surfaced by iterative adversarial review tightening the gate (discovery →
  structure → content), echoing [[Adversarial Review Converges to a Narrowed Residual]].

Related: [[Plan vs Code Review Complementarity]].

## Sources
- Session: jx-qa coverage build + Codex-worktree & plugin-loading gotchas (2026-05-30)
