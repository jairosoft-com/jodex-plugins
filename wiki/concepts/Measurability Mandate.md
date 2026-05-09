---
title: Measurability Mandate
type: concept
tags: [pattern, requirements, quality, product-management]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
aliases: [measurable requirements, testable requirements, no vague adjectives]
provenance: source-derived
---

# Measurability Mandate

Every requirement in a PRD must be testable and measurable. Vague adjectives are replaced with concrete metrics before the document is considered complete.

## Transformations

| Vague | Measurable |
|-------|------------|
| "Fast" | "<200ms response time for 95% of requests" |
| "Secure" | "AES-256 encryption at rest, bcrypt password hashing" |
| "Easy to use" | "First-time users complete task in <3 minutes" |
| "Scalable" | "Handles 10K concurrent users with <500ms p99 latency" |

## Enforcement Points

- `/jx-pm:prd` — Phase 5 generation enforces measurable requirements
- `/jx-pm:techspec` — Phase 2 ambiguity detection flags vague adjectives that survived PRD
- NFRs (Non-Functional Requirements) are explicitly checked for vague terms

## Relationship to Golden Thread

The [[Golden Thread Traceability]] chain only works if every link is verifiable. A vague requirement like "fast" breaks the chain because no test can definitively prove it passes or fails.

## Related

- [[Golden Thread Traceability]] — traceability requires testable links
- [[Requirement ID System]] — IDs label the measurable requirements

## Sources
- [[Source - PRD Generator SKILL]]
