---
title: Adversarial Review Converges to a Narrowed Residual
type: concept
tags: [adversarial-review, security, design-pattern, codex]
created: 2026-05-29
updated: 2026-05-29
source_count: 0
aliases: [overclaim convergence, narrowed not closed]
provenance: synthesis
---

# Adversarial Review Converges to a Narrowed Residual

On security-sensitive designs that ingest untrusted content, iterative adversarial review does not reach a
clean "no findings" pass — it keeps catching **overclaims** and converges on an honest residual instead.

- Each round flags an overclaim ("collapsed", "closed", "safe by construction", "ready to implement") and
  each fix **relocates** the surface (agent → command → provenance) rather than closing it.
- The honest stable end-state is "**narrowed** + accepted residual for trusted use + gated on runtime
  prerequisites" — not zero findings.
- Diminishing returns (the blocking-finding count plateaus or stops dropping) is the signal to **stop the
  loop** and record the residual truthfully. Related: [[Plan vs Code Review Complementarity]],
  [[Adversarial Review Catches Scaffold Drift]].

The loop is typically run as a saved workflow — see [[Saved Workflow By-Name Invocation Drops Args]] for an invocation caveat. The gate it tightens can also harden a runtime smoke across rounds — see [[Runtime Smoke Must Validate Output Content Not Just Discovery]].

## Sources
- Session: jx-qa reviewer build + tool-scoping security (2026-05-29)
