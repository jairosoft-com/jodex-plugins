---
name: Advisor confidence threshold
description: Call advisor tool whenever confidence is 93% or below before proceeding with substantive work
type: feedback
originSessionId: fd5cac33-fb9b-4b6f-a0a7-6edaca2d0800
---
Call advisor() when confidence level is <=93% on any substantive decision or action.

**Why:** User wants extra validation on uncertain work to catch errors early rather than committing to a wrong approach.

**How to apply:** Before writing code, making architectural decisions, or declaring a task complete — if confidence in the approach or answer is 93% or below, call advisor() first. This supplements the existing advisor guidance (call before substantive work, when stuck, when changing approach) with a concrete numeric threshold.
