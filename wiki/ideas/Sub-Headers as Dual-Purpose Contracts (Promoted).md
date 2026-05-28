---
title: Sub-Headers as Dual-Purpose Contracts
type: idea
tags: [skill-design, prd, ado, parsing, design-pattern]
created: 2026-05-20
updated: 2026-05-20
status: promoted
source: jx-pm PRD multi-format AC session (2026-05-20)
---

# Sub-Headers as Dual-Purpose Contracts

Bold sub-headers in PRD AC blocks (`**Scenarios:**`, `**Rules:**`, `**System Behavior:**`, `**Quality Gates:**`) serve two purposes simultaneously:

1. **Human-readable:** Visual grouping that makes the PRD scannable
2. **Machine-parseable:** Format routing for ADO sync (pass-through vs synthesize vs exclude)

Pattern: content structure IS the contract. No separate metadata, no hidden flags. The markdown the author writes is the same markdown the ADO parser reads.

Key constraint: sub-header detection must be scoped to the AC block only (between `**Acceptance Criteria:**` and `**Validates:**`) to avoid false matches from identically-named sections elsewhere in the story.
