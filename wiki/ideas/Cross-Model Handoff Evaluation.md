---
title: Cross-Model Handoff Evaluation
type: idea
tags: [pattern, workflow, multi-model, evaluation, handoff]
created: 2026-05-25
updated: 2026-05-25
source_count: 1
aliases: [AI-to-AI handoff, cross-model suggestion evaluation]
provenance: source-derived
status: raw
---

# Cross-Model Handoff Evaluation

Process for evaluating structured suggestions from another AI model against existing work. Prevents redundant changes while capturing genuine gaps.

## Process

1. **Read the handoff** — understand what the other model proposes
2. **Check what's already done** — compare each item against current state
3. **Identify genuine gaps** — what's truly missing vs already covered
4. **Adopt good ideas** — integrate real catches without redundant rework
5. **Note format mismatches** — the other model may reference conventions it doesn't know about

## Example (Gemini → Claude, 2026-05-25)

Gemini proposed 4 updates to the meet-notes plan:
- Item 1: Add evals to files table → **already done**
- Item 2: Use Format B typed assertions → **genuine gap** (our evals used an invented format)
- Item 3: Align verification section → **already done**
- Item 4: Update implementation order → **already done**

Result: 3 of 4 items redundant, 1 was a real catch that led to discovering the [[Format B Eval Convention]].

## Key Insight

The valuable part of cross-model suggestions is often not the proposed action but the *observation* behind it. Gemini's suggestion to "use Format B" was worth adopting not because of the specific JSON structure it proposed, but because it revealed we were using a non-standard format. The fix came from reading the repo's actual convention, not from Gemini's proposed schema.

## Related

- [[Format B Eval Convention]] — discovered through this process
- [[Spec-First Skill Execution]] — same principle: check the existing convention before improvising

## Sources

- [[Source - Meet-Notes Session Insights]]
