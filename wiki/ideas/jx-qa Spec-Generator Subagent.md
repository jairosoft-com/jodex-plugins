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

## Verified constraints (Claude Code docs)

- **Agent `tools:` takes only bare tool names** (`Bash`, `Read`, `Write`…), not the
  scoped `Bash(playwright-cli:*)` syntax used in command/skill `allowed-tools`.
- **A subagent inherits the parent session's `permissions` (allow/deny)** and cannot
  re-scope Bash itself — fine-grained Bash scoping lives at the **session permissions**
  layer, not in the agent file.
- **A skill's `allowed-tools` does NOT clamp a subagent** — it is additive pre-approval
  only. Running the pinned `generate` skill from inside the agent does *not* narrow the
  agent's Bash reach. (A skill's `disallowed-tools` can remove tools while it is active.)
- **Consequence:** the agent needs a bare `Bash` grant to drive playwright-cli / npx /
  the python helper, and that grant is governed by session permissions — it cannot
  reproduce `commands/generate.md`'s pin. Treat the broadened Bash surface as a decision,
  not a footnote.
- **`skills:` frontmatter binding is real** (e.g. `codex-rescue` binds + references skills).

## Caveat

A full BRD→specs orchestrator can't be fully autonomous: `extract` has a mandatory
human classification gate. Start the agent from the approved xlsx instead.

## Open questions

- Fan out by default, or sequential unless asked?
- Failure policy when a spec won't go green: leave a `test.fixme` stub vs. omit + report the gap?

## Sources
- Session — jx-qa architecture review + agent design (2026-05-28)
