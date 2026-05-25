---
title: Spec-First Skill Execution
type: concept
tags: [pattern, skill, contract, safety, discipline]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: [read the spec first, spec-first execution]
provenance: source-derived
---

# Spec-First Skill Execution

Before executing any jx-* [[Skill]], read its SKILL.md (or delegated shared spec) completely. Follow the phases, field mappings, and confirmation gates exactly as specified. Do not improvise.

## Why

SKILL.md files are contracts — they define field layouts, creation sequences, confirmation gates, and output formats. Improvising produces work items, wiki pages, or artifacts that look superficially correct but violate the contract in ways that require batch correction.

## Anti-Pattern: Specific-Fix Memorization

When a mistake is caught, the natural instinct is to memorize the specific fix: "read ado.md before ADO sync." This fails because the same class of mistake recurs on the next skill invocation — the principle was not generalized.

**Incident (2026-05-25):** Two violations in one session:
1. `/jx-pm:ado` — improvised ADO work item format instead of reading `jx-core/_shared/ado.md`. Wrong Feature template, ACs in Description instead of AcceptanceCriteria field, missing story points and tags. Batch-updated 8 work items.
2. `/jx-kb:ingest` — improvised wiki ingest instead of reading `plugins/jx-kb/skills/ingest/SKILL.md`. Skipped fingerprint (Phase 1), skipped confirmation gate (Phase 3), no source snapshot (Phase 4), incomplete log entry, no cross-reference pass (Phase 6).

The first incident was caught and saved as feedback. The lesson was then immediately violated on the next skill invocation — because it was memorized as "read ado.md" not "read the SKILL.md."

## The Rule

When a `/jx-*:skill` is invoked, the first action is to read the corresponding SKILL.md. This applies to every skill, every time — not just the ones where a mistake was previously caught.

## Phases Most Often Skipped

| Phase | What it does | Why it gets skipped |
|-------|-------------|---------------------|
| Confirmation gate | Wait for user approval before writes | Feels redundant when intent is clear |
| Fingerprint/dedup | Check if source was already processed | Assumed to be new |
| Field routing | Put content in the correct ADO/wiki field | Description field feels sufficient |
| Cross-reference pass | Add bidirectional wikilinks | Easy to forget after main content is written |

## Related

- [[Skill]] — the artifact this pattern applies to
- [[Multi-Phase Skill]] — the structural pattern that defines phases, gates, and sequences
- [[User Confirmation Gate]] — Phase 3 of ingest is a confirmation gate; skipping it violates this pattern
- [[Iterative Adversarial Review]] — this lesson emerged from a FEAT-006 review session
- [[Product Management Skills Plugin]] — the plugin where both incidents occurred
- [[Sub-Headers as Dual-Purpose Contracts]] — ADO AC field routing is a sub-header contract

## Sources

- [[Source - Spec-First Feedback]]
