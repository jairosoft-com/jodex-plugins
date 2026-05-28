---
ado_sync:
  feature_work_item_id: 205002
  feature_work_item_url: "https://dev.azure.com/jairo/91958783-8c2b-4e19-9fff-c73139334abf/_workitems/edit/205002"
  organization: jairo
  project: Jodex
  last_synced: "2026-05-25T19:39:01Z"
  stories:
    US-006-01: 205003
    US-006-02: 205004
    US-006-03: 205005
    US-006-04: 205006
    US-006-05: 205007
    US-006-06: 205008
    US-006-07: 205009
---

# Meeting Preparation Email Distribution

## Document Metadata
- **Feature ID**: 006
- **Feature Name**: Meeting Preparation Email Distribution
- **Document Type**: BRD_PRD
- **Generated Date**: 2026-05-25
- **Quality Profile**: default
- **Quality Gates**:
  - Skill YAML frontmatter valid [skill-only]
  - Command wrapper allowed-tools match workflow [skill-only]
  - Dry-run halts before send [skill-only]
  - HTML escaping applied to all source text [skill-only]
  - Live send delivers styled HTML with attachment [skill-only]

## Document Control

| Attribute | Details |
|-----------|---------|
| **Status** | Draft |
| **Project Sponsor** | ramon aseniero |
| **Product Owner** | ramon aseniero |
| **Target Release** | 2026-06-06 |

---

## Part I: Strategic Foundation (BRD)

### 1. Executive Summary

The `jx-pm:meet-pre` skill generates a daily meeting preparation document from Azure Boards data, covering iteration work items, grooming status, planning gaps, and priority ordering. However, the output is a local Markdown file that requires the recipient to have access to the repository to read it. There is no mechanism to distribute the meeting prep to stakeholders who need it before a daily standup or planning session.

This feature adds a companion skill (`jx-pm:meet-email`) that converts the Markdown output into email-safe inline-styled HTML and sends it via Microsoft Graph API. Recipients receive a professionally formatted email with color-coded tables and an attached `.md` file for raw reference. The pattern is proven: the `portfolio-email` skill in the `iteration_audit` repository uses the same approach successfully for portfolio health dashboards.

### 2. Business Problem & Opportunity

#### Current State

Meeting preparation documents are generated to `wiki/raw/meeting_preparation/YYYY-MM-DD.md` and remain local to the developer's workstation. Sharing requires manual copy-paste into email or chat, losing formatting and requiring effort that discourages consistent distribution. Stakeholders who do not have repository access or CLI tooling cannot consume the output at all.

#### Root Cause Analysis

The `jx-pm:meet-pre` skill was designed as a generation tool without a distribution layer. The plugin system supports skill composition (one skill's output feeds another), but no email distribution skill exists in `jx-pm`. The mail transport infrastructure (`mail-mcp` via Graph API) is available globally but has not been wired into the product management plugin.

### 3. Business Objectives & Success Metrics

| Objective ID | SMART Objective | KPI | Current | Target |
|---|---|---|---|---|
| OBJ-006-01 | After implementation, meeting prep can be emailed to any recipient within 30 seconds of generation | Time from prep generation to email delivery | N/A (manual) | < 30s |
| OBJ-006-02 | After implementation, email renders correctly in Outlook, Gmail, and Apple Mail with no broken styles | Email rendering pass rate across clients | 0% | 100% |
| OBJ-006-03 | After implementation, all ADO-sourced content is HTML-escaped to prevent injection | Content injection incidents | N/A | 0 |

### 4. Project Scope

#### In Scope

- New `meet-email` skill in `jx-pm` plugin
- Markdown-to-email-safe-HTML conversion with inline styles
- Recipient resolution (email address input)
- Sender account resolution via `mcp__mail__list_all_accounts`
- File selection with suffix-aware sorting (handles `meet-pre` reruns)
- Freshness warning for non-today files
- `--dry-run` flag for safe testing
- `--date` flag for selecting specific prep files
- Original `.md` file attachment
- Interactive preview and confirmation before send
- Command wrapper with minimal allowed-tools (no Bash)

#### Out of Scope

- Regenerating meeting preparation data (use `jx-pm:meet-pre`)
- Headless/scheduled auto-send (deferred to v2)
- Name-based recipient lookup (requires `user_*.md` contact files not yet in this repo)
- CC/BCC support (v2 enhancement)
- SMTP or EWS send paths (Graph API only for v1)
- Calendar integration or meeting invites

### 5. Stakeholder Analysis (RACI)

| Stakeholder | Role | R/A/C/I |
|---|---|---|
| ramon aseniero | Author & Product Owner | R/A |
| jx-pm plugin users | Meeting prep generators and email senders | C |
| Meeting attendees (email recipients) | Consumers of meeting prep emails | I |

### 6. Assumptions, Constraints & Dependencies

**Assumptions:**
- The `mail-mcp` server is configured globally in `~/.claude.json` with valid Microsoft Graph API credentials
- `mcp__mail__graph_send_message` supports `body_html` and `attachments` parameters (verified against source)
- Meeting prep files follow the `YYYY-MM-DD.md` / `YYYY-MM-DD-N.md` naming convention from `meet-pre`
- Recipients have email clients that support table-based HTML email (Outlook, Gmail, Apple Mail)

**Constraints:**
- No Bash in command wrapper allowed-tools (tight trust boundary for outbound email)
- `--dry-run` is an LLM instruction gate, not a tool-level enforcement (inherent SKILL.md limitation)
- All v1 sends require interactive user confirmation (no headless bypass)

**Dependencies:**
- `jx-pm:meet-pre` skill for generating source Markdown files
- `mail-mcp` MCP server for Graph API email delivery
- `jx-core` plugin for shared ADO configuration and docs-root resolution

### 7. Risk Assessment

| Risk ID | Risk | Likelihood (1-5) | Impact (1-5) | Mitigation |
|---|---|---|---|---|
| RISK-006-01 | Stale meeting prep sent to recipients when latest file is from a prior day | 2 | 3 | Freshness warning in preview when file date does not equal today; user must explicitly confirm |
| RISK-006-02 | ADO work item content containing HTML-like text alters email structure | 1 | 4 | Mandatory HTML entity escaping of all source text; allowlist-only tag rendering |
| RISK-006-03 | Email renders incorrectly in specific email clients | 2 | 2 | Table-based layout, inline styles only, no external deps; verification across Outlook/Gmail/Apple Mail |
| RISK-006-04 | Suffix-aware file selection picks wrong file on same-day reruns | 1 | 3 | Parse (date, suffix) tuples explicitly; verification test cases for suffix ordering |
| RISK-006-05 | `--dry-run` flag not followed by LLM, causing accidental send | 1 | 4 | Double gate: dry-run instruction + Step 7 confirmation; verification Phase A validates dry-run before live send |

---

## Part II: Tactical Execution (PRD)

### 8. Target Users & Personas

**Primary Persona:** Project Lead / Scrum Master
- Goals: Distribute meeting preparation to all attendees before daily standup
- Pain Points: Manual copy-paste loses formatting; not all attendees have repo access

**Secondary Persona:** Developer / Team Member
- Goals: Receive formatted meeting status in email for quick review before meeting
- Pain Points: Must check repo or CLI output to see meeting prep; no push notification

### 9. User Stories

#### GOAL-006-01: Email meeting prep to recipients as styled HTML

### US-006-01: Send meeting prep email to specified recipients
**As a** project lead
**I want** to send the meeting preparation document as a styled HTML email
**So that** all meeting attendees receive a formatted summary without needing repo access

*Format: System State — email delivery via Graph API*

**Acceptance Criteria:**

**System Behavior:**
- AC-006-01: When the user invokes `/jx-pm:meet-email ramon@example.com`, the skill resolves the recipient, finds the latest prep file, converts it to inline-styled HTML, and presents a preview for confirmation
- AC-006-02: When the user confirms the preview, the skill sends the email via `mcp__mail__graph_send_message` with `body_html`, the resolved `account_id`, and the original `.md` file as attachment
- AC-006-03: When the email is sent successfully, the skill reports the recipient(s), sender account, and delivery status

**Validates:** OBJ-006-01

---

### US-006-02: Convert meeting prep Markdown to email-safe HTML
**As a** meeting attendee
**I want** the email to render as a professionally styled document with color-coded tables
**So that** I can quickly scan iteration status, grooming health, and action items

*Format: Rule-Based — HTML conversion specification*

**Acceptance Criteria:**

**Rules:**
- AC-006-04: HTML body uses table-based layout with inline styles only; no external dependencies, SVG, CSS variables, flexbox, grid, or `<style>` blocks
- AC-006-05: Work items table includes color-coded grooming status: groomed (green `#16a34a`), needs refinement (amber `#d97706`), new (blue `#2563eb`)
- AC-006-06: Work item type displayed as colored pills: Story (`#e0f2fe`/`#0369a1`), Bug (`#fef2f2`/`#dc2626`), Task (`#f0fdf4`/`#166534`)
- AC-006-07: Header banner displays iteration name, date range, and three metric cards (Total/Completed/Remaining points) on dark background (`#1e1b4b`)
- AC-006-08: Action items rendered as numbered circles with text
- AC-006-09: Footer includes generation timestamp and methodology note

**Validates:** OBJ-006-02

---

### US-006-03: HTML-escape all ADO-sourced content
**As a** email recipient
**I want** work item titles and descriptions to render as plain text
**So that** content containing HTML-like characters does not alter the email structure

*Format: Rule-Based — security specification*

**Acceptance Criteria:**

**Rules:**
- AC-006-10: All source text from meeting prep (titles, descriptions, assignee names, action items, flags) is HTML-entity-escaped before insertion: `&` to `&amp;`, `<` to `&lt;`, `>` to `&gt;`, `"` to `&quot;`
- AC-006-11: Only known safe HTML tags are emitted: `<table>`, `<tr>`, `<td>`, `<th>`, `<span>`, `<div>`, `<br>`, `<p>`, `<b>`, `<strong>` with inline `style` attributes
- AC-006-12: No `<a>`, `<img>`, `<script>`, or `<iframe>` tags generated from source content

**Validates:** OBJ-006-03

---

#### GOAL-006-02: Select correct prep file with suffix and date awareness

### US-006-04: Select latest meeting prep file with suffix-aware sorting
**As a** project lead
**I want** the skill to automatically pick the most recent prep file, including same-day reruns
**So that** the email always reflects the latest data

*Format: System State — file selection logic*

**Acceptance Criteria:**

**System Behavior:**
- AC-006-13: When no `--date` flag is provided, the skill parses each filename to extract `(date, suffix)` tuples and picks the file with the highest date, then highest suffix
- AC-006-14: When `--date 2026-05-23` is provided and both `2026-05-23.md` and `2026-05-23-2.md` exist, the skill selects `2026-05-23-2.md`
- AC-006-15: When no meeting prep files exist, the skill halts with: "Run `/jx-pm:meet-pre` first."

**Validates:** OBJ-006-01

---

#### GOAL-006-03: Provide safety gates for email delivery

### US-006-05: Preview email and require confirmation before send
**As a** project lead
**I want** to see a preview of the email (From, To, Subject, Body summary, Attachment) before it is sent
**So that** I can verify the content and recipients before an irreversible action

*Format: System State — interactive confirmation*

**Acceptance Criteria:**

**System Behavior:**
- AC-006-16: When the skill reaches the preview step, it displays From (sender email), To (recipients), Subject (formatted), Body (section summary with counts), and Attachment (filename)
- AC-006-17: When the prep file date does not equal today, the preview includes a freshness warning: "This prep file is from {date}, not today. Proceed?"
- AC-006-18: The skill does not call `graph_send_message` until the user explicitly confirms the preview

**Validates:** OBJ-006-01

---

### US-006-06: Support dry-run mode for safe testing
**As a** developer
**I want** to invoke the skill with `--dry-run` to see the full preview without sending
**So that** I can validate file selection, HTML rendering, and account resolution without risk

*Format: System State — dry-run gate*

**Acceptance Criteria:**

**System Behavior:**
- AC-006-19: When `--dry-run` is provided, the skill executes Steps 1-7 (recipient resolution, file selection, parsing, account resolution, HTML build, preview) and then prints "Dry run complete. No email sent." without calling `graph_send_message`
- AC-006-20: When `--dry-run` is provided, the attachment path in the preview matches the exact resolved file path from Step 2 (e.g., `2026-05-23-2.md`, not `2026-05-23.md`)

**Validates:** OBJ-006-01

---

### US-006-07: Resolve sender account before send
**As a** project lead
**I want** the skill to resolve which mail account to send from
**So that** the email comes from the correct sender address

*Format: System State — account resolution*

**Acceptance Criteria:**

**System Behavior:**
- AC-006-21: When exactly one Graph API-capable account is configured, the skill uses it automatically and displays it in the preview as "From: {email}"
- AC-006-22: When zero Graph-capable accounts are found, the skill halts with an error suggesting the user check mail MCP configuration
- AC-006-23: When multiple Graph-capable accounts are found, the skill asks the user to select which account to use
- AC-006-24: The resolved `account_id` is passed to `graph_send_message` in the send step

**Validates:** OBJ-006-01

### 10. Non-Functional Requirements

| NFR ID | Category | Requirement | Links to | Test Method |
|---|---|---|---|---|
| NFR-006-01 | Email Compatibility | Email renders correctly in Outlook, Gmail, and Apple Mail with no broken styles or missing content | OBJ-006-02 | Manual visual inspection across three clients |
| NFR-006-02 | Security | No user-supplied or ADO-sourced content can inject HTML tags into email body | OBJ-006-03 | Dry-run with XSS test payload in work item title |
| NFR-006-03 | Trust Boundary | Command wrapper excludes Bash; only Read, Glob, ToolSearch, and mail MCP tools allowed | OBJ-006-03 | Inspect command wrapper allowed-tools |
| NFR-006-04 | Attachment Integrity | Attached `.md` file path matches the exact file used for HTML conversion | OBJ-006-01 | Dry-run with suffixed file, verify attachment path |

### 11. Technical Considerations

- **Plugin location:** `plugins/jx-pm/skills/meet-email/` (new skill directory)
- **Command wrapper:** `plugins/jx-pm/commands/meet-email.md` with `allowed-tools: Read, Glob, ToolSearch, mcp__mail__list_all_accounts, mcp__mail__graph_send_message`
- **Mail transport:** `mcp__mail__graph_send_message` via globally configured `mail-mcp` in `~/.claude.json`; supports `body_html`, `attachments` with `file_path`, and `account_id`
- **Source format:** Markdown with known heading structure from `meet-pre` SKILL.md template (lines 146-210)
- **HTML rendering:** Inline styles only, table-based layout, safe fonts (`Arial, Helvetica, sans-serif`), no external dependencies
- **Subject line format:** `Meeting Preparation -- {Iteration Name} -- {Month Day, Year}` (date from filename)
- **Headless mode:** Deferred to v2; requires pinned preflight helper script for env var validation

### 12. Open Questions & Decision Log

| Question | Date | Decision | Rationale |
|---|---|---|---|
| Should email body be HTML or plain text? | 2026-05-25 | HTML with inline styles | User confirmed; matches portfolio-email pattern; better readability |
| Should original .md be attached? | 2026-05-25 | Yes | Provides raw data for recipients who want to copy tables or parse locally |
| Should headless auto-send be in v1? | 2026-05-25 | Deferred to v2 | Without Bash in allowed-tools, env vars cannot be reliably validated |
| Should Bash be in allowed-tools? | 2026-05-25 | No | Tight trust boundary for outbound email; workflow only needs Read, Glob, mail tools |
| How to handle same-day reruns? | 2026-05-25 | Parse (date, suffix) tuples | Lexicographic sort fails for suffixed files; explicit parsing is reliable |

### 13. Release Plan

| Milestone | Target Date | Status |
|---|---|---|
| Requirements Approved (this doc) | 2026-05-25 | Draft |
| SKILL.md + command wrapper implemented | 2026-05-30 | Not started |
| Dry-run verification (Phase A + B) | 2026-05-30 | Not started |
| Live send verification (Phase C) | 2026-06-02 | Not started |
| README updated, merged to main | 2026-06-06 | Not started |

---

## Approval

| Role | Name | Date |
|---|---|---|
| Sponsor | ramon aseniero | |
| Product Owner | ramon aseniero | |
