---
title: Iterative Adversarial Review
type: concept
tags: [pattern, quality, design, review]
created: 2026-05-09
updated: 2026-05-26
source_count: 3
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

## Observed Progression (jx-pm ADO skill test plan — 10 rounds)

| Round | Focus | Findings |
|-------|-------|----------|
| 1 | Fixture contract | 3 high — fixture naming violates skill ID contract, cleanup queries non-existent tags, sandbox guard too permissive |
| 2 | Write-path safety | 3 critical/high — pre-write MCP verification missing, cleanup irreversible, SDK not pinned to branch |
| 3 | Guard precision | 2 high — guard compares env to itself, pre-seeded IDs collide with cleanup |
| 4 | Crash window | 2 high — cleanup misses untagged stories (created before tagging step), circular ID check |
| 5 | Env contradiction | 2 high + 1 medium — hardcoded SANDBOX contradicted by env-derived helpers |
| 6 | Pre-seeded mutation | 2 high + 1 medium — partial/update fixtures share committed IDs that cleanup can corrupt |
| 7 | Persistent contradiction | 2 high + 1 medium — tenant source-of-truth still split across env and constants |
| 8 | Sandbox cleanup | 2 high + 1 medium — `destroy=true` too broad, pre-seeded items need per-run seeding |
| 9 | Credential isolation | 1 high + 2 medium — dry-run write denial needs read-only PAT isolation |
| 10 | Platform constraint | 3 high — MCP org binding cannot be verified (external constraint, not plan flaw) |

**Exit:** Round 10 identified a platform constraint (ADO MCP cannot expose org binding) that no plan revision could resolve. Accepted as documented risk. 10 rounds is atypically long; signal remained high through round 8 because the plan had an internal contradiction (env vs hardcoded sandbox) that kept re-surfacing in different sections.

**Key insight from this session:** When a finding recurs across 3+ rounds despite fixes, check for an internal plan contradiction in a different section — not just the section cited in the finding. A single-section fix is often incomplete when the same concept appears in architecture docs, phase checklists, file-tree comments, and env tables simultaneously.

## Observed Progression (jx-skill:create scaffolder — 7 rounds)

| Round | Focus | Findings |
|-------|-------|----------|
| 1 | Idea review | 2 high (path confinement, trigger parsing), 2 medium (no unimplemented commands, wiki provenance) |
| 2 | Idea update review | 2 findings (filename/link mismatch, broken wikilinks) — wiki filing issues |
| 3 | Plan review | 2 high (Write bypass, multiline trigger parsing), 1 medium (rollback dirs) |
| 4 | Plan re-review | 2 high (already addressed in plan), filed as diminishing returns |
| 5 | Implementation review | 1 P1 (name regex in scaffold), 2 P2 (YAML escaping, json.tool permission), 2 P3 (stray artifact, wiki inventory) |
| 6 | Post-fix review | 1 P1 (cwd confinement), 2 P2 (YAML escaping repeat, core/self target), 2 P3 (stray artifact, wiki inventory repeat) |
| 7 | Final review | 1 P1 (plugin root confinement), 2 P2 (YAML escaping repeat, core/self repeat), 0 new |

## Observed Progression (jx-plugin scaffold plan — 4 rounds)

| Round | Focus | Findings |
|-------|-------|----------|
| 1 | Structure + README spec | 14 findings — confirmation gate, README gaps (count, sections, install/uninstall), error paths, AC weaknesses |
| 2 | Fix-induced issues | 6 findings — path format mismatch, verify output strictness, grep limitations, collision flow conflict, rollback overstatement |
| 3 | Remaining gaps | 3 findings — same-source collision case, README rollback missing, manifest description check |
| 4 | Final confirmation | 0 findings — explicit "IMPLEMENTATION-READY / diminishing returns" verdict |

**Exit:** Round 4 returned zero new blocking findings and the reviewer explicitly declared "IMPLEMENTATION-READY. Diminishing returns has been reached." This is the cleanest convergence signal observed — an explicit reviewer declaration rather than inference from finding count.

**Key insight:** Simple scaffold/mechanical plans (fixed helper, predictable artifact list) converge in 4 rounds vs 6-10 for complex skill plans with external system interactions.

## Observed Progression (FEAT-006 meet-email skill plan — 6 rounds)

| Round | Focus | Findings |
|-------|-------|----------|
| 1 | File selection, mail transport, tool surface | 2 high (stale file selection via lex sort, unverified mail tool path), 1 medium (unrestricted Bash in email skill) |
| 2 | Safety gates, sender binding, freshness | 2 high (headless gate not executable without Bash, no sender account binding), 1 medium (stale file freshness) |
| 3 | Tool verification, dry-run gap | 1 high (mail tool names ungrounded in repo), 1 medium (verification requires dry-run but none defined) |
| 4 | Test safety ordering | 1 high (live send not isolated behind dry-run in verification plan) |
| 5 | Attachment integrity, HTML escaping, dry-run enforcement | 2 high (attachment path diverges from selected file, no HTML escaping for ADO content), 1 medium (dry-run lacks hard boundary) |
| 6 | Dry-run enforcement (repeated) | 1 high (same dry-run tool-level gate — structural SKILL.md limitation) |

**Exit:** Round 6 repeated the dry-run enforcement finding from Round 5. The underlying constraint is structural: SKILL.md skills are LLM instruction files with no mechanism for conditional tool access per argument. Accepted as documented risk with double-gate mitigation (instruction + confirmation).

**Key insight:** When Codex escalates a finding's severity across rounds but the recommendation is unchanged, the issue is likely a platform constraint rather than a design flaw. The correct exit is accepted risk, not another plan revision.

**New pattern discovered:** [[Email-Safe HTML Rendering Pattern]] — reusable rules for converting Markdown to email-compatible inline-styled HTML.

## Resolution-Induced Regression

Key anti-pattern: fixing a round-1 finding creates a new bug visible only in round 2.

Examples:
- Deferring pipeline created a blocker: pipeline's task.json producer moved away
- Extracting shared files to jx-core introduced undefined path resolution
- Making tracks parallel created a race condition (B copies files C deletes)

This is why multi-round review matters — single-pass misses cascading effects of its own fixes.

## Urgency-Based Triage (2026-05-20)

When a round returns multiple findings, rate each 1-10 for urgency and triage individually:

| Urgency | Action | Example |
|---------|--------|---------|
| 7-10 | Fix before shipping | Path traversal bug, safety gate bypass |
| 4-6 | Fix if quick, otherwise file as idea | Missing permission in allowed-tools |
| 1-3 | File to idea inbox | Theoretical edge case, stale wiki text |

This is more effective than binary fix/defer — it lets low-urgency items flow to the backlog without blocking the commit, while safety bugs get immediate attention. The urgency rating also creates a paper trail for *why* a finding was deferred.

## Diminishing Returns Curve — Quantified (2026-05-20)

7-round review of `/jx-skill:create` (skill scaffolder). Largest adversarial progression recorded.

| Round | Finding quality | Real bugs | Repeats/theoretical |
|-------|----------------|-----------|---------------------|
| 1-2 | Safety bugs | 4 (path traversal, trigger parsing, overwrite, unimplemented stubs) | 0 |
| 3 | Design constraints | 3 (no Write bypass, multiline parsing, atomic rollback) | 0 |
| 4 | Misread scope | 0 | 2 (read idea page instead of plan) |
| 5 | Mixed | 2 (name regex in scaffold, json.tool permission) | 1 |
| 6 | Mixed | 2 (cwd confinement, stray artifact) | 1 |
| 7 | Mostly repeats | 1 (plugin root confinement) | 2 |

Signal-to-noise dropped sharply after round 3. Rounds 4-7 found 5 real bugs but also produced ~6 repeat/theoretical findings. The optimal stopping point was round 5 — after that, implementation would surface remaining issues faster than review.

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

### Severity Escalation Sub-Signal

A specific indicator within external constraints: when severity *increases* across rounds but the recommendation text is *identical*, it's a platform constraint. See [[Severity Escalation Convergence Signal]] for the full pattern and FEAT-006 example.

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
- [[Spec-First Skill Execution]] — lesson generalized from FEAT-006 review: read the spec before executing
- [[Naming Ripple Effect]] — stale paths in plans are a rename cascade the code-level grep misses
- [[AC Verifiability Gap]] — sub-pattern: ACs that reference unrealizable verification mechanisms, surfaced during review
- [[Severity Escalation Convergence Signal]] — exit criterion: severity up, recommendation unchanged = platform constraint

## Sources
- [[Source - Plugin Split Implementation Plan]]
- [[Source - FEAT-006 Meeting Prep Email Plan]]
- [[Source - FEAT-006 Session Insights]]
- Session: jx-plugin scaffolding (2026-05-26)
