---
name: Adversarial Review Workflow
description: User runs multiple Codex adversarial reviews iteratively to harden designs before implementation
type: feedback
originSessionId: 15ee19d7-c663-4d21-929d-bc8711658c02
---
Run Codex adversarial review iteratively on design specs/plans — not just once. User expects to discuss each finding individually, resolve them, update the artifact, then re-run review until clean.

**Why:** Single-pass reviews miss cascading issues. Each fix can introduce new edge cases. The user values thoroughness — 4 rounds on jx-pm plan uncovered per-item write-back, tombstones, fail-closed lookup, tenant binding, hierarchy reconciliation, and confirmation gates that weren't in original design.

**How to apply:** When user says "run adversarial review" or reviews a design artifact, expect multiple rounds. After each round, present findings one-by-one via AskUserQuestion, update the artifact, re-run. Don't assume one pass is enough.
