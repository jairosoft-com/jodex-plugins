---
title: "Source - jx-dev Spec SKILL"
type: source
tags: [jx-dev, skill, spec, techspec, architecture, design]
created: 2026-05-10
updated: 2026-05-10
provenance: source-derived
source_path: "plugins/jx-dev/skills/spec/SKILL.md"
source_hash: "deadd00feb73eda7f88a0e4fbe711874ae9ff63f9efb747ba26687163588403d"
---

# Source - jx-dev Spec SKILL

## Metadata
- **Original path**: plugins/jx-dev/skills/spec/SKILL.md
- **SHA-256**: deadd00feb73eda7f88a0e4fbe711874ae9ff63f9efb747ba26687163588403d

## Summary

The Spec skill (renamed from techspec during the jx-pm split) transforms a PRD into a framework-agnostic TECH_SPEC.md using Mermaid diagrams, JSON Schema data models, OpenAPI contracts, and Architecture Decision Records. It performs ambiguity detection on the PRD, conducts a [[Socratic Interview]] to resolve architectural decisions, and generates machine-readable specifications organized by user story. Unlike the jx-pm version, `--chain` and `--chain-all` flags have been removed.

## Key Concepts
- [[Socratic Interview]] -- 3-7 high-value architectural questions tied to specific decisions
- Architecture Decision Records (ADR) -- structured records of major architectural choices
- Ambiguity detection -- flags vague adjectives, missing constraints, logic gaps, undefined contracts, security blindspots
- Round-trip ID extraction -- validates feature number consistency across PRD IDs
- EARS syntax -- "When/If/While...shall" notation for system behavior specification
- [[Requirement ID System]] -- creates only TC and TEST IDs; references PRD IDs without modification
- [[Multi-Phase Skill]] -- 5 phases: folder/ID extraction, PRD analysis, Socratic interview, generation, validation/save
- [[Shared Reference Extraction]] -- references `jx-core/_shared/id-rules.md` and `jx-core/_shared/docs-root.md`
- Framework-agnostic output -- Mermaid, JSON Schema, OpenAPI only (no implementation-specific code)

## Relation to jx-pm

Post-split canonical location. The jx-pm version (see [[Source - Tech Spec Generator SKILL]], SHA `af78f606...`) included `--chain` and `--chain-all` flags for [[Skill Chaining]]. This jx-dev version removes those flags; cross-plugin chaining is deferred.

## Pages Created
None
