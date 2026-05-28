---
name: Wiki lint fixes pending
description: Post-plugin-split wiki health score 78/100 — 5 errors + 5 warnings need fixing in separate session
type: project
originSessionId: 3c6f1d9d-4fd9-480f-b61c-b80878c2c63d
---
Wiki lint ran 2026-05-09 after jx-pm split into jx-pm + jx-dev + jx-core. Health score: 78/100.

**Why:** Plugin split moved/deleted files that wiki source pages still reference. Plus index drift from new ideas.

**How to apply:** Run jx-kb:lint, then fix findings in priority order:

- E1: 9 source pages reference deleted jx-pm files (tombstone or update paths)
- E2: 2 new ideas missing from _index.md, page_count stale
- E3: 3 invalid frontmatter values
- E4: 2 idea pages missing frontmatter
- E5: Split Tech Spec status conflict (now completed)
- W1: 1 orphan page
- W2: stale watchlist
- W3: 65 source pages missing source_count + aliases
- W4: 1 broken wikilink
- W5: page_count drift
