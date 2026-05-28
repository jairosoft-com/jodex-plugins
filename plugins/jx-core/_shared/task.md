---
name: task
user-invocable: true
argument-hint: "[--docs-root <path>] [--force-overwrite]"
description: >
  Convert a PRD.md or BRD_PRD.md (and optionally TECH_SPEC.md) into canonical task.json
  for execution and Azure Boards sync. Preserves all requirement IDs, adds hour estimates
  and story points. Triggers on: convert prd, create task json, task breakdown, jodex format.
  Do not trigger for: PRD generation, tech spec generation, Azure sync, wiki operations.
---

# Task JSON Converter

Convert requirements documents into canonical `task.json` for execution tracking and Azure Boards sync.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `--docs-root` | No | `docs/` or `$JX_DOCS_ROOT` | Output directory root |
| `--force-overwrite` | No | — | Skip merge, regenerate fresh (creates timestamped backup) |

---

## Phase 1: Folder Path & Source Detection

Apply rules from `../../../jx-core/_shared/id-rules.md` and `../../../jx-core/_shared/docs-root.md`:

1. Prompt for folder path
2. Validate folder name, extract feature number
3. Detect source documents in folder:
   - **Required:** `PRD.md` or `BRD_PRD.md` (halt if neither exists)
   - **Optional:** `TECH_SPEC.md` (include TC/TEST IDs if present)

---

## Phase 2: Read & Parse Sources

### From PRD/BRD_PRD.md
- Extract all user stories (by `### US-{NNN}-{seq}:` heading pattern)
- Extract acceptance criteria (by `AC-{NNN}-{seq}:` pattern)
- Extract functional requirements (`FR-{NNN}-{seq}`)
- Extract non-functional requirements (`NFR-{NNN}-{seq}`)
- Extract document metadata (Feature ID, Feature Name)
- Validate `featureId` matches folder feature number

### From TECH_SPEC.md (when present)
- Extract technical constraints (`TC-{NNN}-{seq}`)
- Extract test cases (`TEST-{NNN}-{seq}`)
- Extract `technicalSpecSection` anchors for each user story
  - Anchor format: lowercase, spaces→hyphens, special chars removed
  - Example: `### 3.1 US-006-01: Story Title` → `#31-us-006-01-story-title`

---

## Phase 3: Existing task.json Handling

### If task.json does NOT exist
Proceed to Phase 4 (generate fresh).

### If task.json exists AND `--force-overwrite`
1. Check if file contains `azureWorkItemId` or non-default `passes`/`notes`
2. If yes: require typed confirmation ("This file contains Azure sync state. Type 'overwrite' to confirm:")
3. Create timestamped backup: `task.json.{YYYYMMDD-HHmmss}.bak`
4. Proceed to Phase 4 (generate fresh)

### If task.json exists (default: merge)
Merge by matching requirement IDs:

**Preserve per-item:**
- `azureWorkItemId`, `azureWorkItemUrl`
- `passes`, `notes`
- Any fields in optional `jodex` block

**Preserve root-level:**
- `azureWorkItemId`, `azureWorkItemUrl`
- `azureOrganization`, `azureProject`
- `lastSyncedToAzure`
- `jodex` block

**Update from PRD:**
- Story titles, descriptions
- Acceptance criteria text
- Estimates (recalculated)
- New stories/ACs added
- Priority/ordering

**Removal rule:**
- Item removed from PRD AND has `azureWorkItemId` → tombstone: `{removed: true, id: ..., azureWorkItemId: ..., azureWorkItemUrl: ...}`
- Item removed from PRD AND has NO Azure ID → delete silently

---

## Phase 4: Generate task.json

Build the canonical JSON structure per `../../../jx-core/_shared/task-json-schema.md`.

### Story Sizing

Each story must be completable in ONE context window. Split if:
- Cannot describe the change in 2-3 sentences
- Touches more than 6 files
- Has more than 7 **functional** acceptance criteria (see Functional AC Counting below)

### Hour Estimation

Read PRD and TECH_SPEC before estimating. Classify each AC:

| Hours | When |
|-------|------|
| 0.25 | Quality gates without `[ui-only]` tag (from PRD `Quality Gates:` metadata or defaults) |
| 0.5 | Quality gates with `[ui-only]` tag (E2E/browser verification), single config change |
| 1 | New test file, component update, multi-file change |
| 2 | New feature logic, significant refactor |

**Scope adjustments:**
- TECH_SPEC lists 3+ files for AC → +0.5h
- PRD specifies responsive/a11y → +0.25h on UI ACs
- TECH_SPEC calls out edge cases → +0.25h
- Cap: no AC exceeds 2h

### Functional AC Counting

When sizing, count **functional ACs only** — exclude quality gates using the same two-layer rule as ADO sync:
1. ACs under `**Quality Gates:**` sub-header → excluded
2. Legacy ACs (no sub-header) matching normalized exact phrases from PRD `Quality Gates:` metadata (or default gates if absent: `Lint passes`, `Typecheck passes`, `Unit tests pass`, `E2E tests pass`) → excluded
3. ACs under functional sub-headers (`**Scenarios:**`, `**Rules:**`, `**System Behavior:**`) are NEVER phrase-excluded — sub-header routing is authoritative

See `../../../jx-core/_shared/quality-gates.md` for gate resolution order and tag semantics.

When a story has >3 unhappy-path ACs testing the same flow with different error conditions, count them as 1 complexity unit for sizing (but preserve all IDs in task.json).

### Story Points

| Points | Signals |
|--------|---------|
| 1 | 1-2 functional ACs, ≤0.75h |
| 2 | 2-3 functional ACs, ≤1.5h |
| 3 | 3-5 functional ACs, ≤3h |
| 5 | 5-7 functional ACs, ≤5h |
| 8 | 7+ functional ACs — consider splitting |

### Dependency Ordering

Priority based on dependency order:
1. Schema/database changes
2. Backend logic / server actions
3. UI components using the backend
4. Dashboard/summary views

Earlier stories must NOT depend on later ones.

### Output Structure

```json
{
  "project": "[Project Name]",
  "featureName": "[feature-name-kebab-case]",
  "featureId": "[3-digit feature number]",
  "description": "[Feature description]",
  "detailedPrdPath": "[PRD.md or BRD_PRD.md]",
  "technicalSpecPath": "TECH_SPEC.md",
  "userStories": [...],
  "technicalConstraints": [...],
  "testCases": [...]
}
```

### User Story Object

```json
{
  "id": "US-006-01",
  "title": "Story title",
  "description": "As a [user], I want [feature] so that [benefit]",
  "technicalSpecSection": "#31-us-006-01-story-title",
  "acceptanceCriteria": [
    {
      "id": "AC-006-01",
      "text": "Criterion text",
      "passes": false,
      "estimatedHours": 1
    }
  ],
  "priority": 1,
  "storyPoints": 3,
  "totalEstimatedHours": 4.5,
  "passes": false,
  "notes": ""
}
```

### Optional Jodex Block

```json
{
  "jodex": {
    "branchName": "jodex/feature-name",
    "progressPath": "progress.txt"
  }
}
```

Only include if project uses Jodex autonomous execution.

---

## Phase 5: Save

1. Write via temp file + rename (atomic)
2. Display summary: story count, total hours, total points

---

## Checklist Before Saving

- [ ] Source PRD read and all IDs extracted
- [ ] TECH_SPEC read (if present) with TC/TEST IDs
- [ ] Feature ID matches folder feature number
- [ ] All user story IDs preserved exactly from source
- [ ] AC IDs preserved with global sequential numbering
- [ ] Every story completable in one context window
- [ ] Stories ordered by dependency (schema → backend → UI)
- [ ] Hour estimates set for every AC (0.25, 0.5, 1, or 2)
- [ ] Story points set (1, 2, 3, 5, or 8)
- [ ] Quality criteria present in every story
- [ ] Merge preserved existing Azure/passes/notes state (if applicable)
- [ ] Removed synced items tombstoned (not deleted)
- [ ] Written atomically via temp+rename
