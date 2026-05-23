---
title: Flag-Value Helper Antipattern
type: idea
tags: [testing, patterns, dx, code-quality]
created: 2026-05-22
updated: 2026-05-22
source_count: 0
aliases: [double-flag bug, flag helper antipattern]
provenance: synthesis
status: backlogged
---

# Flag-Value Helper Antipattern

A helper that returns a full `--flag value` string causes a double-flag bug when the call site already includes the flag name.

## Example

```typescript
// Bad — returns flag + value
const tenantFlag = () => `--tenant ${SANDBOX.org}/${SANDBOX.project}`;

// Call site: prompt = `/skill --tenant ${tenantFlag()} ...`
// Renders:   `/skill --tenant --tenant jairo/Jodex-Test ...`  ← broken
```

```typescript
// Good — returns value only; caller owns the flag name
const tenantValue = () => `${SANDBOX.org}/${SANDBOX.project}`;

// Call site: prompt = `/skill --tenant ${tenantValue()} ...`
// Renders:   `/skill --tenant jairo/Jodex-Test ...`  ← correct
```

## Rule

Helpers that extract CLI argument values should return the **value only**. The flag name belongs at the call site where context makes the flag explicit. This also makes the helper reusable across different flag names.

## Where It Bites

- CLI prompt templates built from string interpolation
- Any `--flag ${helper()}` pattern where the helper was authored as a convenience "include everything" function

## Related

- [[Skill Integration Testing via Agent SDK]] — where this was discovered

## Sources
