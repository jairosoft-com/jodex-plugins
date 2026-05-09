---
name: jx-pm Plugin Status
description: Product Management plugin — built and committed, ready for dogfooding
type: project
originSessionId: 15ee19d7-c663-4d21-929d-bc8711658c02
---
jx-pm plugin is implemented at `plugins/jx-pm/` with 5 skills:
- `/jx-pm:prd` — BRD/PRD generator (modes: lite, prd, unified)
- `/jx-pm:techspec` — framework-agnostic tech spec
- `/jx-pm:task` — PRD+TECH_SPEC → task.json with merge-by-default
- `/jx-pm:ado` — Azure Boards sync with safety contracts
- `/jx-pm:pipeline` — full chain convenience wrapper

**Why:** Ported from casacolinacare cc-gen-* skills. Made generic, framework-agnostic, with hardened ADO safety (per-item write-back, tombstones, fail-closed lookup, tenant binding, hierarchy reconciliation, 4 confirmation gates).

**How to apply:** Next steps are dogfooding on a real feature. Source skills remain at `/Users/jairo/Projects/casacolinacare.com/.claude/skills/cc-gen-*` for reference. Wiki project page at `wiki/projects/Product Management Skills Plugin.md`.
