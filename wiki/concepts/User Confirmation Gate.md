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
| CREATE | Page | concept | concepts/ | New concept extracted |
| UPDATE | Other | entity | entities/ | New claims from source |
```

The user can add, remove, or modify entries before approving.

## Typed Value Confirmation

A strengthened variant where the user must type the actual target value rather than a generic "yes" or "confirm". This forces active verification of the target and catches cases where the displayed value differs from the actual write target.

**Pattern:** `"Type '{organization}/{project}' to confirm:"`

**When to use:** When the system cannot programmatically verify the write target (e.g., no API exposes the connected organization), typed confirmation shifts the verification burden to the user in a way that's harder to rubber-stamp than clicking "yes."

**Example (feedback skill):** ADO MCP can't expose the connected org. The user must type the org/project string from `feedback-target.json` to confirm. If the MCP is misconfigured, the user has a last-chance gate where they actively recall and type the intended target.

## Where It's Used

- [[Ingest]] — Phase 3 (plan wiki updates)
- [[Triage]] — each idea requires explicit classification
- [[Knowledge Base Plugin|jx-kb]] plugin — all mutation operations
- `jx-core/_shared/ado.md` — `--new-tenant` requires typing "rebind" before destructive re-bind
- `jx-core/_shared/feedback.md` — typed `{org}/{project}` confirmation before ADO Feature creation

## Sources
- [[Source - JX KB README]]
- [[Source - Azure Boards Sync SKILL]]
