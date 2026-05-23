---
title: Eval Runner for Skill Assertions
type: code
status: backlog
tags: [testing, evals, skills, automation, dx]
created: 2026-05-23
---

# Eval Runner for Skill Assertions

Build an automated runner that reads `evals/evals.json` from any skill directory and executes each eval against the Claude Code runtime, reporting pass/fail per assertion.

## Context

Every skill scaffolded by `/jx-skill:create` gets an `evals/evals.json` file, but nothing in the project actually reads or executes them. Evals are passive documentation — contracts without enforcement.

### Current State

- **9 skills** across 4 plugins have `evals/evals.json` files
- **jx-dev** (spec, task) has zero eval coverage
- **jx-pm:meet-pre** has an empty `[]` eval file
- No runner, no CI integration, no hooks

### Two Eval Formats Exist

**Format A** (jx-qa: generate, extract, test):
- Wrapper object: `{ skill_name, evals: [...] }`
- Assertions are prose descriptions (e.g., "Generated file uses semantic locators")
- Not machine-checkable without LLM-as-judge

**Format B** (jx-kb, jx-skill):
- Plain array: `[ ...evals ]`
- Assertions have typed checks: `output_contains`, `file_exists`, `file_not_exists`, `file_contains`
- Machine-checkable with simple string/file operations

## Proposed Design

### Runner Script (Python)

A lightweight script (~100-150 lines) that:

1. **Discovers** evals: walks `plugins/*/skills/*/evals/evals.json`
2. **Sets up isolation**: creates a temp workspace (git worktree or tmp dir) per eval to prevent side-effect collision
3. **Executes prompts**: runs `claude -p '<prompt>'` for each eval, captures stdout
4. **Checks assertions** mechanically:
   - `output_contains` — substring check on captured stdout
   - `file_exists` — `os.path.exists(path)`
   - `file_not_exists` — `not os.path.exists(path)`
   - `file_contains` — read file, substring check
5. **Reports** pass/fail per eval, per assertion, with summary

### Format Standardization

Migrate Format A (jx-qa prose) to Format B (typed assertions) so all evals are machine-checkable. Prose assertions like "uses semantic locators" become:

```json
{ "type": "file_contains", "path": "tests/footer.spec.ts", "contains": "getByRole" }
```

### Eval Patterns to Support

| Pattern | Purpose | Example |
|---------|---------|---------|
| Happy path | Normal execution produces correct output/files | scaffold-new-skill-happy-path |
| Idempotency | Repeat execution doesn't duplicate work | idempotency-check |
| Negative cases | Skill refuses or redirects wrong inputs | reject-invalid-name |
| Boundary guards | Skill gates on user confirmation | requires-confirmation-before-write |
| Edge cases | Empty state handled gracefully | query-empty-wiki |

### Workspace Isolation

Each eval that creates files needs isolation to avoid collisions:
- Option A: `git worktree` per eval (heavy but accurate)
- Option B: temp directory with symlinked source (lighter)
- Option C: cleanup hooks that restore state between evals

## When Evals Run

Evals are a **development-time** tool, not a runtime check. They do not run when a user invokes a skill in a real session.

### Why Not at Skill Execution Time

- Evals consume tokens and time (each is a full Claude session)
- Evals have side effects (create files, modify state)
- The user wants the skill output, not a test report

### Why Not at Scaffold Time (`/jx-skill:create`)

- At scaffold time, SKILL.md is a placeholder template with no real logic
- `evals/evals.json` starts as an empty `[]`
- Running evals against an empty skeleton is meaningless — like running `npm test` right after `npm init`

### When They Should Run: Skill Authoring Workflow

Evals run during the development cycle that happens **after** scaffolding:

| Step | Action | Evals? |
|------|--------|--------|
| 1 | `/jx-skill:create` scaffolds skeleton | No — nothing to test |
| 2 | Developer writes actual SKILL.md instructions | No — still authoring |
| 3 | Developer writes evals that test those instructions | No — defining the contract |
| 4 | Developer runs evals to verify skill works | **Yes — this is the integration point** |
| 5 | Iterate steps 2-4 until evals pass | **Yes — regression check** |
| 6 | Commit and PR | Optionally via CI |

### Integration Points

The eval runner should be invocable as:

- **A skill/command** (e.g., `/jx-dev:eval --skill spec`) — run evals for a specific skill during authoring
- **A PR check** — run evals for any skill whose SKILL.md or references changed
- **A refactoring guard** — when shared references change (id-rules.md, templates), run evals for all skills that reference the changed file

### Seed Evals from Scaffold

`/jx-skill:create` could generate starter evals (not just `[]`) based on `--triggers` and `--description` flags. For example, if triggers include "create tech spec", scaffold a happy-path eval with that prompt and placeholder assertions the developer fills in. This gives developers a test contract to start from, not a blank file.

### Future Enhancements

- CI integration (run on PR that modifies a SKILL.md)
- Coverage report (which skills have evals, which don't)
- `fixture` field support (pre-conditions setup before eval runs)
- LLM-as-judge fallback for prose assertions that resist migration to typed checks
- Seed eval generation in `/jx-skill:create` based on trigger and description inputs

## Related

- [[Creating a Skill]] — skill scaffolding convention that creates evals/evals.json
- [[Skill Integration Testing via Agent SDK]] — complementary pattern for agent-level testing
- [[Skill]] — multi-phase instructional module powering slash commands
