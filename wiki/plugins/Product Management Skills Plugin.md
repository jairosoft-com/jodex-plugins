---
title: Product Management Skills Plugin
type: plugin
tags: [plugin, product-management, prd, ado, meeting-prep, meet-notes, meet-email, jx-pm]
created: 2026-05-22
updated: 2026-05-25
source_count: 1
aliases: [jx-pm, jx-pm plugin]
provenance: synthesis
---

# Product Management Skills Plugin

Plugin name: **jx-pm**. Product management workflow plugin covering requirements generation, Azure Boards sync, pipeline orchestration, feedback capture, daily meeting preparation, and real-time meeting note capture.

## Pipeline

```
/jx-pm:prd → PRD.md
                 ↓
          /jx-dev:spec → TECH_SPEC.md
                 ↓
          /jx-dev:task → task.json
                 ↓
          /jx-pm:ado  → Azure Boards (Feature + User Story hierarchy)
```

## Commands

| Command | Skill | Purpose |
|---------|-------|---------|
| `/jx-pm:prd` | prd | Generate PRD.md / BRD_PRD.md from clarifying questions |
| `/jx-pm:ado` | ado | Sync PRD to Azure Boards (Feature + User Story hierarchy) |
| `/jx-pm:pipeline` | pipeline | Orchestrate full PRD → ADO pipeline in one command |
| `/jx-pm:feedback` | feedback | Capture feedback and create an ADO Feature work item |
| `/jx-pm:meet-pre` | meet-pre | Generate a daily meeting prep doc from live Azure Boards data |
| `/jx-pm:meet-notes` | meet-notes | Capture real-time meeting notes during a session |
| `/jx-pm:meet-email` | meet-email | Email meeting prep as styled HTML via Graph API |

## Skill Categories

Several distinct types of skill live in jx-pm:

- **Generation skills** (`prd`, `pipeline`) — transform user input into structured documents using clarifying questions and templates.
- **Operational skills** (`meet-pre`, `feedback`) — pull live data from external systems (Azure Boards) and write dated operational artifacts.
- **Capture skills** (`meet-notes`) — real-time interactive capture during an ongoing activity. See [[Real-Time Capture as Skill Pattern]].
- **Distribution skills** (`meet-email`) — convert operational output to email-safe HTML and send via Graph API. See [[Email-Safe HTML Rendering Pattern]].

## meet-pre Output

`/jx-pm:meet-pre` writes dated documents to `wiki/raw/meeting_preparation/YYYY-MM-DD.md`. Each document covers:
- Current iteration work items with grooming health (✅ Groomed / ⚠️ Needs Refinement / 🆕 New)
- Planning gaps — unplanned and future-iteration backlog items
- Priority review with misalignment flags
- 3–7 action items for the meeting

## Dependencies

- [[Core Shared Conventions Plugin|jx-core]] provides ADO tenant binding, docs-root resolution, ID rules, and quality gates.
- Azure DevOps MCP (`mcp__azure-devops__*`) required for `ado`, `meet-pre`, and `feedback` skills.

## Notes

`jx-dev` was extracted from jx-pm so developer-facing spec and task skills live in their own plugin. The ADO sync skill (`ado`) and shared conventions are bridged through [[Core Shared Conventions Plugin|jx-core]].

## Sources

- [[Source - jx-pm Plugin README]]
- [[Source - FEAT-006 Meeting Prep Email Plan]]
