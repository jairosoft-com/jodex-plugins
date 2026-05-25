---
name: feedback-ado-sync-format
description: Always follow jx-core/_shared/ado.md spec when syncing to Azure Boards — do not improvise ADO work item formats
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dcb040d6-2c0f-41bc-bf27-7d543804c73a
---

When running jx-pm:ado sync, always read and follow `plugins/jx-core/_shared/ado.md` before creating any work items. The spec defines:

- Feature title: `{featureId}: {featureName}`
- Feature description: 6-section structured HTML template (Summary, Target Persona, Value Hypothesis, Scope Guardrails, Feature AC, Resources)
- Feature tags: `prd:FEAT-{featureId}`
- Story description: narrative only (As a/I want/So that + Validates) — NO acceptance criteria in Description
- Story AC field: `Microsoft.VSTS.Common.AcceptanceCriteria` — separate field, HTML ordered list with format routing
- Story points: LLM-derived 1/2/3/5/8 scale
- Story tags: `prd:{story.id}`
- Two-step creation: step 2a (create+link), step 2b (update AC/tags/points)

**Why:** On FEAT-006, I improvised the format instead of reading the spec, resulting in ACs dumped into Description, missing AcceptanceCriteria field, no story points, wrong tag format, and wrong Feature description structure. Had to batch-update all 8 work items to fix.

**How to apply:** Before any ADO sync, read `plugins/jx-core/_shared/ado.md` Phase 5 completely. Follow the two-step creation flow and field mapping exactly.
