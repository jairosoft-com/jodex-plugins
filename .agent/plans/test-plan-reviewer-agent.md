# Plan: Add jx-qa `test-plan-reviewer` Subagent

## Status

Drafted 2026-05-29. **Implementation not started** — plan-only until explicit go-ahead (repo rule:
plan approval ≠ implementation approval). Designed deliberately to avoid the security failure mode that
closed the `spec-generator` agent (see `.agent/plans/jx-qa-spec-generator-agent.md`).

## Summary

Add a **read-only** subagent — `plugins/jx-qa/agents/test-plan-reviewer.md` — that reviews an xlsx
test plan (after `/jx-qa:extract`, before `/jx-qa:generate`) for **quality / testability and AC
traceability**, and returns an **advisory report**. It never edits the plan, drives a browser, runs
tests, or writes specs. It fills the gap the `test` skill's negative evals point at (review / coverage
are routed away, but no skill performs them).

Source idea: `wiki/ideas/jx-qa Test-Plan Reviewer Subagent.md` (P1).

## Decisions

1. **Read-only, no-injection by construction (the gating security posture).** The agent's `tools:` are
   **`Read, Grep, Glob` only — NO `Bash`, NO `Write`, NO `playwright-cli`, NO `npx`.** This sidesteps
   the spec-generator failure mode entirely (which needed background + untrusted input + prefix-scoped
   Bash + Write → uncloseable command-injection). Lessons applied:
   - A subagent's `tools:` takes only bare names and a skill's `allowed-tools` does NOT clamp it — so we
     simply **do not grant the agent any executing tool.** With no `Bash`/`Write`, there is no
     command-injection or spec-corruption surface regardless of session permissions.
2. **xlsx parsing happens in the command, not the agent.** Parsing an xlsx requires the pinned
   `xlsx-writer.py read` helper (Bash). To keep the agent Bash-free, the **command** parses the xlsx via
   its existing pinned-helper allowlist and passes the **already-parsed plan content (JSON/text)** to the
   agent. The agent then does pure read-only analysis on text + (optionally) the BRD via `Read`.
3. **Advisory only — never edits the plan.** Output is a review report; the human (or a later step)
   decides what to change. No write path exists.
4. **Scope = plan QUALITY + testability + AC traceability.** Breadth ("did we cover the whole BRD?") is
   the separate future `coverage-analyst`; this agent judges the quality of what's in the plan, and
   checks traceability only when a BRD path is provided.
5. **Explicit invocation.** A thin command `/jx-qa:review-plan <xlsx> [brd]` (does not auto-compete with
   `extract`/`generate`/`test`). Description disambiguates: "review/critique a test plan's quality",
   NOT "extract", "generate", or "run".
6. **Model:** sonnet (analysis).
7. **Evals:** ship a skeleton mirroring `skills/*/evals/evals.json`. DEPENDENCY (carried from the
   spec-generator plan): confirm the eval runner executes *agent* evals; else ship as a manual checklist
   + runner-extension follow-up.

## Files

- **NEW** `plugins/jx-qa/agents/test-plan-reviewer.md` — agent (frontmatter `tools: Read, Grep, Glob`;
  system prompt = read-only plan critic).
- **NEW** `plugins/jx-qa/commands/review-plan.md` — thin command: parse the xlsx via the pinned
  `xlsx-writer.py read`, then delegate the parsed content (+ optional BRD path) to the
  `test-plan-reviewer` agent via the Agent/Task tool. `allowed-tools:` the pinned helper, `Read`, `ls`,
  Agent/Task — **no broad Bash/Write.**
- **NEW** agent eval skeleton — location TBD pending Decision 7's runner confirmation.
- **EDIT** `plugins/jx-qa/README.md` — add the reviewer to an "Agents" section + a one-line safety note
  (read-only, no injection surface — contrast with the deferred spec-generator).
- **No** `plugin.json` / `marketplace.json` change — agents/commands auto-discovered.
- Wiki follow-up: triage the idea after shipping.

## Agent definition spec

Frontmatter:
- `name: test-plan-reviewer`
- `description:` "Review/critique an xlsx test plan's quality, testability, and AC traceability and
  return an advisory report. Use after extract, before generate. Do NOT use to extract from a BRD
  (→ `extract`), generate specs (→ `generate`), or run tests (→ `test`)."
- `model: sonnet`
- `tools: Read, Grep, Glob`   (no Bash, no Write — Decision 1)

System prompt:
- Role: read-only test-plan critic. Input = parsed plan content (provided by the command) + optional BRD path.
- Review each test case for: vague/unverifiable assertions; bundled multi-assertion steps; missing
  negative/edge/error cases; non-E2E steps that slipped in; weak/ambiguous step-1 navigation & locators;
  AC/FR traceability (only if a BRD is provided).
- Output a report: per-case findings (severity · issue · concrete suggestion) + a plan-level summary
  (traceability gaps, systemic weaknesses). **Advisory only — do not propose file edits or call any
  writing/executing tool (you have none).**
- Stay in scope: do not extract, generate, run tests, or open a browser.

## Validation (manual; no agent eval harness confirmed)

- Load: agent appears + frontmatter parses; confirm `tools` has no Bash/Write.
- Routing (positive): "review the test plan / what's missing in this plan" → activates reviewer.
- Routing (negative): "generate specs" → `generate`; "run e2e" → `test`; "extract from BRD" → `extract`.
- Sample review: run on an existing `test-plans/*.xlsx`; confirm a useful, non-mutating report.
- Security check: confirm the agent has no Bash/Write and produced no file changes.

## Risks

- **Low.** Read-only design has no injection/Write surface (the whole point). Main residual: trigger
  overlap with `extract`/`test` — mitigated by the `description`.
- Eval-runner-for-agents dependency (Decision 7) — fallback is a manual checklist.

## Out of scope

- Implementing the agent (plan-only; stop until go-ahead).
- Coverage-vs-BRD breadth analysis (separate `coverage-analyst`).
- Any plan auto-editing, spec generation, browser driving, or test execution.
- The deferred `spec-generator` / `test-healer` agents (blocked on runtime argv-scoped enforcement).

## Steps (once approved)

1. Confirm eval-runner support for agents (Decision 7) → skeleton-runnable vs. manual checklist.
2. Write `plugins/jx-qa/agents/test-plan-reviewer.md` (`tools: Read, Grep, Glob`).
3. Write `plugins/jx-qa/commands/review-plan.md` (parse via pinned helper → delegate parsed content).
4. Edit `plugins/jx-qa/README.md` (Agents section + safety note).
5. Add the eval skeleton.
6. Validate: load + positive/negative routing + sample review + no-write/no-Bash security check.
7. Wiki follow-up: triage the idea → promoted / implemented.
