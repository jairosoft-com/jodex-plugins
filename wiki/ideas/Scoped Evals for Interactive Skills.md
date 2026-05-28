---
title: Scoped Evals for Interactive Skills
type: idea
tags: [testing, evals, interactive, skill, strategy]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: [single-prompt eval scoping]
provenance: source-derived
status: raw
---

# Scoped Evals for Interactive Skills

When a [[Skill]] has a multi-turn interactive loop (e.g., meeting note capture), scope automated evals to the single-prompt-verifiable portion only. Leave interactive behaviors for manual testing.

## Scoping Rule

| Verifiable from single prompt | Manual testing |
|-------------------------------|----------------|
| Initial document creation | Prefix routing (DECISION:, ACTION:, TOPIC:) |
| File naming convention | Incremental persistence |
| Template section presence | Review/edit flow |
| Table column headers | Empty meeting cleanup |
| Placeholder text in empty sections | Draft → final rename |

## Rationale

The eval runner (`claude -p "prompt"`) executes a single prompt and checks assertions against the output. Multi-turn interaction (user types note → confirmation → another note → done) can't be simulated in a single prompt. Attempting it produces fragile, hard-to-maintain evals that test the eval harness more than the skill.

## Application

`/jx-pm:meet-notes` uses 4 [[Format B Eval Convention]] assertions for initial creation + 9 manual interactive tests.

## Related

- [[Format B Eval Convention]] — the assertion format used
- [[Eval Runner for Skill Assertions]] — the runner these evals target
- [[Fixture-Based Specification Verification]] — related pattern for SKILL.md verification

## Sources

- [[Source - Meet-Notes Session Insights]]
