# Shared ID Rules

All jx skills reference this file for folder validation, feature-number extraction, and ID generation.

## Folder Path Validation

Pattern: `{NNN}_{feature_name}` where:
- `{NNN}` is exactly 3 digits (001-999)
- Followed by underscore `_`
- Followed by feature name

Regex: `^(\d{3})_(.+)$`

### Validation Steps

1. Extract folder name from full path (e.g., from `docs/006_payment_gateway/` extract `006_payment_gateway`)
2. Check first 3 characters are digits
3. Verify 4th character is underscore
4. Verify numeric prefix is between 001 and 999 (reject 000)

### On Failure

Display:
```
Invalid folder name format

Expected: {NNN}_{feature_name}
Example: 006_payment_gateway

Your input: [folder_name]
Issue: [specific issue]

Please provide a valid folder path:
```

### On Success

1. Extract feature number (preserve leading zeros as string: "006" not "6")
2. Display: `Using feature number {feature_number} from folder '{folder_name}'`
3. Wait for user confirmation before proceeding

## ID Format

All requirement IDs: `{TYPE}-{feature_number}-{seq}`

- `{TYPE}`: requirement category
- `{feature_number}`: 3-digit string from folder (leading zeros preserved)
- `{seq}`: 2-digit sequential number with zero-padding (01, 02, 03...)

## ID Types by Skill

| Type | Created By | Counter |
|------|-----------|---------|
| OBJ | prd skill | Independent |
| GOAL | prd skill (unified mode) | Independent |
| US | prd skill | Independent |
| AC | prd skill | **GLOBAL across all US** |
| FR | prd skill | Independent |
| NFR | prd skill | Independent |
| RISK | prd skill (unified mode) | Independent |
| TC | spec skill | Independent |
| TEST | spec skill | Independent |

## Global AC Counter (Critical)

AC IDs do NOT reset per user story. They increment globally:

```
US-006-01 -> AC-006-01, AC-006-02
US-006-02 -> AC-006-03, AC-006-04  (continues, not reset)
```

## Cross-Document Rules

- The spec skill references PRD IDs (US, AC, FR, NFR) -- NEVER creates new ones
- The spec skill creates only TC and TEST IDs
- The task skill preserves all IDs exactly in task.json
- The ado skill maps each ID to an Azure work item
