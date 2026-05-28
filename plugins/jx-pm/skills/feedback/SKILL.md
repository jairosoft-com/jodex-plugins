---
name: feedback
user-invocable: true
argument-hint: "<feedback text>"
description: >
  Capture user feedback and create an ADO Feature work item.
  Triggers on: submit feedback, file feedback, capture feedback.
  Do not trigger for: PRD generation, tech spec, task breakdown, ADO sync.
---

# Feedback Capture

**Fail-closed guard:** Before proceeding, verify `../../../jx-core/_shared/feedback.md` is readable.
If the file cannot be read, halt immediately:
> "Error: jx-core shared feedback skill not found. Ensure the jx-core plugin is installed."

You are invoked from **jx-pm**. Follow all instructions in `../../../jx-core/_shared/feedback.md`.
