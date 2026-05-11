---
title: Plugin Pipeline Sequence
type: concept
tags: [architecture, plugins, pipeline, sequence-diagram]
created: 2026-05-10
provenance: session-derived
---

# Plugin Pipeline Sequence

Full system overview of all five jx-* plugins, their dependency graph, and the two primary pipelines (PM→Dev and QA).

> **Note:** Cross-plugin auto-chaining is deferred. Each skill is invoked manually by the User. Artifacts pass via filesystem.

---

## Plugin Dependency Graph

```mermaid
flowchart TD
    subgraph Standalone
        KB["jx-kb
Knowledge Base
init | ingest | query | triage | lint"]
    end

    subgraph PM-Dev Pipeline
        CORE["jx-core
Shared Conventions
id-rules | docs-root | task-json-schema"]
        PM["jx-pm
Project Management
prd | ado | pipeline"]
        DEV["jx-dev
Developer
spec | task"]
    end

    subgraph QA Pipeline
        QA["jx-qa
QA Harness
extract | generate | playwright-cli | test"]
    end

    PM -->|depends| CORE
    PM -->|depends| DEV
    DEV -->|depends| CORE

    style CORE fill:#f5f5dc,stroke:#999
    style PM fill:#d4edda,stroke:#28a745
    style DEV fill:#cce5ff,stroke:#007bff
    style QA fill:#f8d7da,stroke:#dc3545
    style KB fill:#e2d9f3,stroke:#6f42c1
```

---

## PM → Dev Pipeline Sequence

```mermaid
sequenceDiagram
    actor User
    participant PM as jx-pm:prd
    participant DEV_S as jx-dev:spec
    participant DEV_T as jx-dev:task
    participant ADO as jx-pm:ado
    participant FS as Filesystem
    participant CORE as jx-core shared
    participant AzDO as Azure DevOps

    Note over User,AzDO: Phase 1 - Generate PRD
    User->>PM: /jx-pm:prd
    PM->>CORE: Read docs-root, id-rules
    CORE-->>PM: Conventions
    PM->>FS: Write PRD.md
    FS-->>User: PRD.md ready

    Note over User,AzDO: Phase 2 - Generate Technical Spec
    User->>DEV_S: /jx-dev:spec consumes PRD.md
    DEV_S->>FS: Read PRD.md
    DEV_S->>CORE: Read id-rules, task-json-schema
    CORE-->>DEV_S: Conventions
    DEV_S->>FS: Write TECH_SPEC.md
    FS-->>User: TECH_SPEC.md ready

    Note over User,AzDO: Phase 3 - Generate Task Breakdown
    User->>DEV_T: /jx-dev:task consumes PRD + TECH_SPEC
    DEV_T->>FS: Read PRD.md + TECH_SPEC.md
    DEV_T->>CORE: Read task-json-schema, id-rules
    CORE-->>DEV_T: Conventions
    DEV_T->>FS: Write task.json
    FS-->>User: task.json ready

    Note over User,AzDO: Phase 4 - Sync to Azure Boards
    User->>ADO: /jx-pm:ado consumes task.json
    ADO->>FS: Read task.json
    ADO->>CORE: Read id-rules
    CORE-->>ADO: Conventions
    loop Each work item
        ADO->>AzDO: Create or update work item
        AzDO-->>ADO: Work item ID
        ADO->>FS: Write back ID to task.json
    end
    ADO-->>User: Sync report
```

---

## QA Pipeline Sequence

```mermaid
sequenceDiagram
    actor User
    participant EXT as jx-qa:extract
    participant GEN as jx-qa:generate
    participant PW as jx-qa:playwright-cli
    participant TEST as jx-qa:test
    participant FS as Filesystem
    participant Browser as Chrome

    Note over User,Browser: Phase 1 - Extract Test Cases from BRD
    User->>EXT: /jx-qa:extract brd_path [xlsx]
    EXT->>FS: Read BRD/PRD markdown
    FS-->>EXT: Markdown content
    EXT->>EXT: Scan AC, FR, NFR then classify E2E
    EXT->>User: Classification table - confirm?
    User-->>EXT: Confirmed
    EXT->>FS: Write or append test-plan.xlsx
    FS-->>User: test-plan.xlsx ready

    Note over User,Browser: Phase 2 - Generate Playwright Specs
    User->>GEN: /jx-qa:generate consumes xlsx
    GEN->>FS: Read test-plan.xlsx
    FS-->>GEN: Test case rows
    loop Each test case
        GEN->>GEN: Map steps to Playwright actions
        GEN->>FS: Write .spec.ts
    end
    FS-->>User: .spec.ts files ready

    Note over User,Browser: Phase 3 - Browser Automation ad-hoc
    User->>PW: /jx-qa:playwright-cli
    PW->>Browser: Launch and interact
    Browser-->>PW: Results
    PW-->>User: Output

    Note over User,Browser: Phase 4 - Run Tests
    User->>TEST: /jx-qa:test
    TEST->>FS: Read .spec.ts files
    TEST->>Browser: Execute Playwright tests
    Browser-->>TEST: Results
    TEST-->>User: Test report
```

---

## jx-kb Pipeline (Independent)

```mermaid
sequenceDiagram
    actor User
    participant INIT as jx-kb:init
    participant ING as jx-kb:ingest
    participant Q as jx-kb:query
    participant TRI as jx-kb:triage
    participant LINT as jx-kb:lint
    participant FS as Wiki FS

    Note over User,FS: Bootstrap
    User->>INIT: /jx-kb:init
    INIT->>FS: Create wiki structure - schema, index, log, backlog
    FS-->>User: Wiki initialized

    Note over User,FS: Ingest Sources
    User->>ING: /jx-kb:ingest source
    ING->>FS: Read source document
    ING->>ING: Extract entities, concepts, ideas
    ING->>FS: Create or update wiki pages, _index, _log
    FS-->>User: Pages created

    Note over User,FS: Query
    User->>Q: /jx-kb:query question
    Q->>FS: Search _index, read pages
    Q-->>User: Answer with citations

    Note over User,FS: Triage Ideas
    User->>TRI: /jx-kb:triage
    TRI->>FS: Read ideas with status raw
    loop Each raw idea
        TRI->>User: Classify - promote, backlog, or archive
        User-->>TRI: Decision
        TRI->>FS: Update idea status
    end

    Note over User,FS: Health Check
    User->>LINT: /jx-kb:lint
    LINT->>FS: Scan all pages
    LINT->>LINT: Check orphans, broken links, stale claims
    LINT-->>User: Health report
```

---

## Artifact Flow Summary

| Step | Command | Input | Output |
|------|---------|-------|--------|
| 1 | `/jx-pm:prd` | User requirements | `PRD.md` |
| 2 | `/jx-dev:spec` | `PRD.md` | `TECH_SPEC.md` |
| 3 | `/jx-dev:task` | `PRD.md` + `TECH_SPEC.md` | `task.json` |
| 4 | `/jx-pm:ado` | `task.json` | Azure DevOps work items |
| 5 | `/jx-qa:extract` | BRD/PRD markdown | `test-plan.xlsx` |
| 6 | `/jx-qa:generate` | `test-plan.xlsx` | `.spec.ts` files |
| 7 | `/jx-qa:test` | `.spec.ts` files | Test report |

## See Also

- [[Skill Chaining]]
- [[Multi-Phase Skill]]
- [[Cross-Plugin Shared Convention Layer]]
