---
title: "Source - Tech Spec Generator SKILL"
type: source
tags: [skill, jx-pm, techspec, architecture, design]
created: 2026-05-09
updated: 2026-05-09
raw_path: plugins/jx-pm/skills/techspec/SKILL.md
provenance: source-derived
---

# Source - Tech Spec Generator SKILL

## Metadata
- **Original path**: plugins/jx-pm/skills/techspec/SKILL.md
- **SHA-256**: af78f606dee91bb7eb28ae8c937aab3b21c4446513d086541cacb7a87130ec67
- **Size**: 6457 bytes

## Summary

The Tech Spec Generator transforms a PRD into a framework-agnostic TECH_SPEC.md using Mermaid diagrams, JSON Schema data models, OpenAPI contracts, and Architecture Decision Records. It performs ambiguity detection on the PRD, conducts a [[Socratic Interview]] to resolve architectural decisions, and generates machine-readable specifications organized by user story.

## Key Concepts
- [[Socratic Interview]] — 3-7 high-value architectural questions tied to specific decisions
- Architecture Decision Records (ADR) — structured records of major architectural choices
- Ambiguity detection — flags vague adjectives, missing constraints, logic gaps, undefined contracts, security blindspots
- Round-trip ID extraction — validates feature number consistency across PRD IDs
- EARS syntax — "When/If/While...shall" notation for system behavior specification
- [[Requirement ID System]] — creates only TC and TEST IDs; references PRD IDs without modification
- [[Multi-Phase Skill]] — 5 phases: folder/ID extraction, PRD analysis, Socratic interview, generation, validation/save
- [[Skill Chaining]] — `--chain` invokes task skill, `--chain-all` invokes pipeline
- [[Shared Reference Extraction]] — references `_shared/id-rules.md` and `_shared/docs-root.md`
- Framework-agnostic output — Mermaid, JSON Schema, OpenAPI only (no implementation-specific code)

## Pages Created
- [[Socratic Interview]]
