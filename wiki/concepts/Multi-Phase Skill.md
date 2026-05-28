---
title: Multi-Phase Skill
type: concept
tags: [pattern, skill, architecture]
created: 2026-05-07
updated: 2026-05-08
source_count: 8
aliases: [phased skill, phase-based skill]
provenance: source-derived
---

# Multi-Phase Skill

The structural pattern used by all [[Skill]] implementations. Each skill is broken into numbered phases (typically 4-10) with clear inputs, outputs, and gates between them.

## Extract Example (6 Phases)

1. **Extract Requirements** — scan BRD/PRD for AC-xxx, FR-xxx, NFR-xxx, prose requirements; dedup FRs mapped to ACs
2. **Classify as E2E** — present classification table, [[User Confirmation Gate|wait for confirmation]]
3. **Discover Test Plan Structure** — read existing xlsx headers or create new; resolve worksheet selection
4. **Generate Test Case Steps** — create header row + step rows per [[E2E Test Case]]
5. **Write to Excel** — fork via `shutil.copy2` ([[Idempotent Operation|never modify original]]), append rows, version naming
6. **Verify & Report** — re-read xlsx, confirm structure, print coverage report

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Skill as Extract Skill
    participant FS as Filesystem
    participant XL as openpyxl

    Note over User,XL: Phase 1 - Extract Requirements
    User->>Skill: /extract brd_path [xlsx] [mapping] [area] [assigned]
    Skill->>FS: Read BRD/PRD markdown
    FS-->>Skill: Markdown content
    Skill->>Skill: Scan for AC, FR, NFR, prose requirements
    Skill->>Skill: Dedup - prefer ACs over mapped FRs

    Note over User,XL: Phase 2 - Classify as E2E or Not
    Skill->>User: Classification table with Req ID, Summary, Type, Reason
    Skill->>User: Confirm these classifications?
    User-->>Skill: Confirm or adjust

    Note over User,XL: Phase 3 - Discover Test Plan Structure
    alt xlsx_path provided
        Skill->>FS: Read existing xlsx
        Skill->>XL: load_workbook
        XL-->>Skill: Workbook object
        Skill->>Skill: Scan sheets for matching headers
        Skill->>Skill: Extract Area Path, Assigned To, State
    else no xlsx_path
        Skill->>FS: ls test-plans/*.xlsx
        Skill->>User: Select xlsx or create new
        User-->>Skill: Selection
    end

    Note over User,XL: Phase 4 - Generate Test Case Steps
    loop Each E2E requirement
        Skill->>Skill: Create header row with Title
        Skill->>Skill: Create step rows - navigate, locate, assert
    end

    Note over User,XL: Phase 5 - Write to Excel
    alt Forking existing
        Skill->>FS: shutil.copy2 original to versioned copy
        Skill->>XL: load_workbook copy
        Skill->>Skill: Scan for duplicate titles, skip
        Skill->>XL: Append new header and step rows
        Skill->>XL: wb.save
        XL->>FS: Write versioned xlsx
    else Creating new
        Skill->>XL: New Workbook
        Skill->>XL: Write headers and test case rows
        Skill->>XL: wb.save
        XL->>FS: Write new xlsx
    end

    Note over User,XL: Phase 6 - Verify and Report
    Skill->>FS: Re-read new xlsx
    FS-->>Skill: File content
    Skill->>Skill: Verify structure and step numbering
    Skill->>User: Coverage report - Covered, Skipped, Total
```

## Ingest Example (9 Phases)

1. **Validate & Fingerprint** — check wiki exists, [[SHA-256 Fingerprinting|fingerprint]] source, dedup check
2. **Analyze Source** — extract entities, concepts, ideas from content
3. **Plan Wiki Updates** — present table, [[User Confirmation Gate|wait for approval]]
4. **Snapshot Source** — copy to [[Raw Sources]]
5. **Create/Update Pages** — write pages with frontmatter and wikilinks
6. **[[Cross-Reference Pass]]** — bidirectional linking
7. **Update [[Index]]** — maintain catalog
8. **Append to [[Log]]** — audit trail
9. **Report** — structured summary

## Benefits

- Clear error handling boundaries between phases
- User can abort at confirmation gates without partial writes
- Each phase has defined inputs and outputs
- Phases can reference shared concepts across skills

## Sources
- [[Source - Ingest SKILL]]
- [[Source - Extract SKILL]]
- [[Source - PRD Generator SKILL]]
- [[Source - Tech Spec Generator SKILL]]
- [[Source - Task JSON Converter SKILL]]
- [[Source - Azure Boards Sync SKILL]]
- [[Source - jx-dev Spec SKILL]]
- [[Source - jx-dev Task SKILL]]
