---
title: Format B Eval Convention
type: concept
tags: [testing, evals, convention, skill, assertion]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: [typed assertions, Format B evals, eval assertion types]
provenance: source-derived
---

# Format B Eval Convention

The repo-standard format for `evals.json` files in [[Skill]] directories. Each eval is a named test case with an input prompt and an array of typed assertion objects.

## Schema

```json
{
  "name": "test-case-name",
  "description": "What this test verifies",
  "input": "/plugin:skill --flags",
  "assertions": [
    { "type": "file_exists", "path": "relative/path/to/expected/file" },
    { "type": "file_contains", "path": "relative/path", "contains": "expected string" },
    { "type": "file_contains_ordered", "path": "relative/path", "ordered": ["first", "second", "third"] },
    { "type": "output_contains", "contains": "expected stdout text" }
  ]
}
```

## Assertion Types

| Type | Parameters | Checks |
|------|-----------|--------|
| `file_exists` | `path` | File was created at expected path |
| `file_contains` | `path`, `contains` | File includes expected string |
| `file_contains_ordered` | `path`, `ordered` | Strings appear in specified order |
| `output_contains` | `contains` | Skill's stdout includes expected text |

## Reference Implementations

- `plugins/jx-skill/skills/create/evals/evals.json` — skill scaffolder (8 assertions per case)
- `plugins/jx-skill/skills/create-plugin/evals/evals.json` — plugin scaffolder
- `plugins/jx-pm/skills/meet-notes/evals/evals.json` — meeting notes (4 test cases)

## Discovery

Identified when a Gemini cross-model handoff flagged an invented `prompt`/`assertion` string format as non-standard. The existing repo convention was already established in jx-skill evals but had not been documented as a named pattern. See [[Cross-Model Handoff Evaluation]].

## Related

- [[Skill]] — evals live in each skill's `evals/` directory
- [[Eval Runner for Skill Assertions]] — the runner that executes these assertions
- [[Scoped Evals for Interactive Skills]] — scoping strategy when skills have capture loops
- [[Spec-First Skill Execution]] — read the convention before writing evals

## Sources

- [[Source - Meet-Notes Session Insights]]
