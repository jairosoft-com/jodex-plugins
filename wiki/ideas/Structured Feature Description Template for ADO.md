---
title: Structured Feature Description Template for ADO
type: idea
tags: [jx-pm, jx-core, ado, feature, description, template]
created: 2026-05-22
updated: 2026-05-22
status: completed
priority: P1
effort: medium
source: User-provided Gemini prompt template (2026-05-22)
aliases: [feature description format, ado feature template]
provenance: user-provided
---

# Structured Feature Description Template for ADO

## Problem

The ADO sync skill writes the Feature work item Description as a raw dump of the PRD Executive Summary — unformatted prose that is difficult to scan during standups and lacks the structured context engineers need (personas, scope guardrails, success metrics, feature-level ACs).

Current spec (`ado.md` line 163):
```
Description: Executive Summary / Overview content from PRD
```

## Proposed Solution

Replace the raw Executive Summary dump with a structured, scannable template that synthesizes the PRD into an execution-focused Feature ticket. The template follows Agile Product Owner conventions: concise bullets, no technical deep-dives, feature-level Definition of Done (not Given/When/Then).

### Template

```markdown
## Summary / Problem Statement
[2-3 sentence synthesis from Executive Summary / Business Problem — the user pain point or business gap]

## Target Persona
- 👤 [Primary persona from Target Users section]
- 👤 [Secondary persona, if applicable]

## Value Hypothesis & Success Metrics
[1-sentence "If we do X, then Y" from Business Objectives]
- 📊 [KPI 1 from Success Metrics table]
- 📊 [KPI 2 from Success Metrics table]

## Scope Guardrails
- ✅ **In Scope:** [Comma-separated major deliverables from In Scope section]
- ❌ **Out of Scope:** [Comma-separated exclusions from Out of Scope section]

## Acceptance Criteria (Feature Level)
- [ ] All child User Stories are completed, tested, and closed.
- [ ] [Major integration/security/compliance gate from NFRs]
- [ ] [End-to-end verification step from Quality Gates]
- [ ] Code quality gates pass (from Quality Gates metadata).

## Resources & Links
- 🔗 **Full BRD/PRD:** {featureId}: {featureName}
- 🏗️ **Technical Spec:** [TECH_SPEC.md path if exists, else "Pending"]
- 🐞 **ADO Link:** [Auto-populated after creation]
```

### Extraction Rules

1. **Be concise & scannable** — synthesize, don't copy-paste paragraphs
2. **Elevate the "Why"** — focus on business problem and expected value
3. **Filter out the "How"** — no technical specs, API payloads, or code-level details (those belong in child User Stories)
4. **Feature-level AC only** — Definition of Done checklist, NOT Given/When/Then (that's story-level)

### Section-to-PRD Mapping

| Template Section | PRD Source |
|-----------------|-----------|
| Summary / Problem Statement | `## Executive Summary` or `## 1. Executive Summary` |
| Target Persona | `## 8. Target Users & Personas` |
| Value Hypothesis & Success Metrics | `## 3. Business Objectives & Success Metrics` |
| Scope Guardrails | `## 4. Project Scope` (In Scope + Out of Scope) |
| Acceptance Criteria (Feature Level) | `## 10. Non-Functional Requirements` + `Quality Gates:` metadata + "All child stories closed" default |
| Resources & Links | `## Document Metadata` + folder path conventions |

## Scope

### Modified Files

| File | Changes |
|------|---------|
| `plugins/jx-core/_shared/ado.md` | Phase 5 Work Item Fields — Feature section: replace "Executive Summary / Overview content from PRD" with the structured template and extraction rules. Add section-to-PRD mapping as an inline reference. |

### Unchanged

| File | Reason |
|------|--------|
| `plugins/jx-pm/commands/ado.md` | No allowed-tools change needed |
| `plugins/jx-pm/skills/prd/SKILL.md` | PRD output format unchanged — the ADO sync skill does the synthesis at write time |
| `plugins/jx-core/scripts/frontmatter-sync.py` | No field changes |

## Acceptance Criteria

- AC-1: Feature Description in ADO contains all 6 template sections (Summary, Target Persona, Value Hypothesis, Scope Guardrails, Feature-Level AC, Resources & Links)
- AC-2: Description is HTML-formatted with headings, bullet points, and emoji markers matching the template
- AC-3: No Given/When/Then format appears in the Feature Description — only checklist-style Definition of Done
- AC-4: No technical specifications, API details, or code-level requirements appear in the Feature Description
- AC-5: The "Resources & Links" section auto-populates the PRD feature ID and ADO link from frontmatter
- AC-6: Legacy PRDs without persona or scope sections produce the template with "Not specified" placeholders rather than failing
- AC-7: Dry-run output shows the structured Feature Description preview

## Verification

1. Run `--dry-run` on an existing PRD (FEAT-001, FEAT-002, or FEAT-003) and verify the Feature Description preview matches the template
2. Run live sync on a test PRD and verify `wit_get_work_item` returns the structured Description
3. Verify the Description is scannable in the ADO board UI (headings render, emojis display, checkboxes work)

## Dependencies

None. Backward compatible — existing Features can be updated via update mode re-sync.
