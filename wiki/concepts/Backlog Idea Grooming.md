---
title: Backlog Idea Grooming
type: concept
tags: [wiki, workflow, backlog, grooming, ideas]
created: 2026-05-21
updated: 2026-05-21
source_count: 0
aliases: [idea grooming, grooming backlog, backlog refinement]
provenance: session-derived
---

# Backlog Idea Grooming

The process of transforming a `backlogged` wiki idea into an execution-ready specification. Grooming resolves open questions and adds enough structure so the idea can be handed off to a PRD or implemented directly without further clarification.

## When to Groom

After [[Triage]] classifies an idea as `backlogged`. Grooming happens before promoting to `promoted` or generating a BRD_PRD.

## Grooming Checklist

A fully groomed backlog idea has all of the following:

- [ ] **Scope defined** — happy path only vs. full coverage vs. phased; stated explicitly
- [ ] **Open questions resolved** — each question in the idea has a decision and rationale
- [ ] **Acceptance criteria** — checklist of what "done" looks like
- [ ] **Deliverable named** — concrete output (file path, page name, feature)
- [ ] **Priority set** — `high` / `medium` / `low` in frontmatter
- [ ] **Page outline (if applicable)** — section structure for any wiki page deliverable

## Grooming in Practice

Present open questions to the author one at a time. For each question:
1. Offer 2–3 concrete options with trade-off descriptions
2. Record the decision and rationale directly in the idea file
3. Move to the next question only after the current one is closed

Avoid grooming in bulk — one question at a time produces cleaner decisions and less re-work. See [[Over-Grooming Anti-Pattern]] for the failure mode where grooming adds more content than value.

## Output

A groomed idea is promotion-ready. The typical next steps are:

- Generate a BRD_PRD via `/jx-pm:prd` (sets `prd:` frontmatter field, status → `promoted`)
- Or implement directly and mark `status: completed`

## Related

- [[Idea Lifecycle]] — full state machine for ideas
- [[Triage]] — upstream step that classifies raw ideas
- [[Over-Grooming Anti-Pattern]] — failure mode to avoid
- [[Measurability Mandate]] — applies to AC written during grooming
