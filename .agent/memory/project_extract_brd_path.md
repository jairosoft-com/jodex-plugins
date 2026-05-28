---
name: extract-skill-brd-path-improvement
description: Remove hardcoded raw/articles/ BRD path hint from extract skill — prompt user or pull from memory instead
type: project
originSessionId: 9cf0318f-50b8-4e37-88c2-69cd5500d311
---
Extract skill should not hardcode `raw/articles/` as BRD path hint.

Two better options:
1. Prompt user for BRD path if none supplied
2. Pull BRD path from agent memory if previously stored

**Why:** Hardcoded path couples skill to one project's folder structure. Other projects won't have `raw/articles/`.
**How to apply:** Update SKILL.md Phase 1 / Inputs table to remove hardcoded path reference. Add fallback logic: check memory for known BRD path → if not found, ask user.
