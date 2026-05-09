---
title: User Confirmation Gate
type: concept
tags: [security, pattern, ux]
created: 2026-05-07
updated: 2026-05-07
source_count: 2
aliases: [confirmation gate, approval checkpoint]
provenance: source-derived
---

# User Confirmation Gate

A design pattern where the LLM presents planned changes and waits for explicit user approval before executing any writes. No wiki mutations occur before the gate.

## How It Works

During [[Ingest]], Phase 3 presents a table of planned page creates/updates:
```
| Action | Page | Type | Directory | Reason |
|--------|------|------|-----------|--------|
| CREATE | [[Page]] | concept | concepts/ | New concept extracted |
| UPDATE | [[Other]] | entity | entities/ | New claims from source |
```

The user can add, remove, or modify entries before approving.

## Where It's Used

- [[Ingest]] — Phase 3 (plan wiki updates)
- [[Triage]] — each idea requires explicit classification
- [[LLM Wiki]] plugin — all mutation operations

## Sources
- [[Source - LLM Wiki README]]
- [[Source - Azure Boards Sync SKILL]]
