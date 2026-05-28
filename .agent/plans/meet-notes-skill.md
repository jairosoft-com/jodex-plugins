# Plan: `meet-notes` Skill for jx-pm Plugin

## Context

The jx-pm plugin has a meeting workflow with two skills: `meet-pre` (before the meeting — generates preparation from ADO) and `meet-email` (after the meeting — distributes via email). The missing middle piece is `meet-notes`: capturing what happens DURING the meeting — decisions, action items, discussion notes.

A scaffold stub already exists at `plugins/jx-pm/skills/meet-notes/SKILL.md` (from `jx-skill:create`) with placeholder phases and no implementation. This plan defines what the skill should do.

---

## Role in the Meeting Pipeline

```
/jx-pm:meet-pre    → BEFORE: generates preparation doc from ADO
/jx-pm:meet-notes  → DURING: captures notes, decisions, action items
/jx-pm:meet-email  → AFTER: distributes preparation via email (notes email: v2)
```

**Scope note:** `meet-email` currently only reads `wiki/raw/meeting_preparation/`. Extending it to also send `meeting_notes/` is a v2 enhancement — not part of this plan.

## Design Principles

1. **Incremental capture** — notes arrive one at a time during the meeting, not as a single dump
2. **Structured output** — the final document has a consistent template (attendees, agenda, notes, decisions, action items)
3. **Link to preparation** — optionally import the meet-pre agenda so notes are anchored to planned topics
4. **Actionable output** — action items are extractable for ADO work item creation
5. **No ADO dependency** — the skill works even without Azure Boards (pure note-taking mode)

---

## Files to Modify

| # | Path | Action |
|---|------|--------|
| 1 | `plugins/jx-pm/skills/meet-notes/SKILL.md` | Rewrite (replace scaffold) |
| 2 | `plugins/jx-pm/skills/meet-notes/references/template.md` | Create (canonical section template) |
| 3 | `plugins/jx-pm/skills/meet-notes/evals/evals.json` | Create (automated structural assertions) |
| 4 | `plugins/jx-pm/commands/meet-notes.md` | Update (fix allowed-tools, description) |
| 5 | `plugins/jx-pm/README.md` | Update (add meet-notes to skills table) |

---

## SKILL.md Structure

### Frontmatter

```yaml
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
```

### Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--date` | No | Today | `YYYY-MM-DD` for the meeting date |
| `--from-prep` | No | false | Import agenda from today's meet-pre output |

### Workflow (6 Phases)

**Phase 1 — Initialize and write draft**

- Determine meeting date (today or `--date`)
- If `--from-prep`: read `wiki/raw/meeting_preparation/YYYY-MM-DD.md` (latest suffix) to import:
  - Iteration name and dates
  - Action items as agenda topics
  - Work item IDs discussed
- If no `--from-prep` or no prep file exists: start with blank template
- Ask user for attendees (comma-separated names)
- **Ensure output directory exists**: the `wiki/raw/meeting_notes/` directory may not exist on a fresh checkout (wiki/raw/ is gitignored). Use Bash to create it if missing: `mkdir -p wiki/raw/meeting_notes`
- Resolve **draft** path: `wiki/raw/meeting_notes/.draft-YYYY-MM-DD-{HHmmss}-{random4}.md` (timestamp + 4-char random suffix for collision resistance). Glob for existing `.draft-*` files with same prefix — if one exists, generate a new random suffix.
- **Write the initial draft to disk immediately** with the header, attendees, imported agenda (if any), and empty sections. This ensures a recoverable document exists from the start. The `.draft-` prefix signals it is in-progress.

**Phase 2 — Capture notes (interactive loop with incremental persistence)**

Enter an incremental capture loop. The user provides notes one at a time. For each input:

- If input starts with `DECISION:` or `Decision:` → route to Decisions section
- If input starts with `ACTION:` or `Action:` → route to Action Items section, parse assignee if provided (e.g., `ACTION @ramon: fix the build`)
- If input starts with `TOPIC:` or `Topic:` → start a new discussion topic
- If input is `done`, `end`, or `finish` → exit the loop, proceed to Phase 3
- Otherwise → append to current topic's discussion notes

**After each input, re-write the full document to the same file path.** This ensures no captured content is lost if the session is interrupted. The file on disk always reflects the latest state.

Display a brief confirmation after each note: `[noted]`, `[decision recorded]`, `[action item added]`, `[new topic: {title}]`

**Phase 3 — Review and finalize**

Display the full structured document to the user. Ask:
> "Review the meeting notes. You can edit, add, or remove entries. Type 'save' when ready."

Allow corrections. After each correction, re-write the document to disk.

**Phase 4 — Finalize document**

Rename the draft to its final path:
- Final path: `wiki/raw/meeting_notes/YYYY-MM-DD.md` (with suffix if a finalized file for that date already exists)
- Rename: `.draft-YYYY-MM-DD-{HHmmss}.md` → `YYYY-MM-DD.md` (or `YYYY-MM-DD-2.md`, etc.)
- If the user typed `done` with zero notes captured: ask "No notes captured. Save empty document?" If declined, **delete the draft file** and exit cleanly — no artifact left behind.

### Reference Template

The canonical document structure lives at `skills/meet-notes/references/template.md`. The skill reads this template at initialization and uses it as the structural contract for every document it produces. This follows the [[Template-as-Reference Pattern]] — the template is a reference artifact, not inline in SKILL.md.

The template defines:

**Required header fields** (every document must have):
- `# Meeting Notes — {YYYY-MM-DD}` (H1 title)
- `**Meeting Date:**` field
- `**Attendees:**` field
- `**Generated:**` field

**Optional header field:**
- `**Iteration:**` (present only when `--from-prep` used)

**Required sections** (must appear as H2 headings in this order):
1. `## Agenda`
2. `## Discussion` (with H3 sub-topics)
3. `## Decisions` (table with columns: #, Decision, Context)
4. `## Action Items` (table with columns: #, Action, Owner, Due, Status)
5. `## Related`

**Section rules:**
- Empty sections use `(none)` placeholder — never omitted
- Decisions table: every row must have all 3 columns populated
- Action Items table: Owner defaults to `TBD` if not specified; Due defaults to `TBD`; Status always `Open` on creation

**Phase 5 — Validate and grade**

After each write (incremental or final), validate the document against the reference template:

| Check | Pass | Fail |
|-------|------|------|
| H1 title matches `# Meeting Notes — YYYY-MM-DD` | Title present with valid date | Missing or malformed |
| All 4 required header fields present | All found | Any missing |
| All 5 required H2 sections present in order | All found | Any missing or out of order |
| Decisions table has 3 columns (if non-empty) | Columns match | Wrong column count or names |
| Action Items table has 5 columns (if non-empty) | Columns match | Wrong column count or names |
| Empty sections use `(none)` not blank | Placeholder present | Section heading with no content |
| No orphan content outside a section | All content under a heading | Text between sections |

**Grading:**
- **A** — all checks pass
- **B** — 1-2 minor failures (e.g., missing placeholder for empty section)
- **C** — structural failures (missing required section, wrong table columns)
- **F** — document is unrecoverable (missing H1, no sections)

Display the grade after each write: `[grade: A]` or `[grade: B — missing (none) in Decisions]`

If grade is C or F on the final write, warn the user before confirming.

**Phase 6 — Summary**

Display to user:
```
Meeting notes written to: wiki/raw/meeting_notes/{filename}
Topics discussed: {count}
Decisions recorded: {count}
Action items captured: {count}
Grade: {A/B/C/F}
```

**Phase 7 — Optional: create ADO work items from action items (deferred to v2)**

Deferred to v2. Would use `mcp__azure-devops__wit_create_work_item` to create Tasks from action items. Requires ADO tenant resolution (same as meet-pre Phase 1).

---

## Evals (`evals.json`) — Format B (Typed Assertions)

Automated assertions using the repo's standard eval format (see `jx-skill/create/evals/evals.json` for reference). Each eval is a single-prompt invocation with typed assertion objects.

Evals are scoped to what's verifiable from a single prompt — initial document creation and structural correctness. Interactive behaviors (prefix routing, incremental persistence, empty cleanup) remain manual verification.

```json
[
  {
    "name": "meet-notes-happy-path",
    "description": "Invoke meet-notes with a date flag — verify draft file created with correct naming and template sections",
    "input": "/jx-pm:meet-notes --date 2026-06-01",
    "assertions": [
      { "type": "file_exists", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "# Meeting Notes — 2026-06-01" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "**Meeting Date:**" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "**Attendees:**" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "**Generated:**" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "## Agenda" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "## Discussion" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "## Decisions" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "## Action Items" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-01-*.md", "contains": "## Related" },
      { "type": "output_contains", "contains": "Meeting notes" }
    ]
  },
  {
    "name": "meet-notes-template-tables",
    "description": "Verify the initial draft has correct table column headers for Decisions and Action Items",
    "input": "/jx-pm:meet-notes --date 2026-06-02",
    "assertions": [
      { "type": "file_exists", "path": "wiki/raw/meeting_notes/.draft-2026-06-02-*.md" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-02-*.md", "contains": "| # | Decision | Context |" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-02-*.md", "contains": "| # | Action | Owner | Due | Status |" }
    ]
  },
  {
    "name": "meet-notes-empty-sections-placeholder",
    "description": "Verify empty sections in the initial draft use (none) placeholder, not blank",
    "input": "/jx-pm:meet-notes --date 2026-06-03",
    "assertions": [
      { "type": "file_exists", "path": "wiki/raw/meeting_notes/.draft-2026-06-03-*.md" },
      { "type": "file_contains", "path": "wiki/raw/meeting_notes/.draft-2026-06-03-*.md", "contains": "(none)" }
    ]
  },
  {
    "name": "meet-notes-section-order",
    "description": "Verify H2 sections appear in canonical order: Agenda → Discussion → Decisions → Action Items → Related",
    "input": "/jx-pm:meet-notes --date 2026-06-04",
    "assertions": [
      { "type": "file_exists", "path": "wiki/raw/meeting_notes/.draft-2026-06-04-*.md" },
      { "type": "file_contains_ordered", "path": "wiki/raw/meeting_notes/.draft-2026-06-04-*.md", "ordered": ["## Agenda", "## Discussion", "## Decisions", "## Action Items", "## Related"] }
    ]
  }
]
```

**Assertion types used:**
- `file_exists` — draft file created at expected path
- `file_contains` — output file includes expected string
- `file_contains_ordered` — strings appear in specified order (may need eval runner support; fallback: multiple `file_contains` checks)
- `output_contains` — skill's stdout includes expected text

**Note:** `file_exists` paths with `*` globs match the draft naming pattern (timestamp + random suffix). The eval runner should resolve the glob to the most recent matching file. If the runner doesn't support globs, create a known-path fixture directory for eval runs.

These evals validate the initial document creation — the part of the skill that runs from a single prompt before the interactive capture loop begins. The skill's built-in Phase 5 validation performs the same structural checks inline during execution.

### Authority

- **Owns**: meeting note capture, incremental note routing, structured document generation
- **Defers to**: `jx-pm:meet-pre` for preparation data (v1 does not modify meet-email)

### Failure Behavior

- `--from-prep` specified but no prep file found → warn and continue with blank template
- Empty notes (user types `done` immediately) → warn: "No notes captured. Save empty document?" If declined, delete the draft and exit cleanly.
- Write fails → report error with path; draft file remains for manual recovery
- Session interrupted during capture → draft file on disk contains all notes captured up to the last input

---

## Command Wrapper (`meet-notes.md`)

```yaml
description: Capture meeting notes incrementally — attendees, discussion, decisions, action items.
argument-hint: "[--date YYYY-MM-DD] [--from-prep]"
allowed-tools: Read, Glob, Write, Bash(mkdir:*), Bash(mv:*), Bash(rm:*)
```

- `Read` — read meet-pre files for `--from-prep`
- `Glob` — find latest meet-pre file by date; check for draft collisions
- `Write` — write the meeting notes document (initial draft + incremental rewrites)
- `Bash(mkdir:*)` — create `wiki/raw/meeting_notes/` on first run if missing
- `Bash(mv:*)` — rename `.draft-*` to final filename on finalize
- `Bash(rm:*)` — delete `.draft-*` on declined empty meeting
- No ADO tools in v1 (action item → ADO deferred to v2)

---

## README Update

Add to skills table:

```
| meet-notes | `/jx-pm:meet-notes` | Capture meeting notes with decisions and action items |
```

---

## Verification

### Automated (evals.json — Format B typed assertions)

Single-prompt evals that verify initial document creation and template compliance:

1. **meet-notes-happy-path** — invoke with `--date`, verify draft file exists, H1 title correct, all 4 header fields present, all 5 H2 sections present
2. **meet-notes-template-tables** — verify Decisions and Action Items have correct table column headers
3. **meet-notes-empty-sections-placeholder** — verify empty sections use `(none)` not blank
4. **meet-notes-section-order** — verify H2 sections in canonical order (Agenda → Discussion → Decisions → Action Items → Related)

### Interactive (manual walkthrough — capture loop behaviors)

5. **Blank meeting**: invoke without `--from-prep`, add 2 topics, 1 decision, 1 action item, save → verify document written correctly and graded A
6. **From-prep import**: create a meet-pre file, invoke with `--from-prep` → verify agenda imported from action items
7. **Prefix routing**: test `DECISION:`, `ACTION:`, `TOPIC:` prefixes → verify correct section routing
8. **Action item parsing**: test `ACTION @ramon: fix the build` → verify owner extracted as "ramon"
9. **Suffix handling**: run twice on same date → verify second finalized file gets `-2` suffix
10. **Empty meeting cleanup**: type `done` immediately, decline save → verify no meeting notes file remains (draft deleted)
11. **Incremental persistence**: add 2 notes, then check the draft file on disk → verify both notes are already persisted before typing `done`
12. **Draft → final rename**: start a session → verify draft uses `.draft-*` naming; after finalize → verify renamed to `YYYY-MM-DD.md`
13. **Grade display**: verify grade displayed after each incremental write and in final summary

---

## Accepted Risks

**Finalize race condition.** If two sessions finalize notes for the same date at the same instant, the later `mv` could overwrite the earlier file. This is a single-user CLI tool — concurrent same-date finalizations are not a realistic scenario. The draft naming (timestamp + random suffix) prevents collision during capture; the finalize race is a theoretical edge case.

**Bash permissions scope.** `Bash(mv:*)` and `Bash(rm:*)` are broader than the strict minimum (which would be a path-confined pinned helper). This matches the trust model of other jx-pm skills and is acceptable for a tool that already has `Write` access to the same directory.

---

## Implementation Order

1. Create `references/template.md` (canonical section structure)
2. Rewrite `SKILL.md` (replace scaffold with full spec, reference the template)
3. Create `evals/evals.json` (7 automated structural assertions)
4. Update `commands/meet-notes.md` (fix allowed-tools)
5. Update `README.md` (add to skills table)
6. Run automated evals against a test fixture
7. Interactive walkthrough: blank meeting + from-prep flows
