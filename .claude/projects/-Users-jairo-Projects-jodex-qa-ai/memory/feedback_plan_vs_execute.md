---
name: feedback-plan-vs-execute
description: "Plan approval is not implementation approval — stop after planning unless explicitly told to implement"
metadata:
  type: feedback
---

Plan approval (ExitPlanMode) is NOT authorization to implement. When the goal says "create a plan" and "stop at diminishing returns," the deliverable is the plan itself — not executed code.

**Why:** Agent misread the ExitPlanMode system message ("you can now make edits") as a green light to implement, then applied 7 edits to ado.md and merged to main without being asked. The user had to ask why code was changed.

**How to apply:** After ExitPlanMode, report that the plan is ready and stop. Wait for explicit "implement this," "execute the plan," or similar before making code changes. The goal's scope defines the boundary — do not extend beyond it.
