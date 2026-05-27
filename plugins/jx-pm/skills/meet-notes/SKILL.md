---
name: meet-notes
user-invocable: true
argument-hint: "[--date YYYY-MM-DD] [--from-prep]"
description: >
  Capture meeting notes incrementally during a meeting. Creates a structured
  document with attendees, agenda, discussion points, decisions, and action items.
  Triggers on: "meeting notes", "take meeting notes", "capture notes",
  "start meeting notes", /jx-pm:meet-notes.
  Do not trigger for: meeting preparation (use jx-pm:meet-pre), email
  distribution (use jx-pm:meet-email), PRD generation, ADO sync.
---

<!-- markdownlint-disable MD013 -->

# Meeting Notes

Capture meeting notes incrementally during a meeting. Produces a structured Markdown document with attendees, agenda, discussion topics, decisions, and action items.

Do not use for:

- Generating meeting preparation from Azure Boards (use `jx-pm:meet-pre`)
- Distributing meeting content via email (use `jx-pm:meet-email`)
- PRD generation, ADO sync, or wiki operations

## Authority and precedence

This skill owns:

- Meeting note capture and incremental note routing
- Structured document generation following the reference template
- Draft lifecycle (create, persist, finalize, cleanup)

Defers to:

- `jx-pm:meet-pre` for preparation data (agenda import via `--from-prep`)
- v1 does not modify or interact with `jx-pm:meet-email`

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--date` | No | Today | `YYYY-MM-DD` for the meeting date |
| `--from-prep` | No | false | Import agenda from today's meet-pre output |

## Reference template

The canonical document structure lives at `references/template.md` within this skill directory. Read this template at initialization and use it as the structural contract for every document produced.

**Required header fields** (every document must have):
- `# Meeting Notes — {YYYY-MM-DD}` (H1 title)
- `**Meeting Date:**` field
- `**Attendees:**` field
- `**Generated:**` field

**Optional header field:**
- `**Iteration:**` (present only when `--from-prep` used and prep file has iteration info)

**Required sections** (must appear as H2 headings in this order):
1. `## Agenda`
2. `## Discussion` (with H3 sub-topics)
3. `## Decisions` (table with columns: #, Decision, Context)
4. `## Action Items` (table with columns: #, Action, Owner, Due, Status)
5. `## Related`

**Section rules:**
- Empty sections use `(none)` placeholder — sections are never omitted
- Decisions table: every row must have all 3 columns populated
- Action Items table: Owner defaults to `TBD` if not specified; Due defaults to `TBD`; Status always `Open` on creation

## Required workflow

### Phase 1 — Initialize and write draft

1. Determine meeting date (today or `--date`)
2. If `--from-prep`: find latest `wiki/raw/meeting_preparation/YYYY-MM-DD.md` using suffix-aware sorting (same logic as meet-email Step 2). Import:
   - Iteration name and dates
   - Action items as agenda topics
   - Work item IDs discussed
3. If no `--from-prep` or no prep file exists: start with blank template
4. Ask user for attendees (comma-separated names)
5. **Ensure output directory exists**: `mkdir -p wiki/raw/meeting_notes`
6. Resolve **draft** path: `wiki/raw/meeting_notes/.draft-YYYY-MM-DD-{HHmmss}-{random4}.md`
   - Glob for existing `.draft-*` files with same date+time prefix — if collision, generate a new random suffix
7. Read `references/template.md`, fill in header fields (date, attendees, iteration if from-prep, timestamp), populate agenda from prep or leave as `(none)`
8. **Write the initial draft to disk immediately.** The `.draft-` prefix signals in-progress.

### Phase 2 — Capture notes (interactive loop with incremental persistence)

Enter an incremental capture loop. The user provides notes one at a time. For each input:

- If input starts with `DECISION:` or `Decision:` → route to Decisions section. Add a row to the Decisions table with the decision text and the current topic as context.
- If input starts with `ACTION:` or `Action:` → route to Action Items section. Parse assignee if provided (e.g., `ACTION @ramon: fix the build` → Owner: ramon). Owner defaults to `TBD`. Due defaults to `TBD`. Status: `Open`.
- If input starts with `TOPIC:` or `Topic:` → start a new discussion topic. Add an H3 heading under Discussion.
- If input is `done`, `end`, or `finish` → exit the loop, proceed to Phase 3
- Otherwise → append to current topic's discussion notes under Discussion

**After each input, re-write the full document to the same draft file path.** This ensures no captured content is lost if the session is interrupted. The file on disk always reflects the latest state.

Display a brief confirmation after each note:
- `[noted]` — general discussion note
- `[decision recorded]` — routed to Decisions table
- `[action item added: @{owner}]` — routed to Action Items table
- `[new topic: {title}]` — new H3 under Discussion

### Phase 3 — Review and finalize

Display the full structured document to the user. Ask:
> "Review the meeting notes. You can edit, add, or remove entries. Type 'save' when ready."

Allow corrections. After each correction, re-write the document to the draft file.

### Phase 4 — Finalize document

Rename the draft to its final path:
- Final path: `wiki/raw/meeting_notes/YYYY-MM-DD.md`
- If a finalized file for that date already exists, append suffix: `YYYY-MM-DD-2.md`, etc.
- Rename via: `mv wiki/raw/meeting_notes/.draft-... wiki/raw/meeting_notes/YYYY-MM-DD.md`

**Empty meeting handling:** If the user typed `done` with zero notes captured (no topics, decisions, or action items added beyond initialization):
- Ask: "No notes captured. Save empty document?"
- If confirmed: finalize as normal
- If declined: **delete the draft file** (`rm wiki/raw/meeting_notes/.draft-...`) and exit cleanly — no artifact left behind

### Phase 5 — Validate and grade

After the final write, validate the document against the reference template:

| Check | Pass | Fail |
|-------|------|------|
| H1 title matches `# Meeting Notes — YYYY-MM-DD` | Title present with valid date | Missing or malformed |
| All 4 required header fields present | All found | Any missing |
| All 5 required H2 sections present in order | All found | Any missing or out of order |
| Decisions table has 3 columns (if non-empty) | Columns match | Wrong column count or names |
| Action Items table has 5 columns (if non-empty) | Columns match | Wrong column count or names |
| Empty sections use `(none)` not blank | Placeholder present | Section heading with no content |

**Grading:**
- **A** — all checks pass
- **B** — 1-2 minor failures (e.g., missing placeholder for empty section)
- **C** — structural failures (missing required section, wrong table columns)
- **F** — document is unrecoverable (missing H1, no sections)

Display the grade: `[grade: A]` or `[grade: B — missing (none) in Decisions]`

If grade is C or F, warn the user before confirming.

### Phase 6 — Summary

Display to user:

```text
Meeting notes written to: wiki/raw/meeting_notes/{filename}
Topics discussed: {count}
Decisions recorded: {count}
Action items captured: {count}
Grade: {A/B/C/F}
```

### Phase 7 — Create ADO work items from action items (deferred to v2)

Deferred to v2. Would use `mcp__azure-devops__wit_create_work_item` to create Tasks from action items. Requires ADO tenant resolution (same as meet-pre Phase 1).

## Failure behavior

| Condition | Response |
|-----------|----------|
| `--from-prep` but no prep file found | Warn and continue with blank template |
| Empty notes, user declines save | Delete draft file, exit cleanly |
| Write fails | Report error with path; draft file remains for manual recovery |
| Session interrupted during capture | Draft file on disk contains all notes captured up to last input |

## Completion checklist

1. Meeting date resolved (today or `--date`)
2. Attendees collected from user
3. Output directory created if missing
4. Draft file written immediately at initialization
5. Each note persisted to draft after capture
6. Prefix routing applied correctly (DECISION/ACTION/TOPIC)
7. Action item owner parsed from `@name` syntax
8. Review presented to user before finalize
9. Draft renamed to final path (or deleted if empty + declined)
10. Document validated against reference template
11. Grade displayed (A/B/C/F)
12. Summary report printed
