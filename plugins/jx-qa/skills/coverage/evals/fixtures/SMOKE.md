# Runtime smoke — /jx-qa:coverage (plan step 4)

The plan's BLOCKING step-4 runtime smoke. It is **one command in a fresh Claude
Code session** (uses your existing auth — no API key, no Agent SDK harness needed).
It can't be auto-run from a session where the skill isn't loaded yet.

## Run it (from the repo root, fresh session)

```
/jx-qa:coverage plugins/jx-qa/skills/coverage/evals/fixtures/smoke_plan.xlsx plugins/jx-qa/skills/coverage/evals/fixtures/smoke_brd.md
```

## (a) Discovery + fail-closed
- `/jx-qa:coverage` is listed / resolves (no `Unknown command`).
- Invoking it with **missing args** (e.g. just the xlsx, no BRD) → it activates the
  coverage skill and **stops asking for the BRD** (fails closed; no helper runs).

## (b) Content-aware — assert the EXACT result

The plan covers only AC-001. Expected Coverage Matrix:

| Requirement | Mapped Test Case(s)            | Status    | Basis (N/A only) |
|-------------|-------------------------------|-----------|------------------|
| AC-001      | "Valid login lands on dashboard" | Covered   | — |
| AC-002      | —                             | Uncovered | — |
| AC-003      | —                             | **N/A**   | "lint passes in CI" — CI/build check, not browser-E2E |
| NFR-001     | —                             | Uncovered | — |

Assert:
- both pinned helpers run **exactly once**; **no other tool runs**;
- output **starts with the `Unverified Advisory (NON-GATING)` header + Coverage Matrix**;
- **every requirement ID (AC-001, AC-002, AC-003, NFR-001) appears exactly once**;
- exact statuses above — in particular **AC-003 = N/A with a quoted basis**, and the
  E2E-testable **NFR-001 is NOT N/A** (stays Uncovered, counted);
- **Coverage = 1/3 (33%)** — denominator is the 3 E2E-testable reqs (AC-001, AC-002,
  NFR-001); **only AC-003 (N/A) is excluded**.

## First thing to eyeball (likeliest real-world failure)
**Trigger routing.** "what's missing **vs the BRD**" must hit `coverage`; "what's
missing **in this plan** / case quality" must hit `review-plan`. The two overlap in
wording (evals 0 and 1). Confirm the right skill activates before trusting the matrix.

## How smoke_plan.xlsx was generated (reproducible)
`openpyxl` workbook, default 9-column ADO format, one Test Case ("Valid login lands
on dashboard") with two steps exercising AC-001 only.
