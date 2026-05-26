---
name: insights
user-invocable: true
argument-hint: "[--label <session-label>] [wiki_path]"
description: >
  Extract insights from the current conversation session and file worthy ones
  to the wiki. Reviews session for new patterns, decisions, connections, facts,
  and ideas. Deduplicates against existing wiki content, presents candidates
  individually for user approval, then files approved items with proper
  provenance tracking.
  Triggers on: "insights", "session insights", "file session insights",
  "what did we learn", /jx-kb:insights.
  Do not trigger for: document ingestion, wiki queries, triage, lint.
---

# Session Insights

Extract insights from the current conversation and file worthy ones to the wiki.

Unlike `/jx-kb:ingest` (which processes a static source document), this skill
treats the conversation itself as the source. No file fingerprinting or snapshot
is needed — the log entry records the session label instead.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--label` | No | — | Short label for the log entry (e.g., "meet-notes scaffolding"). Prompted if not provided. |
| `wiki_path` | No | `wiki/` | Wiki directory. Must contain `_schema.md` |

## Phase 1: Validate Wiki & Load Context

1. Check wiki exists — look for `_schema.md` at `wiki_path`. If not found: "Wiki not found. Run `/jx-kb:init` first."
2. Read `_schema.md` to load taxonomy rules and custom routing.
3. Read `_index.md` to get full page catalog (needed for dedup in Phase 3).
4. Read the last 50 lines of `_log.md` for recent operations context (newest entries are at the top, but reading the tail ensures coverage after many runs).

## Phase 2: Extract Session Insights

Review the current conversation for knowledge candidates. Extract items that represent:

- **New patterns** — recurring structures or approaches observed during the session
- **Decisions** — choices made and their rationale
- **Connections** — links between previously unrelated concepts
- **Facts** — concrete claims or observations worth preserving
- **Ideas** — speculative or half-formed thoughts worth capturing

For each candidate, produce:
- **Title**: Descriptive page title (Title Case With Spaces)
- **Summary**: One-line description
- **Type**: Proposed taxonomy type (idea, concept, entity, topic, etc.)
- **Tags**: 2-4 relevant tags
- **Key claims**: 1-3 bullet points of substance

### Classification Rules

- Well-defined patterns or principles → `concepts/`
- Speculative, ambiguous, or half-formed → `ideas/` with `status: raw`
- Named things (tools, people, products) → `entities/`
- Broader themes → `topics/`
- When uncertain → `ideas/` (tiebreaker rule from schema)

If no insights found: "This session has no new insights worth filing. The conversation may have been too short or covered already-documented ground."

## Phase 3: Deduplicate

For each candidate from Phase 2:

1. Search `_index.md` for existing pages with similar titles or overlapping topics.
2. For potential matches, grep wiki content for deeper verification:
   ```bash
   grep -rl "<candidate title or key term>" <wiki_path>/ --include="*.md" | grep -v "raw/"
   ```
3. If a near-match exists, classify as:
   - **UPDATE** — the candidate adds genuinely new claims to an existing page
   - **SKIP** — the existing page already covers this adequately
4. If no match: classify as **NEW**.

Drop all SKIP candidates. Proceed with NEW and UPDATE items only.

If all candidates are SKIPs: "All session insights are already covered in the wiki. Nothing to file."

## Phase 4: Present & Confirm

Present each surviving candidate **one at a time** (not as a batch). For each:

```
### <Title>

**Action**: NEW | UPDATE <existing page>
**Type**: <taxonomy type>
**Tags**: <tag list>

Key claims:
- <claim 1>
- <claim 2>

File this insight? [File / Modify / Skip]
```

For **Modify**: let the user adjust title, type, tags, or claims before filing.

Collect all decisions. Do not write any files until all candidates are reviewed.

After all candidates are presented, show a summary table:

```
| # | Title | Action | Type |
|---|-------|--------|------|
| 1 | ... | NEW | idea |
| 2 | ... | UPDATE | concept |
```

Ask: "Proceed with filing these? (yes/no)"

Do not write until user confirms.

## Phase 5: File to Wiki

For each approved candidate:

### Creating a New Page

Write file in the appropriate taxonomy directory.

Include YAML frontmatter:
```yaml
---
title: <Title>
type: <type>
tags: [tag1, tag2]
created: <today's date>
updated: <today's date>
source_count: 0
aliases: []
provenance: synthesis
---
```

For idea pages, add: `status: raw`

Write brief, structured content:
- One paragraph of context (2-4 sentences max)
- Key claims as bullet points
- `[[wikilinks]]` for every cross-reference to other wiki pages

End every page with:
```markdown
## Sources
- Session: <label> (<date>)
```

Use `Session: <label> (<date>)` as the source line since there is no raw source
document. This keeps the `## Sources` section required by the wiki schema and
ensures compatibility with `/jx-kb:triage` which reads provenance from that section.

### Updating an Existing Page

1. Read current page content.
2. Integrate new claims, preserving existing content.
3. If new info contradicts existing claims, add a conflict callout.
4. Update `updated` date in frontmatter.
5. Add `- Session: <label> (<date>)` to the page's `## Sources` section.

**Content brevity**: Keep idea pages to 5-10 lines of body content. Concepts can be longer but should not exceed what the session evidence supports.

## Phase 5b: Cross-Reference Pass

For each newly created page, check if existing wiki pages mention its title in
prose without a `[[wikilink]]`. Use grep:
```bash
grep -rl "<new page title>" <wiki_path>/ --include="*.md" | grep -v "_index.md" | grep -v "_log.md" | grep -v "raw/"
```

Exclude `raw/` snapshots — these are immutable provenance files and must not be
edited. If matches are found in maintained pages, read those pages and add the
missing `[[wikilinks]]` where the name appears naturally. This ensures
bidirectional linking.

## Phase 6: Update `_index.md`

For each new page, add entry in the correct taxonomy section:
```markdown
- [[Page Name]] — One-line summary (#tag1, #tag2) [status if idea]
```

For updated pages, revise the one-line summary if the update meaningfully changed the page's scope.

Re-sort entries alphabetically within each section. Update `page_count` and `updated` date in frontmatter.

## Phase 7: Append to `_log.md`

```markdown
## <date and time> — Session Insights: <label>

- **Operation**: insights
- **Label**: <session label>
- **Pages created**: <list with types>
- **Pages updated**: <list>
- **Ideas extracted**: <count>
- **Conflicts flagged**: <count>
- **Cross-references added**: <count>
- **Outcome**: Success
```

## Phase 8: Report

```
## Session Insights Filed

### Label
<session label>

### Pages Created
- [[Page Name]] (type)
- [[Idea Name]] (idea — needs triage)

### Pages Updated
- [[Existing Page]] — added new claims

### Stats
- Insights reviewed: <total candidates>
- Filed: <n>
- Skipped (already covered): <n>
- Cross-references added: <n>
```
