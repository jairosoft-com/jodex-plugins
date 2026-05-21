---
title: Mermaid Diagram Patterns
type: concept
tags: [jx-pm, techspec, mermaid, diagrams, visualization]
created: 2026-05-09
updated: 2026-05-21
source_count: 2
aliases: [Diagram Patterns, Mermaid Reference]
provenance: source-derived
---

# Mermaid Diagram Patterns

A reference library of seven Mermaid diagram types used by the jx-pm techspec skill to visualize architecture in TECH_SPEC documents. Each pattern serves a specific communication purpose: C4 Context for system boundaries, C4 Container for internal components, Sequence for request flows, ERD for data models, State Machine for entity lifecycles, Flowchart for decision logic, and Deployment for infrastructure topology. The guiding principle is one concept per diagram.

## Pipeline Diagram in BRD_PRD (Executive Summary)

A `flowchart TD` placed in the Executive Summary of a BRD_PRD serves a different purpose than TECH_SPEC diagrams — it communicates the **user-facing happy-path flow** to stakeholders before any technical detail. Key conventions:

- Node shapes: rounded rectangles (`([...])`) for data artefacts, rectangles (`[...]`) for skill/command steps, diamonds (`{...}`) for human decision points
- Happy path flows straight down; optional/debug paths branch to the side
- Each step labelled with the actual command (e.g., `/jx-qa:extract`)
- Color coding: input/output artefacts in blue, success terminal in green, optional steps in amber
- One diagram per pipeline — covers the full flow, not individual steps

This is distinct from the seven TECH_SPEC diagram types above, which target engineering audiences. The BRD_PRD pipeline diagram targets product and business stakeholders.

## Related

- [[Template-as-Reference Pattern]]
- [[Skill Chaining]]
- [[Mermaid Obsidian Rendering Gotchas]]

## Sources
- [[Source - Mermaid Diagram Patterns]]
- [[Source - jx-dev Diagram Patterns]]
