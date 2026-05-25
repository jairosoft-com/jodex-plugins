# Plan: `meet-email` Skill for jx-pm Plugin

## Context

The `jx-pm:meet-pre` skill generates a daily meeting preparation Markdown file (`wiki/raw/meeting_preparation/YYYY-MM-DD.md`) from Azure Boards data. Currently there's no way to distribute that document by email. This skill fills that gap — it converts the Markdown output to email-safe inline-styled HTML and sends it via Graph API, following the same patterns as the `portfolio-email` skill in the `iteration_audit` repo.

User confirmed: Markdown → email-safe HTML body + attach original `.md` file.

### Mail Transport Prerequisite (Verified)

The `mail-mcp` server is configured globally in `~/.claude.json` with Microsoft Graph API credentials. Tool names verified against `mail-mcp/src/server.rs` and `mail-mcp/src/models.rs`:

**`mcp__mail__list_all_accounts`** — returns configured accounts with supported send methods.

**`mcp__mail__graph_send_message`** (`GraphSendMessageInput`):
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `account_id` | string | No (default: `"default"`) | Account identifier |
| `to` | string[] | Yes | Recipient emails (1–50) |
| `cc` | string[] | No | CC recipients |
| `subject` | string | Yes | 1–998 chars |
| `body_html` | string | No* | HTML body (*at least one of `body_text`/`body_html` required) |
| `body_text` | string | No* | Plain text fallback |
| `save_to_sent` | bool | No (default: true) | Save to Sent Items |
| `attachments` | AttachmentInput[] | No | File attachments |

**`AttachmentInput`**:
| Parameter | Type | Notes |
|-----------|------|-------|
| `file_path` | string | Local file path (MCP reads directly) |
| `filename` | string | Auto-detected from `file_path` if omitted |
| `content_type` | string | Auto-detected from extension if omitted |

No additional setup required — tools are available in any project inheriting the global `~/.claude.json` config. Same MCP used by `portfolio-email` in `iteration_audit` repo.

---

## Files to Create

| # | Path | Purpose |
|---|------|---------|
| 1 | `plugins/jx-pm/skills/meet-email/SKILL.md` | Full skill specification |
| 2 | `plugins/jx-pm/skills/meet-email/evals/evals.json` | Empty evals `[]` |
| 3 | `plugins/jx-pm/commands/meet-email.md` | Command wrapper |

## File to Update

| Path | Change |
|------|--------|
| `plugins/jx-pm/README.md` | Add `meet-email` (and `meet-pre`, `feedback`) to skills table |

---

## SKILL.md Structure

### Frontmatter

```yaml
name: meet-email
user-invocable: true
argument-hint: "[recipient-email or comma-separated emails] [--date YYYY-MM-DD] [--dry-run]"
description: >
  Send the meeting preparation document as an email-safe HTML summary to
  specified recipients via Graph API. Attaches original Markdown file.
  Triggers on: "email meeting prep", "send meeting prep", /jx-pm:meet-email.
  Do not trigger for: generating meeting prep (use jx-pm:meet-pre),
  PRD generation, ADO sync, wiki operations.
```

### Authority

- **Owns**: email-safe HTML conversion of meeting prep, email composition, recipient handling, send workflow
- **Defers to**: `jx-pm:meet-pre` for document generation; `mcp__mail__list_all_accounts` for send method

### Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| recipients | Yes | — | One or more email addresses, comma-separated |
| `--date` | No | Latest file by filename | `YYYY-MM-DD` to select specific prep file |
| `--dry-run` | No | false | Run all steps except send — print preview and halt before calling `graph_send_message` |

### Workflow (9 Steps)

**Step 1 — Identify recipients**
- Input contains `@` → use as email directly
- Bare name (no `@`) → ask user for email. Never guess.
- Empty argument → ask user

**Step 2 — Find meeting preparation file**
- Glob: `wiki/raw/meeting_preparation/*.md`
- `--date YYYY-MM-DD` provided → match files starting with that date prefix, pick highest suffix (`-2` > `-1` > base)
- No `--date` → parse each filename to extract `(date, suffix)` tuple, sort by date descending then suffix descending, pick first. This handles `meet-pre`'s rerun behavior where `YYYY-MM-DD-2.md` is newer than `YYYY-MM-DD.md` for the same date.
  - Parsing rule: filename `YYYY-MM-DD.md` → suffix 0; `YYYY-MM-DD-N.md` → suffix N
- No files → halt: "Run `/jx-pm:meet-pre` first."

**Step 3 — Read and parse Markdown**
- Extract by heading: iteration info, capacity summary, work items table, refinement items, backlog tables, priority table/flags, action items

**Step 4 — Resolve sender account**
- Call `mcp__mail__list_all_accounts` to enumerate configured mail accounts
- Select the Graph API-capable account. If zero accounts → halt with error. If multiple Graph-capable accounts → ask user which to use. If exactly one → use it.
- Extract `account_id` and sender email address (e.g., `ramon@jairosoft.com`) for use in Step 8 and display in Step 7 preview

**Step 5 — Build email-safe HTML body**
- Parse each Markdown section → inline-styled HTML tables
- **HTML escaping (mandatory)**: All source text from the meeting prep (work item titles, descriptions, assignee names, action items, flags) must be HTML-entity-escaped before insertion into the HTML body. Escape at minimum: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`, `"` → `&quot;`. This prevents ADO-sourced content containing HTML-like text from altering the email structure.
- **Allowlist rendering**: Only emit known safe HTML tags (`<table>`, `<tr>`, `<td>`, `<th>`, `<span>`, `<div>`, `<br>`, `<p>`, `<b>`, `<strong>`) with inline `style` attributes. No `<a>`, `<img>`, `<script>`, or `<iframe>` from source content.
- Styling rules: no external deps, no SVG, no CSS vars, no flexbox/grid, all inline styles, safe fonts, no `<style>` blocks

HTML section mapping:
1. **Header banner** — dark bg (`#1e1b4b`), iteration name/dates, 3 metric cards (Total/Completed/Remaining points)
2. **Work items table** — color-coded grooming (✅ `#16a34a`, ⚠️ `#d97706`, 🆕 `#2563eb`), type pills (Story/Bug/Task)
3. **Refinement callout** — amber box (`#fffbeb` bg, `#d97706` left border) listing missing fields
4. **Backlog tables** — unplanned items + future iteration items
5. **Priority table** — top 10 ranked rows
6. **Priority flags** — amber callout if any flags exist
7. **Action items** — numbered circles (`#1e1b4b` bg) with text
8. **Footer** — generation timestamp, methodology note, `#94a3b8` text

**Step 6 — Attach original `.md` file**
- Use `attachments` parameter with `file_path`

**Step 6.5 — Headless mode (deferred to v2)**

Headless auto-send (env-var-gated confirmation bypass) is deferred to v2. Reason: without Bash in the allowed-tools, the skill cannot reliably read/validate environment variables (`MEET_EMAIL_AUTO_SEND`, `MEET_EMAIL_AUTHORIZED_RECIPIENTS`, `MEET_EMAIL_DRY_RUN`). A future version can add a pinned preflight helper script to the allowed-tools that reads and validates these env vars, returning normalized recipients. For now, all sends require interactive confirmation (Step 7).

**Step 7 — Preview and confirm (interactive)**
- Show:
  - **From**: sender email (from Step 4 account resolution)
  - **To**: recipient(s)
  - **Subject**: formatted subject line
  - **Body**: summary of sections included (iteration, N work items, N action items)
  - **Attachment**: filename
  - **Freshness warning**: if the prep file date ≠ today, display: "⚠️ This prep file is from {date}, not today. Proceed?"
- Wait for explicit confirmation. Non-negotiable.

**Step 8 — Send (or halt for dry-run)**
- If `--dry-run` → print "Dry run complete. No email sent." and stop. Do NOT call `graph_send_message`.
- Otherwise → call `mcp__mail__graph_send_message` with:
  - `account_id` (from Step 4)
  - `to` (resolved recipients)
  - `subject` (formatted subject line)
  - `body_html` (email-safe HTML from Step 5)
  - `attachments: [{file_path: "<resolved_path>"}]` — use the exact file path resolved in Step 2 (e.g., `wiki/raw/meeting_preparation/2026-05-23-2.md`), NOT a reconstructed path
  - `save_to_sent: true`

Note: `--dry-run` is an LLM instruction gate, not a tool-level enforcement. This is inherent to the SKILL.md format — all skill steps are model-followed instructions. The Step 7 interactive confirmation provides a second gate before send.

**Step 9 — Confirm delivery**
- Report recipient(s), sender account, and status

### Subject Line

```
Meeting Preparation — {Iteration Name} — {Month Day, Year}
```

Date sourced from filename, not today's date.

### Env Vars

None in v1. Headless env vars (`MEET_EMAIL_AUTO_SEND`, `MEET_EMAIL_AUTHORIZED_RECIPIENTS`) deferred to v2 with a pinned preflight script. Dry-run is handled via the `--dry-run` CLI argument instead.

### Failure Behavior

- No prep file → "Run `/jx-pm:meet-pre` first"
- `--date` file not found → list available dates
- Bare name → ask for email
- Zero Graph-capable mail accounts → halt with error, suggest checking mail MCP config
- Multiple Graph-capable accounts → ask user which to use
- Send fails → report error, include account_id and recipient(s) in message

---

## Command Wrapper (`meet-email.md`)

```yaml
allowed-tools: Read, Glob, ToolSearch, mcp__mail__list_all_accounts, mcp__mail__graph_send_message
```

No `Bash` — the workflow uses only Read (file content), Glob (file discovery), ToolSearch (load deferred mail MCP schemas), and the two mail tools. This keeps the trust boundary tight for an outbound-email skill.

Pattern: identical to `meet-pre.md` — one-sentence description, `$ARGUMENTS`.

---

## README Update

Add to skills table:

| Skill | Command | Description |
|-------|---------|-------------|
| meet-pre | `/jx-pm:meet-pre` | Generate daily meeting preparation from Azure Boards |
| meet-email | `/jx-pm:meet-email` | Email the meeting preparation as styled HTML |
| feedback | `/jx-pm:feedback` | Capture feedback and create ADO Feature |

---

## Verification

Verification is ordered **dry-run first, live send last**. All dry-run tests must pass before any live send.

### Phase A: Dry-run tests (no email sent)

1. **No-file error**: invoke before any prep file exists → confirm error message, no mail tools called
2. **Dry run — full preview**: invoke with `--dry-run ramon@jairosoft.com` → confirm full preview (From, To, Subject, Body summary, Attachment, freshness) prints, then "Dry run complete. No email sent." No `graph_send_message` call.
3. **File selection — date**: create `2026-05-23.md` and `2026-05-24.md`, invoke with `--dry-run` → must pick `2026-05-24.md`
4. **File selection — suffix**: create `2026-05-23.md` and `2026-05-23-2.md`, invoke with `--dry-run` → must pick `2026-05-23-2.md` (the rerun)
5. **File selection — `--date`**: invoke with `--dry-run --date 2026-05-23` when both files exist → must pick `2026-05-23-2.md`
6. **Freshness warning**: invoke with `--dry-run` against a prep file dated yesterday → preview must show "⚠️ This prep file is from {date}, not today"
7. **Account resolution**: invoke with `--dry-run` → preview must show "From: {email}" matching the resolved account

### Phase B: Content integrity (dry-run)

8. **Attachment path — suffix**: with `2026-05-23-2.md` as the selected file, invoke `--dry-run` → attachment path in preview must show `2026-05-23-2.md`, not `2026-05-23.md`
9. **HTML escaping**: create a prep file with a work item title containing `<script>alert('xss')</script>` and `&` characters → invoke `--dry-run` → verify title renders as escaped text in the HTML preview, not as executable tags

### Phase C: Live send (gated, controlled recipient)

10. **Live send to self only**: send test to `ramon@jairosoft.com` (the user's own address). Confirm send succeeds, then open in Outlook and Gmail to verify: tables render, grooming colors display, action item circles show, `.md` attachment present, From address correct.
11. **Send failure handling**: if `graph_send_message` returns an error, confirm the skill reports the error with account_id and recipient(s), and does NOT retry automatically.

---

## Accepted Risks

**Dry-run is an instruction gate, not a tool-level gate.** The `--dry-run` flag and Step 7 confirmation are LLM-followed instructions. The `mcp__mail__graph_send_message` tool remains callable in the command wrapper regardless of `--dry-run`. This is inherent to the SKILL.md format — all skills in this plugin system work via model instruction following, not executable code with conditional tool access. The reference skill (`portfolio-email`) has the same pattern. Mitigations: (1) `--dry-run` explicitly instructs "Do NOT call `graph_send_message`", (2) Step 7 requires explicit user confirmation before send, (3) verification Phase A validates dry-run behavior before any live send.

---

## Implementation Order

1. Create `evals/evals.json` (trivial)
2. Create `SKILL.md` (main deliverable)
3. Create `commands/meet-email.md`
4. Update `README.md` skills table
5. Test with dry-run
