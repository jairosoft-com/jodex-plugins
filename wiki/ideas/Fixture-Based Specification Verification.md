---
title: Fixture-Based Specification Verification
type: idea
tags: [pattern, testing, skill, verification, SKILL.md]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: [spec verification via fixtures]
provenance: source-derived
status: raw
---

# Fixture-Based Specification Verification

For [[Skill]]s implemented as SKILL.md files (LLM instruction files, not executable code), verification testing means confirming the spec correctly handles edge cases — not running automated tests.

## Approach

Create fixture files with known edge cases and verify the SKILL.md's logic addresses them:

- **Suffix sorting**: files `2026-05-23.md` and `2026-05-23-2.md` to test rerun selection
- **XSS payloads**: work item titles containing `<script>` tags to test HTML escaping rules
- **Date boundaries**: files from yesterday to test freshness warnings
- **Empty directories**: no files to test error messages

The spec's instructions are the "code" — verification confirms the instructions produce correct behavior for each fixture.

## Limitation

This verifies specification completeness, not runtime behavior. An LLM following the instructions could still deviate. The spec-level verification catches design gaps; runtime testing catches instruction-following gaps.

## Related

- [[Skill]] — the artifact type this applies to
- [[Spec-First Skill Execution]] — read the spec before executing
- [[Multi-Phase Skill]] — structural pattern that defines the phases being verified

## Sources

- [[Source - FEAT-006 Session Insights]]
