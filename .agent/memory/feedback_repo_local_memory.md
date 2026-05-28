---
name: Repo-local memory preference
description: Save reusable jodex-qa-ai project memory in .agent/memory, not only in external Codex memory
type: feedback
originSessionId: codex-2026-05-11
---
For this repository, save durable project-specific memory in `.agent/memory/` as repo-local artifacts, in addition to any Codex cross-session memory notes when appropriate.

**Why:** The user wants project memory to travel with the repository and remain visible to agents working from the checkout, not only inside `~/.codex/memories`.

**How to apply:** When a reusable preference, project decision, workflow rule, or project-specific reference emerges for `jodex-qa-ai`, create or update a small Markdown file under `.agent/memory/` and add a pointer from `.agent/memory/MEMORY.md`. Keep source/project/wiki changes separate from memory notes unless the user explicitly asks for broader edits.
