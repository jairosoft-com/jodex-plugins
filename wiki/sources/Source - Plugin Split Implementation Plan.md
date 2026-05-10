---
title: Source - Plugin Split Implementation Plan
type: source
tags: [plugin-architecture, implementation, plan, jx-dev, jx-core]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
aliases: []
provenance: source-derived
---

# Source - Plugin Split Implementation Plan

Implementation plan for splitting jx-pm into jx-pm + jx-dev + jx-core. Executed via 4-agent tmux team with signal file coordination.

## Key Content

- 4-track parallel architecture (A: jx-core, B: jx-dev, C: jx-pm modify, D: verification)
- Race condition prevention via dependency ordering (B before C)
- 12-step verification suite with grep checks, manifest validation, smoke tests
- 8 documented pitfalls for implementers
- Tmux execution commands for separate Claude instances
- Signal file coordination pattern (`/tmp/jx-split-track-*-done`)

## Knowledge Extracted To

- [[Agent Team Execution]] — signal file coordination, separate instance model
- [[Iterative Adversarial Review]] — plan-level review case study (2 rounds)
- [[Plugin Dependency Declaration]] — dependencies field convention
- [[Cross-Plugin Shared Convention Layer]] — reference-only plugin pattern
- [[Plugin Architecture]] — dependency section

## Raw Source

`wiki/raw/sources/cc7896ff-sparkling-squishing-boole.md`

## Sources
- [[Source - Split Tech Spec Idea]]
