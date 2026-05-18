---
title: Iterative Adversarial Review
type: concept
tags: [pattern, quality, design, review]
created: 2026-05-09
updated: 2026-05-18
source_count: 1
aliases: [adversarial review loop, multi-pass review, design hardening]
provenance: synthesis
---

# Iterative Adversarial Review

A design-hardening pattern: submit a spec to adversarial review, resolve findings, update the spec, re-submit — repeat until no blocking findings remain.

## Why Single-Pass Fails

- Each fix can introduce new edge cases
- Reviewer sees different context after fixes (new attack surface)
- Cascading issues only surface after earlier issues are resolved
- First-pass findings tend to be structural; later passes find semantic/contract issues

## The Loop

```
1. Write/update design spec
2. Submit to adversarial reviewer (Codex, peer, security)
3. Reviewer returns findings (verdict: approve | needs-attention)
4. Discuss each finding individually — don't batch-resolve
5. Decide resolution per finding (fix, accept risk, defer)
6. Update spec with resolutions
7. Re-submit → goto 3
8. Exit when verdict = approve or findings are acceptable
```

## Observed Progression (jx-pm skill authoring)

| Round | Focus | Findings |
|-------|-------|----------|
| 1 | Working tree noise | .claude/worktrees leak, ADO idempotency gap, index corruption |
| 2 | ADO safety basics | Crash recovery, tenant guard, chain contract gap |
| 3 | Contract consistency | Merge vs tombstone contradiction, confirmation gates, tenant binding mismatch |
| 4 | Edge cases | Feature lookup, hierarchy reconciliation, force-overwrite backup safety |
| 5 | Clean | Approve (no material findings after all resolutions applied) |

## Observed Progression (jx-pm plugin split — idea grooming)

| Round | Focus | Findings |
|-------|-------|----------|
| 1 | Structural gaps | 3 critical, 4 major — missing manifests, undefined reference mechanism, pipeline contradiction |
| 2 | Resolution-induced regressions | 1 blocker, 3 high — pipeline lost task.json producer, no migration path, undefined path resolution |
| 3 | Remaining precision | 1 blocker, 3 major — wrong relative path depth, stale-reference grep incomplete, dependency shape unspecified |

## Observed Progression (jx-pm plugin split — implementation plan)

| Round | Focus | Findings |
|-------|-------|----------|
| 1 | Execution safety | 1 critical (race condition), 4 major — missing marketplace update, broken verification checks |
| 2 | Polish | 0 blockers — README env var, smoke test gaps, git-empty-dir |

## Resolution-Induced Regression

Key anti-pattern: fixing a round-1 finding creates a new bug visible only in round 2.

Examples:
- Deferring pipeline created a blocker: pipeline's task.json producer moved away
- Extracting shared files to jx-core introduced undefined path resolution
- Making tracks parallel created a race condition (B copies files C deletes)

This is why multi-round review matters — single-pass misses cascading effects of its own fixes.

## Diminishing Returns Signal

Stop when:
- Verdict is "CLEAN — no blockers"
- Findings drop to minor/cosmetic only
- Advisor confirms further rounds polish spec without code to validate against
- Implementation will surface remaining issues more efficiently

## Convergence Limit: External Constraints

Stop iterating when Codex repeats a finding across 2+ rounds and the underlying constraint is external to the design (e.g., a third-party API that doesn't expose the needed capability).

In this case, no design revision can satisfy the reviewer — the tooling fundamentally can't deliver what's being asked for. The correct exit is:

1. Document the constraint as accepted residual risk
2. Present the user with explicit options: (a) accept with documented risk, (b) descope the capability, (c) block until the external constraint is resolved
3. Stop the review loop — further rounds will not converge

**Example (feedback skill, 2026-05-14):** Codex flagged "org-binding gap" across 3 rounds. The ADO MCP server doesn't expose its configured organization. No amount of plan revision could satisfy "add a real connected-organization check" because the check is impossible with available tools. Resolution: accept residual risk with strengthened typed confirmation gate (see [[User Confirmation Gate]]).

## Key Patterns Discovered Through This Loop

Each round surfaced patterns that became wiki concepts:
- [[Per-Item Write-Back]] — round 2 (crash safety)
- [[Tombstone Pattern]] — round 3 (orphan prevention)
- [[Fail-Closed Lookup]] — round 3 (ambiguous match safety)

## Stale Path Detection Post-Rename

Adversarial review catches stale references in non-code artifacts (plans, docs) after plugin renames. Example from jx-qa test skill plan (2026-05-10): plan authored pre-rename targeted `plugins/qa-ai/...` paths, but live code had moved to `plugins/jx-qa/...`. Codex flagged the mismatch as high-severity — executing the plan would have created dead duplicate paths or left the real skill untouched.

This failure mode is invisible to grep-based verification (which checks code, not plans) and only surfaces when adversarial review reads both the plan and the filesystem.

## Multi-Stage Lifecycle Review (2026-05-18)

Adversarial review applied at different lifecycle stages catches different classes of issues:

| Stage | Target | Findings Class |
|-------|--------|---------------|
| Idea grooming | Scope and acceptance criteria | Safety gaps in *what* to build (weak verification, underspecified credential handling) |
| Plan review | Implementation sequence and file operations | Execution risks in *how* to build it (link retargeting, missing explicit flags) |

The idea-stage review caught that the verification checklist could bless the wrong tenant. The plan-stage review caught that the promotion rename would silently retarget historical wikilinks. Neither finding would have surfaced at the other stage — the idea review didn't know about the rename strategy, and the plan review wouldn't have questioned the verification design.

This suggests adversarial review is most effective when applied at each lifecycle transition, not just before implementation.

## When to Use

- Before implementing any system that writes to external state (APIs, databases, cloud services)
- When a design has safety/idempotency requirements
- When porting existing code to new context (assumptions from source may not hold)
- After significant design changes within a session
- After plugin or namespace renames — plans and docs authored pre-rename carry stale paths

## Related

- [[User Confirmation Gate]] — confirmation gates emerged from this pattern
- [[Idempotent Operation]] — idempotency contracts hardened through review
- [[Per-Item Write-Back]] — discovered through adversarial review
- [[Tombstone Pattern]] — discovered through adversarial review
- [[Fail-Closed Lookup]] — discovered through adversarial review
- [[Product Management Skills Plugin]] — case study for this pattern
- [[Cross-Plugin Shared Convention Layer]] — adversarial review caught resolution-induced regressions during split
- [[Split Verification Pattern]] — dual-tier verification emerged from review findings
- [[Knowledge Flywheel]] — review is one phase of the self-reinforcing knowledge loop
- [[Naming Ripple Effect]] — stale paths in plans are a rename cascade the code-level grep misses

## Sources
- [[Source - Plugin Split Implementation Plan]]
