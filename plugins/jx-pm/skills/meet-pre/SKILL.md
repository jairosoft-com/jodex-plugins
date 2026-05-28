---
name: meet-pre
user-invocable: true
argument-hint: "[--iteration <id>] [--project <org/project>]"
description: >
  Prepare a daily project meeting document covering the current iteration work items,
  backlog grooming status, planning (current/future iteration assignment), and priority order.
  Fetches live data from Azure Boards and writes the output to wiki/raw/meeting_preparation/.
  Triggers on: "meeting prep", "meeting preparation", "prepare for daily meeting", "daily standup prep", /jx-pm:meet-pre.
  Do not trigger for: PRD generation, tech spec generation, task breakdown, ADO sync, wiki operations.
---

# Meeting Preparation

Generate a daily project meeting preparation document from live Azure Boards data.

The document covers:
- Current iteration work items and their status
- Grooming/refinement health of each item
- Planning gaps (unassigned iteration, missing estimates)
- Priority ordering across the board backlog

Output is written to `wiki/raw/meeting_preparation/YYYY-MM-DD.md`.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--iteration` | No | Current iteration from ADO | Iteration path or ID to inspect |
| `--project` | No | From `jx-core/_shared/ado.md` or memory | `<org>/<project>` override |

---

## Phase 1: Resolve ADO Tenant

**Fail-closed guard:** Verify `../../../jx-core/_shared/ado.md` is readable. If not, halt:
> "Error: jx-core shared ADO skill not found. Ensure the jx-core plugin is installed."

Resolve tenant binding:
1. Use `--project` argument if provided.
2. Otherwise read from `../../../jx-core/_shared/ado.md` binding.
3. If no binding exists, prompt:
   > "Which Azure DevOps project? (e.g. myorg/MyProject)"
   Then save for future use per ado.md conventions.

---

## Phase 2: Fetch Current Iteration

Use `mcp__azure-devops__work_list_team_iterations` to get active iterations for the team.

Identify the **current** iteration (the one whose `startDate <= today <= finishDate`).
If `--iteration` was supplied, use that instead.

Display to user:
```
Iteration: {iteration_name} ({startDate} → {finishDate})
```

---

## Phase 3: Fetch Work Items

Fetch two sets of items using Azure DevOps MCP tools:

### 3a. Current Iteration Items

Use `mcp__azure-devops__wit_get_work_items_for_iteration` for the resolved iteration.

For each item collect:
- ID, Title, Work Item Type, State, Assigned To
- Story Points / Effort (if present)
- Description / Acceptance Criteria (to assess grooming)
- Tags

### 3b. Board Backlog Items

Use `mcp__azure-devops__wit_list_backlog_work_items` to fetch items in the project backlog
(not yet assigned to an iteration, or in future iterations).

For each item collect the same fields as 3a, plus:
- Iteration Path (to distinguish future-planned vs unplanned)

---

## Phase 4: Grooming Analysis

For each work item evaluate grooming health using these criteria:

| Check | Groomed? |
|-------|----------|
| Has a clear Title (not placeholder) | Required |
| Has Description or Acceptance Criteria | Required |
| Has Story Points / Effort estimate | Required |
| Has Assigned To (for in-progress items) | Required for active items |
| State is appropriate for iteration position | Informational |

Label each item:
- ✅ **Groomed** — all required fields present
- ⚠️ **Needs Refinement** — missing one or more required fields (list what is missing)
- 🆕 **New / Not Started** — no description or estimate, likely needs grooming session

---

## Phase 5: Planning Analysis

Categorize backlog items:

1. **Current Iteration** — assigned to the active sprint
2. **Future Iteration** — assigned to a named future sprint
3. **Unplanned** — no iteration assigned; recommend placement
4. **Blocked / On Hold** — State indicates blocked, list blockers if available

For unplanned items, suggest iteration assignment based on:
- Priority order (stack rank)
- Remaining capacity in current iteration (story points: planned vs done)
- Dependencies visible in the title or description

---

## Phase 6: Priority Review

List all in-scope items (current iteration + top unplanned backlog) sorted by:
1. Priority field (if set)
2. Stack rank / backlog order

Flag any items where priority appears misaligned:
- High-priority item not in current iteration
- Low-priority item blocking iteration completion
- Duplicate or overlapping items

---

## Phase 7: Generate and Write Document

### Output Path

Resolve docs root from `../../../jx-core/_shared/docs-root.md`.
Write to: `wiki/raw/meeting_preparation/YYYY-MM-DD.md`
where `YYYY-MM-DD` is today's date.

If the file already exists, append a suffix: `YYYY-MM-DD-2.md`, etc.

### Document Template

```markdown
# Daily Meeting Preparation — {YYYY-MM-DD}

**Iteration:** {iteration_name} ({startDate} → {finishDate})
**Generated:** {timestamp}

---

## Current Iteration: {iteration_name}

### Capacity Summary
- Total Story Points Planned: {sum}
- Completed: {done_sum}
- Remaining: {remaining_sum}

### Work Items

| ID | Title | Type | State | Points | Assigned To | Grooming |
|----|-------|------|-------|--------|-------------|----------|
| #{id} | {title} | {type} | {state} | {points} | {assignee} | {status_emoji} |

#### Items Needing Refinement

For each ⚠️ item, list what is missing:
- #{id} {title}: missing {field1}, {field2}

---

## Backlog — Planning Gaps

### Unplanned Items (recommend for next iteration)

| Priority | ID | Title | Type | Points | Notes |
|----------|----|-------|------|--------|-------|

### Future Iteration Items

| Iteration | ID | Title | Type | State | Points |
|-----------|----|-------|------|-------|--------|

---

## Priority Review

### Top 10 by Priority

| Rank | ID | Title | Iteration | State | Points |
|------|----|-------|-----------|-------|--------|

### Flags

- {flag description for each misaligned item}

---

## Action Items for Meeting

Generate 3–7 concrete talking points derived from the analysis:

1. Items requiring grooming before next sprint (list IDs)
2. Unplanned high-priority items to schedule
3. Blocked items needing resolution
4. Capacity risk if any (over/under-committed iteration)
5. Priority conflicts to discuss with team
```

### After Writing

Display to user:
```
Meeting prep written to: wiki/raw/meeting_preparation/{filename}
Iteration: {iteration_name}
Items analyzed: {count} in iteration, {count} in backlog
Items needing grooming: {count}
Unplanned items: {count}
```

---

## Checklist Before Writing

- [ ] ADO tenant resolved
- [ ] Current iteration identified and confirmed
- [ ] All current iteration work items fetched
- [ ] Backlog items fetched
- [ ] Grooming status assessed for every item
- [ ] Planning gaps identified
- [ ] Priority review complete
- [ ] Action items list generated (3–7 items)
- [ ] Output path resolved and unique filename chosen
- [ ] Document written to `wiki/raw/meeting_preparation/`
