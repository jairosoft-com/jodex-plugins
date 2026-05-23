---
title: ADO Work Item IDs Are Not PRD Feature IDs
type: idea
tags: [ado, testing, fixtures, cleanup, jx-pm]
created: 2026-05-22
source_count: 0
provenance: session-observation
status: raw
---

# ADO Work Item IDs Are Not PRD Feature IDs

PRD Feature IDs (e.g., 910) are app-level identifiers assigned in the PRD. ADO assigns separate system work item IDs in the 100k–200k range when items are created.

**Implication for test isolation:** fixture cleanup cannot filter by `[System.Id] >= 901 AND [System.Id] <= 999` — those IDs will never match. Use tag-based queries instead:

```
[System.Tags] CONTAINS 'prd:FEAT-9' OR [System.Tags] CONTAINS 'prd:US-9'
```

Also, `queryByTag` for no-duplicate assertions must exclude `Removed` state items (`[System.State] <> 'Removed'`), otherwise patches from previous runs show up as false duplicates.
