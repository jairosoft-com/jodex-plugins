---
title: Adversarial Review Catches Scaffold Drift
type: idea
tags: [adversarial-review, codex, workflow, skill-design, quality]
created: 2026-05-22
updated: 2026-05-22
status: raw
priority: P3
effort: small
source: Session — FEAT-003 4-round adversarial review (2026-05-22)
provenance: observation
---

# Adversarial Review Catches Scaffold Drift

## Observation

In 4 rounds of adversarial review for FEAT-003, 3 of the HIGH findings came from the same pattern: a behavior rule was updated in one place (a paragraph description) but the same rule was also encoded in a scaffold template, a sub-header list, or a checklist item in the same file — and those secondary locations were not updated.

Examples caught:
- Phase 5 Quality Gates paragraph updated but User Story Format scaffold (lines 176-179) still had hard-coded untagged gates
- Phase 5 paragraph updated but line 204 sub-header list still said "Always present"
- Phase 5 paragraph updated but checklist items 289+296 still used "every story" language

## Action Pattern

When editing a skill's behavior description, grep the file for every other place that behavior is stated before declaring the edit complete:

```bash
grep -n "Quality Gates\|always present\|Always present" plugins/jx-pm/skills/prd/SKILL.md
```

One grep pass before committing would have caught all three in FEAT-003.
