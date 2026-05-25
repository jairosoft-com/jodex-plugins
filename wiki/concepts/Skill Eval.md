---
title: Skill Eval
type: concept
tags: [testing, evals, skills, pattern]
created: 2026-05-25
---

# Skill Eval

A development-time behavior contract for a [[Skill]]. Each eval pairs a user prompt with assertions about expected output and file-system side effects.

## Structure

An eval lives at `plugins/<plugin>/skills/<name>/evals/evals.json` and contains an array of test cases. Each test case has a prompt (the user input) and assertions (what should happen).

## Two Assertion Styles

**Typed (machine-checkable):** `output_contains`, `file_exists`, `file_not_exists`, `file_contains` — used by jx-kb and jx-skill plugins.

**Prose (human-readable):** descriptive English assertions — used by jx-qa plugin. Requires LLM-as-judge or migration to typed format for automation.

## When They Run

Evals are development-time only. They do not run when a user invokes a skill, and they are not useful at scaffold time (SKILL.md is a template, evals.json is `[]`). They run during skill authoring: write SKILL.md → write evals → run evals → iterate.

## Eval Patterns

- **Happy path** — normal execution produces correct output/files
- **Idempotency** — repeat execution doesn't duplicate work
- **Negative cases** — skill refuses or redirects wrong inputs
- **Boundary guards** — skill gates on user confirmation before writes
- **Edge cases** — empty state or missing prerequisites handled gracefully

## Related

- [[Skill]] — the multi-phase module that evals test
- [[Eval Runner for Skill Assertions]] — backlogged runner to automate eval execution
