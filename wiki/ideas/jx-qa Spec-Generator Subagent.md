---
title: jx-qa Spec-Generator Subagent
type: idea
tags: [jx-qa, agent, playwright, test-automation, plugin-architecture]
created: 2026-05-28
updated: 2026-05-28
source_count: 0
provenance: session-observation
status: raw
---

# jx-qa Spec-Generator Subagent

Add the first real agent to jx-qa: a `spec-generator` subagent that turns an
**already-approved xlsx test plan** into verified Playwright `.spec.ts` files. It
is the agent form of the [[QA Testing Plugin]] `generate` skill — drive a live
browser, capture semantic locators, write the spec, run it to confirm it passes.

## Why

- `generate` is the pipeline bottleneck (minutes per test case, real browser).
- Parallelizable: specs are independent and the run is idempotent (skip-if-exists),
  so it partitions cleanly — one isolated `playwright-cli -s=<tc>` session per test case.
- Context isolation: snapshot-heavy exploration stays out of the main thread.
- Enables background / batch runs.

## Shape

- `skills: [generate, playwright-cli, test]`; system prompt defers to the `generate`
  skill as the single source of truth (no duplicated workflow).
- Starts from an approved xlsx, so no interactive gate inside its scope.

```yaml
---
name: spec-generator
model: sonnet
tools: Bash, Read, Write          # bare names — NOT scoped Bash(...)
skills: [generate, playwright-cli, test]
---
```

## Verified constraints

- **Agent `tools:` takes bare tool names**, not the scoped `Bash(playwright-cli:*)`
  permission syntax used in command/skill `allowed-tools`. Confirmed across all
  official agents + the `plugin-dev/agent-creator` schema. Fine-grained Bash scoping
  stays at the command/skill layer, so a bare `Bash` grant is coarser than
  `commands/generate.md` — flag this in any security review.
- **`skills:` frontmatter binding is real** (e.g. `codex-rescue` binds and then
  references its skills the same way).

## Caveat

A full BRD→specs orchestrator can't be fully autonomous: `extract` has a mandatory
human classification gate. Start the agent from the approved xlsx instead.

## Open questions

- Fan out by default, or sequential unless asked?
- Failure policy when a spec won't go green: leave a `test.fixme` stub vs. omit + report the gap?

## Sources
- Session — jx-qa architecture review + agent design (2026-05-28)
