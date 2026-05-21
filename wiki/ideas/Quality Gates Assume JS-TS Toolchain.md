---
title: Quality Gates Assume JS-TS Toolchain
type: idea
tags: [jx-pm, prd, hardcoded, quality-gates, polyglot]
created: 2026-05-20
status: backlogged
source: PRD skill hardcoded values review (2026-05-20)
---

# Quality Gates Assume JS-TS Toolchain

Auto-appended quality gates ("Lint passes", "Typecheck passes", "Unit tests pass", "E2E tests pass") assume a JS/TS project. A Python project needs "mypy passes" or "ruff passes". Rust needs "cargo clippy passes". Go needs "go vet passes".

Quality gates should be configurable per project, either via a project-level config file or an env var like `$JX_QUALITY_GATES`. The ADO skill's exact-phrase exclusion logic would also need to be updated to match the configured gates instead of hardcoded phrases.
