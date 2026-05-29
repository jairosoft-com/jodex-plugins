---
title: ADO WIQL CONTAINS Is Substring Not Exact Tag
type: idea
tags: [ado, wiql, testing, cleanup, query]
created: 2026-05-22
updated: 2026-05-28
source_count: 0
provenance: session-observation
status: completed
---

# ADO WIQL CONTAINS Is Substring Not Exact Tag

In Azure DevOps WIQL, `[System.Tags] CONTAINS 'prd:FEAT-9'` performs a **substring match** on the full tags field string — it matches any item whose tags contain that substring.

This means `CONTAINS 'prd:FEAT-9'` matches items tagged `prd:FEAT-910`, `prd:FEAT-999`, etc. — useful for fixture-range cleanup queries without enumerating every ID.

**Anti-pattern:** filtering by ADO work item ID range (e.g., `[System.Id] >= 901 AND [System.Id] <= 999`) does not work for fixture cleanup because ADO assigns system IDs in the 100k–200k range — unrelated to PRD feature numbers.
