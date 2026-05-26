# Plan: `meet-notes` Skill for jx-pm Plugin

## Context

The jx-pm plugin has a meeting workflow with two skills: `meet-pre` (before the meeting — generates preparation from ADO) and `meet-email` (after the meeting — distributes via email). The missing middle piece is `meet-notes`: capturing what happens DURING the meeting — decisions, action items, discussion notes.

A scaffold stub already exists at `plugins/jx-pm/skills/meet-notes/SKILL.md` (from `jx-skill:create`) with placeholder phases and no implementation. This plan defines what the skill should do.

---

## Role in the Meeting Pipeline

```
/jx-pm:meet-pre    → BEFORE: generates preparation doc from ADO
/jx-pm:meet-notes  → DURING: captures notes, decisions, action items
/jx-pm:meet-email  → AFTER: distributes prep or notes via email
```

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
| 2 | `plugins/jx-pm/commands/meet-notes.md` | Update (fix allowed-tools, description) |
| 3 | `plugins/jx-pm/README.md` | Update (add meet-notes to skills table) |

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

**Phase 1 — Initialize meeting document**

- Determine meeting date (today or `--date`)
- If `--from-prep`: read `wiki/raw/meeting_preparation/YYYY-MM-DD.md` (latest suffix) to import:
  - Iteration name and dates
  - Action items as agenda topics
  - Work item IDs discussed
- If no `--from-prep` or no prep file exists: start with blank template
- Ask user for attendees (comma-separated names)
- Create the in-memory document structure

**Phase 2 — Capture notes (interactive loop)**

Enter an incremental capture loop. The user provides notes one at a time. For each input:

- If input starts with `DECISION:` or `Decision:` → route to Decisions section
- If input starts with `ACTION:` or `Action:` → route to Action Items section, parse assignee if provided (e.g., `ACTION @ramon: fix the build`)
- If input starts with `TOPIC:` or `Topic:` → start a new discussion topic
- If input is `done`, `end`, or `finish` → exit the loop, proceed to Phase 3
- Otherwise → append to current topic's discussion notes

Display a brief confirmation after each note: `[noted]`, `[decision recorded]`, `[action item added]`, `[new topic: {title}]`

**Phase 3 — Review and edit**

Display the full structured document to the user. Ask:
> "Review the meeting notes. You can edit, add, or remove entries. Type 'save' when ready."

Allow corrections before writing.

**Phase 4 — Write document**

Output path: `wiki/raw/meeting_notes/YYYY-MM-DD.md`

If file exists, append suffix: `YYYY-MM-DD-2.md`, etc. (same convention as meet-pre)

### Document Template

```markdown
# Meeting Notes — {YYYY-MM-DD}

**Meeting Date:** {YYYY-MM-DD}
**Attendees:** {comma-separated names}
**Iteration:** {iteration_name} (if from-prep)
**Generated:** {timestamp}

---

## Agenda

{imported from meet-pre action items, or user-provided topics}

---

## Discussion

### {Topic 1}

{discussion notes}

### {Topic 2}

{discussion notes}

---

## Decisions

| # | Decision | Context |
|---|----------|---------|
| 1 | {decision text} | {topic it was discussed under} |

---

## Action Items

| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | {action text} | {assignee} | {date if specified} | Open |

---

## Related

- Meeting Preparation: {link to meet-pre file if --from-prep}
```

**Phase 5 — Summary**

Display to user:
```
Meeting notes written to: wiki/raw/meeting_notes/{filename}
Topics discussed: {count}
Decisions recorded: {count}
Action items captured: {count}
```

**Phase 6 — Optional: create ADO work items from action items (deferred to v2)**

Deferred to v2. Would use `mcp__azure-devops__wit_create_work_item` to create Tasks from action items. Requires ADO tenant resolution (same as meet-pre Phase 1).

### Authority

- **Owns**: meeting note capture, incremental note routing, structured document generation
- **Defers to**: `jx-pm:meet-pre` for preparation data; `jx-pm:meet-email` for distribution

### Failure Behavior

- `--from-prep` specified but no prep file found → warn and continue with blank template
- Empty notes (user types `done` immediately) → warn: "No notes captured. Write empty document anyway?"
- Write fails → report error with path

---

## Command Wrapper (`meet-notes.md`)

```yaml
description: Capture meeting notes incrementally — attendees, discussion, decisions, action items.
argument-hint: "[--date YYYY-MM-DD] [--from-prep]"
allowed-tools: Read, Glob, Write
```

- `Read` — read meet-pre files for `--from-prep`
- `Glob` — find latest meet-pre file by date
- `Write` — write the meeting notes document
- No ADO tools in v1 (action item → ADO deferred to v2)
- No Bash needed

---

## README Update

Add to skills table:

```
| meet-notes | `/jx-pm:meet-notes` | Capture meeting notes with decisions and action items |
```

---

## Verification

1. **Blank meeting**: invoke without `--from-prep`, add 2 topics, 1 decision, 1 action item, save → verify document written correctly
2. **From-prep import**: create a meet-pre file, invoke with `--from-prep` → verify agenda imported from action items
3. **Prefix routing**: test `DECISION:`, `ACTION:`, `TOPIC:` prefixes → verify correct section routing
4. **Action item parsing**: test `ACTION @ramon: fix the build` → verify owner extracted as "ramon"
5. **Suffix handling**: run twice on same date → verify second file gets `-2` suffix
6. **Empty meeting**: type `done` immediately → verify warning displayed
7. **Review/edit**: verify full document displayed for review before writing

---

## Implementation Order

1. Rewrite `SKILL.md` (replace scaffold with full spec)
2. Update `commands/meet-notes.md` (fix allowed-tools)
3. Update `README.md` (add to skills table)
4. Test with blank meeting flow
5. Test with `--from-prep` flow
