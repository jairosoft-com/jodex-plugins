---
name: query
user-invocable: true
argument-hint: <question> [wiki_path]
description: >
  Query the LLM Wiki to answer questions with citations. Searches the index,
  reads relevant pages, synthesizes an answer citing wiki pages and raw sources.
  Triggers on: "ask the wiki", "search wiki", "what does the wiki say about",
  "query knowledge base", /llm-wiki:query, or any question directed at the wiki.
  Do not trigger for ingesting, linting, triaging, or initializing.
---

# Query the Wiki

Search index, read relevant pages, synthesize answer with citations. Optionally file answer back as a new wiki page.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `question` | Yes | — | Natural language question |
| `wiki_path` | No | `wiki/` | Wiki directory. Must contain `_schema.md` |

## Phase 1: Load Context

1. Validate wiki exists (check for `_schema.md`).
2. Read `_schema.md` for configuration and taxonomy structure.
3. Read `_index.md` to get the full page catalog with summaries and tags.

If wiki is empty (page_count: 0): "Wiki is empty. Ingest some sources first with `/llm-wiki:ingest`."

## Phase 2: Find Relevant Pages

Parse the user's question. Identify relevant pages through:

1. **Keyword matching** — scan `_index.md` for page names and one-line summaries that match question keywords.
2. **Link graph traversal** — run `wiki-tools.py wikilinks <wiki_path>` to get the link graph. From seed pages (keyword matches), follow outbound links one hop to find related pages.
3. **Tag matching** — if the question maps to known tags in the index, include pages with those tags.

Produce a ranked list of pages to read:
- Typical questions: read 3-8 pages
- Broad questions: read up to 15 pages
- Cap at 15 pages to stay within context limits

If no relevant pages found: "No wiki pages match this question. Try a different query or ingest more sources."

## Phase 3: Read and Synthesize

Read each relevant page in full. Synthesize an answer that:

1. **Directly addresses the question** — lead with the answer, not background.
2. **Cites every factual claim** with `[[Page Name]]` wiki links.
3. **Surfaces conflicts** — if any consulted page has `[!conflict]` callouts, present both sides with their respective sources.
4. **Identifies gaps** — note where the wiki lacks enough information to answer fully. Suggest what sources might fill the gap.
5. **Uses Obsidian-compatible formatting** — wikilinks, callouts, markdown.

### Answer Format

```markdown
## Answer

<Direct answer to the question with [[citations]]>

### Details

<Supporting information organized by relevance>

### Conflicts

<Any unresolved contradictions found, if applicable>

### Gaps

<What the wiki doesn't cover that would help answer this better>

### Pages Consulted
- [[Page 1]]
- [[Page 2]]
- [[Page 3]]
```

## Phase 4: Offer to File Answer

If the synthesized answer introduces a genuinely new perspective, useful aggregation, or cross-cutting analysis that doesn't already exist as a wiki page, offer to save it:

"Would you like to save this answer as a wiki page? Suggested title: `[[<Title>]]`. Which bucket? (topics/concepts/other)"

If user accepts:
1. Create the page in the chosen taxonomy directory with proper frontmatter.
2. Set `source_count` to 0 (this page is derived from other wiki pages, not raw sources).
3. Add `[[wikilinks]]` to all referenced pages.
4. Add a `## Derived From` section instead of `## Sources`:
   ```markdown
   ## Derived From
   - [[Page 1]]
   - [[Page 2]]
   ```
5. Update `_index.md` with the new entry.

If user declines, no writes. Clean exit.

## Phase 5: Append to `_log.md`

```markdown
## <date and time> — Query

- **Operation**: query
- **Question**: "<the user's question>"
- **Pages consulted**: <list>
- **Answer filed**: No (or: Yes, as [[Page Title]])
- **Outcome**: Answered with <n> citations
```
