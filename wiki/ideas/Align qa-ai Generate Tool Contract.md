---
title: Align qa-ai Generate Tool Contract
type: idea
tags: [qa-ai, tooling, security]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [qa-ai generate allowed tools mismatch]
provenance: synthesis
status: backlogged
---

# Align qa-ai Generate Tool Contract

The [[QA AI]] generate workflow should align its documented xlsx parsing method with its allowed tool surface.

## Observation

The generate skill describes parsing xlsx test plans with `npx -p xlsx node -e`, while the slash command and skill allowed tools focus on `playwright-cli`, `npx playwright test`, and `ls`.

## Why It Matters

This creates a mismatch between the intended secure execution model and the actual workflow instructions. A future run may either fail due to unavailable permissions or require broader tool access than the plugin intends.

## Potential Fix

Move xlsx parsing behind a pinned helper or explicitly adjust the allowed tool contract. Prefer a pinned helper if preserving the [[Pinned Helper]] security model is more important than ad-hoc Node execution.

## Related

- [[Plugin Metadata Surfaces]]
- [[Semantic Locator]]
- [[Idempotent Operation]]
- [[Jodex Plugin Marketplace]]

## Derived From
- [[QA AI]]
- [[Source - Generate SKILL]]
- [[Pinned Helper]]
- [[Semantic Locator]]
