---
name: feedback-read-skill-spec-first
description: "Before executing any jx-* skill, read its SKILL.md completely — do not improvise the workflow"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dcb040d6-2c0f-41bc-bf27-7d543804c73a
---

Before executing any jx-* skill (jx-pm:ado, jx-kb:ingest, jx-pm:prd, etc.), read the skill's SKILL.md file completely. Follow the phases, field mappings, and confirmation gates exactly as specified. Do not improvise.

**Why:** This mistake happened twice in the same session:
1. **jx-pm:ado** — improvised ADO work item format instead of reading `jx-core/_shared/ado.md`. Result: wrong Feature description template, ACs dumped into Description instead of AcceptanceCriteria field, missing story points and tags. Had to batch-update 8 work items.
2. **jx-kb:ingest** — improvised wiki ingest instead of reading `plugins/jx-kb/skills/ingest/SKILL.md`. Result: skipped fingerprint, skipped confirmation gate (Phase 3), no source snapshot, incomplete log entry, no cross-reference pass.

The first incident was caught, the lesson was saved, then immediately violated again on the next skill invocation — because the lesson was memorized as "read ado.md before ADO sync" instead of the general principle "read the SKILL.md before running any skill."

**How to apply:** When a `/jx-*:skill` is invoked, the first action is to read the corresponding SKILL.md (or its delegated shared spec). This applies to every skill, every time — not just the ones where a mistake was previously caught. The spec defines the contract; improvising produces drift.
