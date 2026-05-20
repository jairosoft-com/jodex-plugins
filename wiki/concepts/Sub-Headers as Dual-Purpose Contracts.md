---
title: Sub-Headers as Dual-Purpose Contracts
type: concept
tags: [skill-design, prd, ado, parsing, design-pattern]
created: 2026-05-20
updated: 2026-05-20
source_count: 1
aliases: [content-as-contract, dual-purpose markdown headers]
provenance: session-derived
---

# Sub-Headers as Dual-Purpose Contracts

Bold sub-headers in PRD AC blocks (`**Scenarios:**`, `**Rules:**`, `**System Behavior:**`, `**Quality Gates:**`) serve two purposes simultaneously:

1. **Human-readable:** Visual grouping that makes the PRD scannable
2. **Machine-parseable:** Format routing for ADO sync (pass-through vs synthesize vs exclude)

Pattern: content structure IS the contract. No separate metadata, no hidden flags. The markdown the author writes is the same markdown the ADO parser reads.

Key constraint: sub-header detection must be scoped to the AC block only (between `**Acceptance Criteria:**` and `**Validates:**`) to avoid false matches elsewhere in the story.

## Related

- [[Conditional AC Format Selection]]
- [[ADO State Sync Model]]
