# Plan (CLOSED): jx-qa `spec-generator` Subagent — superseded by Option C (keep generation interactive)

## Status — CLOSED: Option C adopted 2026-05-29

**Decision (2026-05-29): do NOT build the autonomous background `spec-generator` agent.** Generation
stays **interactive**, via the existing scoped `/jx-qa:generate` command + `generate` skill with a
human in the loop. No new agent, no new Bash/Write tool surface. This plan is retained below as the
**evaluation record**.

**Why.** Two rounds of adversarial Codex review (via the `review-and-fix-plan` workflow) showed the
autonomous/background design has an **uncloseable command-injection + provenance surface** at the
plan/permission level:
- Under the repo's prefix-only permission grammar, an allowed prefix (e.g. `Bash(npx playwright test:*)`)
  matches the raw command string *before* the shell — so attacker-influenceable xlsx/browser-derived
  text can be command-chained. No prefix allowlist contains this; closing it needs **runtime
  argv-scoped (no-shell) enforcement that does not exist today** (`wiki/concepts/Prefix-Only Permission Grammar.md`).
- A bare `Write` grant bypasses any pinned file-lifecycle helper; rollback-safe staging needs fs ops
  the allowlist forbids; and an `extract` approval sidecar would be **self-asserted / forgeable**
  without an authenticated issuer — `extract` emits no such stamp today.
- The *unattended/autonomous* amplifier comes from **"background + ingests untrusted input + no human
  in the loop."** Interactive, human-driven generation **removes that amplifier** (a person vets the
  workbook and watches each run) but does **NOT** eliminate the underlying surface — see the
  residual-risk note below.

**What Option C means.** The autonomous background agent is **DEFERRED — not that the risk is
collapsed.** The existing interactive `generate` path (human-driven) remains the supported way to
produce specs; the agent's hoped-for benefits (context isolation, background/batch, parallel fan-out)
are deferred, not delivered.

**Residual risk (accepted for interactive use).** The inline `/jx-qa:generate` path still grants
`Bash(playwright-cli:*)`, `Bash(npx playwright test:*)`, `Read`, and **bare `Write`**, and the
`generate` skill auto-selects a sole xlsx without provenance, feeds xlsx-derived step actions into
`playwright-cli goto`, writes specs, and runs `npx playwright test`. Under the repo's raw prefix
matching, human-driven mode **reduces unattended execution** but does **not** eliminate
stale/wrong-tenant workbook risk, bare-`Write` lifecycle risk, or command-chaining via the allowed
prefixes. These are **accepted for interactive, human-supervised use**; optional hardening is tracked
as [[Harden Interactive jx-qa Generate Path]].

**Revisit only if BOTH prerequisites land:** (1) the runtime provides argv-scoped / no-shell command
enforcement, and (2) `extract` emits an authenticated provenance record (checksums + approver identity +
timestamp + tenant/baseURL). At that point, reopen as the Option-B no-shell, path-confined redesign.

**Implementation: none.** Closed decision record (plan-only; nothing to build).

---

> The sections below are retained as the **evaluation record** — the design we considered and the
> adversarial findings that led to Option C. They are **superseded by the decision above** and are
> **NOT to be implemented as written.**

## Summary

Add the first agent to the jx-qa plugin — `plugins/jx-qa/agents/spec-generator.md` —
an autonomous subagent that turns an **already-approved xlsx test plan** into verified
Playwright `.spec.ts` files by deferring to the existing `generate` skill: parse the plan,
skip existing specs, live-explore the site for semantic locators, write the spec, and run
it to confirm it passes.

Source idea: `wiki/ideas/jx-qa Spec-Generator Subagent.md`.

## Decisions (drafted 2026-05-28; Decisions 1, 3, 4, 9 re-opened 2026-05-29 — see Status)

1. **Security (gating) — Option A, NOT yet sound; background automation BLOCKED pending
   argv-scoped enforcement.** Ship the agent with bare `tools: Bash, Read, Write`. A subagent's
   `tools:` accepts only bare names (no `Bash(playwright-cli:*)` scoping), a skill's `allowed-tools`
   does **not** clamp a subagent, and a subagent inherits the session's `permissions`. So the
   broadened Bash surface is **governed by the consuming session's `permissions`**, not the
   agent/skill files, and must be **documented** (README + security note). Consuming projects **MUST**
   deny bare Bash and allow only `playwright-cli` / `npx playwright test` / the pinned `xlsx-writer.py`
   reader / the pinned `spec-fs.py` lifecycle helper (Decision 3) / `ls`.
   **Why this is not yet a sound control (the reopened finding):** under the repo's prefix-only
   permission grammar the allowlist matches the **raw command string before shell interpretation**,
   so a command beginning with an allowed prefix can append shell syntax and chain an arbitrary
   command (e.g. `npx playwright test tests/a.spec.ts; <injected>`, or `python3 .../spec-fs.py …;
   <injected>`). For a background agent ingesting attacker-influenceable xlsx/browser-derived text,
   prefix-allow is therefore **not** a containment proof. **Consequence: background (non-interactive)
   automation is BLOCKED** until the consuming runtime enforces **argv-scoped** command permission
   (each compound segment checked, not a raw-string prefix) OR shell is replaced by a hard execution
   boundary (a path-confined runner receiving structured argv/data, no shell metacharacters). Reducing
   to the two pinned helpers (`xlsx-writer.py`, `spec-fs.py`) shrinks the surface but does **not** make
   prefix-allow sound — see Decision 9's chaining probe and the Risks/Residual notes. **No
   auto-install** anywhere (see Decision 9).
2. **Concurrency — sequential v1.** One test case at a time within a single agent
   invocation. Parent-orchestrated fan-out (one agent per case) is **deferred to v2**.
3. **Failure policy — omit + report, bound = 2 repair attempts.** On a failing spec, repair
   locators/assertions and re-run up to 2 attempts. If still failing, **omit the spec and
   report it as a gap** — never write a non-passing `// Test Case TBD` spec (protects the
   ADO-linking contract). An idempotent re-run retries omitted cases (may self-heal).
   **Rollback-safe write via a pinned, path-confined lifecycle helper (overrides the `generate`
   skill's in-place Write).** The bare `Write` tool cannot rename, delete, or `mkdir`, and the
   Decision 1 allowlist forbids raw `mv`/`rm`/`mkdir` — so the temp→rename / sweep / delete-on-fail
   lifecycle is routed through **one new pinned helper `plugins/jx-qa/scripts/spec-fs.py`** that is
   the *only* component allowed to touch the `tests/` tree. It exposes exactly these path-confined
   subcommands, all of which validate that every path resolves under the project `tests/` dir and that
   the slug matches a safe `[a-z0-9-]+` regex before any filesystem op:
   - `ensure-dir` — create `tests/` if absent (Decision 9e);
   - `sweep` — delete orphaned `tests/.*.spec.ts.tmp` on startup;
   - `stage <slug> <content-file>` — write the candidate to `tests/.<slug>.spec.ts.tmp`;
   - `commit <slug>` — **atomically rename** `tests/.<slug>.spec.ts.tmp` → `tests/<slug>.spec.ts`
     (only called after `npx playwright test` passes);
   - `discard <slug>` — delete the temp candidate on exhausted repairs / timeout / crash.

   Flow per case: `stage` → `npx playwright test` the temp file → `commit` on pass, else `discard` +
   record the gap — never leave a partial/unverified file at the final path. This makes the slug-skip
   idempotency mean *skip only verified specs*, and `discard`-on-fail is what lets re-runs retry gaps.
   The helper is added to the Decision 1 allowlist as `Bash(python3 …/spec-fs.py:*)`; **crash/retry
   (orphan-sweep) and failure-cleanup behavior must be verified before rollback safety is declared
   locked.** (Caveat: per Decision 1 the prefix allow for this helper is still raw-string-matched and
   chainable; path-confinement lives inside the helper, not in the permission grammar.)
4. **xlsx provenance — explicit path REQUIRED *and* a verifiable provenance sidecar REQUIRED
   (fail-closed).** A human-named path is necessary but **NOT sufficient**: naming a file proves
   nothing about its approval state, freshness, or intended tenant/site, so a stale, wrong-tenant, or
   unapproved spreadsheet would otherwise satisfy the only gate. The agent therefore requires, in
   addition to the explicit path:
   - a **provenance sidecar/stamp** (e.g. `<plan>.xlsx.provenance.json` or an embedded sheet) emitted
     by `extract`, carrying at minimum: source-document checksum, workbook (xlsx) checksum, approval
     marker, generated-at timestamp, and target tenant + `baseURL`.
   The agent **verifies fail-closed**: it recomputes the workbook checksum and compares it to the
   stamp; it confirms the stamp's target tenant/`baseURL` matches the `playwright.config` `baseURL` it
   will navigate; and it **STOPS and reports** if the sidecar is **absent, malformed, checksum-mismatched
   (stale/edited workbook), or tenant/baseURL-mismatched**. Background/non-interactive mode also keeps
   **sole-match auto-discovery disabled**: with no explicit path, **stop and report** "specify the test
   plan path." (auto-driving live browser navigation + spec writes from an unproven xlsx is disallowed.)
   **Dependency:** `extract` does not yet emit this stamp (see Out of scope), so this gate is a hard
   prerequisite — the agent cannot run in background mode until `extract` stamps provenance. The
   `generate` skill keeps its explicit-preferred → single-match → fail-closed discovery for the
   **interactive inline path only**.
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
9. **Preconditions — report-and-stop pre-flight.**
   **(a) Permission preflight (best-effort tripwire, NOT a containment proof) — runs FIRST, before any
   plan parse or browser work.** Probe that broad shell is NOT granted with TWO sentinels, both of
   which must be *denied* in a correctly-scoped session:
   - a **bare-shell sentinel** — `bash -c 'echo unscoped-shell-reachable'` (catches a missing
     bare-Bash deny);
   - an **allowed-prefix chaining sentinel** — append shell syntax after an allowed prefix, e.g.
     `npx playwright test --version; echo chained-shell-reachable` (and similarly
     `python3 …/spec-fs.py --probe; echo chained`). This specifically probes the reopened finding:
     if the chained `echo` executes, the prefix allow is being raw-string-matched and command-chaining
     is reachable.
   If **either** sentinel succeeds, the shell boundary is unsound → **STOP** and report the required
   remediation (deny bare Bash; allow only `Bash(playwright-cli:*)`, `Bash(npx playwright test:*)`, the
   pinned `xlsx-writer.py` reader, the pinned `spec-fs.py` helper, `Bash(ls:*)`). Proceed only if
   **both** sentinels are blocked AND the required commands run. **Honest limitation (Decision 1):**
   passing this preflight is **not** proof of containment — a runtime that prefix-matches raw strings
   can block these specific sentinels yet still permit other allowed-prefix chains; sound containment
   requires argv-scoped enforcement, which is the blocking prerequisite for background mode.
   **(b)** Verify playwright-cli (`npx --no-install playwright-cli --version`) — doubles as the
   allowlisted-command confirmation for (a); if missing, **stop and report** the install command
   (`npm install -g @playwright/cli@latest`) — **do NOT auto-install**.
   **(c)** Plan-parse check falls out of the `xlsx-writer.py read` step. **Provenance gate (Decision 4)**
   runs here too: verify the sidecar checksum + tenant/baseURL match, else **stop and report**.
   **(d)** Site reachability — lazy: first `playwright-cli goto` failure = fail-fast "site unreachable" stop.
   **(e)** Ensure `tests/` exists — via `spec-fs.py ensure-dir` (Decision 3 helper), **not** raw
   `mkdir` (which the allowlist forbids). The same step runs `spec-fs.py sweep` to clear orphaned
   `*.tmp` candidates.

## Files

- **NEW** `plugins/jx-qa/agents/spec-generator.md` — agent definition (frontmatter + system prompt).
- **NEW** `plugins/jx-qa/scripts/spec-fs.py` — pinned, path-confined spec-file lifecycle helper
  (`ensure-dir` / `sweep` / `stage` / `commit` / `discard`) per Decision 3. The only component
  permitted to mutate the `tests/` tree; validates path-under-`tests/` and safe-slug regex on every op.
- **NEW** agent eval skeleton — location TBD pending Decision 5's runner confirmation.
- **EDIT** `plugins/jx-qa/commands/generate.md` — add the `--background` flag: update
  `argument-hint`, add conditional logic ("if `--background` → delegate to the
  `spec-generator` subagent via the Agent/Task tool; else run the `generate` skill inline"),
  and add the Agent/Task tool to `allowed-tools`.
- **EDIT** `plugins/jx-qa/README.md` — add an "Agents" section documenting `spec-generator`,
  the **session-permissions security note** (Decision 1, including the prefix-grammar chaining caveat
  and the argv-scoped-enforcement prerequisite for background mode), the `spec-fs.py` lifecycle helper,
  and the Decision 4 provenance-sidecar requirement.
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
- `tools: Bash, Read, Write`  (bare names — Decision 1; the consuming session's `permissions` must
  deny bare Bash and allow only `playwright-cli` / `npx playwright test` / `xlsx-writer.py` /
  `spec-fs.py` / `ls`, with the standing caveat that this is not sound against command-chaining —
  Decision 1 / Decision 9a)
- `skills: [generate, playwright-cli, test]`

System prompt:
- Role: autonomous Playwright spec author; input = an **explicitly-provided, approved** xlsx path (post-extract gate; no auto-discovery in agent mode — Decision 4).
- **Defer to the `generate` skill as the single source of truth** — do not duplicate it.
- Operating rules: idempotent slug-skip (**skip only verified specs** — Decision 3); line-3 `// Test Case TBD - <Title>` contract;
  semantic locators via `generate-locator`; self-verify each spec with `npx playwright test`;
  stay in scope (no BRD, no plan generation, no classification gate, no xlsx mutation).
- Bake in Decisions 2 (sequential), 3 (omit+report, 2 attempts, **+ rollback-safe temp→rename-on-pass /
  discard-on-fail via the pinned `spec-fs.py` helper — no raw `mv`/`rm`/`mkdir`**), 4 (**explicit path
  required AND fail-closed provenance-sidecar verification: checksum + tenant/baseURL match, else
  STOP**), 7 (URL resolution), 9 (**best-effort permission preflight with bare-shell AND
  allowed-prefix-chaining sentinels, first — explicitly not a containment proof**).
- Call out the rollback-safe write and the no-auto-discovery rule as **explicit overrides** of the
  `generate` skill — not silent deviations.
- Output: report per Decision 8.

## Validation (Decision 5)

- **Eval skeleton** mirroring the skills' format (activation ±, idempotency, TBD contract,
  omit-on-failure) — runnability pending the runner-support check.
- **Manual checklist** (the de facto validation until/unless the runner supports agents):
  load (agent appears + frontmatter parses); positive routing (`--background` → agent);
  negative routing ("extract from BRD" → `extract`; "run e2e" → `test`); end-to-end on a
  sample **provenance-stamped** xlsx (passing specs, idempotent re-run skips); **security reach** —
  run **both** preflight sentinels (bare-shell + allowed-prefix-chaining) and the injection eval, and
  treat the project `permissions` as a necessary-but-insufficient control (sound containment needs
  argv-scoped enforcement — Decision 1 / 9a), not a clean pass.

## Risks

- **Broadened Bash surface — UNSOUND under prefix-only grammar; central, BLOCKING for background mode.**
  The Decision-9 preflight is a best-effort tripwire (bare-shell + allowed-prefix-chaining sentinels);
  it can detect some misconfigurations but **cannot make prefix-allow sound** because the grammar
  raw-string-matches before shell interpretation, leaving command-chaining via an allowed prefix
  reachable. Correct session-`permissions` config is a required external control but is **insufficient
  on its own**. **Mitigation/exit:** block background automation until the runtime provides argv-scoped
  command enforcement (or a no-shell path-confined runner); reducing to the two pinned helpers shrinks
  but does not close the surface. State honestly in the README security note (not plugin-enforced).
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
- **Extract-side provenance stamp — now a PREREQUISITE, not an optional follow-up (Decision 4).**
  `extract` emits no approval/checksum/metadata today (only the xlsx). Decision 4 now **requires** a
  provenance sidecar (source + workbook checksums, approval marker, generated-at timestamp, target
  tenant/`baseURL`) and **fails closed without it**, so the agent **cannot run in background mode**
  until `extract` is extended to emit this stamp. Extending `extract` is out of scope for *this* plan
  (separate work item), but it is a hard dependency gating implementation here — tracked in the Status
  prerequisites and the residual list. (A human-named path alone is explicitly **not** accepted as
  provenance, the prior plan's weakness.)

## Steps (once approved)

0. **Prerequisites (BLOCKING — must clear before steps below):** (a) confirm the consuming runtime
   provides **argv-scoped** command enforcement (or a no-shell path-confined runner) so Decision 1 is
   sound — otherwise background mode stays blocked; (b) extend `extract` to emit the Decision 4
   provenance stamp (separate work item) — otherwise the Decision 4 gate fails closed and the agent
   cannot run in background mode.
1. **Confirm eval-runner support for agents** (Decision 5 dependency) → decide skeleton-runnable
   vs. manual-checklist + follow-up.
2. Write `plugins/jx-qa/scripts/spec-fs.py` (path-confined lifecycle helper — Decision 3) and verify
   path-confinement + crash/retry orphan-sweep + failure-cleanup before relying on rollback safety.
3. Write `plugins/jx-qa/agents/spec-generator.md` (frontmatter + system prompt with Decisions baked in).
4. Edit `plugins/jx-qa/commands/generate.md` — add `--background` flag + Agent/Task tool.
5. Edit `plugins/jx-qa/README.md` — Agents section + security note (prefix-grammar caveat + helper +
   provenance).
6. Add the eval skeleton, **including an injection eval** that specifically probes allowed-prefix
   command-chaining (e.g. an xlsx field / locator text carrying `; echo pwned`) and asserts no chained
   command executes — this is the empirical gate for Decision 1 / Decision 9a.
7. Validate: load + positive/negative routing + manual e2e on a sample *provenance-stamped* xlsx +
   security reach (both preflight sentinels + the injection eval).
8. Wiki follow-up: triage the idea → promoted / implemented.
