---
title: Split Verification Pattern
type: concept
tags: [pattern, verification, naming, safety]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [split verification, dual-mode verification]
provenance: synthesis
---

# Split Verification Pattern

When a bulk operation produces both "must change" and "intentionally preserved" instances of the same token, split verification into two tiers rather than one grep with exclusions.

## The Problem

A single exhaustive grep with `grep -v` exclusions is fragile:
- Line-level exclusions mask stale identifiers that share a line with preserved ones
- Adding more exclusions weakens the check until it catches nothing
- False confidence: verification passes but stale references survive

## The Pattern

**Tier 1 — Zero-hit checks** (must return zero results):
Check for tokens in actionable positions only. These are unambiguous and have no legitimate reason to survive.
```bash
grep -rn '/old-name:\|old-name@\|plugins/old-name' ...
```

**Tier 2 — Audit-only checks** (expected hits, human review):
List remaining occurrences for manual inspection. Every hit must be a conceptual reference, not a plugin identifier.
```bash
grep -rn 'Old Name' ... | grep -v '\[\[Old Name\]\]'
```

## When It Applies

- Renaming a plugin whose name is also an upstream concept (e.g., "LLM Wiki" = both plugin and Karpathy's pattern)
- Any rename where the old name has legitimate uses beyond the thing being renamed
- Deprecations where some references should persist as historical context

## Example from This Project

`LLM Wiki` was both a plugin name and Karpathy's upstream pattern name:
- **Tier 1**: Zero-hit for `[[LLM Wiki]]` wikilinks, `/llm-wiki:` commands, `plugins/llm-wiki/` paths
- **Tier 2**: Audit remaining "LLM Wiki" prose — all should reference the pattern concept, not the plugin

## Related

- [[Scoped Replacement Pattern]] — safe replacement rules
- [[Naming Ripple Effect]] — rename cascade
- [[Iterative Adversarial Review]] — caught this gap during plan review
