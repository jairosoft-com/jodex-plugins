# Plan: Add jx-qa `spec-generator` Subagent

## Status

Design decisions **locked 2026-05-28** (see Decisions). **Implementation not started** —
this remains plan-only until explicit go-ahead (repo rule: plan approval ≠ implementation
approval).

## Summary

Add the first agent to the jx-qa plugin — `plugins/jx-qa/agents/spec-generator.md` —
an autonomous subagent that turns an **already-approved xlsx test plan** into verified
Playwright `.spec.ts` files by deferring to the existing `generate` skill: parse the plan,
skip existing specs, live-explore the site for semantic locators, write the spec, and run
it to confirm it passes.

Source idea: `wiki/ideas/jx-qa Spec-Generator Subagent.md`.

## Decisions (locked 2026-05-28)

1. **Security (gating) — Option A, signed off.** Ship the agent with bare
   `tools: Bash, Read, Write`. A subagent's `tools:` accepts only bare names (no
   `Bash(playwright-cli:*)` scoping), a skill's `allowed-tools` does **not** clamp a
   subagent, and a subagent inherits the session's `permissions`. So the broadened Bash
   surface is **governed by the consuming session's `permissions`**, not the agent/skill
   files, and must be **documented** (README + security note). Recommend consuming projects
   allow only `playwright-cli` / `npx playwright test` / the pinned helper and deny broad
   shells. **No auto-install** anywhere (see Decision 9).
2. **Concurrency — sequential v1.** One test case at a time within a single agent
   invocation. Parent-orchestrated fan-out (one agent per case) is **deferred to v2**.
3. **Failure policy — omit + report, bound = 2 repair attempts.** On a failing spec, repair
   locators/assertions and re-run up to 2 attempts. If still failing, **omit the spec and
   report it as a gap** — never write a non-passing `// Test Case TBD` spec (protects the
   ADO-linking contract). An idempotent re-run retries omitted cases (may self-heal).
4. **xlsx discovery — explicit-preferred, fail-closed.** Use an explicit path if provided;
   else single-match auto-discovery (`ls test-plans/*.xlsx`, use only if exactly one); on
   0 or 2+ matches, **stop and report** "specify the test plan path" (no interactive ask).
5. **Evals — ship an eval skeleton.** Mirror `skills/*/evals/evals.json` (activation ±,
   idempotency, line-3 TBD contract, omit-on-failure). **DEPENDENCY:** confirm the repo's
   eval runner actually executes *agent* evals; if it is skill-only, the skeleton ships as a
   documented manual checklist plus a runner-extension follow-up. (Agent eval file location
   is TBD pending this — agents are single `.md` files, unlike skill directories.)
6. **Invocation — explicit-delegation via a `--background` flag on `/jx-qa:generate`.** The
   agent does NOT auto-compete with the `generate` skill's everyday triggers. Inline
   requests run the skill; `/jx-qa:generate --background` delegates to the agent. (Flag name
   `--background`; overridable.)
7. **URL resolution — step-1 → baseURL → skip+report.** Navigation target comes from the
   test case's step-1 action; if absent, fall back to `playwright.config` `baseURL`; if
   still none, skip the case and report (consistent with Decision 3).
8. **Return — plain human-readable report.** Generated / skipped / failures-with-reason. No
   machine-aggregation contract in v1 (follows from sequential v1).
9. **Preconditions — report-and-stop pre-flight.** Verify playwright-cli
   (`npx --no-install playwright-cli --version`); if missing, **stop and report** the install
   command (`npm install -g @playwright/cli@latest`) — **do NOT auto-install** (preserves the
   narrow-permissions posture). Plan-parse check falls out of the `xlsx-writer.py read` step.
   Site reachability handled lazily: treat the first `playwright-cli goto` failure as a
   fail-fast "site unreachable" stop. Ensure `tests/` exists (create if absent).

## Files

- **NEW** `plugins/jx-qa/agents/spec-generator.md` — agent definition (frontmatter + system prompt).
- **NEW** agent eval skeleton — location TBD pending Decision 5's runner confirmation.
- **EDIT** `plugins/jx-qa/commands/generate.md` — add the `--background` flag: update
  `argument-hint`, add conditional logic ("if `--background` → delegate to the
  `spec-generator` subagent via the Agent/Task tool; else run the `generate` skill inline"),
  and add the Agent/Task tool to `allowed-tools`.
- **EDIT** `plugins/jx-qa/README.md` — add an "Agents" section documenting `spec-generator`
  and the **session-permissions security note** (Decision 1).
- **No** `plugin.json` / `marketplace.json` change — agents are auto-discovered from `agents/`.
- Wiki follow-up (separate from the code change): triage the idea (`/jx-kb:triage`) →
  promoted / implemented after shipping.

## Agent definition spec

Frontmatter:
- `name: spec-generator`
- `description:` scoped to **explicit delegation / background / batch / isolated** runs
  (Decision 6); explicitly states "for normal inline generation use the `generate` skill,"
  and "Do not use to extract from a BRD (→ `extract`) or to run an existing suite (→ `test`)."
- `model: sonnet`
- `tools: Bash, Read, Write`  (bare names — Decision 1)
- `skills: [generate, playwright-cli, test]`

System prompt:
- Role: autonomous Playwright spec author; input = an **approved** xlsx (post-extract gate).
- **Defer to the `generate` skill as the single source of truth** — do not duplicate it.
- Operating rules: idempotent slug-skip; line-3 `// Test Case TBD - <Title>` contract;
  semantic locators via `generate-locator`; self-verify each spec with `npx playwright test`;
  stay in scope (no BRD, no plan generation, no classification gate, no xlsx mutation).
- Bake in Decisions 2 (sequential), 3 (omit+report, 2 attempts), 4 (xlsx discovery),
  7 (URL resolution), 9 (pre-flight).
- Output: report per Decision 8.

## Validation (Decision 5)

- **Eval skeleton** mirroring the skills' format (activation ±, idempotency, TBD contract,
  omit-on-failure) — runnability pending the runner-support check.
- **Manual checklist** (the de facto validation until/unless the runner supports agents):
  load (agent appears + frontmatter parses); positive routing (`--background` → agent);
  negative routing ("extract from BRD" → `extract`; "run e2e" → `test`); end-to-end on a
  sample approved xlsx (passing specs, idempotent re-run skips); **security reach** (agent's
  Bash is bounded by the project's `permissions` as agreed).

## Risks

- **Broadened Bash surface** — mitigated only by session `permissions`, not the agent/skill
  files (Decision 1). Central, accepted, must be documented.
- **Eval runner may not support agents** — Decision 5 dependency; fallback is manual checklist
  + runner-extension follow-up.
- **Flag routing** — verify `/jx-qa:generate --background` reliably delegates and the bare
  command still runs inline (Decision 6).
- Concurrent-browser cost — N/A in v1 (sequential).

## Out of scope

- Implementing the agent (plan-only; stop until go-ahead).
- Parent-orchestrated fan-out (v2 — Decision 2).
- Full BRD→specs orchestrator (blocked by `extract`'s human gate).
- A full agent eval *runner* (a skeleton is in scope; extending the runner may be a follow-up).
- Changing the project's session `permissions` (separate task under Option A if desired).

## Steps (once approved)

1. **Confirm eval-runner support for agents** (Decision 5 dependency) → decide skeleton-runnable
   vs. manual-checklist + follow-up.
2. Write `plugins/jx-qa/agents/spec-generator.md` (frontmatter + system prompt with Decisions baked in).
3. Edit `plugins/jx-qa/commands/generate.md` — add `--background` flag + Agent/Task tool.
4. Edit `plugins/jx-qa/README.md` — Agents section + security note.
5. Add the eval skeleton.
6. Validate: load + positive/negative routing + manual e2e on a sample xlsx + security reach.
7. Wiki follow-up: triage the idea → promoted / implemented.
