---
title: Source - Plugin Split Session Correlation
type: source
tags: [session-learning, plugin-architecture, adversarial-review, agent-team, meta-pattern]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
aliases: []
provenance: source-derived
---

# Source - Plugin Split Session Correlation

End-of-session synthesis from the jx-pm plugin split. One complete lifecycle: idea → grooming → adversarial review → plan → execution → wiki filing → lint.

## Key Insight: Resolution-Induced Regression

Fixing a round-1 finding creates a new bug visible only in round 2. Examples:
- "Defer pipeline" broke pipeline's task.json producer
- "Extract to jx-core" left path resolution undefined
- "Parallel tracks" created race condition (B copies files C deletes)

Single-pass review catches structural gaps. Multi-pass catches the bugs your fixes introduce.

## Statistics

- Idea grooming: 3 rounds, 24 findings (5 critical)
- Plan review: 2 rounds, 11 findings (1 critical)
- Execution: 4-agent tmux team, 12/12 verification checks pass
- Wiki: 32 files changed, score 78 → 95

## New Conventions Created

- `dependencies` field in plugin.json
- Reference-only plugin type (no commands, no skills)
- Relative paths anchored from SKILL.md (3 levels to jx-core)
- Env var precedence chain: `$JX_DOCS_ROOT` > `$JX_PM_DOCS_ROOT` > `docs/`

## Agent Team Models

Two execution models discovered:
- Subagent model: `Agent()` tool with `run_in_background` — for reviews
- Separate instance model: `claude -p` in tmux panes — for execution tracks

Signal file coordination: `touch /tmp/track-done` + `until [ -f signal ]; do sleep 5; done`

## The Meta-Pattern: Knowledge Flywheel

Build → Review → Fix → Execute → Capture → Enrich → Lint → Fix. Each phase feeds the next session's starting knowledge.

## Adversarial Review at Two Levels

1. Design level (idea) — hardens the spec
2. Execution level (plan) — hardens the implementation

Different failure modes at each level. Both needed.

## Diminishing Returns Signal

Stop when: verdict CLEAN, findings minor/cosmetic only, advisor confirms, implementation will surface issues faster than review.

## Knowledge Extracted To

- [[Iterative Adversarial Review]] — resolution-induced regression, diminishing returns, case studies
- [[Agent Team Execution]] — signal files, separate instance model, race condition prevention
- [[Plugin Dependency Declaration]] — dependencies array convention
- [[Cross-Plugin Shared Convention Layer]] — reference-only plugin pattern
- [[Plugin Architecture]] — dependency section, reference-only type

## Sources
- [[Source - Plugin Split Implementation Plan]]
- [[Source - Split Tech Spec Idea]]
- [[Source - Cross-Plugin Convention Layer]]
