---
title: Add Requirement-ID Traceability Column to Extract
type: idea
tags: [jx-qa, extract, traceability, coverage, test-plan]
created: 2026-05-30
updated: 2026-05-30
source_count: 0
provenance: session-observation
status: raw
---

# Add Requirement-ID Traceability Column to Extract

jx-qa's xlsx test plan (default 9-column ADO format —
`ID | Work Item Type | Title | Test Step | Step Action | Step Expected | Area Path | Assigned To | State`)
stores **no requirement ID per test case**. The `AC-…/FR-…/NFR-… → test case` link
exists only **transiently** during `extract`'s Phase-2 classification; the final
workbook keeps a human-readable Title, not the requirement it came from.

**Consequence:** every downstream traceability check must match **semantically
(fuzzy)** — both `review-plan`'s AC/FR side-check and the planned
`/jx-qa:coverage` analyzer (`.agent/plans/jx-qa-coverage-analyzer.md`). A
differently-worded test case can be mis-mapped, producing false "uncovered" gaps.

**Fix:** have `/jx-qa:extract` **persist the requirement ID** — either a 10th
`Requirement ID` column or an `AC-…: ` prefix on the test case Title — so
requirement→test-case mapping becomes **deterministic**.

**Payoff:** upgrades **both** `coverage` and `review-plan` traceability from fuzzy
to exact, with no change to either consumer's logic.

Relates to [[QA Testing Plugin]], [[jx-qa Test-Plan Reviewer Subagent]].

## Sources
- Session — coverage-gap analyzer planning; xlsx schema review (2026-05-30)
