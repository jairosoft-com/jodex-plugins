---
name: meet-email
user-invocable: true
argument-hint: "[recipient-email or comma-separated emails] [--date YYYY-MM-DD] [--dry-run]"
description: >
  Send the meeting preparation document as an email-safe HTML summary to
  specified recipients via Graph API. Attaches original Markdown file.
  Triggers on: "email meeting prep", "send meeting prep", "email daily prep",
  /jx-pm:meet-email.
  Do not trigger for: generating meeting prep (use jx-pm:meet-pre),
  PRD generation, ADO sync, wiki operations.
---

<!-- markdownlint-disable MD013 -->

# Meeting Preparation Email

Send the latest meeting preparation document as email-safe inline HTML to one or more recipients. Body = fully styled table-based HTML. Renders in Outlook, Gmail, Apple Mail.

Do not use for:

- Generating/recomputing meeting preparation (use `jx-pm:meet-pre`)
- Running Azure Boards queries directly (use `jx-pm:meet-pre`)
- Sending emails unrelated to meeting preparation

## Authority and precedence

This skill owns:

- Email-safe HTML conversion of meeting preparation documents
- Email composition, recipient handling, send workflow
- Inline style conventions for email compatibility

Defers to:

- `jx-pm:meet-pre` SKILL.md for document generation, data format, and section structure
- `mcp__mail__list_all_accounts` for determining correct send method

## Accepted inputs

### Single recipient

```text
/jx-pm:meet-email ramon@jairosoft.com
/jx-pm:meet-email ramon@jairosoft.com --date 2026-05-23
/jx-pm:meet-email ramon@jairosoft.com --dry-run
```

### Multiple recipients

```text
/jx-pm:meet-email ramon@jairosoft.com, another@example.com
```

### Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| recipients | Yes | — | One or more email addresses, comma-separated |
| `--date` | No | Latest file by date+suffix | `YYYY-MM-DD` to select specific prep file |
| `--dry-run` | No | false | Run all steps except send; print preview and halt |

### Recipient resolution

1. Input contains `@` → use directly as email
2. Input has no `@` (bare name) → ask user for email address
3. Empty argument → ask user for recipient(s)
4. **Never guess or fabricate email addresses**

## Required workflow

### Step 1 — Identify recipients

Parse argument, extract email(s) by splitting on commas. Validate each contains `@`. If any entry lacks `@`, ask user for the email. If argument is empty, ask.

### Step 2 — Find the meeting preparation file

```text
Glob pattern: wiki/raw/meeting_preparation/*.md
```

**File selection logic:**

If `--date YYYY-MM-DD` provided:
- Match files starting with that date prefix
- If multiple matches (e.g., `2026-05-23.md` and `2026-05-23-2.md`), pick the highest suffix

If no `--date`:
- Parse each filename to extract `(date, suffix)` tuple
- Parsing rule: `YYYY-MM-DD.md` → suffix 0; `YYYY-MM-DD-N.md` → suffix N
- Sort by date descending, then suffix descending
- Pick the first (most recent date, highest suffix for same-day reruns)

If no files match: halt with message:
> "No meeting preparation file found. Run `/jx-pm:meet-pre` first."

If `--date` specified but file not found: list available dates and halt.

Record the **exact resolved file path** — carry it through all subsequent steps unchanged.

### Step 3 — Read and parse the Markdown

Read the full Markdown file from the resolved path. Extract these sections by heading:

| Source heading | Data extracted |
|---|---|
| `# Daily Meeting Preparation` line | Document title |
| `**Iteration:**` line | Iteration name, start date, finish date |
| `**Generated:**` line | Generation timestamp |
| `## Current Iteration` > `### Capacity Summary` | Total points, completed points, remaining points |
| `## Current Iteration` > `### Work Items` table | Array of {id, title, type, state, points, assignee, grooming_status} |
| `#### Items Needing Refinement` list | Array of {id, title, missing_fields} |
| `## Backlog — Planning Gaps` > `### Unplanned Items` table | Array of {priority, id, title, type, points, notes} |
| `## Backlog — Planning Gaps` > `### Future Iteration Items` table | Array of {iteration, id, title, type, state, points} |
| `## Priority Review` > `### Top 10 by Priority` table | Array of {rank, id, title, iteration, state, points} |
| `## Priority Review` > `### Flags` list | Array of flag strings |
| `## Action Items for Meeting` numbered list | Array of action item strings |

### Step 4 — Resolve sender account

Call `mcp__mail__list_all_accounts`. Select the Graph API-capable account:

- **Zero** Graph-capable accounts → halt: "No Graph API-capable mail account found. Check mail MCP configuration."
- **Exactly one** → use it automatically
- **Multiple** → ask user which account to use

Extract `account_id` and sender email address for use in Step 8 and display in Step 7 preview.

### Step 5 — Build email-safe HTML body

Convert parsed Markdown data to email-compatible HTML per these rules:

#### HTML escaping (mandatory)

All source text from the meeting prep (work item titles, descriptions, assignee names, action items, flags) MUST be HTML-entity-escaped before insertion:

- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`

This prevents ADO-sourced content containing HTML-like text from altering the email structure.

#### Allowlist rendering

Only emit known safe HTML tags: `<table>`, `<tr>`, `<td>`, `<th>`, `<span>`, `<div>`, `<br>`, `<p>`, `<b>`, `<strong>` — each with inline `style` attributes. No `<a>`, `<img>`, `<script>`, or `<iframe>` tags from source content.

#### Email HTML rules

- **No external dependencies**: No `<script>`, no CDN links (Tailwind, Google Fonts), no `<link>` tags
- **No SVG**: Replace SVG charts with table-based equivalents or omit
- **No CSS variables**: Replace `var(--color)` with literal hex values
- **No flexbox/grid**: Use `<table>` layout exclusively
- **All styles inline**: Every element gets `style="..."` attributes
- **Safe fonts only**: `font-family: Arial, Helvetica, sans-serif`
- **No `<style>` blocks**: Some email clients strip `<head>` entirely

#### Email structure (in order)

1. **Header banner** — Dark bg (`#1e1b4b`), title "Daily Meeting Preparation", iteration name + date range, 3 metric cards in a row: Total Points | Completed | Remaining

2. **Work items table** — Full-width styled table with alternating row backgrounds (`#ffffff` / `#f8fafc`). Columns: ID, Title, Type (colored pill), State, Points, Assigned To, Grooming (color-coded). Table header: `background: #f1f5f9; color: #334155`. Border: `1px solid #e2e8f0`.

3. **Items needing refinement callout** — Amber bg box (`#fffbeb`, border-left `4px solid #d97706`, text `#92400e`). Bulleted list of items with missing fields.

4. **Unplanned items table** — Same table styling. Columns: Priority, ID, Title, Type, Points, Notes.

5. **Future iteration items table** — Same table styling. Columns: Iteration, ID, Title, Type, State, Points.

6. **Priority review table** — Same table styling. Columns: Rank, ID, Title, Iteration, State, Points.

7. **Priority flags callout** — Amber callout box (same style as refinement). Only shown if flags exist.

8. **Action items** — Numbered circles: `display: inline-block; width: 28px; height: 28px; border-radius: 50%; background: #1e1b4b; color: #ffffff; text-align: center; line-height: 28px; font-weight: bold; margin-right: 10px`. Each item as a table row with circle in one cell, text in another.

9. **Footer** — Generation timestamp, "Prepared by jx-pm:meet-pre from Azure Boards data." Text: `#94a3b8`, font-size `12px`, top border `1px solid #e2e8f0`.

#### Color reference

| Element | Hex |
|---------|-----|
| Groomed / green | `#16a34a` |
| Needs Refinement / amber | `#d97706` |
| New / blue | `#2563eb` |
| Header background | `#1e1b4b` |
| Header text | `#ffffff` |
| Body text | `#334155` |
| Table header bg | `#f1f5f9` |
| Table border | `#e2e8f0` |
| Alternate row | `#f8fafc` |
| Callout bg (amber) | `#fffbeb` |
| Callout border (amber) | `#d97706` |
| Callout text (amber) | `#92400e` |
| Footer text | `#94a3b8` |
| Number circle bg | `#1e1b4b` |
| Story pill bg/text | `#e0f2fe` / `#0369a1` |
| Bug pill bg/text | `#fef2f2` / `#dc2626` |
| Task pill bg/text | `#f0fdf4` / `#166534` |

### Step 6 — Attach the original Markdown file

Attach the meeting prep file using the **exact resolved file path from Step 2** via the `attachments` parameter with `file_path`. Do NOT reconstruct the path — use the variable carried from Step 2.

### Step 6.5 — Headless mode (scheduled invocation)

Skip Step 7 confirmation and proceed to Step 8 if ALL three env vars are set:

1. `MEET_EMAIL_AUTO_SEND` = `true`
2. `MEET_EMAIL_AUTHORIZED_RECIPIENTS` = non-empty comma-separated allowlist
3. **Every** resolved recipient appears in the allowlist (case-insensitive, whitespace-trimmed)

In headless mode: still **print full preview to stdout** (From / To / Subject / Body summary / Attachment) so the launchd log captures what was sent, who received it, and which file was attached.

If `MEET_EMAIL_AUTO_SEND=true` but `MEET_EMAIL_AUTHORIZED_RECIPIENTS` is unset/empty, OR any resolved recipient is not on the allowlist — **fail closed**: print the offending recipient, exit without sending. No silent fallback to interactive mode. No partial sends.

`MEET_EMAIL_DRY_RUN=true` overrides headless send — print full preview but **do not invoke** `mcp__mail__graph_send_message`. Use for verification runs.

When all three env vars are unset (default): existing interactive flow from Step 7 is unchanged.

### Step 7 — Preview and confirm

Show user preview before sending:

```text
From: {sender email from Step 4}
To: {recipients}
Subject: Meeting Preparation — {Iteration Name} — {Month Day, Year}
Body: Email-safe HTML meeting prep ({N} work items, {N} action items)
Attachment: {resolved filename from Step 2}
```

If the prep file date does not equal today's date, add:
```text
⚠️ This prep file is from {file date}, not today. Proceed?
```

**Wait for explicit user confirmation before sending.** Non-negotiable.

### Step 8 — Send (or halt for dry-run)

If `--dry-run`:
- Print "Dry run complete. No email sent."
- Do NOT call `graph_send_message`.
- Stop here.

Otherwise, call `mcp__mail__graph_send_message` with:

- `account_id`: from Step 4
- `to`: resolved recipient email addresses
- `subject`: `Meeting Preparation — {Iteration Name} — {Month Day, Year}` (date from filename, formatted as e.g. "May 23, 2026")
- `body_html`: email-safe HTML from Step 5
- `attachments`: `[{"file_path": "<exact resolved path from Step 2>"}]`
- `save_to_sent`: `true`

### Step 9 — Confirm delivery

Report send result with:
- Recipient(s)
- Sender account (`account_id` and email)
- Delivery status

## Subject line format

```text
Meeting Preparation — {Iteration Name} — {Month Day, Year}
```

Example: `Meeting Preparation — Sprint 12 — May 23, 2026`

Date sourced from the prep file's filename, not today's date.

## Output policy

- Skill writes no files to disk
- Skill creates no IMAP drafts
- Sends directly via Graph API
- Original Markdown file attached for raw viewing

## Failure behavior

| Condition | Response |
|-----------|----------|
| No prep file exists | "No meeting preparation file found in `wiki/raw/meeting_preparation/`. Run `/jx-pm:meet-pre` first." |
| `--date` specified but file not found | "No meeting preparation file found for {date}. Available dates: {list}." |
| Recipient not resolvable (bare name) | Ask user for email address |
| Zero Graph-capable mail accounts | Halt with error, suggest checking mail MCP configuration |
| Multiple Graph-capable accounts | Ask user which account to use |
| Send fails | Report error with `account_id` and recipient(s) in message. Do NOT retry automatically. |

## Completion checklist

1. Recipients resolved to valid emails
2. Latest (or `--date`-specified) prep file identified via suffix-aware sorting
3. Resolved file path carried through all steps unchanged
4. All Markdown sections parsed
5. All source text HTML-entity-escaped before HTML insertion
6. Email-safe HTML built with inline styles only (no external deps)
7. Original Markdown file attached using exact resolved path
8. Sender account resolved with explicit `account_id`
9. User confirmed send (interactive) or `--dry-run` halted before send
10. Email sent via Graph API (or dry-run halt message printed)
11. Delivery status reported with recipient(s) and sender account
