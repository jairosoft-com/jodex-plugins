---
title: Socratic Interview
type: concept
tags: [pattern, architecture, requirements, discovery]
created: 2026-05-09
updated: 2026-05-09
source_count: 2
aliases: [socratic questioning, architectural interview, guided discovery]
provenance: source-derived
---

# Socratic Interview

A structured questioning technique where the LLM asks 3-7 high-value architectural questions, each tied to a specific design decision. Used to resolve ambiguity and surface constraints before generating technical specifications.

## Rules

- Every question must tie to a specific architectural decision
- Never ask generic questions ("Who is the target audience?")
- Challenge vague requirements with concrete alternatives
- Focus on decisions that shape implementation, not gather context

## Question Categories

- **Technical decisions**: optimistic UI, relational vs NoSQL, sync vs async
- **Non-functional requirements**: expected load, latency targets, data retention
- **Cross-cutting concerns**: auth/authz, monitoring, rollback strategy
- **Constraints and trade-offs**: dev speed vs runtime performance, downtime windows

## Distinction from Clarifying Questions

The PRD skill asks clarifying questions (Phase 3) to understand scope and intent. The Socratic Interview in techspec asks architectural questions to resolve how the system should be built. Clarifying questions are broad; Socratic questions are technical and decision-forcing.

## Related

- [[Multi-Phase Skill]] — Socratic Interview is Phase 3 of the techspec skill
- [[Measurability Mandate]] — Socratic questions often force vague requirements into measurable ones

## Sources
- [[Source - Tech Spec Generator SKILL]]
- [[Source - jx-dev Spec SKILL]]
