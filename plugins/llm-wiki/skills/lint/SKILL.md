---
name: lint
user-invocable: true
argument-hint: "[wiki_path]"
description: >
  Health-check the LLM Wiki. Finds orphan pages, broken wikilinks, missing
  cross-references, stale claims, contradictions, frontmatter issues, index
  drift, and stale ideas. Triggers on: "lint wiki", "check wiki health",
  "wiki health check", "audit knowledge base", /llm-wiki:lint. Do not trigger
  for ingesting, querying, triaging, or initializing.
---

# Lint the Wiki

Run structural and content quality checks. Generate a health report with actionable findings.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `wiki_path` | No | `wiki/` | Wiki directory. Must contain `_schema.md` |

## Phase 1: Structural Checks (Automated via Script)

Run these commands and collect results:

### Orphan Pages
```
wiki-tools.py orphans <wiki_path>
```
Returns pages with zero inbound `[[wikilinks]]`. These are disconnected from the knowledge graph.

### Broken Links
```
wiki-tools.py broken-links <wiki_path>
```
Returns `[[wikilinks]]` that point to non-existent pages. These are dead references.

### Frontmatter Validation
```
wiki-tools.py frontmatter-check <wiki_path>
```
Returns pages with missing or malformed YAML frontmatter fields (required: title, type, tags, created, updated).

### Page Census
```
wiki-tools.py page-list <wiki_path>
```
Returns all pages on disk for comparison with index.

## Phase 2: Index Drift

Compare `_index.md` entries against actual files on disk:

1. **Pages on disk but missing from index** — files exist in taxonomy directories but have no entry in `_index.md`.
2. **Pages in index but missing from disk** — `_index.md` references pages that don't exist as files.
3. **Stale summaries** — read each page and check if the one-line summary in the index still accurately reflects the page content. Flag obviously outdated summaries.

## Phase 3: Content Quality Checks (LLM-Driven)

Read wiki pages (all for small wikis, sample for >50 pages) and check:

### Unresolved Conflicts
Pages with `> [!conflict]` callout blocks that haven't been resolved. Count and list them.

### Stale Pages
Pages with `updated` date older than 90 days. These may contain outdated information. List with last-updated date.

### Stale Ideas
Pages in `ideas/` with `status: raw` and `created` date older than 14 days. These need triage attention.

### Missing Cross-References
Entity or concept names mentioned in prose text without `[[wikilinks]]`. The name must match an existing page title exactly (case-sensitive).

### Thin Pages
Pages with fewer than 3 sentences of substantive content (excluding frontmatter, headers, and the Sources section).

### Duplicate Coverage
Multiple pages covering the same entity or concept, detected by:
- Very similar titles (e.g., "Machine Learning" and "ML" without alias linking)
- Overlapping content that should be merged

## Phase 4: Generate Report

Organize findings by severity:

```markdown
## Wiki Lint Report — <today's date>

### Errors (must fix)
- **Broken link**: [[Nonexistent Page]] referenced from [[Machine Learning]]
- **Missing from index**: entities/Acme Corporation.md not listed in _index.md
- **Missing frontmatter**: entities/Quick Note.md missing fields: type, tags

### Warnings (should fix)
- **Orphan page**: [[Stale Draft]] has zero inbound links
- **Unresolved conflict**: [[Acme Corporation]] has 1 unresolved [!conflict] block
- **Thin page**: [[Quick Note]] has only 1 sentence
- **Stale idea**: [[Old Idea]] raw for 21 days, needs triage

### Info
- **Stale page**: [[Old Topic]] last updated 120 days ago
- **Missing wikilink**: "transformer" mentioned in [[AI Research]] without [[wikilink]]
- **Duplicate candidate**: [[ML]] and [[Machine Learning]] may cover same concept

### Summary
- Total pages: <n>
- Errors: <n>
- Warnings: <n>
- Info: <n>
- Health score: <0-100>
```

### Health Score Calculation
- Start at 100
- Each error: -10
- Each warning: -5
- Each info: -1
- Floor at 0

## Phase 5: Offer Auto-Fix

For certain issues, offer to fix automatically:

| Issue | Auto-fix |
|-------|----------|
| Missing index entries | "Add these pages to `_index.md`?" |
| Missing wikilinks in prose | "Add `[[wikilinks]]` to these mentions?" |
| Orphan pages | "These pages have no inbound links. Delete, merge, or add references?" |
| Pages in index but not on disk | "Remove these stale entries from `_index.md`?" |

Only execute fixes the user explicitly confirms. Never auto-fix without asking.

## Phase 6: Append to `_log.md`

```markdown
## <date and time> — Lint

- **Operation**: lint
- **Errors found**: <n>
- **Warnings found**: <n>
- **Info found**: <n>
- **Auto-fixes applied**: <n> (<description>)
- **Health score**: <n>/100
- **Outcome**: Report generated
```
