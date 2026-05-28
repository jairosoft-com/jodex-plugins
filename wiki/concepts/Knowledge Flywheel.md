---
title: Knowledge Flywheel
type: concept
tags: [pattern, workflow, wiki, meta]
created: 2026-05-09
updated: 2026-05-09
source_count: 1
aliases: [flywheel, build-review-capture loop]
provenance: source-derived
---

# Knowledge Flywheel

Self-reinforcing loop where each phase of work feeds the next session's starting knowledge. Work produces artifacts, artifacts get reviewed, reviews surface insights, insights get filed to wiki, wiki enriches future work.

## The Loop

```
Build → Review → Fix → Execute → Capture → Enrich → Lint → Fix
  ↑                                                          |
  └──────────────────────────────────────────────────────────┘
```

## How Each Phase Feeds the Next

| Phase | Output | Feeds |
|-------|--------|-------|
| Build | Idea/plan | Review input |
| Review | Findings | Fix targets |
| Fix | Hardened spec | Execution input |
| Execute | Working code | Capture source |
| Capture | Wiki pages | Enrichment targets |
| Enrich | Cross-references | Lint input |
| Lint | Health score + fixes | Better wiki for next Build |

## Evidence: Plugin Split Session

Single session traversed the full loop:
- **Build**: Groomed idea for jx-pm split
- **Review**: 5 adversarial rounds (3 idea, 2 plan), 35 total findings
- **Fix**: All findings resolved, spec hardened
- **Execute**: 4-agent tmux team, 12/12 verification pass
- **Capture**: 5 concept pages created/enriched, 3 source pages
- **Enrich**: 27+ cross-references added
- **Lint**: Wiki health 78 → 95

## Why It Works

Each pass through the loop:
- Increases wiki density (more pages, more links)
- Surfaces patterns (resolution-induced regression, signal file coordination)
- Creates reusable knowledge (concepts are tools for future sessions)
- Reduces startup cost (next session begins with richer context)

## Anti-Pattern: Breaking the Loop

Skipping capture after execution loses insights. Common failure: implement → commit → move on. The wiki never learns, next session starts cold.

## Related

- [[Iterative Adversarial Review]] — the review phase of the flywheel
- [[Agent Team Execution]] — the execution phase
- [[Filing Workflow]] — the capture phase
- [[Ingest]] — the enrichment phase
- [[Health Score]] — the lint phase

- [[Emergent Design from Constraint]] — the flywheel itself emerged from constraint

## Sources
- [[Source - Plugin Split Session Correlation]]
- [[Source - Plugin Split Dream]]
