---
title: Skill Integration Testing via Agent SDK
type: idea
tags: [jx-qa, testing, agent-sdk, playwright, integration-test, skills]
created: 2026-05-22
updated: 2026-05-22 (session 2)
source_count: 0
aliases: [skill e2e testing, agent sdk test pattern]
provenance: synthesis
status: backlogged
---

# Skill Integration Testing via Agent SDK

Pattern for testing Claude Code skills programmatically using `@anthropic-ai/claude-agent-sdk`.

## Core Pattern

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const msg of query({
  prompt: "/plugin-name:skill-name --args",
  options: {
    plugins: [`${REPO_ROOT}/plugins/plugin-name`],  // pin to checkout
    cwd: REPO_ROOT,
  },
})) { ... }
```

## Key Constraints

- **Pin plugins to `REPO_ROOT`** — prevents the suite from running against the installed version while the branch under test is broken
- **Use `@playwright/test` as runner** + `APIRequestContext` for REST state assertions — no browser needed for API-backed skills
- **Read-only credential for dry-run tests** — a write-scope token passed to a dry-run invocation cannot prove no writes occurred; a read-only PAT causes any write tool call to return 401, which surfaces as a test failure
- **Temp fixture copies** — never mutate committed fixture files; copy to `$TMPDIR/{runId}/` before each test and delete after
- **Pre/post frontmatter diff** for change detection — read `ado_sync` before SDK call, diff after, clean only newly added IDs
- **Per-run seed creation** — for tests that start from partial state, create seed items via REST in `before-each` and clean them in `after-each`; no shared committed work item IDs

## Confirmation Gate Handling

- Pass `--tenant org/project` to bypass interactive tenant binding prompt
- Use fixtures with explicit sub-headers (e.g., `**Scenarios:**`) to avoid `scenarios_inferred` confirmation gate
- Design fixtures to avoid all interactive gates

## Three-PAT Credential Model

For skills that write to external state (ADO, GitHub, etc.), provision three separate PATs scoped to the sandbox only:

| Token | Scope | Used for |
|-------|-------|----------|
| `TOKEN_RW` | Read + Write | E2E tests — real mutations |
| `TOKEN_RO` | Read only | Dry-run tests — write attempts fail with 401 |
| `TOKEN_CLEANUP` | Read + Write + Delete | Pre-run sweep to hard-delete stale Removed items |

Keeping Delete scope separate from the E2E token prevents accidental hard-deletes during normal test runs. Fail closed if `TOKEN_CLEANUP` is absent when the sweep runs.

## Plugin-Local Tests

When the test suite lives under the plugin (`plugins/jx-pm/tests/`), exclude it from marketplace packaging:

```json
// plugins/jx-pm/.claude-plugin/plugin.json
{ "exclude": ["tests/"] }
```

Without this, test deps and fixtures are bundled when users install the plugin.

## Layered Coverage Model

| Layer | Invocation | Cost | Value |
|-------|-----------|------|-------|
| Unit | Direct helper script calls | <$0.01 | Deterministic; no LLM |
| Dry-run | Agent SDK + read-only PAT | ~$0.10/run | PRD parsing, field routing |
| E2E | Agent SDK + write PAT + REST assertions | ~$0.50-1.00/run | Full sync contract |
| UI smoke | Browser automation | Slowest | Visual/portal spot check |

## Related

- [[jx-pm]] — first skill targeted by this pattern
- [[QA Testing Plugin|jx-qa]] — likely home for this as a reusable capability
- [[Playwright Tests for jx-pm ADO Skills]] — implementation plan using this pattern
- [[Read-Only Credential as Dry-Run Guard]] — companion safety pattern

## Sources
