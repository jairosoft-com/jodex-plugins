---
name: extract
user-invocable: true
argument-hint: <brd_path> [xlsx_path] [mapping_path] [area_path] [assigned_to]
description: >
  Extract E2E test cases from BRD/PRD markdown documents and insert them into
  an Excel (.xlsx) test plan spreadsheet. Triggers on: "extract E2E test cases
  from BRD", "generate E2E tests from requirements", "add E2E test steps to
  test plan spreadsheet", "turn acceptance criteria into E2E test cases", or
  any request to generate/extract/write E2E test cases from a requirements
  document into an xlsx file. Do not trigger for test plan reviews, coverage
  analysis, Playwright script generation, or unit/integration test generation.
---

# BRD/PRD → Test Cases

Extract E2E test cases from requirement documents and insert them into a structured Excel test plan.

## Inputs

Gather these before starting:

| Input | Required | Source |
|-------|----------|--------|
| BRD/PRD markdown path | Yes | User provides or references `raw/articles/` |
| Existing xlsx test plan | Yes if appending, No if creating new | User provides or found in `raw/data/` |
| Mapping JSON | No — infer column structure from xlsx row 1 if absent | `raw/data/*-mapping-*.json` |

If no xlsx exists and no mapping JSON, use the default 9-column Azure DevOps format:
`ID | Work Item Type | Title | Test Step | Step Action | Step Expected | Area Path | Assigned To | State`

## Arguments

| Argument | Required | Example | Notes |
|----------|----------|---------|-------|
| `brd_path` | Yes | `raw/articles/BRD_PRD.md` | Path to BRD/PRD markdown file |
| `xlsx_path` | No | `raw/data/casacolina-test-plan-2026-04-28.xlsx` | Existing test plan to fork. Omit to create new |
| `mapping_path` | No | `raw/data/casacolina-test-plan-mapping-2026-04-28.json` | Column mapping JSON. Inferred from xlsx if absent |
| `area_path` | No | `CasaColinaCare.com` | Override Area Path. Default: from existing xlsx |
| `assigned_to` | No | `RAMON ASENIERO JR <ramon@jairosoft.com>` | Override Assigned To. Default: from existing xlsx |

**Example invocation:**
> Extract E2E test cases from raw/articles/BRD_PRD.md and add to raw/data/casacolina-test-plan-2026-04-28.xlsx

## Phase 1: Extract Requirements

Read the BRD/PRD markdown in full. Extract every testable requirement by scanning for:

- **Acceptance criteria**: `AC-xxx-xx` patterns, checkbox lists under user stories
- **Functional requirements**: `FR-xxx-xx` patterns
- **Non-functional requirements**: `NFR-xxx-xx` patterns
- **Prose requirements**: Bullet lists or paragraphs describing expected behavior without formal IDs

**Dedup rule**: When an FR explicitly maps to specific ACs (e.g., "FR-010-02: ... Supports: US-010-01"),
prefer the ACs for test case generation. Skip the FR to avoid duplicate coverage. Each requirement
should produce exactly one test case unless it covers genuinely independent behaviors.

## Phase 2: Classify as E2E or Not

Present the classification in this table format, then stop and wait for explicit user confirmation:

| Req ID | Summary | Classification | Reason | Proposed Test Title |
|--------|---------|---------------|--------|---------------------|
| AC-010-01 | Bio uses nickname in prose | E2E | Rendered content assertion | Bio displays nickname Kriss on About page |
| AC-010-04 | Lint passes | NOT E2E | CLI tooling | — |

Ask: "Confirm these classifications? You can move items between E2E and NOT-E2E, or edit proposed titles."
Do not proceed until user confirms.

### E2E-testable — generate test case

- Browser/UI content assertions (rendered text, element visibility, content correctness)
- Navigation and user flows (page load, click sequences, form submission)
- Visual/layout checks (spacing, overflow, responsive behavior)
- Authentication flows, checkout sequences, workflow state transitions
- Cross-system handoffs (email delivery, API-then-UI verification)
- Data persistence checks (submit form → verify data persists on reload)

### NOT E2E — skip, report as excluded

- Lint, type-check, or build tool passes (CLI tooling)
- Unit or integration test assertions (test runner scope)
- Code-level inspection (import exists, export defined, constant value)
- Static analysis checks

### Hybrid ACs

Some ACs contain both E2E-verifiable and code-level assertions. Extract only the E2E-verifiable
portion. Example: "bio uses nickname AND imports constant from constants.ts" → test case covers
"bio uses nickname" only; the import check is code-level.

## Phase 3: Discover Test Plan Structure

Before generating test cases, understand the target xlsx format.

### If existing xlsx provided

1. If workbook has multiple sheets, scan each sheet's row 1 for expected headers
   (Work Item Type, Title, Test Step, Step Action, Step Expected).
   If exactly one sheet matches, use it. If zero or multiple sheets match, stop and ask user
   which sheet to use. Do not silently default to `wb.active`.
2. Read row 1 for column headers
3. Identify the **header row + step row** pattern from existing data:
   - **Header row**: has Work Item Type = `Test Case`, Title filled, step columns blank
   - **Step rows**: sequential integers in Test Step column, Action + Expected filled
3. Extract default values for Area Path, Assigned To, State from existing header rows
   - Multiple values across rows: use the most recent (last header row) as default

### If no existing xlsx

Ask user for: Area Path, Assigned To, State values. Create new workbook with column headers in row 1.

## Phase 4: Generate Test Case Steps

For each E2E requirement, create one test case:

**Header row fields:**
- `ID`: blank (auto-assigned externally)
- `Work Item Type`: `Test Case`
- `Title`: Clear, descriptive (e.g., "Bio paragraph displays nickname Kriss on About page")
- `Test Step / Step Action / Step Expected`: blank
- `Area Path / Assigned To / State`: from existing data or user input

**Step rows — writing rules:**
- **Step 1**: Navigation for UI tests (`Go to [URL]`) or setup for non-UI E2E tests
- **Middle steps**: Locate elements, establish context, set preconditions
- **Final steps**: Specific, verifiable assertions — both positive and negative where applicable
- Expected results must be concrete: `Text "Kriss founded Casa Colina Care" is present in bio paragraph` not `Verify it works`
- One assertion per step — don't combine multiple checks

**Traceability**: Note which AC/FR/NFR IDs each test case covers (e.g., "Covers: AC-010-01, AC-010-03").
Include in the output report, not in the xlsx cells.

## Phase 5: Write to Excel

### Forking (existing xlsx)

1. `shutil.copy2(original, new_file)` — byte-preserving copy, never modify original
2. Open the copy with `openpyxl`
3. Before appending, scan existing header rows for matching Titles. Skip duplicates and report them
4. Append new rows after all existing content
5. Save the copy

**Version naming**: `{basename}-{v}.xlsx` where `{v}` is next available integer.
Example: `casacolina-test-plan-2026-04-28.xlsx` → `casacolina-test-plan-2026-04-28-2.xlsx`.
If `-2` exists, use `-3`.

### Creating new (no existing xlsx)

1. Create new `openpyxl.Workbook()`
2. Write headers in row 1
3. Write test cases below
4. Name: use user-provided name or `test-plan-{YYYY-MM-DD}.xlsx`

### Python pattern

```python
import shutil
import openpyxl

# Fork
shutil.copy2(src_path, dst_path)
wb = openpyxl.load_workbook(dst_path)
# Select correct sheet (see Phase 3 worksheet selection logic)
ws = wb.active  # or wb[sheet_name] if multiple sheets

# Append test cases (header row + step rows per test case)
ws.append([None, "Test Case", title, "", "", "", area, assigned, state])
ws.append(["", "", "", 1, action, expected, "", "", ""])
# ... more steps

wb.save(dst_path)
```

## Phase 6: Verify & Report

After writing, re-read the new xlsx and confirm:
- Original file untouched (if forking)
- Column headers match row 1
- All existing test cases preserved
- New test cases follow header row + step rows structure
- Step numbering resets per test case (1, 2, 3…)

Print a **coverage report**:

```
## Coverage Report
✅ Covered:
  - AC-010-01, AC-010-03 → "Bio paragraph displays nickname Kriss on About page"
  - AC-010-02 → "Name card retains full formal name on About page"
  - NFR-010-01 → "No layout regression after nickname text change"

⏭️ Skipped (not E2E):
  - AC-010-04, AC-010-09 → lint check (CLI tooling)
  - AC-010-05, AC-010-10 → type check (CLI tooling)
  - AC-010-06 → unit test pass (test runner)
  - AC-010-07, AC-010-08 → code inspection (static analysis)

📊 Total: 3 test cases generated, 7 criteria skipped
```

Every extracted requirement must appear in the coverage report exactly once — as covered, deduped, or
skipped with reason. If any requirement is unaccounted for, flag it as a gap.

If zero E2E criteria found: report explicitly, do not create an empty workbook.

## Error Handling

- **openpyxl not installed**: Run `pip install openpyxl` after user confirms
- **Encrypted or corrupt xlsx**: Stop with clear message, suggest user re-export from source
- **Wrong format (.xls, .xlsm)**: Only `.xlsx` is supported. Fail closed with clear message: "This skill requires .xlsx format. Please re-export your file as .xlsx."
- **openpyxl drops features**: Byte-copy via `shutil.copy2` preserves original; warn user if macros/charts detected in source workbook
