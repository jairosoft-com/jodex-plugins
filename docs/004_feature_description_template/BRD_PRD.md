---
ado_sync:
  feature_work_item_id: 204895
  feature_work_item_url: "https://dev.azure.com/jairo/91958783-8c2b-4e19-9fff-c73139334abf/_workitems/edit/204895"
  organization: jairo
  project: Jodex
  last_synced: "2026-05-23T07:34:50Z"
  stories:
    US-004-01: 204896
    US-004-02: 204897
    US-004-03: 204898
    US-004-04: 204899
---
# Structured Feature Description Template for ADO

## Document Metadata
- **Feature ID**: 004
- **Feature Name**: Structured Feature Description Template for ADO
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
| **Target Release** | 2026-06-12 |

---

## Part I: Strategic Foundation (BRD)

### 1. Executive Summary

The ADO sync skill writes Feature work item descriptions as a raw dump of the PRD Executive Summary — unformatted prose that is difficult to scan during standups and lacks the structured context engineers need (personas, scope guardrails, success metrics, feature-level acceptance criteria). Every Feature created by `/jx-pm:ado` requires manual reformatting before it is useful in sprint planning.

This initiative replaces the raw dump with a 6-section structured template that synthesizes the PRD into an execution-focused Feature ticket. The template follows Agile Product Owner conventions: concise bullets, business-focused "why" over technical "how", and feature-level Definition of Done (not Given/When/Then). The change is confined to a single spec file (`ado.md` Phase 5 Feature section), and all existing Features can be updated via re-sync.

### 2. Business Problem & Opportunity

#### Current State

When `/jx-pm:ado` creates a Feature work item, the Description field receives the raw Executive Summary text from the PRD. This is a paragraph of prose — not structured for consumption by engineers, PMs, or stakeholders in ADO.

**Qualitative Evidence:**
- Engineers must re-read the full PRD to find scope boundaries, personas, and success metrics — information that should be at their fingertips in the Feature ticket
- PMs manually reformat Feature descriptions after every sync to add structure, scope guardrails, and Definition of Done criteria
- During standups, Feature descriptions are skipped because they're too dense to scan quickly

#### Root Cause Analysis

The spec (`ado.md` line 163) prescribes a single line for Feature descriptions:
```
Description: Executive Summary / Overview content from PRD
```
No template, no extraction rules, no section mapping. The agent dumps whatever it finds in the Executive Summary.

### 3. Business Objectives & Success Metrics

| Objective ID | SMART Objective | KPI | Current | Target |
|---|---|---|---|---|
| OBJ-004-01 | After implementation, every Feature created by ADO sync contains all 6 template sections (Summary, Persona, Value Hypothesis, Scope, Feature AC, Resources) by 2026-06-12 | Template section count per Feature | 0 sections (raw prose) | 6 sections |
| OBJ-004-02 | Eliminate manual reformatting of Feature descriptions post-sync by 2026-06-12 | Manual reformats per Feature | 1 per Feature | 0 |

### 4. Project Scope

#### In Scope
- Replace Feature Description spec in `ado.md` Phase 5 with structured 6-section template
- Add extraction rules (concise, elevate why, filter how, feature-level AC only)
- Add section-to-PRD mapping table for agent reference
- Update dry-run output to show structured Feature Description preview

#### Out of Scope
- Changes to User Story Description or AC field mapping (already handled by FEAT-002)
- Changes to PRD output format (the ADO sync does the synthesis at write time)
- Changes to allowed-tools or frontmatter-sync.py
- Retroactive update of existing Features (update mode handles this on next re-sync)

### 5. Stakeholder Analysis (RACI)

| Stakeholder | Role | R/A/C/I |
|---|---|---|
| ramon aseniero | Author & Product Owner | R/A |
| jx-pm plugin users | ADO sync consumers | C |
| ADO board readers | Feature ticket consumers | I |

### 6. Assumptions, Constraints & Dependencies

**Assumptions:**
- All PRD templates (lite, standard, unified) contain the sections referenced by the mapping table (Executive Summary, Target Users, Business Objectives, Project Scope, NFRs)
- The agent can synthesize prose into concise bullets at generation time without requiring a separate summarization step
- HTML rendering in ADO supports headings, bullet lists, checkboxes, and emoji characters

**Constraints:**
- MVP scope — single file change to `ado.md`
- Must not break existing User Story creation flow
- Template must work for all three PRD modes (lite, prd, unified)

**Dependencies:**
- PRD must contain the mapped sections. Missing sections produce "Not specified" placeholders (graceful degradation)

### 7. Risk Assessment

| Risk ID | Risk | Likelihood (1-5) | Impact (1-5) | Mitigation |
|---|---|---|---|---|
| RISK-004-01 | Lite PRDs lack some sections (e.g., no Target Users, no NFRs) resulting in sparse Feature descriptions | 3 | 2 | Template handles missing sections with "Not specified" placeholders; lite PRDs still get Summary, Scope, and Resources |
| RISK-004-02 | ADO HTML rendering strips emojis or mangles heading structure | 1 | 3 | ADO supports Unicode emoji and HTML headings; confirmed in prior FEAT-001/002/003 syncs |
| RISK-004-03 | Agent over-synthesizes and loses critical business context from Executive Summary | 2 | 3 | Extraction rule: "2-3 sentence synthesis" provides guardrail; reviewable in dry-run output |

---

## Part II: Tactical Execution (PRD)

### 8. Target Users & Personas

**Primary Persona:** Engineer reading Feature tickets during sprint planning
- Goals: Understand the "what" and "why" of a Feature in under 30 seconds
- Pain Points: Current Feature descriptions are unstructured prose requiring PRD cross-referencing

**Secondary Persona:** PM reviewing Feature tickets after ADO sync
- Goals: Verify the Feature ticket is complete and ready for sprint planning without manual reformatting
- Pain Points: Must manually add scope guardrails, personas, and Definition of Done after every sync

### 9. User Stories

#### GOAL-004-01: Feature descriptions are structured and scannable

### US-004-01: Feature Description uses structured template
**As a** jx-pm plugin user
**I want** the ADO sync to write Feature descriptions using a 6-section structured template
**So that** Feature tickets are scannable during standups and contain all execution context

*Format: Rule-Based — the deliverable is a spec document change prescribing a template; no executable code is produced*

**Acceptance Criteria:**

**Rules:**
- AC-004-01: `ado.md` Phase 5 Feature Description specifies a 6-section template: Summary/Problem Statement, Target Persona, Value Hypothesis & Success Metrics, Scope Guardrails, Acceptance Criteria (Feature Level), Resources & Links
- AC-004-02: Each template section maps to a specific PRD source section via a section-to-PRD mapping table in the spec
- AC-004-03: The spec includes 4 extraction rules: be concise & scannable, elevate the "why", filter out the "how", feature-level AC only (Definition of Done, not Given/When/Then)
- AC-004-04: The Summary/Problem Statement section is limited to 2-3 synthesized sentences, not a raw paragraph dump
- AC-004-05: The Scope Guardrails section explicitly lists both In Scope and Out of Scope as comma-separated items
- AC-004-06: The Acceptance Criteria section uses markdown checkboxes for Definition of Done items, not Given/When/Then format

**Quality Gates:**
- AC-004-07: Lint passes
- AC-004-08: Typecheck passes
- AC-004-09: Unit tests pass

**Validates:** OBJ-004-01

---

### US-004-02: Template handles missing PRD sections gracefully
**As a** jx-pm plugin user
**I want** the structured template to produce "Not specified" placeholders when a PRD section is missing
**So that** lite PRDs and incomplete PRDs don't cause sync failures or empty descriptions

*Format: System State — graceful degradation behavior; verifiable by syncing a lite PRD*

**Acceptance Criteria:**

**System Behavior:**
- AC-004-10: When a PRD has no Target Users section, system writes "Not specified" under the Target Persona heading instead of omitting the section
- AC-004-11: When a PRD has no Business Objectives table, system writes "Not specified" under the Value Hypothesis heading
- AC-004-12: When a PRD has no Out of Scope section, system writes "None defined" under the Out of Scope bullet
- AC-004-13: When a PRD has no NFRs, system uses the default "All child User Stories completed" and quality gates from metadata as Feature-level ACs

**Quality Gates:**
- AC-004-14: Lint passes
- AC-004-15: Typecheck passes
- AC-004-16: Unit tests pass

**Validates:** OBJ-004-01

---

### US-004-03: Dry-run shows structured Feature Description preview
**As a** jx-pm plugin user
**I want** `--dry-run` to show the full structured Feature Description before sync
**So that** I can verify the template is correctly populated from the PRD

*Format: Rule-Based — dry-run output display constraint*

**Acceptance Criteria:**

**Rules:**
- AC-004-17: Dry-run output for the Feature shows the complete 6-section Description preview with all populated content
- AC-004-18: Dry-run output shows which PRD section each template section was extracted from
- AC-004-19: Given a user runs `--dry-run`, When reviewing the Feature Description preview, Then it matches the structured template format — not raw prose

**Quality Gates:**
- AC-004-20: Lint passes
- AC-004-21: Typecheck passes
- AC-004-22: Unit tests pass

**Validates:** OBJ-004-01

---

### US-004-04: Resources & Links section auto-populates from PRD metadata
**As a** jx-pm plugin user
**I want** the Resources & Links section to auto-populate the PRD reference, tech spec path, and ADO link
**So that** the Feature ticket links back to its source documents without manual entry

*Format: Rule-Based — auto-population from existing metadata*

**Acceptance Criteria:**

**Rules:**
- AC-004-23: The PRD link is populated as "{featureId}: {featureName}" from Document Metadata
- AC-004-24: The Technical Spec link is populated from the TECH_SPEC.md path in the same folder if it exists, or "Pending" if not
- AC-004-25: The ADO Link is populated with the Feature work item URL from `ado_sync.feature_work_item_url` after creation (or "Auto-populated after creation" on first sync)
- AC-004-26: Given a PRD folder contains both BRD_PRD.md and TECH_SPEC.md, When sync runs, Then both are referenced in Resources & Links

**Quality Gates:**
- AC-004-27: Lint passes
- AC-004-28: Typecheck passes
- AC-004-29: Unit tests pass

**Validates:** OBJ-004-02

---

### 10. Non-Functional Requirements

| NFR ID | Category | Requirement | Links to | Test Method |
|---|---|---|---|---|
| NFR-004-01 | Compatibility | The structured template must render correctly in ADO's HTML description field (headings, bullets, checkboxes, emojis) | OBJ-004-01 | Visual inspection in ADO after live sync |
| NFR-004-02 | Backward Compatibility | Existing Features can be updated to the new format via update mode re-sync without data loss | OBJ-004-02 | Re-sync FEAT-001 and verify structured description replaces old prose |
| NFR-004-03 | Portability | The template must work for all three PRD modes (lite, prd, unified) with appropriate section fallbacks | OBJ-004-01 | Sync a lite PRD and verify placeholder handling |

### 11. Technical Considerations

- **Architecture:** Single spec file change (`plugins/jx-core/_shared/ado.md` Phase 5 Feature section)
- **HTML format:** Feature Description uses HTML with `<h2>` headings, `<ul>` bullets, and checkbox entities
- **Extraction at sync time:** The agent synthesizes the PRD content into the template during sync — the PRD itself is not modified
- **Section-to-PRD mapping:** The spec includes an inline mapping table so the agent knows exactly which PRD section to read for each template section
- **Emoji rendering:** ADO supports Unicode emoji (confirmed in FEAT-001/002/003 syncs)

### 12. Open Questions & Decision Log

| Question | Date | Decision | Rationale |
|---|---|---|---|
| Should the template be stored as a separate reference file or inline in ado.md? | 2026-05-22 | Inline in ado.md | Keeps the spec self-contained; the template is short enough (~20 lines) |
| Should the Feature AC section include story-count verification (e.g., "5/5 stories closed")? | 2026-05-22 | No — use generic "All child stories closed" | Story count changes as PRD evolves; a static count would go stale |
| Should emojis be configurable or fixed? | 2026-05-22 | Fixed in template | Consistency across all Features; configurability adds complexity without value |

### 13. Release Plan

| Milestone | Target Date | Status |
|---|---|---|
| Requirements Approved (this doc) | 2026-05-22 | Draft |
| Spec updated (ado.md) | 2026-06-05 | Not started |
| Verification (dry-run + live sync) | 2026-06-12 | Not started |
| Published to main | 2026-06-12 | Not started |

---

## Approval

| Role | Name | Date |
|---|---|---|
| Sponsor | ramon aseniero | |
| Product Owner | ramon aseniero | |
