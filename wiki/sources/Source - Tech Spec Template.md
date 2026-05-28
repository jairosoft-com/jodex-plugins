---
title: "Source - Tech Spec Template"
type: source
tags: [jx-pm, techspec, template, architecture]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/techspec/references/template.md
provenance: source-derived
---

# Source - Tech Spec Template

## Metadata
- **Original path**: plugins/jx-pm/skills/techspec/references/template.md
- **SHA-256**: c25609335365067dd366f1434e995ffbd8a96d1e2441580537fa0effc6badef1
- **Size**: 3310 bytes

## Summary

Template for the TECH_SPEC.md output produced by the techspec skill. Defines an 8-section structure: Introduction (background, user stories, goals/non-goals), Architecture Overview (C4 context diagram + narrative), Design Details (per-story with trigger, EARS syntax behavior, sequence diagrams, JSON Schema data models, OpenAPI contracts, state machines, error handling), ADRs, Implementation Plan (phased rollout + data migration), Technical Constraints, Testing Strategies, and Cross-Cutting Concerns (security, scalability, monitoring, deployment).

## Key Concepts
- EARS syntax for system behavior specification (When/If/Shall)
- Per-user-story design detail sections
- JSON Schema for data models
- OpenAPI for API contracts
- Architecture Decision Records (ADR) format
- Technical Constraint pattern: TC-{feature_number}-XX
- Test strategy pattern: TEST-{feature_number}-XX
- Cross-cutting concerns: security, scalability, monitoring, deployment/rollback

## Pages Created
None
