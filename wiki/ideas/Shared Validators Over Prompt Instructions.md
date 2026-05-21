---
title: Shared Validators Over Prompt Instructions
type: idea
tags: [skill-design, validation, contracts, jx-core, design-pattern]
created: 2026-05-20
status: raw
source: jx-pm PRD multi-format AC session (2026-05-20), Codex R12
---

# Shared Validators Over Prompt Instructions

When a skill's output format has hard constraints consumed downstream, enforce via shared executable scripts, not prompt instructions.

- **Prompt instructions** are advisory — the LLM can miss violations, especially for subtle format rules like single-line AC bodies
- **Shared scripts** are deterministic — same input always produces same pass/fail

Wire the same validator into both the generator (pre-save) and every downstream consumer (pre-sync). Example: `validate-ac-blocks.sh` runs at PRD save (Phase 6) and ADO sync (Phase 2), catching both LLM-generated and hand-edited violations.

Pattern applies to any skill producing structured output with format contracts: PRD AC blocks, task.json schema, frontmatter structure.
