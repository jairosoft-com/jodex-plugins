# Plan: Multi-Format Acceptance Criteria for PRD Skill

## Problem

The PRD skill (`plugins/jx-pm/skills/prd/SKILL.md`) generates acceptance criteria in a single format — flat bullet list (Rule-Based checklist). Industry best practice (confirmed by NotebookLM sources and the Gemini AC prompt) recommends three formats, conditionally selected based on story type.

## Source Material

Gemini prompt defines three formats with conditional selection:
- **Condition A (User Journeys):** Scenario-Based (Given/When/Then) for UI flows
- **Condition B (Constraints & Logic):** Rule-Based (Checklist) for validations, permissions, rules
- **Condition C (Backend & Data):** System State / Flow for APIs, migrations, background processing
- **Hybrid:** Complex stories use multiple formats, clearly separated
- **Happy/Unhappy Paths:** Every AC must cover success AND failure explicitly

## Hard Constraints

### HC-1: Single-Line AC Body (Enforced)

All AC formats MUST remain single-line after the `AC-{NNN}-{seq}:` prefix. The ADO parser (`jx-core/_shared/ado.md:61-62`) uses line-based extraction: `AC-{NNN}-{seq}: {text}`. Multi-line bodies break parsing.

**Enforcement (shared validator, two call sites):**

A shared AC block validator script (`plugins/jx-core/scripts/validate-ac-blocks.sh` or equivalent) performs the block-level validation. It is invoked from two call sites:
1. **PRD Save (Phase 6):** Before writing the PRD file. PRD is not saved until all ACs pass.
2. **ADO Sync (Phase 2):** Before dry-run or any write. Halt with line-numbered failures if invalid. This catches hand-edited or externally generated PRDs that bypass the PRD generator.

The validator is a shared executable — not prompt instructions — ensuring consistent enforcement regardless of LLM behavior. Add `Bash(validate-ac-blocks:*)` to the `allowed-tools` in both `plugins/jx-pm/commands/prd.md` and `plugins/jx-pm/commands/ado.md`.

Examples of compliant formats:
```
Rule-Based:
- AC-006-01: Payment details stored using PCI-compliant tokenization

Scenario-Based:
- AC-006-02: Given user is on checkout page, When they click "Buy Now", Then order processes within 2s

System State:
- AC-006-03: When POST /orders receives valid payload, system creates order record with status=pending and returns 201
```

### HC-2: Quality Gates Keep AC IDs

Quality gate criteria (Lint passes, Typecheck passes, Unit tests pass, E2E tests pass) continue to consume sequential AC IDs in the global counter. They are visually grouped under a `**Quality Gates:**` sub-header but are NOT excluded from the ID sequence. Rationale: the ADO skill's exclusion logic (`ado.md:148`) matches by keyword in the AC text — this requires the text to exist on an AC-prefixed line.

### HC-3: Backward Compatibility

Existing PRDs generated under the single-format convention continue to work unchanged. The ADO re-sync flow (Update mode) handles them without requiring format rationale or hybrid sub-headers. Format upgrade is opt-in — only applies when a PRD is regenerated.

### HC-4: Global AC Counter Unchanged

The global AC counter rule is unchanged: ACs never reset per story. Unhappy-path ACs count toward the global counter like any other AC. No non-contiguous numbering.

## Downstream Impact Assessment

### ADO Skill (`jx-core/_shared/ado.md`) — REQUIRES UPDATE

**Current behavior (line 148):** "Acceptance Criteria field: Gherkin synthesized from behavioral ACs. Exclude quality-gate criteria (lint, typecheck, tests)."

**Problem:** If the PRD now produces Given/When/Then ACs directly, the Gherkin synthesizer will double-process them.

**Resolution — Sub-header detection with quality-gate keyword fallback:**

The fix spans two ADO phases:

#### ADO Phase 2 (Parse PRD) — Extract Format Context

Current Phase 2 extracts only `AC-{NNN}-{seq}: {text}` lines. Update to also capture the preceding bold sub-header for each AC group. For each story, produce a list of `{ac_id, text, format_group}` tuples:

```
Parse rules:
1. Locate the **Acceptance Criteria:** container header within each story block. Sub-header detection is SCOPED to the AC block only (between **Acceptance Criteria:** and the AC block boundary: **Validates:**, next ### US- heading, next ## heading, or end of story). Bold labels like **Rules:** or **Scenarios:** outside the AC block are IGNORED for routing.
2. Within the AC block, scan for routing sub-headers: **Scenarios:**, **Rules:**, **System Behavior:** (or alias **System State:**), **Quality Gates:**
3. ACs following a routing sub-header inherit that sub-header's format group
4. **Acceptance Criteria:** itself is a NON-ROUTING container — it resets any inherited format group to none
4. ACs with no preceding format sub-header → format_group = "legacy"
```

#### ADO Phase 5 (Create/Update) — Format Routing

| format_group | ADO Behavior |
|------------|-------------|
| `scenarios` | Pass through as-is (already Gherkin) |
| `scenarios_inferred` | Pass through as-is (inferred from legacy G/W/T pattern; dry-run warning logged) |
| `rules` | Synthesize Gherkin (current behavior) |
| `system_behavior` | Pass through as-is (technical behavior spec) |
| `system_behavior_inferred` | Pass through as-is (inferred from legacy system-state pattern; dry-run warning logged) |
| `quality_gates` | Exclude from AC field |
| `legacy` | Apply exact-phrase quality-gate exclusion FIRST, then synthesize remaining as Gherkin |

#### Quality-Gate Exclusion — Two-Layer Gate

Quality-gate exclusion uses two layers with explicit precedence:

**Rule: Sub-header routing is authoritative.** If an AC has a format group from a sub-header (`scenarios`, `rules`, `system_behavior`), it is NEVER excluded by phrase matching — the sub-header is the final routing decision. This prevents silent loss of deliberately-placed functional ACs.

1. **Sub-header layer:** ACs with `format_group = "quality_gates"` (under `**Quality Gates:**`) are always excluded
2. **Normalized exact-phrase layer (legacy only):** For ACs with `format_group = "legacy"` only, normalize the AC text (strip trailing annotations like `*(UI stories only)*`, trim whitespace) then exclude if it matches any of these exact phrases:
   - `Lint passes`
   - `Typecheck passes`
   - `Unit tests pass`
   - `E2E tests pass`
   
   This is normalized exact string matching, NOT keyword substring matching — an AC like "Given user runs E2E suite, When tests complete, Then dashboard updates" is NOT excluded because it doesn't match any exact phrase after normalization. But `E2E tests pass *(UI stories only)*` IS excluded because normalization strips the annotation.

**Precedence summary:**
- `quality_gates` format_group → always exclude
- `scenarios`, `rules`, `system_behavior`, `*_inferred` → never exclude by phrase (sub-header is authoritative)
- `legacy` → apply normalized exact-phrase exclusion, then route remainder to synthesis

This ensures HC-3 backward compatibility: existing PRDs with flat-list quality-gate ACs (including annotated variants from the current prd-template) under a plain `**Acceptance Criteria:**` header are excluded by normalized exact-phrase match, identical to current behavior.

**Dry-run output must show every excluded AC with the exact exclusion rule used** (sub-header vs normalized exact-phrase, showing the normalization if applied).

#### Dry-Run Verification

The `--dry-run` output MUST show format routing for each AC:
```
Story: US-009-01
  AC-009-01 [scenarios] → pass-through: "Given user has saved payment..."
  AC-009-02 [scenarios] → pass-through: "Given user clicks Buy Now with expired card..."
  AC-009-03 [quality_gates] → excluded: "Lint passes"
  AC-009-04 [quality_gates] → excluded: "Typecheck passes"

Story: US-009-02 (legacy, no sub-headers)
  AC-009-08 [legacy] → synthesize: "Payment details stored using PCI-compliant tokenization"
  AC-009-09 [legacy/exact-phrase-excluded] → excluded: "Lint passes"
  AC-009-10 [scenarios_inferred] → pass-through (WARNING: no sub-header): "Given user enters invalid card, When form submits, Then error message displays"
  AC-009-11 [system_behavior_inferred] → pass-through (WARNING: no sub-header): "When POST /refund receives valid payload, system creates refund record"
```

### Spec Skill (`jx-dev/skills/spec/SKILL.md`) — NO CHANGE REQUIRED

The spec skill references AC IDs only (`Related Requirements: AC-{NNN}-{seq}`), not AC bodies. The spec skill uses EARS syntax (When/If/While...shall) for its own system behavior descriptions — this overlaps with PRD G/W/T but operates at a different abstraction level (spec = architecture, PRD = user intent). Documented as acceptable redundancy.

### Task Skill (`jx-core/_shared/task.md`) — REQUIRES UPDATE

**Problem:** `task.md` uses AC count for split thresholds, hour estimates, and story points. With happy/unhappy paths + quality gates, inflated AC counts trigger unnecessary story splitting and inflated estimates.

**Resolution:** Update `task.md` sizing logic to use functional-scenario counting with the same exclusion rules as ADO:
- **Count:** Functional ACs (scenarios, rules, system state behaviors)
- **Exclude from count:** Quality gate ACs identified by sub-header (`**Quality Gates:**`) OR by normalized exact-phrase match (`Lint passes`, `Typecheck passes`, `Unit tests pass`, `E2E tests pass` after stripping annotations). This is the same two-layer exclusion used in ADO — NOT keyword substring matching.
- **Collapse unhappy paths:** When a story has >3 unhappy-path ACs testing the same flow with different error conditions, count them as 1 complexity unit for sizing (but preserve all IDs)
- **Apply to:** Split thresholds, hour estimates, story point derivation

### Story Points Calibration (ADO)

ADO skill derives story points from "AC count and complexity" (`ado.md:149`). Add calibration note: "When estimating story points, weight by functional scenario count (excluding quality gates), not raw AC line count."

## Changes

### 1. SKILL.md — Phase 5 (Generate Document)

Add **AC Format Selection** subsection after the existing User Story Format block.

#### Format Selection Rules

| Condition | Story Type | Format | Example |
|-----------|-----------|--------|---------|
| A | User interacts with UI in step-by-step flow | Scenario-Based (Given/When/Then) | Login, checkout, form submission |
| B | Field validations, permissions, constraints, accessibility | Rule-Based (Checklist) | Password rules, role access, WCAG |
| C | Background processing, API payloads, data migrations | System State / Flow | Webhook handler, ETL job, API integration |

**Hybrid:** Complex stories may need multiple formats. Separate with bold sub-headers:
- `**Scenarios:**` — Given/When/Then items
- `**Rules:**` — Checklist items
- `**System Behavior:**` — State/flow items (canonical name)
- `**Quality Gates:**` — Always present, always Rule-Based

**Sub-header aliases:** The ADO parser recognizes `**System State:**` as an alias for `**System Behavior:**` — both route to pass-through. The canonical name in templates and examples is `**System Behavior:**` but either is valid.

These sub-headers serve dual purpose: visual grouping in the PRD AND format detection for ADO sync.

#### Format Rationale

Before the Acceptance Criteria block, add an italic line explaining the format choice:

```markdown
*Format: Scenario-Based — user-facing checkout flow with step-by-step journey*

**Acceptance Criteria:**

**Scenarios:**
- AC-009-08: Given user has saved payment, When they click "Buy Now", Then order completes within 2s
- AC-009-09: Given user clicks "Buy Now" with expired card, When payment fails, Then error message displays with retry option

**Quality Gates:**
- AC-009-10: Lint passes
- AC-009-11: Typecheck passes
- AC-009-12: Unit tests pass
- AC-009-13: E2E tests pass
```

#### Happy/Unhappy Paths

Every story MUST include at least one happy-path AC and one unhappy-path AC. Unhappy paths cover error handling, edge cases, and failure recovery. They consume normal global AC IDs.

#### Mode-Specific Defaults

| Mode | Default AC Format | Format Selection |
|------|-------------------|------------------|
| `lite` | Rule-Based (checklist) | Escalate to Scenario-Based or System State only if story type demands it |
| `prd` | Conditional per story | Full format selection rules apply |
| `unified` | Conditional per story | Full format selection rules apply |

### 2. SKILL.md — AC ID Granularity

Codify in Phase 5: **one scenario = one AC ID**. The full G/W/T or System State body sits on a single line after the AC ID prefix.

```markdown
**Scenarios:**
- AC-006-01: Given user is on checkout page, When they click "Buy Now", Then order processes within 2s
- AC-006-02: Given user clicks "Buy Now" with expired card, When payment fails, Then error message displays with retry option

**Quality Gates:**
- AC-006-03: Lint passes
- AC-006-04: Typecheck passes
- AC-006-05: Unit tests pass
- AC-006-06: E2E tests pass
```

### 3. SKILL.md — Phase 6 (Save) — Pre-Save Validation

Add a validation step before writing the file:

**Single-line AC validation (block-level rule):**

Within each acceptance-criteria group (between `**Acceptance Criteria:**` and the first of: `**Validates:**`, next `### US-` heading, next `##` heading, or end of story), every non-blank line MUST match one of these patterns:
- AC bullet: `- AC-{NNN}-{seq}: {text}` (the AC line itself)
- Bold sub-header: `**Scenarios:**`, `**Rules:**`, `**System Behavior:**`, `**System State:**`, `**Quality Gates:**`
- Format rationale: italic line starting with `*Format:`

The `**Validates:**` line and any content after it is story metadata, NOT part of the AC block — it is not validated by this rule.

Any line within the AC block that does not match these patterns is flagged as a continuation/orphan line:
```
Error: Orphan line detected in AC block (line 47)

Expected: AC bullet, sub-header, format rationale, or blank line
Found: "    When they click 'Buy Now', Then order processes"

This appears to be continuation text from AC-006-02 on line 46.
The ADO parser will silently drop this line during sync.

Fix: Rewrite AC-006-02 as a single line.
```

This identical rule applies in both PRD save (Phase 6) and ADO sync (Phase 2). Do NOT save/sync until all AC blocks pass validation.

### 4. id-rules.md — Multi-Format AC ID Rules

Add to the "Global AC Counter (Critical)" section:

```markdown
## AC Format Compatibility

AC IDs support three body formats. All MUST remain single-line:

- **Scenario-Based:** `AC-{NNN}-{seq}: Given [context], When [action], Then [result]`
- **Rule-Based:** `AC-{NNN}-{seq}: [Constraint or validation statement]`
- **System State:** `AC-{NNN}-{seq}: When [trigger], system [action] and returns [result]`

One scenario/rule/state = one AC ID. The global counter applies uniformly across all formats.
```

### 5. ADO Skill — Two-Phase Format Detection

Update `plugins/jx-core/_shared/ado.md` in two phases:

**Phase 2 (Parse PRD) update:**
- Extend story extraction to capture bold sub-headers preceding AC groups
- Produce `{ac_id, text, format_group}` tuples per story
- `**Acceptance Criteria:**` is a non-routing container (does not set format group)
- ACs with no format sub-header → `format_group = "legacy"`
- **Single-line AC validation:** Before proceeding to Phase 3+, validate all AC lines are single-line. If any AC has continuation text on the next line, halt with line-numbered error. This catches hand-edited PRDs that bypass the generator's Phase 6 validation.
- **Orphaned format promotion (soft, with confirmation):** After initial classification, scan ACs with `format_group = "legacy"` for format-indicative patterns:
  - AC text matches full Given/When/Then structure (contains all three keywords: `Given `, `When `, `Then `) → **promote to `format_group = "scenarios_inferred"`**
  - AC text matches System State pattern (`When [trigger], system [action]` — must contain both `When ` and `system `) → **promote to `format_group = "system_behavior_inferred"`**
  - Partial matches (e.g., text starts with `Given` but lacks `When`/`Then`) remain `format_group = "legacy"` and are synthesized normally
  - All other legacy ACs remain `format_group = "legacy"`
  - **Visibility in ALL sync modes (not just dry-run):** For each promoted AC, display in the sync report: "AC-{NNN}-{seq} inferred as Scenario-Based/System State (no sub-header found). Consider adding **Scenarios:** or **System Behavior:** sub-header."
  - **Confirmation gate for ALL non-dry-run sync modes (Normal, Partial, Update):** If any ACs were inferred-promoted, pause before any `wit_create_work_item` or `wit_update_work_item` call and show the inferred routing. User must confirm before ADO writes proceed. This prevents silent overwrite of existing Azure Boards AC content during Partial or Update mode. (Dry-run mode shows this info without the gate.)
  - This preserves HC-3: legacy PRDs with full G/W/T or system-state wording pass through correctly. The confirmation gate prevents silent misclassification.

**Phase 5 (Create/Update) update:**
- Route ACs by format_group: scenarios/scenarios_inferred → pass-through, rules → synthesize, system_behavior/system_behavior_inferred → pass-through, quality_gates → exclude, legacy → exact-phrase-exclude then synthesize
- Quality-gate exclusion precedence: sub-header routing is authoritative — ACs under functional sub-headers are NEVER phrase-excluded. Exact-phrase exclusion applies ONLY to `legacy` format_group ACs.
- Dry-run output shows format routing per AC for verification

**Story points calibration:** "When estimating story points, weight by functional scenario count (excluding quality gates), not raw AC line count."

### 6. Task Skill — Sizing Calibration

Update `plugins/jx-core/_shared/task.md` sizing logic:

**Before:** AC count used directly for split thresholds, hour estimates, story points.

**After:** Use functional-scenario counting with the same two-layer exclusion as ADO:
- Count functional ACs only (scenarios, rules, system state behaviors)
- Exclude quality gate ACs using the same two-layer gate with precedence as ADO:
  1. **Sub-header layer:** ACs with `format_group = "quality_gates"` are excluded
  2. **Normalized exact-phrase layer (legacy only):** For `legacy` format_group ACs, exclude normalized exact phrases: `Lint passes`, `Typecheck passes`, `Unit tests pass`, `E2E tests pass`
  3. **Sub-header is authoritative:** ACs under functional sub-headers (scenarios, rules, system_behavior) are NEVER phrase-excluded
- Do NOT use keyword substring matching — an AC like "Given QA engineer runs E2E tests, When suite completes, Then dashboard shows pass rate" is a functional AC and MUST be counted
- When a story has >3 unhappy-path ACs testing the same flow with different error conditions, count them as 1 complexity unit for sizing (but preserve all IDs)

Update `plugins/jx-core/_shared/task-json-schema.md` to replace raw AC-count thresholds with the same functional-scenario counting rules. This is a required update — task.md and the schema must use identical exclusion logic.

### 7. Template Updates

**Approach:** Templates show the most-likely format for the first story with a comment linking to format selection rules. The second story shows an alternate format to demonstrate variety. All stories use sub-headers.

**lite-template.md:**
- Story 1: Rule-Based (most common for lite scope) with happy + unhappy path
- Sub-headers: `**Rules:**` + `**Quality Gates:**`
- Comment: `<!-- See SKILL.md Format Selection Rules for Scenario-Based and System State formats -->`

**prd-template.md:**
- Story 1: Scenario-Based with happy + unhappy path, sub-headers: `**Scenarios:**` + `**Quality Gates:**`
- Story 2: Rule-Based, sub-headers: `**Rules:**` + `**Quality Gates:**`
- Hybrid sub-headers demonstrated

**unified-template.md:**
- Story 1: Scenario-Based with happy + unhappy path
- Story 2: Rule-Based
- Both with sub-headers + Quality Gates

### 8. example.md

Update the existing lite example (one-click checkout):
- US-009-01 (save payment method): **Rule-Based** — constraints/validation with unhappy path (invalid card format), sub-headers: `**Rules:**` + `**Quality Gates:**`
- US-009-02 (one-click purchase): **Scenario-Based** — user journey with happy path (successful purchase) and unhappy path (expired card, network timeout), sub-headers: `**Scenarios:**` + `**Quality Gates:**`

### 9. Checklist Updates

Add to the pre-save checklist in SKILL.md:
- [ ] AC format rationale present for each story
- [ ] Happy and unhappy paths covered for each story
- [ ] Sub-headers present on every AC block (Scenarios/Rules/System Behavior + Quality Gates)
- [ ] All AC bodies are single-line (pre-save validation passed)

## Files Modified

| File | Change | Risk |
|------|--------|------|
| `plugins/jx-pm/skills/prd/SKILL.md` | Format selection rules, ID granularity, quality gates, mode defaults, pre-save validation, checklist | Medium — core skill logic |
| `plugins/jx-core/_shared/id-rules.md` | AC format compatibility section | Low — additive |
| `plugins/jx-core/_shared/ado.md` | Sub-header format detection + story points calibration | Medium — ADO sync behavior change |
| `plugins/jx-core/_shared/task.md` | Functional-scenario counting for sizing | Medium — task estimation change |
| `plugins/jx-core/_shared/task-json-schema.md` | Replace raw AC-count thresholds with functional-scenario counting | Medium — sizing authority |
| `plugins/jx-core/scripts/validate-ac-blocks.sh` | Shared AC block validator (new file) | Medium — new shared script |
| `plugins/jx-pm/commands/prd.md` | Add validate-ac-blocks to allowed-tools | Low |
| `plugins/jx-pm/commands/ado.md` | Add validate-ac-blocks to allowed-tools | Low |
| `plugins/jx-pm/skills/prd/references/lite-template.md` | Format-aware AC block with sub-headers | Low |
| `plugins/jx-pm/skills/prd/references/prd-template.md` | Mixed-format examples + hybrid sub-headers | Low |
| `plugins/jx-pm/skills/prd/references/unified-template.md` | Format-aware AC block with sub-headers | Low |
| `plugins/jx-pm/skills/prd/references/example.md` | Mixed-format example with happy/unhappy paths | Low |

## Resolved Review Findings

| ID | Source | Finding | Resolution |
|----|--------|---------|------------|
| C1 | Advisor | ADO Gherkin double-processing | Sub-header format detection (Codex F1 refinement) |
| C2 | Advisor | ADO parser single-line constraint | HC-1: hard rule + pre-save validation (Codex F3) |
| A1 | Advisor | Quality Gates ID treatment | HC-2: keep IDs, visual grouping only |
| A2 | Advisor | Spec EARS vs PRD Gherkin overlap | Documented as acceptable redundancy |
| A3 | Advisor | Story Points miscalibration | Calibration note: count scenarios not raw lines |
| A4 | Advisor | Backward compatibility | HC-3: old PRDs work unchanged, upgrade is opt-in |
| A5 | Advisor | Template block undefined | Approach: most-likely format + comment link to rules |
| F1 | Codex R1 | System State ACs routed to synthesis | Sub-header detection replaces text-prefix heuristic |
| F2 | Codex R1 | Task conversion sizing inflated | task.md updated with functional-scenario counting |
| F3 | Codex R1 | Single-line rule unenforced | Pre-save validation gate added to Phase 6 |
| F4 | Codex R2 | ADO Phase 2 discards sub-header context | Phase 2 updated to extract format_group per AC |
| F5 | Codex R2 | Legacy PRDs leak quality gates | Two-layer exclusion: sub-header + exact-phrase |
| F6 | Codex R3 | Hand-edited PRDs bypass single-line validation | ADO Phase 2 validates AC line integrity before any write |
| F7 | Codex R3 | Quality-gate keyword exclusion too broad | Exact-phrase matching replaces substring keyword matching |
| F8 | Codex R3 | task-json-schema.md update conditional | Made mandatory — schema must agree with task.md on sizing |
| F9 | Codex R4 | Annotated E2E quality gates leak in legacy | Normalized exact-phrase matching strips annotations before compare |
| F10 | Codex R4 | G/W/T ACs without sub-headers get double-processed | Orphaned format detection halts with missing-sub-header warning |
| F11 | Codex R4 | Task sizing uses broad keyword exclusion | Aligned to same two-layer exclusion as ADO (sub-header + normalized exact-phrase) |
| F12 | Codex R5 | Task Changes section still had keyword wording | Replaced with explicit two-layer rule matching ADO + negative example |
| F13 | Codex R6 | Orphaned format halt breaks HC-3 | Changed to soft detection: infer pass-through + dry-run warning (no halt) |
| F14 | Codex R6 | System State vs System Behavior naming inconsistency | Added alias support: parser accepts both, canonical name documented |
| F15 | Codex R7 | Inferred legacy routing doesn't survive to Phase 5 | Promoted to `scenarios_inferred`/`system_behavior_inferred` format_groups with explicit Phase 5 routing |
| F16 | Codex R8 | Single-line validation heuristic too vague | Replaced with precise block-level rule: every non-blank non-heading line must match AC/sub-header/rationale pattern |
| F17 | Codex R9 | AC block validation rejects Validates: metadata | AC block boundary ends before **Validates:** — story metadata excluded from validation |
| F18 | Codex R10 | Exact-phrase exclusion overrides explicit sub-header routing | Sub-header routing is authoritative — phrase exclusion only applies to legacy format_group |
| F19 | Codex R11 | Sub-header detection scans whole story block | Scoped strictly to AC block (after **Acceptance Criteria:** container) |
| F20 | Codex R11 | Inferred routing only visible in dry-run | Confirmation gate for normal sync + tightened G/W/T inference to require full structure |
| F21 | Codex R12 | Validation is prompt-only, not executable | Shared validator script added as enforceable gate at both call sites |
| F22 | Codex R12 | Confirmation gate only covers Normal sync | Gate covers all non-dry-run modes: Normal, Partial, Update |

## Out of Scope

- Priority/MoSCoW field on stories
- Story point / T-shirt sizing on PRD
- Missing FR section in unified template
- Dependency mapping between stories
