# FEAT-004: Structured Feature Description Template for ADO — Implementation Plan

## Context

The ADO sync skill (`plugins/jx-core/_shared/ado.md`) writes Feature work item descriptions as a raw Executive Summary dump. Engineers and PMs must manually reformat every Feature ticket. This plan replaces the dump with a structured 6-section template synthesized from the PRD at sync time.

**Single file change:** `plugins/jx-core/_shared/ado.md`

## AC-to-Edit Traceability

| AC | Description | Edit Site |
|----|-------------|-----------|
| AC-004-01 | 6-section template specified | Site 2 |
| AC-004-02 | Mapping table present | Site 2 |
| AC-004-03 | 4 extraction rules | Site 2 |
| AC-004-04 | Summary limited to 2-3 sentences | Site 2 |
| AC-004-05 | Scope lists In + Out (comma-separated) | Site 2 |
| AC-004-06 | Feature AC uses HTML checkboxes (☐), not GWT | Site 2 |
| AC-004-10 | Missing Target Users → "Not specified" | Site 2 |
| AC-004-11 | Missing Objectives → "Not specified" | Site 2 |
| AC-004-12 | Missing Out of Scope → "None defined" | Site 2 |
| AC-004-13 | Missing NFRs → default ACs from quality gates | Site 2 |
| AC-004-17 | Dry-run shows 6-section preview | Site 4 |
| AC-004-18 | Dry-run shows PRD source provenance | Site 4 |
| AC-004-19 | Dry-run matches structured format | Site 4 |
| AC-004-23 | PRD link from Document Metadata | Site 2 |
| AC-004-24 | Tech Spec from folder inspection | Sites 1+2 |
| AC-004-25 | ADO Link two-state (placeholder/URL) | Sites 2+3 |
| AC-004-26 | Both files referenced when both exist | Sites 1+2 |
| AC-004-07..09, 14..16, 20..22, 27..29 | Quality gate ACs (lint/typecheck/unit tests) | N/A — doc-only spec change; see backlog idea "Quality Gates Applied to Doc-Only Stories" |

## Edits (5 sites, single file)

### Site 1: Phase 2, line 56 — expand extraction scope
Replace single "Feature description" extraction line with multi-section extraction listing all PRD sections the template needs. Preserve the full source priority: `Executive Summary` → `Overview` + `Problem Statement` → `Introduction` (existing fallback chain maintained). Phase 2 = "what to read"; Phase 5 = "how to format".

### Site 2: Phase 5, lines 161-163 — the primary deliverable
Replace the 3-line Feature block with:
- HTML template showing all 6 sections with emoji markers and **HTML checkbox representation (☐)** — NOT markdown `- [ ]` since `System.Description` is an HTML field
- 4 extraction rules (concise, elevate why, filter how, feature-level AC only)
- Section-to-PRD mapping table with 3 columns (Unified, Standard, Lite)
- Scope Guardrails rendered as comma-separated items per AC-004-05
- Placeholder rules for missing sections ("Not specified" / "None defined")
- Resources & Links auto-population rules (TECH_SPEC.md detection, ADO Link two-state)
- Preserve Tags line

### Site 3: Phase 5, Field Update Rules + Creation Order — Feature re-sync + ADO Link update
- Update Description row: "Feature: re-render structured template. User Story: narrative only, no ACs."
- Add paragraph: update mode for Features re-renders full template, upgrades pre-template Features
- **Add post-create Feature Description update step:** After `wit_create_work_item` returns the Feature URL and frontmatter write-back is done, issue `wit_update_work_item` to re-render the Resources & Links section with the actual `ado_sync.feature_work_item_url` (replacing the "Auto-populated after creation" placeholder). This is 1 extra API call on first sync only.

### Site 4: Phase 5, Dry-Run — Feature preview
Add Feature Description preview showing 6-section template with provenance annotations per section (e.g., `[from: ### 1. Executive Summary]` or `[placeholder: section not found]`)

### Site 5: Checklist — Feature validation items
Add items that **distinguish Feature from User Story**:
- `[ ] Feature Description uses 6-section structured template`
- `[ ] Feature Description includes feature-level AC (Definition of Done checkboxes) — this is distinct from User Story Description which contains narrative only`
- `[ ] Missing PRD sections produce placeholders, not empty/omitted sections`
- `[ ] Dry-run Feature preview shows 6-section template with provenance annotations`
- `[ ] Resources & Links: TECH_SPEC.md detected if present; ADO Link auto-populated after creation`

**Note:** The existing checklist item "Description contains narrative only — no AC content" applies to **User Story** descriptions only. Add a clarifying qualifier: "User Story Description contains narrative only — no AC content"

## Key Design Decisions

- **D1: HTML template with ☐ checkboxes** — `System.Description` is an HTML field in ADO. Use Unicode ☐ (ballot box) for checkboxes, not markdown `- [ ]`. ADO renders HTML natively; markdown checkboxes would display as plain text. (Codex R1 finding: HTML vs Markdown ambiguity)
- **D2: ADO Link two-state with post-create update** — first sync writes placeholder in Feature Description, creates Feature via `wit_create_work_item`, captures URL, writes frontmatter, then `wit_update_work_item` re-renders Resources section with actual URL. 1 extra API call on first sync only. (Codex R1 finding: missing edit site for post-create update)
- **D3: Standard PRD column** — added to mapping table (Introduction vs Executive Summary, Goals vs Business Objectives)
- **D4: In Scope derivation** — lite/standard PRDs derive In Scope from User Story titles when no explicit section exists
- **D5: Phase 2/5 split** — Phase 2 lists what to extract; Phase 5 defines how to format (consistent with existing pattern)
- **D6: Checklist distinguishes Feature vs User Story** — "narrative only" applies to User Story; Feature includes feature-level AC section. (Codex R1 finding: checklist contradiction)

## Adversarial Review Log

### Round 1 (Codex, 2026-05-22)
Verdict: pass-with-warnings (7 findings)

| Finding | Severity | Resolution |
|---------|----------|------------|
| Checklist contradiction (narrative-only vs Feature AC) | warning | Site 5 updated to distinguish Feature vs User Story |
| HTML vs Markdown checkbox ambiguity | warning | D1 updated: use Unicode ☐, not markdown `- [ ]` |
| Missing post-create Feature update step | warning | D2 + Site 3 expanded with explicit update step |
| Quality gate ACs omitted from traceability | warning | Added as N/A row — doc-only spec change |
| Comma-separated Scope format | warning | Site 2 note added per AC-004-05 |
| Overview fallback preservation | warning | Site 1 already preserves full fallback chain |
| NFR-004-02 overwrite risk | warning | By design — "PRD wins" is the existing contract |

## What NOT to change
- User Story fields (handled by FEAT-002)
- PRD output format (synthesis happens at sync time)
- allowed-tools in commands/ado.md
- frontmatter-sync.py or validate-ac-blocks.sh

## Verification
1. Read-back: confirm all 5 sites edited correctly
2. AC coverage: walk traceability matrix, verify each AC addressed
3. Dry-run test: run on FEAT-001/002/003/004 PRDs, verify structured Feature preview
4. Live sync test: sync a PRD and verify wit_get_work_item shows 6-section HTML Description with ☐ checkboxes
5. Lite PRD test: verify placeholder handling for missing sections
6. ADO Link test: verify first-sync placeholder → post-create URL substitution
