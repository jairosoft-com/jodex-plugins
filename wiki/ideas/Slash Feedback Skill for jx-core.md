---
title: Slash Feedback Skill for jx-core
type: idea
status: completed
tags: [jx-core, feedback, skill, cross-role, developer-experience, ado]
created: 2026-05-14
updated: 2026-05-14
groomed: 2026-05-14
source_count: 0
aliases: [jx-core feedback skill, /feedback command]
provenance: synthesis
---

# Slash Feedback Skill for jx-core

Add a `/feedback` slash skill to the jx-core plugin that provides a structured, freeform way to capture user feedback and create Azure DevOps Feature work items from any role plugin.

## Motivation

- No current mechanism exists within the jx plugin ecosystem for structured feedback capture
- Feedback is a cross-role concern — QA, PM, Dev, and KB workflows all benefit from user feedback loops
- jx-core already hosts shared executable logic (ado, task); a feedback skill follows the same pattern
- Centralizing in jx-core avoids duplicating feedback logic across role plugins

## Grooming Decisions

### Invocation: Stub Delegation (v1: jx-pm and jx-qa)

jx-core remains command-free. v1 ships feedback stubs in two role plugins:

- `/jx-pm:feedback` — stub in `jx-pm/skills/feedback/SKILL.md` → delegates to `jx-core/_shared/feedback.md`
- `/jx-qa:feedback` — stub in `jx-qa/skills/feedback/SKILL.md` → delegates to `jx-core/_shared/feedback.md`

**Deferred to v2:** jx-dev and jx-kb stubs. Extend after dogfooding the pattern in jx-pm and jx-qa.

**Dependency impact:** jx-pm already depends on jx-core. jx-qa currently has no dependencies — v1 adds `"jx-core"` to `jx-qa/plugin.json`.

Each role plugin also needs a `commands/feedback.md` declaring `allowed-tools` for Azure DevOps MCP write tools.

Follows the established ado/task stub-delegation pattern from [[Extract ADO Sync and Task Skills to jx-core]].

### Storage: ADO Feature Work Items

Every feedback submission creates an Azure DevOps **Feature** work item. Triage handles reclassification if a Feature should actually be a Bug.

This leverages the existing `jx-core/_shared/ado.md` shared logic for ADO connectivity and authentication.

**Known limitation:** The "Feature" work item type must exist in the target project's process template. Custom templates that lack Feature will produce a create-time error. v1 does not pre-validate the work item type — if this becomes a recurring issue, a future iteration can add `wit_get_work_item_type` validation or make the type configurable.

### Tenant Binding: Prompt → Persist to `feedback-target.json`

> Plan-aligned 2026-05-14; see `.agent/plans/slash-feedback-skill-jx-core-v1.md` for authoritative spec.

The feedback skill resolves its ADO target (organization, project, area path) via a dedicated config file:

1. **Read**: Check for `feedback-target.json` in the working directory root
2. **If absent → Prompt**: Ask the user for organization, project, and area path; write the binding to `feedback-target.json`
3. **If present → Validate**: Verify project via `mcp__azure-devops__core_list_projects` with `projectNameFilter`
4. Include **org/project** in the confirmation preview so the user sees exactly where the item will land
5. **Fail closed** if project is not found or the MCP connection is stale

**MCP limitation:** No MCP tool exposes which organization the server is connected to. The persisted `organization` field exists so the user can verify it during typed confirmation, not for MCP-based validation. `core_list_projects` operates within the configured org but does not return the org name.

**Area path limitation:** No ADO MCP tool currently exposes area path enumeration. The stored area path cannot be pre-validated. If invalid, `wit_create_work_item` will fail at create time — the skill must surface this error clearly and not retry silently.

**Accepted residual risk:** If the MCP server is reconfigured to a different org that has a project with the same name, `core_list_projects` will pass and the Feature will be created in the wrong org. This requires both MCP misconfiguration AND the user typing the wrong org/project at the confirmation gate. Accepted for v1.

This follows the tenant binding pattern from `jx-core/_shared/ado.md` (Phase 2). A dedicated config file keeps binding state separate from agent instructions (`AGENTS.md`) and is version-controlled and shared across the team.

### Idempotency: Best-Effort Dedupe via Search-Before-Create

To reduce duplicate Features from retries, timeouts, or cross-plugin submissions of the same feedback:

1. Derive a **feedback fingerprint** — SHA-256 hash of the normalized feedback text
2. Tag the created work item with `feedback-id:<fingerprint>`
3. Before creating, **search ADO** for an existing open work item with that fingerprint tag
4. If exactly one match → report it and halt ("Feedback already submitted as ADO #12345")
5. If multiple matches → halt and surface the conflict for manual resolution
6. If no match → proceed with creation
7. After successful creation, emit the ADO work item ID to the user for reference

This provides **best-effort deduplication**, not exactly-once guarantees. Concurrent retries or ADO search-index lag can produce duplicates in rare edge cases. This is acceptable for a human-initiated command — duplicates are easily identified by the shared `feedback-id` tag and resolved during triage.

### Feedback Format: Freeform

Simple freeform text capture with no enforced categories or templates. The user provides text, and the skill formats it into an ADO Feature with:

- **Title**: extracted or summarized from the feedback text
- **Description**: full feedback text
- **Tags**: `feedback`, plus the invoking plugin name auto-detected from the stub (e.g., `jx-pm`)
- **Area Path**: inherited from current project configuration

### Stub Parameter Passing

Each stub passes its invoking plugin name via natural language context in the delegation instruction — no flag parsing or environment variables needed. Example stub preamble:

> You are invoked from **jx-pm**. Follow all instructions in `../../../jx-core/_shared/feedback.md`.

The shared logic reads the plugin name from this context and uses it for auto-tagging the ADO work item. This matches the existing stub pattern in `jx-pm/skills/ado/SKILL.md` and `jx-dev/skills/task/SKILL.md`.

### Confirmation Gate: Typed Confirmation Required

Before creating the ADO work item, the skill must show a preview:

- **Organization / Project** (from `feedback-target.json`)
- Title (proposed)
- Description (full text)
- Area Path
- Tags (including `feedback-id:<fingerprint>`)

User must type `{organization}/{project}` to confirm — not just "create". This forces active verification of the target and follows the `ado.md` `--new-tenant` pattern for write operations.

## Acceptance Criteria

### Core Logic
- [ ] `jx-core/_shared/feedback.md` contains the full feedback skill logic
- [ ] Skill accepts freeform text input via `$ARGUMENTS`
- [ ] Skill extracts/summarizes a title from the feedback text
- [ ] Skill creates an ADO Feature work item with title, description, tags, and area path
- [ ] Confirmation gate shows preview (org/project, title, description, area path, tags) and requires typed `{org}/{project}` confirmation before ADO write
- [ ] Each stub declares its plugin name in the delegation preamble (e.g., "You are invoked from **jx-pm**"); shared logic reads this context to auto-tag the work item

### Tenant Validation
- [ ] Skill reads ADO target (org/project/area path) from `feedback-target.json`; if absent, prompts the user and persists the binding
- [ ] Skill validates project via `core_list_projects` with `projectNameFilter` before any write
- [ ] Organization is persisted for user verification during typed confirmation (not MCP-validated — no tool exposes connected org)
- [ ] Area path is stored in `feedback-target.json` but cannot be pre-validated (no MCP tool); invalid area path produces a clear create-time error
- [ ] Skill fails closed when project is not found or MCP connection is stale
- [ ] Org/project are displayed in the confirmation preview; user types `{org}/{project}` to confirm

### Idempotency
- [ ] Skill derives a SHA-256 fingerprint from normalized feedback text
- [ ] Created work item is tagged with `feedback-id:<fingerprint>`
- [ ] Skill searches ADO for existing open item with matching fingerprint before creating
- [ ] Exactly one match → report existing item and halt (no duplicate)
- [ ] Multiple matches → halt and surface conflict for manual resolution
- [ ] After successful creation, emit the ADO work item ID to the user

### Stubs (v1: jx-pm and jx-qa)
- [ ] `jx-pm/skills/feedback/SKILL.md` — thin stub delegating to `../../../jx-core/_shared/feedback.md`
- [ ] `jx-qa/skills/feedback/SKILL.md` — thin stub delegating to `../../../jx-core/_shared/feedback.md`

### Commands (v1: jx-pm and jx-qa)

Minimal `allowed-tools` for feedback v1:

```
allowed-tools: Read, Write, Bash(python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py":*), mcp__azure-devops__wit_create_work_item, mcp__azure-devops__search_workitem, mcp__azure-devops__wit_get_work_item, mcp__azure-devops__core_list_projects
```

- [ ] `jx-pm/commands/feedback.md` — declares minimal allowed-tools as above
- [ ] `jx-qa/commands/feedback.md` — declares minimal allowed-tools as above

### Contract Preservation
- [ ] `jx-core` has no `commands/` directory — remains command-free
- [ ] `jx-qa/plugin.json` adds `"jx-core"` to `dependencies` (new dependency for jx-qa)
- [ ] `jx-pm/plugin.json` already has `"jx-core"` in `dependencies` — no change needed

### Security
- [ ] Confirmation gate cannot be bypassed by stubs — gate logic lives in `jx-core/_shared/feedback.md`
- [ ] `allowed-tools` in jx-pm and jx-qa `commands/feedback.md` include `Read`, `Write`, pinned helper Bash scope, and 4 ADO MCP tools (`wit_create_work_item`, `search_workitem`, `wit_get_work_item`, `core_list_projects`) — no update/link/prune/batch tools, no `core_get_identity_ids`
- [ ] Tenant validation prevents writes to wrong org/project — fails closed on ambiguity

## Resolved Questions

- **Auto-tagging**: Auto-detect. Each stub passes its plugin name as a parameter to the shared logic, which tags the ADO work item automatically. No user input needed.
- **Dry-run flag**: No. The confirmation gate already shows a full preview — a separate `--dry-run` adds complexity for no value.
- **List subcommand**: Deferred to a future iteration. v1 is capture-only. Users can query ADO directly or via `/jx-pm:ado` to find feedback items.
- **Feature work item type validation**: Documented as known limitation. v1 assumes Feature exists in the target process template. If it doesn't, `wit_create_work_item` fails at create time with a surfaced error. Future iteration can add `wit_get_work_item_type` pre-validation or make the type configurable.
- **Tenant binding store**: Dedicated `feedback-target.json` file. Keeps binding state separate from `AGENTS.md` (agent instructions) and agent memory (per-user). Version-controlled and shared across the team.
- **v1 rollout scope**: jx-pm and jx-qa only. jx-pm already depends on jx-core (no new dependency). jx-qa gains jx-core as a new dependency. jx-dev and jx-kb stubs deferred to v2 after dogfooding.

## Related

- [[Extract ADO Sync and Task Skills to jx-core]] — precedent for shared executable logic in jx-core via stub delegation
- [[Cross-Plugin Shared Convention Layer (Promoted)]] — architectural pattern this follows

## Sources

- User conversation (2026-05-14)
