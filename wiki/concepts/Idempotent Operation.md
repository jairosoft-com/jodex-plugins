---
title: Idempotent Operation
type: concept
tags: [pattern, safety, design]
created: 2026-05-07
updated: 2026-05-07
source_count: 1
aliases: [idempotency, safe re-run]
provenance: source-derived
---

# Idempotent Operation

A design pattern where re-running an operation produces the same result as running it once. Multiple plugins in this repo use idempotency for safety.

## Examples

- `/qa-ai:generate` skips test cases that already have `.spec.ts` files — re-running is safe
- [[SHA-256 Fingerprinting]] detects already-ingested sources and warns before re-processing

## Why It Matters

Users may re-run commands accidentally or intentionally (e.g., after adding new test cases to an xlsx). Idempotent operations prevent duplicate work and data corruption.

## Sources
- [[Source - Generate SKILL]]
