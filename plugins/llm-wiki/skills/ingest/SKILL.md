---
name: ingest
user-invocable: true
argument-hint: <source_path> [wiki_path]
description: >
  Ingest a source document into the LLM Wiki. Reads the raw source, extracts
  entities, concepts, ideas, and other knowledge, creates or updates wiki pages,
  resolves cross-references, updates index and log. Triggers on: "ingest this
  document", "add to wiki", "process this source", "ingest into knowledge base",
  /llm-wiki:ingest, or any request to add/ingest/import a document into the wiki.
  Do not trigger for querying, linting, triaging, or initializing.
---

# Ingest Source Document

Read a source, extract knowledge across all taxonomy types, create/update wiki pages with cross-references.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `source_path` | Yes | — | Path to source file. Must be within project root |
| `wiki_path` | No | `wiki/` | Wiki directory. Must contain `_schema.md` |

## Phase 1: Validate & Fingerprint

**No files are copied or written in this phase.**

1. Check wiki exists — look for `_schema.md` at `wiki_path`. If not found: "Wiki not found. Run `/llm-wiki:init` first."
2. Read `_schema.md` to load wiki configuration and taxonomy rules.
3. Locate source file. Must be within project root (per path safety contract).
4. Run `wiki-tools.py fingerprint <source_path>` to get SHA-256 hash + size.
5. Read `_log.md` and search for matching SHA-256 hash in prior ingest entries.
   - If match found: warn user. "This source was previously ingested on `<date>`. Re-ingest (updates existing pages) or skip?"
   - Do not proceed until user decides.

## Phase 2: Analyze Source

Read source from its **original location** (read-only). Do not copy yet.

Detect source type by file extension:

### Markdown / Plain Text (`.md`, `.txt`, `.text`)
Full content extraction. Extract:
- Named entities (people, organizations, products, places, dates)
- Abstract concepts and principles
- Broader topics/themes
- Raw ideas (speculative, ambiguous, or half-formed thoughts)
- Plugin references or design implications
- Platform-specific notes
- Project context (goals, timelines, status)
- Decision implications or trade-offs
- Key claims and facts with their context
- Contradictions or ambiguities within the source

### Source Code Files (`.py`, `.ts`, `.js`, `.sh`, `.go`, `.rs`, `.java`, etc.)
Treat as text. Extract:
- Module purpose and responsibility
- Public exports, functions, classes, and their signatures
- Key patterns and idioms used
- Dependencies and imports
- API surface (endpoints, commands, interfaces)
- Architecture notes (how this module fits in the larger system)

### Unsupported Formats
For PDF, DOCX, images, HTML, and other binary formats: stop with clear message.
"This source format is not directly supported. Please convert to markdown or plain text first."

## Phase 3: Plan Wiki Updates

Present planned changes as a table. **Wait for user confirmation before any writes.**

```
| Action | Page | Type | Directory | Reason |
|--------|------|------|-----------|--------|
| CREATE | [[Acme Corporation]] | entity | entities/ | New entity, primary subject |
| UPDATE | [[Machine Learning]] | concept | concepts/ | New claims from this source |
| CREATE | [[Plugin Hot-Reload]] | idea | ideas/ | Raw idea, needs triage |
| CREATE | [[Source - Paper Title]] | source | sources/ | Source summary page |
```

**Classification rules:**
- Clear, well-defined knowledge → route directly to appropriate taxonomy bucket
- Raw, ambiguous, or speculative → route to `ideas/` with `status: raw`
- When uncertain which bucket → route to `ideas/` (tiebreaker rule from schema)

Ask: "Proceed with these changes? You can add, remove, or modify entries."
Do not proceed until user confirms.

## Phase 4: Snapshot Source

After user confirms, run:
```
wiki-tools.py snapshot <source_path> <wiki_path>
```

This copies the source into `wiki/raw/sources/<sha256_prefix>-<filename>`.
Record the returned `dest` path and `sha256` for the log entry.

If user cancelled at Phase 3, nothing was written. Clean exit.

## Phase 5: Create/Update Pages

For each planned change:

### Creating a New Page

Write file in the appropriate taxonomy directory (e.g., `entities/Acme Corporation.md`).

Include YAML frontmatter:
```yaml
---
title: Acme Corporation
type: entity
tags: [company, tech]
created: <today's date>
updated: <today's date>
source_count: 1
aliases: [Acme, Acme Corp]
---
```

For idea pages, add lifecycle fields:
```yaml
status: raw
```

Write structured content with sections appropriate to the type.
Add `[[wikilinks]]` for every cross-reference to other wiki pages (existing or planned in this batch).

End every page with:
```markdown
## Sources
- [[Source - <Document Title>]]
```

### Updating an Existing Page

1. Read current page content.
2. Integrate new information, preserving existing content.
3. **Contradiction handling**: if new info contradicts existing claims, add a conflict callout:
   ```markdown
   > [!conflict] <topic>
   > [[Source - Article A]] claims X.
   > [[Source - Article B]] claims Y.
   > Needs resolution.
   ```
   Never silently overwrite existing claims.
4. Update `updated` date in frontmatter.
5. Increment `source_count`.
6. Add new source to `## Sources` section.

### Source Summary Page

Create in `sources/`:
- File: `Source - <Sanitized Title>.md`
- Frontmatter: title, type: source, tags, created, raw_path (snapshot path)
- Content: structured summary — title, author (if identifiable), date, key topics covered, entity/concept count extracted

## Phase 6: Cross-Reference Pass

Run `wiki-tools.py backlinks <wiki_path>` to get the full link graph.

For each newly created page, check if other existing pages mention its title in prose without a `[[wikilink]]`. If so, read those pages and add the missing wikilinks where the name appears naturally.

This ensures bidirectional linking across the wiki.

## Phase 7: Update `_index.md`

Read current index. For each new or updated page, ensure it appears in the correct taxonomy section:

```markdown
- [[Page Name]] — One-line summary (#tag1, #tag2)
```

- Re-sort entries alphabetically within each section.
- Update `page_count` and `updated` date in frontmatter.
- Replace `_No <type> yet._` placeholders when first entry is added.

## Phase 8: Append to `_log.md`

```markdown
## <date and time> — Ingest

- **Operation**: ingest
- **Source**: <original source path>
- **Snapshot**: <wiki/raw/sources/sha256prefix-filename>
- **SHA-256**: <full hash>
- **Pages created**: <list>
- **Pages updated**: <list>
- **Ideas extracted**: <count>
- **Conflicts flagged**: <count>
- **Cross-references added**: <count>
- **Outcome**: Success
```

## Phase 9: Report

Print structured summary:

```
## Ingest Complete

📄 Source: <filename>
🔗 Snapshot: <wiki/raw/sources/...>

### Pages Created
- [[Entity Name]] (entity)
- [[Concept Name]] (concept)
- [[Raw Idea]] (idea — needs triage)
- [[Source - Title]] (source)

### Pages Updated
- [[Existing Page]] — added new claims from this source

### Stats
- Conflicts flagged: <n>
- Cross-references added: <n>
- Ideas needing triage: <n>
- Total wiki pages: <n>
```

## Error Handling

- **Wiki not initialized**: Direct user to run `/llm-wiki:init`
- **Source not found**: "File not found at `<path>`. Check the path and try again."
- **Source outside project root**: "Path escapes project root. Source must be within the project directory."
- **Unsupported format**: List supported extensions, suggest conversion
- **Duplicate source**: Show previous ingest date, ask re-ingest or skip
