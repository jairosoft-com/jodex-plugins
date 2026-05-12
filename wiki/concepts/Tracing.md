---
title: Tracing
type: concept
tags: [debugging, playwright, observability]
created: 2026-05-07
updated: 2026-05-12
source_count: 1
aliases: [execution trace, trace capture]
provenance: source-derived
---

# Tracing

Detailed execution trace capture for debugging and analysis in [[Playwright]]. Traces include DOM snapshots, screenshots, network activity, and console logs.

## Usage

```bash
playwright-cli tracing-start
# ... perform actions ...
playwright-cli tracing-stop
```

## What Traces Capture

| Category | Details |
|----------|---------|
| Actions | Clicks, fills, hovers, keyboard, navigations |
| DOM | Full snapshot before/after each action |
| Screenshots | Visual state at each step |
| Network | All requests, responses, headers, bodies, timing |
| Console | log, warn, error messages |
| Timing | Precise timing per operation |

## Jodex Use

In the [[QA Testing Plugin|jx-qa]] workflow, tracing is most useful after a generated test fails but the failure is not obvious from the assertion output. A trace gives the reviewer the rendered page, DOM state, network behavior, and action sequence that led to the failure.

Traces should normally be treated as generated artifacts. Keep them for debugging and attach them to issue reports when useful, but avoid committing bulky trace output into the project repository unless the team has an explicit artifact policy.

## Trace vs Video vs Screenshot

| Feature | Trace | Video | Screenshot |
|---------|-------|-------|------------|
| DOM inspection | Yes | No | No |
| Network details | Yes | No | No |
| Step-by-step replay | Yes | Continuous | Single frame |
| Best for | Debugging | Demos | Quick capture |

## Sources
- [[Source - Tracing Reference]]
