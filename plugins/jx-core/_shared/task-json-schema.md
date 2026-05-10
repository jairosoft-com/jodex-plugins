# task.json Schema

Canonical JSON format for task breakdowns. Produced by the task skill and consumed by the ado skill for Azure Boards sync and optionally by Jodex for autonomous execution.

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `project` | string | Project name |
| `featureName` | string | kebab-case feature name (no prefix) |
| `featureId` | string | 3-digit feature number from folder (e.g., "006") |
| `description` | string | Feature description |
| `detailedPrdPath` | string | Relative path: `PRD.md` or `BRD_PRD.md` |
| `userStories` | array | User story objects (see below) |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `technicalSpecPath` | string | `TECH_SPEC.md` (if exists) |
| `technicalConstraints` | array | TC objects from TECH_SPEC |
| `testCases` | array | TEST objects from TECH_SPEC |
| `jodex` | object | Jodex-specific fields (see below) |
| `azureWorkItemId` | number | Feature work item ID (added by ado) |
| `azureWorkItemUrl` | string | Feature work item URL (added by ado) |
| `azureOrganization` | string | Bound Azure org (added by ado) |
| `azureProject` | string | Bound Azure project (added by ado) |
| `lastSyncedToAzure` | string | ISO timestamp (added by ado) |

## User Story Object

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
      "estimatedHours": 1,
      "azureWorkItemId": null,
      "azureWorkItemUrl": null
    }
  ],
  "priority": 1,
  "storyPoints": 3,
  "totalEstimatedHours": 4.5,
  "passes": false,
  "notes": "",
  "azureWorkItemId": null,
  "azureWorkItemUrl": null
}
```

## Tombstone Object (removed items)

```json
{
  "id": "US-006-03",
  "removed": true,
  "azureWorkItemId": 200456,
  "azureWorkItemUrl": "https://dev.azure.com/..."
}
```

Items with `removed: true` are inert -- not synced, not created. Preserved for `--prune` reconciliation.

## Optional Jodex Block

```json
{
  "jodex": {
    "branchName": "jodex/feature-name",
    "progressPath": "progress.txt"
  }
}
```

## Hour Estimation Scale (per AC)

| Hours | Label | When to use |
|-------|-------|-------------|
| 0.25 | Trivial | Quality gates: lint, typecheck, unit tests |
| 0.5 | Simple | E2E test, browser verification, single config change |
| 1 | Moderate | New test file, component update, multi-file change |
| 2 | Complex | New feature logic, significant refactor |

## Story Points (per User Story)

| Points | Signals |
|--------|---------|
| 1 | 1-2 ACs, single file, <=0.75h |
| 2 | 2-3 ACs, 1-2 files, <=1.5h |
| 3 | 3-5 ACs, 2-4 files, <=3h |
| 5 | 5-7 ACs, 4-6 files, <=5h |
| 8 | 7+ ACs, 6+ files -- consider splitting |

## Story Sizing Rule

Each story must be completable in ONE context window. If you can't describe the change in 2-3 sentences, split it.

## Dependency Ordering

Stories execute in priority order. Earlier stories must not depend on later ones:
1. Schema/database changes
2. Server actions / backend logic
3. UI components that use the backend
4. Dashboard/summary views
