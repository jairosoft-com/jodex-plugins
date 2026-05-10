---
name: triage
user-invocable: true
argument-hint: "[wiki_path]"
description: >
  Triage raw ideas in the LLM Wiki. Reviews ideas with status: raw, presents
  each to the user for classification: promote to a taxonomy bucket, add to
  backlog for execution, or archive with reason. Triggers on: "triage ideas",
  "review ideas", "classify ideas", "process inbox", /jx-kb:triage, or any
  request to review/classify/promote raw wiki ideas. Do not trigger for
  ingesting, querying, linting, or initializing.
---

# Triage Raw Ideas

Review ideas in `ideas/` with `status: raw`. For each, user decides: promote, backlog, or archive.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `wiki_path` | No | `wiki/` | Wiki directory. Must contain `_schema.md` |

## Phase 1: Load Ideas

1. Validate wiki exists (check for `_schema.md`). Read schema for taxonomy rules.
2. Scan `ideas/` directory for all `.md` files.
3. Read each file's frontmatter. Filter to pages with `status: raw`.
4. If no raw ideas found: "No raw ideas to triage. All ideas have been processed."
5. Read `_backlog.md` for context on existing priorities.
6. Read `_index.md` for awareness of existing wiki content (avoid promoting duplicates).

## Phase 2: Present for Triage

For each raw idea, present:

```
### [[Idea Title]]

**Summary**: <one-line summary from the page content>
**Source**: <from ## Sources section>
**Tags**: <from frontmatter>
**Created**: <date>

Key claims:
- <claim 1>
- <claim 2>

---
Action? [Promote / Backlog / Archive / Skip]
```

For each idea, ask user to choose:

### Promote
Move to appropriate taxonomy bucket. Ask user which bucket:
- concepts/ — abstract principles, patterns
- entities/ — named things
- topics/ — broader subject areas
- plugins/ — plugin specs
- platforms/ — platform docs
- projects/ — project pages
- decisions/ — ADRs
- code/ — source code docs

### Backlog
Add to `_backlog.md` for future execution. Ask user for priority:
- P0 — Critical
- P1 — High
- P2 — Medium
- P3 — Low

### Archive
Mark as archived. Ask for reason (e.g., "duplicate of [[Existing Page]]", "not relevant", "too vague").

### Skip
Leave as `status: raw` for now. Move to next idea.

Process all raw ideas before executing changes. Collect all decisions first.

## Phase 3: Execute Decisions

For each decision:

### Promoting an Idea

1. Read the idea page content from `ideas/<Title>.md`.
2. Create new page in target bucket (e.g., `concepts/<Title>.md`).
   - Update frontmatter: change `type` to target type, set `status: promoted`, set `promoted_to: <target_path>`.
   - Remove idea-specific fields that don't apply to the target type.
   - Preserve all content, wikilinks, and sources.
3. Update the original idea page in `ideas/`:
   - Set `status: promoted`
   - Set `promoted_to: <relative path to new page>`
   - Keep the file (don't delete — it serves as a redirect/audit trail)
4. Update all pages that link to `[[Idea Title]]` — the wikilink still resolves since the idea file remains.

### Backlogging an Idea

1. Update the idea page frontmatter: set `status: backlogged`.
2. Add entry to `_backlog.md` under the appropriate priority section:
   ```
   - [[Idea Title]] — <one-line summary> (#tag1, #tag2) — from [[Source - <name>]]
   ```
3. Re-sort entries within the priority section alphabetically.

### Archiving an Idea

1. Update the idea page frontmatter:
   - Set `status: archived`
   - Set `archive_reason: "<user's reason>"`
2. Keep the file in `ideas/` (don't delete — preserves audit trail).

## Phase 4: Update `_index.md`

For promoted ideas:
- Remove entry from Ideas section
- Add entry to target taxonomy section

For archived/backlogged ideas:
- Update the one-line summary in Ideas section to reflect status

Re-sort entries alphabetically within each section. Update `page_count` and `updated` date.

## Phase 5: Update `_backlog.md`

If any ideas were backlogged:
- Add entries to appropriate priority sections
- Re-sort within each section
- Update `updated` date in frontmatter

## Phase 6: Append to `_log.md`

```markdown
## <date and time> — Triage

- **Operation**: triage
- **Ideas reviewed**: <total count>
- **Promoted**: <count> (<list with target buckets>)
- **Backlogged**: <count> (<list with priorities>)
- **Archived**: <count> (<list with reasons>)
- **Skipped**: <count>
- **Outcome**: Success
```

## Report

Print structured summary:

```
## Triage Complete

### Promoted
- [[Concept Name]] → concepts/ (was idea)
- [[Entity Name]] → entities/ (was idea)

### Backlogged
- [[Idea Title]] → P1 (High)

### Archived
- [[Old Idea]] — reason: duplicate of [[Existing Page]]

### Remaining
- <n> raw ideas still in inbox
```
