---
name: Discuss Findings Individually
description: User prefers to discuss review findings one-by-one rather than batch-resolving with multi-select
type: feedback
originSessionId: 15ee19d7-c663-4d21-929d-bc8711658c02
---
When presenting Codex adversarial review findings, user prefers to go through them one at a time with discussion, not batch all into a single multi-select question.

**Why:** Each finding may need clarification, context, or the user may have domain knowledge that changes the recommendation. Batch questions don't allow for this back-and-forth.

**How to apply:** After adversarial review returns findings, say "let's go through them one by one" pattern. Use AskUserQuestion with 1 question per finding OR present all findings but expect user to say "let's discuss" before resolving. Don't pre-resolve without discussion.
