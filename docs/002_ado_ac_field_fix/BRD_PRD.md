# ADO Sync AC Field Fix

## Document Metadata
- **Feature ID**: 002
- **Feature Name**: ADO Sync AC Field Fix
- **Document Type**: BRD_PRD
- **Generated Date**: 2026-05-22
- **Quality Profile**: default
- **Quality Gates**:
  - Lint passes
  - Typecheck passes
  - Unit tests pass

## Document Control

| Attribute | Details |
|-----------|---------|
| **Status** | Draft |
| **Project Sponsor** | ramon aseniero |
| **Product Owner** | ramon aseniero |
| **Target Release** | 2026-06-05 |

---

## Part I: Strategic Foundation (BRD)

### 1. Executive Summary

The jx-pm ADO sync skill creates User Story work items in Azure Boards but writes acceptance criteria into `System.Description` instead of the dedicated `Microsoft.VSTS.Common.AcceptanceCriteria` field. This happens because the MCP tool used for story creation (`wit_add_child_work_items`) only accepts `title` and `description` parameters. The result: ADO boards show an empty Acceptance Criteria tab, forcing users to manually relocate ACs or read them from an overloaded Description field.

This initiative updates the ADO sync spec (`jx-core/_shared/ado.md`) to prescribe a two-step creation flow: create stories with parent linking via `wit_add_child_work_items`, then populate the AC field and clean Description via `wit_update_work_item`. The change is confined to a single spec file, both tools are already in the allowed-tools list, and the fix is backward compatible.

### 2. Business Problem & Opportunity

#### Current State

When `jx-pm:ado` syncs a PRD to Azure Boards, User Story work items are created with:
- `System.Description`: Contains story narrative + acceptance criteria (combined)
- `Microsoft.VSTS.Common.AcceptanceCriteria`: Empty

**Qualitative Evidence:**
- ADO board users cannot see ACs in the dedicated Acceptance Criteria tab — they must scroll through the Description field
- The ADO Kanban board's built-in AC checklist feature does not work because the AC field is empty
- Manual copy-paste from Description to AC field is required after every sync, negating the automation benefit

#### Root Cause Analysis

The skill spec (`ado.md` lines 163-177) correctly designs two separate fields but:
1. Never names the ADO field path (`Microsoft.VSTS.Common.AcceptanceCriteria`)
2. Never prescribes which MCP tool to use for story creation
3. Does not address the `wit_add_child_work_items` limitation (no AC parameter)

The executing agent uses `wit_add_child_work_items` for its convenient parent-linking behavior and merges all content into the only available field (`description`).

### 3. Business Objectives & Success Metrics

| Objective ID | SMART Objective | KPI | Current | Target |
|---|---|---|---|---|
| OBJ-002-01 | Eliminate manual AC relocation by auto-populating `Microsoft.VSTS.Common.AcceptanceCriteria` on every ADO sync by 2026-06-05 | AC field populated after sync | 0% of stories | 100% of stories |
| OBJ-002-02 | Ensure `System.Description` contains only the story narrative (As a / I want / So that + Validates) with no AC content leaking into Description by 2026-06-05 | Description field contains no AC lines | 0% of stories | 100% of stories |

### 4. Project Scope

#### In Scope
- Update `plugins/jx-core/_shared/ado.md` Phase 5 to prescribe two-step creation (create+link, then update AC field)
- Add explicit ADO field name `Microsoft.VSTS.Common.AcceptanceCriteria` to the spec
- Update Field Update Rules table to include AC field
- Update dry-run output spec to show field mapping per story

#### Out of Scope
- Retroactive fix for previously synced stories (not MVP — update mode handles on next re-sync)
- Changes to `wit_add_child_work_items` MCP tool itself (upstream dependency)
- Changes to allowed-tools in `commands/ado.md` (`wit_update_work_item` already present)
- Changes to frontmatter-sync.py or validate-ac-blocks.sh

### 5. Stakeholder Analysis (RACI)

| Stakeholder | Role | R/A/C/I |
|---|---|---|
| ramon aseniero | Author & Product Owner | R/A |
| jx-pm plugin users | ADO sync consumers | C |
| ADO board users | Story readers | I |

### 6. Assumptions, Constraints & Dependencies

**Assumptions:**
- `wit_update_work_item` supports setting `Microsoft.VSTS.Common.AcceptanceCriteria` via the path `/fields/Microsoft.VSTS.Common.AcceptanceCriteria` (confirmed in live session 2026-05-22)
- `wit_add_child_work_items` returns the created work item IDs needed for the follow-up update call
- The two-step approach (create then update) does not introduce race conditions in ADO

**Constraints:**
- MVP scope only — single spec file change, no code changes
- Must not break existing `--dry-run` behavior
- Must remain backward compatible with PRDs that were synced under the old single-field behavior

**Dependencies:**
- `mcp__azure-devops__wit_update_work_item` MCP tool must remain available
- `mcp__azure-devops__wit_add_child_work_items` must continue returning created work item IDs in its response

### 7. Risk Assessment

| Risk ID | Risk | Likelihood (1-5) | Impact (1-5) | Mitigation |
|---|---|---|---|---|
| RISK-002-01 | `wit_update_work_item` rejects the AC field path for User Story work item type | 1 | 4 | Already confirmed working in live session (2026-05-22); add pre-flight check note to spec |
| RISK-002-02 | Two-step creation adds latency to sync (extra API call per story) | 3 | 1 | Acceptable trade-off; stories are created infrequently; update calls are lightweight |
| RISK-002-03 | Crash between create and update leaves story with combined Description and empty AC | 2 | 2 | Existing crash recovery (tag-based search) handles re-identification; update mode re-sync corrects field layout |

---

## Part II: Tactical Execution (PRD)

### 8. Target Users & Personas

**Primary Persona:** jx-pm Plugin User
- Goals: Sync PRD to Azure Boards with correct field mapping — ACs in the AC field, description in Description
- Pain Points: Must manually move ACs from Description to AC field after every sync; ADO Kanban AC checklist feature is unusable

### 9. User Stories

#### GOAL-002-01: User Stories are created with ACs in the correct ADO field

### US-002-01: Acceptance criteria populate the dedicated AC field
**As a** jx-pm plugin user
**I want** the ADO sync to write acceptance criteria into `Microsoft.VSTS.Common.AcceptanceCriteria`
**So that** ACs appear in the Acceptance Criteria tab and the ADO Kanban checklist works

*Format: System State — the change is an internal field-mapping behavior with no UI interaction; verifiable via API field inspection*

**Acceptance Criteria:**

**System Behavior:**
- AC-002-01: When a User Story is created via ADO sync, system sets `Microsoft.VSTS.Common.AcceptanceCriteria` with routed ACs (Gherkin for scenarios/rules, pass-through for system_behavior)
- AC-002-02: When a User Story is created via ADO sync, system sets `System.Description` with only the story narrative ("As a / I want / So that" + "Validates:") and no AC content
- AC-002-03: When a User Story has only quality-gate ACs (all excluded), system leaves `Microsoft.VSTS.Common.AcceptanceCriteria` empty and logs a warning
- AC-002-04: When ADO sync crashes between `wit_add_child_work_items` and `wit_update_work_item`, system recovers via tag-based search on next sync and corrects field layout

**Quality Gates:**
- AC-002-05: Lint passes
- AC-002-06: Typecheck passes
- AC-002-07: Unit tests pass

**Validates:** OBJ-002-01, OBJ-002-02

---

### US-002-02: Update mode corrects field layout on re-sync
**As a** jx-pm plugin user
**I want** re-syncing an existing PRD to split combined Description+AC content into the correct fields
**So that** stories created under the old behavior get fixed without manual intervention

*Format: System State — re-sync is a background field-correction operation; verifiable via API field inspection*

**Acceptance Criteria:**

**System Behavior:**
- AC-002-08: When update mode detects a story whose `Microsoft.VSTS.Common.AcceptanceCriteria` is empty and `System.Description` contains AC lines, system splits content into the correct fields
- AC-002-09: When update mode runs on a story already split correctly, system overwrites both fields with current PRD content (PRD wins per Field Update Rules)
- AC-002-10: When update mode runs, system never overwrites Story Points (preserve ADO value rule unchanged)

**Quality Gates:**
- AC-002-11: Lint passes
- AC-002-12: Typecheck passes
- AC-002-13: Unit tests pass

**Validates:** OBJ-002-01

---

### US-002-03: Spec names explicit ADO field and prescribes tool sequence
**As a** jx-pm plugin maintainer
**I want** the ADO sync spec to explicitly name `Microsoft.VSTS.Common.AcceptanceCriteria` and prescribe the two-step creation flow
**So that** future agents implement the correct field mapping without ambiguity

*Format: Rule-Based — the deliverable is a spec document change; requirements express content rules*

**Acceptance Criteria:**

**Rules:**
- AC-002-14: `ado.md` Phase 5 Work Item Fields section names `Microsoft.VSTS.Common.AcceptanceCriteria` as the target field for acceptance criteria
- AC-002-15: `ado.md` Phase 5 prescribes two-step creation: (1) `wit_add_child_work_items` for create+parent-link with Description-only content, (2) `wit_update_work_item` to set AC field
- AC-002-16: `ado.md` Phase 5 Field Update Rules table includes `Acceptance Criteria (Microsoft.VSTS.Common.AcceptanceCriteria)` with behavior "PRD wins — always update"
- AC-002-17: `ado.md` Phase 5 specifies that `wit_add_child_work_items` description parameter receives ONLY the story narrative, not ACs
- AC-002-18: Given an agent reads the spec, When it encounters Phase 5 story creation, Then the tool sequence and field mapping are unambiguous — no spec interpretation required

**Quality Gates:**
- AC-002-19: Lint passes
- AC-002-20: Typecheck passes
- AC-002-21: Unit tests pass

**Validates:** OBJ-002-01, OBJ-002-02

---

### US-002-04: Dry-run output shows field mapping
**As a** jx-pm plugin user
**I want** `--dry-run` to show which content goes to Description vs Acceptance Criteria
**So that** I can verify field mapping before executing a live sync

*Format: Rule-Based — dry-run output is a display format constraint*

**Acceptance Criteria:**

**Rules:**
- AC-002-22: Dry-run output for each story shows a `Description:` preview containing only the story narrative
- AC-002-23: Dry-run output for each story shows an `Acceptance Criteria:` preview containing routed ACs
- AC-002-24: Dry-run output for each story shows excluded quality-gate ACs with reason
- AC-002-25: Given a user runs `--dry-run`, When reviewing a story's planned fields, Then the Description and AC content are shown separately — not combined

**Quality Gates:**
- AC-002-26: Lint passes
- AC-002-27: Typecheck passes
- AC-002-28: Unit tests pass

**Validates:** OBJ-002-01

---

### 10. Non-Functional Requirements

| NFR ID | Category | Requirement | Links to | Test Method |
|---|---|---|---|---|
| NFR-002-01 | Performance | The additional `wit_update_work_item` call per story must add less than 2 seconds per story to total sync time | OBJ-002-01 | Timed comparison: sync with and without AC update step |
| NFR-002-02 | Backward Compatibility | PRDs synced under the old single-field behavior must continue to work in update mode without manual intervention | OBJ-002-01 | Re-sync an existing PRD; verify fields split correctly |
| NFR-002-03 | Reliability | Crash recovery between create and update steps must not result in duplicate work items or lost AC data | OBJ-002-01 | Simulate crash after create, before update; re-run sync; verify recovery |

### 11. Technical Considerations

- **Architecture:** Single spec file change (`plugins/jx-core/_shared/ado.md`), no code changes
- **Tool sequence:** `wit_add_child_work_items` (create + parent link) → `wit_update_work_item` (set AC field + clean Description)
- **ADO field path:** `/fields/Microsoft.VSTS.Common.AcceptanceCriteria`
- **HTML format:** AC field content should use HTML format (ordered list) matching the Description format
- **Existing crash recovery:** Tag-based search (`prd:{story_id}`) handles the gap between create and update

### 12. Open Questions & Decision Log

| Question | Date | Decision | Rationale |
|---|---|---|---|
| Should we retroactively fix existing synced stories? | 2026-05-22 | No — not MVP | Update mode will fix them on next re-sync; avoids batch migration risk |
| Which tool approach for story creation? | 2026-05-22 | Option B (create+link, then update) | Both tools already in allowed-tools; simpler than manual parent linking |
| Should the Description field contain a "See Acceptance Criteria tab" pointer? | 2026-05-22 | No | Adds noise; ADO UI already shows the AC tab prominently |

### 13. Release Plan

| Milestone | Target Date | Status |
|---|---|---|
| Requirements Approved (this doc) | 2026-05-22 | Draft |
| Spec updated (ado.md) | 2026-05-29 | Not started |
| Verification (dry-run + live sync) | 2026-06-05 | Not started |
| Published to main | 2026-06-05 | Not started |

---

## Approval

| Role | Name | Date |
|---|---|---|
| Sponsor | ramon aseniero | |
| Product Owner | ramon aseniero | |
