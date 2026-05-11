---
title: "Source - jx-dev Tech Spec Template"
type: source
tags: [jx-dev, spec, template, architecture]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-dev/skills/spec/references/template.md"
source_hash: "c25609335365067dd366f1434e995ffbd8a96d1e2441580537fa0effc6badef1"
---

# Source - jx-dev Tech Spec Template

## Metadata
- **Original path**: plugins/jx-dev/skills/spec/references/template.md
- **SHA-256**: c25609335365067dd366f1434e995ffbd8a96d1e2441580537fa0effc6badef1

## Summary

Template for the TECH_SPEC.md output produced by the spec skill. Defines an 8-section structure: Introduction (background, user stories, goals/non-goals), Architecture Overview (C4 context diagram + narrative), Design Details (per-story with trigger, EARS syntax behavior, sequence diagrams, JSON Schema data models, OpenAPI contracts, state machines, error handling), ADRs, Implementation Plan (phased rollout + data migration), Technical Constraints, Testing Strategies, and Cross-Cutting Concerns (security, scalability, monitoring, deployment).

Canonical post-split copy; see also [[Source - Tech Spec Template]] (the jx-pm equivalent at `plugins/jx-pm/skills/techspec/references/template.md`). Content is byte-identical (same SHA-256).

## Key Concepts
- EARS syntax for system behavior specification (When/If/Shall)
- Per-user-story design detail sections
- JSON Schema for data models
- OpenAPI for API contracts
- Architecture Decision Records (ADR) format
- Technical Constraint pattern: TC-{feature_number}-XX
- Test strategy pattern: TEST-{feature_number}-XX
- [[Requirement ID System]] -- TC and TEST ID formats

## Pages Created
None
