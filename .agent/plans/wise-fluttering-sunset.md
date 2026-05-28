# Implementation Plan: jx-pm Plugin

## Context

The jx-pm (Product Management Skills Plugin) is a fully-groomed project that provides 5 skills for product managers/owners. It's being ported and generalized from 6 existing skills in `casacolinacare.com/.claude/skills/cc-gen-*`. All design questions are resolved. The plugin lives at `plugins/jx-pm/`.

**Problem:** PM/PO workflows (BRD/PRD generation, tech specs, task breakdowns, ADO sync) are currently project-specific and hardcoded to Next.js. Need a generic, reusable plugin.

**Outcome:** A framework-agnostic plugin with chaining support that works across any jodex project.

---

## Phase 0: Foundations

Create plugin skeleton, shared patterns, marketplace registration.

**Files to create:**
- `plugins/jx-pm/.claude-plugin/plugin.json`
- `plugins/jx-pm/README.md`
- `plugins/jx-pm/schemas/task-json-schema.md` (ported from `casacolinacare.com/.claude/skills/prd-json-schema.md`, renamed)
- `plugins/jx-pm/skills/_shared/id-rules.md` (folder validation, feature-number extraction, global AC counter)
- `plugins/jx-pm/skills/_shared/docs-root.md` (configurable root, default `docs/`)
- `plugins/jx-pm/agents/ABOUT.md`
- `plugins/jx-pm/hooks/ABOUT.md`
- `plugins/jx-pm/prompts/ABOUT.md`
- `plugins/jx-pm/schemas/ABOUT.md` (placeholder alongside the schema file)
- `.claude-plugin/marketplace.json` (add jx-pm entry)

**plugin.json:**
```json
{
  "name": "jx-pm",
  "version": "1.0.0",
  "description": "Product Management: generate PRDs, tech specs, task breakdowns, and sync to Azure Boards.",
  "author": { "name": "Jairosoft", "email": "ramon@jairosoft.com" }
}
```

---

## Phase 1: `/jx-pm:prd`

Single skill with `--mode lite|prd|unified` flag. Entry point of the pipeline.

**Files:**
- `plugins/jx-pm/skills/prd/SKILL.md`
- `plugins/jx-pm/skills/prd/references/lite-template.md`
- `plugins/jx-pm/skills/prd/references/prd-template.md`
- `plugins/jx-pm/skills/prd/references/unified-template.md`
- `plugins/jx-pm/skills/prd/references/example.md`
- `plugins/jx-pm/commands/prd.md`

**Source files to port (simplify, not copy):**
- `/Users/jairo/Projects/casacolinacare.com/.claude/skills/cc-gen-prd-lite/SKILL.md`
- `/Users/jairo/Projects/casacolinacare.com/.claude/skills/cc-gen-prd/SKILL.md`
- `/Users/jairo/Projects/casacolinacare.com/.claude/skills/cc-gen-brd-prd/SKILL.md`
- Templates: `PRD_Template.md`, `BRD_PRD_Template.md`, `BRD_Template.md`

**SKILL.md phases:**
1. Mode selection & argument parsing
2. Folder path & validation (reference `_shared/id-rules.md`)
3. Clarifying questions (mode-branched)
4. Golden thread establishment
5. Generate document (mode-branched, using templates)
6. Save & chain (if `--chain`, invoke `/jx-pm:techspec`)

**Simplifications:**
- Remove all CasaColina references
- Remove hardcoded `prds/` → configurable docs root
- Strip troubleshooting sections (~400 lines saved)
- Keep one workflow example per mode (not 3)
- Unify validation into shared reference

---

## Phase 2: `/jx-pm:techspec`

Framework-agnostic tech spec generator. Biggest rewrite — source is ~50% Next.js specific.

**Files:**
- `plugins/jx-pm/skills/techspec/SKILL.md`
- `plugins/jx-pm/skills/techspec/references/template.md`
- `plugins/jx-pm/skills/techspec/references/diagram-patterns.md` (Mermaid: sequence, ERD, state machines, C4)
- `plugins/jx-pm/commands/techspec.md`

**Source:** `/Users/jairo/Projects/casacolinacare.com/.claude/skills/cc-gen-tech-spec/SKILL.md`

**SKILL.md phases:**
1. Folder path & round-trip ID extraction (from `_shared`)
2. PRD analysis & ambiguity detection
3. Socratic interview (3-7 architectural questions)
4. Technical design document generation:
   - Architecture overview (Mermaid C4)
   - Design details per user story (sequence diagrams, data models, API contracts)
   - Architecture Decision Records
   - Implementation plan
   - Technical constraints (TC-{NNN}-{seq})
   - Test strategies (TEST-{NNN}-{seq})
   - Cross-cutting concerns
5. Validation & refinement

**What to remove:** All Next.js 15 content (Phase 5 from source — server components, Zustand, shadcn/ui, App Router patterns, Tailwind). Replace with framework-agnostic diagram patterns.

---

## Phase 3: `/jx-pm:task`

PRD + TECH_SPEC → task.json converter.

**Files:**
- `plugins/jx-pm/skills/task/SKILL.md`
- `plugins/jx-pm/commands/task.md`

**Source:** `/Users/jairo/Projects/casacolinacare.com/.claude/skills/cc-gen-prd-task/SKILL.md`

**Key changes from source:**
- Output: `task.json` (not `prd.json`)
- Accepts both PRD and TECH_SPEC as input (when chained or when TECH_SPEC exists in folder)
- Includes TC/TEST IDs from TECH_SPEC in output
- Fails validation in chained mode if TECH_SPEC missing
- Jodex fields (branchName, progressPath) moved to optional `jodex` block
- Drop `jodex/` prefix from featureName
- Keep: story sizing, hour estimation, AC verifiability, dependency ordering

**Rerun safety (merge-by-default):**
- If `task.json` already exists, MERGE — don't overwrite:
  - Match stories/ACs by requirement ID (US-{NNN}-{seq}, AC-{NNN}-{seq})
  - Preserve per-item: `azureWorkItemId`, `azureWorkItemUrl`, `passes`, `notes`, jodex fields
  - Preserve root-level: `azureWorkItemId`, `lastSyncedToAzure`, `azureOrganization`, `azureProject`
  - Update from PRD: structure, titles, descriptions, estimates, new stories/ACs
  - **Removal rule:** if item removed from PRD AND has `azureWorkItemId` → tombstone (`{removed: true}`), never delete. If no Azure ID → delete silently.
- `--force-overwrite`: 
  - Creates timestamped backup: `task.json.{timestamp}.bak` (never overwrites previous backups)
  - If file contains `azureWorkItemId` or non-default `passes`/`notes`: requires typed confirmation before proceeding
  - Then regenerates fresh (no merge)
- Write via temp file + rename (atomic)

---

## Phase 4: `/jx-pm:ado`

Azure Boards sync with safety contracts.

**Files:**
- `plugins/jx-pm/skills/ado/SKILL.md`
- `plugins/jx-pm/skills/ado/references/sync-states.md` (state transition tables)
- `plugins/jx-pm/commands/ado.md`

**Source:** `/Users/jairo/Projects/casacolinacare.com/.claude/skills/cc-azure-board-sync/SKILL.md`

**Key changes:**
- Reads `task.json` (not `prd.json`)
- New flags: `--dry-run`, `--tenant <org>/<project>`
- Safety contracts:
  - Idempotent: title-prefix convention as durable Azure-side key (see below)
  - Tenant guard: confirms org/project before writes
  - Partial-failure recovery: atomic task.json write-back per batch
  - Confirmation gates for force-recreate and state-sync

**ADO idempotency — work item ID as primary key:**
- Once created, `azureWorkItemId` (unique integer within org) is the definitive binding
- All work item titles prefixed with source ID for human readability:
  - Feature: `006: feature-name`
  - User Story: `US-006-01: Story Title`
  - Task: `AC-006-01: Criterion text`
- **Per-item write-back:** write `azureWorkItemId` to task.json immediately after EACH individual create (not batched). Minimizes crash-without-ID window.
- **Hierarchy reconciliation (every sync run):**
  - Before creating anything new, verify all existing bound items have correct parent links
  - For each Story with `azureWorkItemId`: check it's linked to Feature parent. Create link if missing.
  - For each Task with `azureWorkItemId`: check it's linked to its User Story parent. Create link if missing.
  - Wrong-parent conflict → HALT, show conflict, require manual resolution
  - Included in `--dry-run` output (shows "N missing links to repair")
- **Crash recovery fallback:** if task.json lacks ID for an item (rare), search Azure by title prefix at correct hierarchy level:
  - Must find exactly 1 match → reuse it
  - 0 matches → create new
  - 2+ matches → HALT, show duplicates, require manual resolution
- Title prefix is immutable (ID never changes); description/body can be updated freely

**Tenant binding (task.json authoritative, memory is suggestion only):**
- Source of truth: `azureOrganization`/`azureProject` in task.json (once bound)
- Agent memory stores last-used org/project as DEFAULT SUGGESTION only
- First sync (no Azure metadata in task.json): show memory suggestion, user confirms, then bind to task.json
- Subsequent syncs: task.json binding wins. Compare against current MCP connection.
- If mismatch: HALT with error: "Tenant mismatch: task.json bound to {stored}, connected to {current}. Use --new-tenant to strip old IDs and re-sync."
- `--new-tenant` flag: **mandatory preview + confirmation gate**
  - Shows all Azure IDs that will be stripped
  - Creates timestamped backup: `task.json.{org}.{project}.{timestamp}.bak`
  - Requires typed confirmation before executing
  - Tombstones all existing Azure IDs (marks as `{previousTenant: ...}`)
  - Then proceeds with fresh sync to new tenant
- If task.json has no Azure metadata: proceed normally, bind on first write

**Orphan/stale item handling (tombstone pattern):**
- When `/jx-pm:task` merge detects items removed from PRD that have `azureWorkItemId`:
  - Do NOT delete from task.json
  - Mark as `{removed: true, azureWorkItemId: ..., azureWorkItemUrl: ...}`
  - Warn user: "N synced items removed from PRD — tombstoned in task.json"
- `/jx-pm:ado --dry-run` reports tombstoned items as "stale Azure work items"
- `--prune` flag on `/jx-pm:ado`: **mandatory preview + confirmation gate**
  - Shows exact work item IDs, titles, and intended state transitions (close/remove)
  - Creates timestamped backup of task.json before pruning
  - Requires typed confirmation before executing
  - Closes tombstoned work items in Azure, then removes from task.json
- Without `--prune`: tombstones remain inert (not synced, not created, just preserved for audit)

**Confirmation gates (complete list):**
All destructive external-state operations require preview + typed confirmation:
1. Force-recreate mode
2. State-sync mode
3. `--new-tenant` (strips Azure IDs)
4. `--prune` (closes Azure work items)

---

## Phase 5: `/jx-pm:pipeline` (stub)

Future convenience skill. Minimal stub.

**Files:**
- `plugins/jx-pm/skills/pipeline/SKILL.md`
- `plugins/jx-pm/commands/pipeline.md`

Stub that documents the chain: prd → techspec → task �� ado. Full implementation deferred.

---

## Phase 6: Validation

1. Smoke test: run `/jx-pm:prd --mode lite` on a sample feature
2. Verify `--chain` passes folder path between skills
3. Review all SKILL.md files for framework-specific language
4. Ensure configurable docs root works
5. Run wiki lint to verify no broken references

---

## Dependency Order

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
```

Each skill consumes output from its predecessor.

---

## Verification

After each phase:
- Install plugin locally: `claude --plugin-dir ./plugins/jx-pm`
- Test slash command appears: `/jx-pm:prd --help`
- Run skill on test input
- Verify output file structure matches spec
- For ado: use `--dry-run` to validate without Azure writes

---

## Estimated Effort

| Phase | Effort |
|-------|--------|
| 0: Foundations | ~1 session |
| 1: prd | ~2 sessions |
| 2: techspec | ~3 sessions (biggest rewrite) |
| 3: task | ~1.5 sessions |
| 4: ado | ~2.5 sessions |
| 5: pipeline | ~0.5 sessions |
| 6: Validation | ~1 session |
| **Total** | **~11.5 sessions** |
