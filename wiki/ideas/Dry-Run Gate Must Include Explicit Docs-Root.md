---
title: Dry-Run Gate Must Include Explicit Docs-Root
type: idea
tags: [jx-pm, ado, safety, verification, docs-root]
created: 2026-05-18
updated: 2026-05-18
source_count: 0
aliases: [docs-root dry-run safety, explicit docs-root gate]
provenance: session-derived
status: backlogged
---

# Dry-Run Gate Must Include Explicit Docs-Root

Verification instructions that use `/jx-pm:ado --dry-run` without `--docs-root docs` risk validating the wrong `task.json` or tenant binding if a stale environment variable (`$JX_DOCS_ROOT` or `$JX_PM_DOCS_ROOT`) is set.

## Problem

The ADO skill resolves docs root in this order: `--docs-root` flag → `$JX_DOCS_ROOT` → `$JX_PM_DOCS_ROOT` → `docs/`. Without the explicit flag, a leftover env var from a different project can make the dry run pass against the wrong feature folder, turning the safety check into a false-confidence check.

## Recommendation

All onboarding and quick-reference pages that include a dry-run verification step should use the explicit form: `/jx-pm:ado --dry-run --docs-root docs`.

## Source

Adversarial review finding (2026-05-18) during plan review of the ADO MCP Installation idea promotion.

## Related

- [[ADO State Sync Model]]
- [[Configurable Default Chain]]
- [[Tenant Binding]]
- [[MCP Tool Surface Alignment Gate]]
