---
title: Product Management Skills Plugin
type: project
tags: [plugin, product-management, brd, prd, tech-spec, ado, jx-pm]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [PM plugin, PO plugin, product owner skills, jx-pm]
provenance: synthesis
status: active
promoted_from: ideas/
---

# Product Management Skills Plugin

Plugin name: **jx-pm**. Single plugin providing [[Skill]]s for product managers and product owners. Covers document generation, JSON conversion, and Azure DevOps synchronization.

Ported and generalized from `casacolinacare.com/.claude/skills/cc-gen-*` and `cc-azure-board-sync`.

## Decisions Made

| Question | Decision |
|----------|----------|
| Plugin structure | Single plugin, 5 skills |
| BRD vs PRD tiers | One skill with `--mode lite\|prd\|unified` flag |
| Skill chaining | Optional `--chain` flag to auto-feed output to next skill |
| Output format | Markdown by default, `--wiki` flag to file into LLM Wiki |
| ADO pipeline | Two separate skills: prd-task (PRD→JSON) + ado (JSON→Azure Boards) |
| ADO work item types | Configurable hierarchy depth (default: User Stories only) |
| ADO config | task.json authoritative once bound; memory stores suggestion only |
| Tech spec framework | Framework-agnostic (remove Next.js specifics, keep Mermaid/JSON Schema/OpenAPI) |
| Save location | Configurable folder pattern, default `{NNN}_{feature_name}` |

## Skills

### 1. `/jx-pm:prd` — BRD/PRD Generator
Generate requirements documents from conversational input or structured prompts. Three modes in one skill.

- Flag: `--mode lite|prd|unified` (default: lite)
  - `lite` — streamlined PRD, single feature, 3-5 user stories
  - `prd` — advanced PRD, multi-system/complex features
  - `unified` — BRD+PRD combining business justification + tactical PRD
- Output: markdown file or wiki page (`--wiki`)
- With `--chain`: auto-feeds output to `/jx-pm:techspec`
- Includes: golden thread traceability (OBJ→US→AC→FR), INVEST user stories, Gherkin AC, MoSCoW prioritization
- ID system: `{TYPE}-{feature_number}-{seq}` with global AC counter

### 2. `/jx-pm:techspec` — Tech Spec Generator
Transform PRD/BRD_PRD into TECH_SPEC.md with formal specifications.

- Input: PRD file path or piped from `--chain`
- Output: TECH_SPEC.md or wiki page (`--wiki`)
- With `--chain`: auto-feeds to `/jx-pm:task`
- Framework-agnostic: uses Mermaid diagrams, JSON Schema, OpenAPI specs — no framework-specific patterns baked in
- Generates TC (technical constraint) and TEST IDs; references PRD US/AC/FR IDs without modification
- Includes: Socratic interview phase, ambiguity detection, architectural red flags

### 3. `/jx-pm:task` — PRD to JSON Converter
Convert PRD/BRD_PRD markdown into canonical `task.json` for Jodex autonomous execution.

- Input: PRD.md or BRD_PRD.md + optionally TECH_SPEC.md (when chained from techspec or when TECH_SPEC exists in folder)
- Output: task.json in same folder
- Preserves all source IDs exactly (US, AC, FR, NFR from PRD; TC, TEST from TECH_SPEC)
- Adds: hour estimates, story points, dependency ordering
- Validates: story sizing (must fit one Jodex context window)
- When TECH_SPEC present: includes `technicalConstraints` and `testCases` arrays with TC/TEST IDs in task.json
- Fails validation in chained mode if expected TECH_SPEC is missing
- With `--chain`: auto-feeds to `/jx-pm:ado`

### 4. `/jx-pm:ado` — Azure Boards Sync
Synchronize task.json to Azure Boards via MCP tools.

- Input: task.json
- Creates: Feature → User Stories → Tasks hierarchy in ADO
- Modes: Normal (create), Update, Force recreate, Partial, State Sync
- State sync: reads `passes` flags from task.json, updates ADO work item states (designed for post-Jodex reconciliation)
- Writes Azure work item IDs back to task.json
- Config: ADO org/project saved to agent memory on first use
- Uses: `mcp__azure-devops__wit_*` MCP tools

**Safety contracts:**
- Idempotent: uses source requirement IDs (US-{NNN}-{seq}, AC-{NNN}-{seq}) as stable keys — lookup-before-create prevents duplicates on retry
- Tenant guard: confirms org/project before every write (even if cached in memory) via dry-run preview
- Partial-failure recovery: atomic task.json write-back after each work item batch; resume from last successful write on retry
- Confirmation gates: force-recreate and state-sync modes require explicit user confirmation before execution
- Dry-run: `--dry-run` flag shows planned ADO operations without executing

### 5. (Future) `/jx-pm:pipeline` — Full Pipeline
Optional convenience skill running all 4 in sequence: bprd → techspec → prd-task → ado.

## Generalization Changes from Source

| Aspect | casacolinacare (cc-gen-*) | jx-pm (generic) |
|--------|--------------------------|-----------------|
| Framework | Next.js 15 / React 19 hardcoded | Framework-agnostic |
| Save path | Hardcoded `prds/` | Configurable, default `{NNN}_{name}` |
| AC quality gates | `dev-browser skill` references | Generic: lint, typecheck, tests |
| Skill prefix | `cc-gen-*` | `jx-pm:*` |
| Inter-skill refs | `cc-gen-prd-task`, `cc-gen-tech-spec` | `jx-pm:task`, `jx-pm:techspec` |
| task.json contract | Jodex-specific | Core required, Jodex fields optional |

## Resolved Questions

| Question | Decision |
|----------|----------|
| Tech spec patterns | Mermaid (sequence, ERD, state machines, C4), JSON Schema, OpenAPI, ADR format |
| BRD/PRD templates | Simplify — keep core sections, cut troubleshooting/workflow example bloat |
| Default root directory | `docs/` — structure: `docs/{NNN}_{feature_name}/PRD.md` |
| Chain behavior | `--chain` = next skill only, `--chain-all` = full pipeline. Partial chains allowed |
| task.json schema | Core fields required (project, featureName, featureId, userStories). Jodex fields (branchName, technicalSpecSection, passes) optional |

## Open Questions (Remaining)

None — all design questions resolved. Ready for implementation.

## Source Skill Mapping

| Source skill | jx-pm skill | Key files |
|-------------|-------------|-----------|
| cc-gen-prd-lite | `/jx-pm:prd --mode lite` | SKILL.md, PRD_Template.md, PRD_Example.md |
| cc-gen-prd | `/jx-pm:prd --mode prd` | SKILL.md, PRD_Template.md, PRD_Example.md |
| cc-gen-brd-prd | `/jx-pm:prd --mode unified` | SKILL.md, BRD_Template.md, BRD_PRD_Template.md, PRD_Template.md, Complete_User_Story_Template_with_Gherkin.md |
| cc-gen-tech-spec | `/jx-pm:techspec` | SKILL.md |
| cc-gen-prd-task | `/jx-pm:task` | SKILL.md, prd-json-schema.md |
| cc-azure-board-sync | `/jx-pm:ado` | SKILL.md |

## Related

- [[QA AI]] — similar multi-phase skill pattern (BRD → xlsx → Playwright)
- [[Multi-Phase Skill]] — structural pattern these skills would follow
- [[Plugin Architecture]] — .claude-plugin format
- [[Creating a Skill]] — how to build skills
- [[Naming Ripple Effect]] — plugin rename cascade considerations

## Sources
