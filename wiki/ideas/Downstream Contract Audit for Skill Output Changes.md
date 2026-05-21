---
title: Downstream Contract Audit for Skill Output Changes
type: idea
tags: [skill-design, contracts, jx-pm, jx-core, jx-dev]
created: 2026-05-20
updated: 2026-05-20
status: backlogged
source: jx-pm PRD multi-format AC session (2026-05-20)
---

# Downstream Contract Audit for Skill Output Changes

When changing a skill's output format, audit every downstream consumer. The PRD AC format change cascaded to 5+ files across 3 plugins (jx-pm, jx-core, jx-dev).

Initial plan missed two critical issues:
1. ADO skill already synthesized Gherkin from flat ACs — new G/W/T format caused double-processing
2. Task skill used raw AC count for sizing — unhappy paths inflated estimates

Lesson: grep for the output pattern (e.g., `AC-`) across all plugins before planning. The spec, task, and ADO skills all consume PRD output but in different ways — ID-only vs body-parsing vs count-based.
