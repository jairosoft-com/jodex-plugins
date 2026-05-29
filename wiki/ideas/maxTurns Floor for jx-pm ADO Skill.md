---
title: maxTurns Floor for jx-pm ADO Skill
type: idea
tags: [jx-pm, agent-sdk, testing, performance, skill-runner]
created: 2026-05-22
updated: 2026-05-28
source_count: 0
provenance: session-observation
status: completed
---

# maxTurns Floor for jx-pm ADO Skill

`/jx-pm:ado` reads 5+ shared files before executing (SKILL.md, ado.md, docs-root.md, id-rules.md, quality-gates.md). The default `maxTurns: 20` is consistently insufficient.

Observed minimums:
- **Dry-run**: 80 turns, ~2–4 min per test
- **E2E with ADO writes**: 80 turns + 12 min timeout per test (feature create + 2 story creates + AC updates + frontmatter write-back)

Any SDK test harness for `jx-pm:ado` should set `maxTurns: 80` minimum and configure Playwright timeout ≥ 12 min for E2E tests.
