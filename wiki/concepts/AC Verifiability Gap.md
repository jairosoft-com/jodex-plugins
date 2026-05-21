---
title: AC Verifiability Gap
type: concept
tags: [prd, acceptance-criteria, verification, jx-pm, design-pattern]
created: 2026-05-21
updated: 2026-05-21
source_count: 0
aliases: [AC verification mismatch, unverifiable acceptance criteria, AC reality check]
provenance: synthesis
---

# AC Verifiability Gap

A failure mode where acceptance criteria in a PRD reference verification mechanisms that don't match reality — either the check doesn't exist, the tool can't detect what the AC claims, or the AC contradicts another constraint that wins in practice.

Surfaces during implementation, not authoring. The author writes plausible-sounding ACs (e.g., "lint reports X", "tests fail Y") without confirming the tool actually has that capability.

## How It Manifests

Three observed shapes:

1. **Wrong literal value** — AC names a path, count, or field that doesn't match the live system.
2. **Tool can't detect the condition** — AC says "lint flags Z" but the lint script has no rule for Z.
3. **Contradicts a stronger constraint** — AC's literal text fights with a schema or convention that the implementer must follow.

## Resolution Patterns

| Shape | Resolution | Why |
|-------|-----------|-----|
| Wrong literal value | Update the AC to match the live system | Source code is authoritative; the AC was authored from stale memory |
| Tool can't detect | Rewrite AC against an actual check (e.g., `grep -c` instead of `lint`) | The AC's *intent* is real; only the chosen mechanism is wrong |
| Contradicts stronger constraint | Decision-log note reconciling the literal vs. intent reading | Both constraints have legitimate authority; the note documents which wins |

## Why This Pattern Matters

The implementer is the last line of defense before broken ACs ship as binding requirements. Catching this gap during implementation prevents:
- ACs that can never pass verification (locking the feature in perpetual "draft" status)
- Implementers silently deviating from the AC without paper trail
- Future ADO sync producing work items whose acceptance criteria reference nonexistent checks

## Implementation Workflow

Before executing a PRD:

1. Read every AC alongside the actual tool/file/mechanism it references
2. For each AC that mentions a verification check, confirm the check exists *and* detects what the AC claims
3. For each gap found, apply one of the three resolution patterns above
4. Update both the AC text and a decision-log row capturing why

This is a sub-step of [[Iterative Adversarial Review]] — Codex flagged all three resolutions independently during the JX QA Workflow review, but the pattern is general.

## Observed Examples (JX QA Workflow, 2026-05-21)

| AC | Gap | Resolution |
|----|-----|-----------|
| AC-001-09 | Specified `tests/specs/` but generate SKILL writes to `tests/` | Updated AC to match code |
| AC-001-24, AC-001-30 | "wiki lint reports missing cross-reference" — but `wiki-tools.py` only detects orphans, not missing required links | Rewrote against `grep -c` |
| AC-001-29 | "end of onboarding page" — but wiki schema requires `## Derived From` as last section | Decision-log note: "end" means "after main content, before Sources" |

## Related

- [[Iterative Adversarial Review]] — upstream review process that surfaces these gaps
- [[Measurability Mandate]] — sibling principle (ACs must be testable; this concept addresses *whether the test exists*)
- [[Conditional AC Format Selection]] — choosing the right format reduces but doesn't eliminate verifiability gaps
- [[Golden Thread Traceability]] — verifiability gaps break the trace from objective to acceptance check
- [[Conflict Callout]] — used to record the decision-log reconciliation when AC literal vs intent diverges
