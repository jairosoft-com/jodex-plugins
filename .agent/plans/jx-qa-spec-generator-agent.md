# Plan: Add jx-qa `spec-generator` Subagent

## Summary

Add the first agent to the jx-qa plugin — `plugins/jx-qa/agents/spec-generator.md` —
an autonomous subagent that turns an **already-approved xlsx test plan** into verified
Playwright `.spec.ts` files by deferring to the existing `generate` skill. It is the
agent form of the `generate` skill: parse the plan, skip existing specs, live-explore
the site for semantic locators, write the spec, and run it to confirm it passes.

Source idea: `wiki/ideas/jx-qa Spec-Generator Subagent.md` (status: raw).

**This is a plan only. Do not implement until approved** (repo rule: plan approval ≠
implementation approval).

## Decision required before building — security sign-off

Per AGENTS.md ("Keep tool permissions narrow… Do not broaden command allowlists, MCP
surfaces, or filesystem write scope casually"). Claude Code docs (sub-agents, skills,
permissions) establish:

- A subagent's `tools:` field accepts **only bare tool names** — no `Bash(playwright-cli:*)`
  scoping.
- A subagent **inherits the parent session's `permissions` (allow/deny)** and cannot
  re-scope Bash from inside the agent file.
- A skill's `allowed-tools` is **additive pre-approval — it does NOT clamp** a subagent.
  Running the pinned `generate` skill from inside this agent does *not* narrow its Bash reach.

**Consequence:** the agent must carry a bare `Bash` grant to drive `playwright-cli`,
`npx playwright test`, and the pinned `xlsx-writer.py`. That grant is governed by the
**consuming session's permissions**, not by the agent file or the `generate` skill. It
**cannot reproduce** `commands/generate.md`'s pinned `Bash(playwright-cli:*)` posture.
This is a genuine surface broadening relative to the command path — the plugin README
explicitly advertises *not* having broad `python3:*`/`npx:*`/`node:*` grants.

Options (choose one — **this is the gating decision**):

- **A (recommended).** Ship the agent with `tools: Bash, Read, Write` and make its safety
  an explicit session-permissions responsibility: document that the agent's Bash reach ==
  the project's `permissions.allow`/`deny`, recommend the consuming project pin Bash
  (allow `playwright-cli`, `npx playwright test`, the pinned helper; deny broad shells),
  and call out the broadened surface in the plugin README + security section. Requires
  explicit user sign-off on the broadened Bash grant.
- **B.** Don't ship a standalone agent. Keep generation in the pinned `generate` command
  and obtain parallelism by having the main thread spawn Task subagents that run it.
  (Caveat: those subagents *also* inherit session permissions — same exposure; this mainly
  preserves the per-command pin for interactive use.)
- **C.** Defer the agent until session-level permission fencing for QA runs is defined.

Recommendation: **A**, contingent on explicit sign-off.

Drop from any "mitigations" list: "limit the agent's Bash via prompt instruction" — a
prompt is not an enforcement boundary and must not be presented as a security control.

## Files

- **NEW** `plugins/jx-qa/agents/spec-generator.md` — agent definition (frontmatter + system prompt).
- **EDIT** `plugins/jx-qa/README.md` — add an "Agents" section documenting `spec-generator`
  and the session-permissions security note.
- **No** `plugin.json` / `marketplace.json` change — agents are auto-discovered from `agents/`.
- Wiki follow-up (separate, not part of the code change): once implemented, triage the
  idea (`/jx-kb:triage`) → promoted / implemented.

## Agent definition spec

Frontmatter:
- `name: spec-generator`
- `description:` when-to-use (after extract approval; "generate/write specs from the
  approved plan"; batch/background runs) **and** when-NOT (extract from a BRD → `extract`;
  run an existing suite → `test`) — must disambiguate from the `generate` skill's triggers.
- `model: sonnet`
- `tools: Bash, Read, Write`  (bare names — see security decision)
- `skills: [generate, playwright-cli, test]`

System prompt:
- Role: autonomous Playwright spec author. Input = an **approved** xlsx (post-extract gate).
- **Defer to the `generate` skill as the single source of truth** — do not duplicate its workflow.
- Operating rules (non-negotiable):
  - Idempotent slug-skip (`tests/<slug>.spec.ts`; skip if exists; never overwrite).
  - Line-3 contract: exactly `// Test Case TBD - <Title>` (ADO linking depends on `TBD`).
  - Semantic locators via `playwright-cli generate-locator` (no raw CSS/XPath/positional refs).
  - Self-verify: run `npx playwright test <spec>` and repair until green before reporting.
  - Stay in scope: no BRD reading, no plan generation, no classification gate, no xlsx mutation.
- Resolved defaults (open questions from the idea):
  - **Concurrency:** sequential by default; opt-in fan-out with isolated `playwright-cli -s=<tc>`
    sessions, capped ~3–4.
  - **Failure policy:** after 2 repair attempts, **omit** the spec and report the gap — do not
    write a broken or `test.fixme` spec that pollutes the suite.
  - **xlsx discovery:** inherit `generate`'s two-stage discovery (`ls test-plans/*.xlsx` → parse
    user message); accept an explicit path when delegated.
- Output: single report — generated / skipped / failures-with-reason.

## Validation (manual — no agent eval harness exists in this repo)

- **Load:** agent appears in the subagent registry; frontmatter parses.
- **Routing (positive):** "generate specs from the approved plan" → activates `spec-generator`.
- **Routing (negative):** "extract test cases from the BRD" → `extract`, not this; "run the
  e2e tests" → `test`, not this.
- **End-to-end (manual; needs a sample approved xlsx + a live site):** produces `tests/*.spec.ts`
  that pass; re-run is idempotent (skips existing).
- **Security:** confirm the agent's actual Bash reach under the project's `permissions` matches
  what was agreed; verify it cannot run out-of-scope shell commands.

## Risks

- **Broadened Bash surface** (the gating decision) — mitigated only by session `permissions`,
  not by the agent or skill files.
- **Trigger overlap** with the `generate` skill — disambiguate via the `description`.
- **Concurrent-browser resource use** if fanning out — mitigated by sequential default + cap.

## Out of scope

- Implementing the agent (plan-only; stop after approval).
- Full BRD→specs orchestrator (blocked by `extract`'s human gate).
- An agent eval harness (none exists; optional follow-up).
- Changing the project's session `permissions` (separate task if Option A is chosen).

## Steps (once approved)

1. Write `plugins/jx-qa/agents/spec-generator.md`.
2. Update `plugins/jx-qa/README.md` (Agents section + security note).
3. Validate load + positive/negative routing.
4. Manual end-to-end on a sample approved xlsx.
5. Wiki follow-up: triage the idea → promoted / implemented.
