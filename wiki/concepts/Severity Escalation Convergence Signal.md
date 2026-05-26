---
title: Severity Escalation Convergence Signal
type: concept
tags: [pattern, adversarial-review, convergence, platform-constraint]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: [severity escalation signal, escalation without recommendation change]
provenance: source-derived
---

# Severity Escalation Convergence Signal

When an [[Iterative Adversarial Review]] finding's severity increases across consecutive rounds but the recommendation text is unchanged, the underlying issue is a platform constraint — not a design flaw.

## Pattern

| Round N | Round N+1 | Signal |
|---------|-----------|--------|
| Medium severity, recommendation X | High severity, recommendation X (same) | Platform constraint — stop iterating |
| Medium severity, recommendation X | High severity, recommendation Y (new) | Real design gap — fix and re-submit |

The reviewer escalates because the issue remains unresolved, but if their proposed fix hasn't changed, it means no design revision can satisfy the requirement. The tooling fundamentally can't deliver what's being asked for.

## Correct Exit

1. Document the constraint as accepted residual risk with explicit mitigations
2. Stop the review loop — further rounds will not converge
3. Do not revise the plan again with the same recommendation

## Example (FEAT-006, 2026-05-25)

SKILL.md `--dry-run` enforcement:
- **Round 5**: medium — "split dry-run into a command without `graph_send_message`"
- **Round 6**: high — "split dry-run into a command without `graph_send_message`" (identical)

The SKILL.md format has no mechanism for conditional tool access per argument. All skills are LLM instruction files. No amount of plan revision could satisfy "make the tool unavailable during dry-run." Resolution: accepted risk with double-gate mitigation (instruction + confirmation).

## Distinction from Recurring Findings

This is different from findings that recur because of an internal contradiction (see [[Iterative Adversarial Review]] key insight from ADO skill test plan). In that case, the recommendation changes each round as the reviewer finds the same contradiction in different sections. Here, the recommendation is frozen — the reviewer has one fix and it can't be implemented.

## Related

- [[Iterative Adversarial Review]] — parent pattern; this is a specific exit criterion
- [[Spec-First Skill Execution]] — emerged from the same session
- [[User Confirmation Gate]] — common mitigation for platform constraints

## Sources

- [[Source - FEAT-006 Session Insights]]
