---
title: Plan vs Code Review Complementarity
type: idea
tags: [adversarial-review, codex, quality, workflow, pattern]
created: 2026-05-27
updated: 2026-05-27
status: raw
priority: P2
effort: small
source: Session — jx-local create-prompt plan + code review (2026-05-27)
provenance: observation
---

# Plan vs Code Review Complementarity

Plan-level adversarial review and code-level review catch fundamentally different classes of issues. Both are needed even when the plan has been thoroughly hardened.

## Evidence

jx-local:create-prompt skill development:
- 6 rounds of plan review: 10→9→4→3→1→1 findings (design gaps, missing features, phase ordering, validation boundaries, data transport)
- 7 rounds of code review after implementation: P1→P2→P2→P2→P2+P3→P2+P3→P2 (undefined env vars, permission mismatches, first-use bootstrapping, symlink escapes, YAML type coercion)

Zero overlap between the two sets.

## What Each Catches

**Plan review**: missing features, ambiguous contracts, wrong phase ordering, validation boundary design, data transport architecture

**Code review**: undefined variables at runtime, command allowlist mismatches, directory-doesn't-exist bootstrapping, symlink path escapes, concurrent race conditions, YAML type coercion edge cases

## Related

- [[Iterative Adversarial Review]]
- [[Severity Escalation Convergence Signal]]
