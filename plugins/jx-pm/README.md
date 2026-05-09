# jx-pm — Product Management Skills Plugin

Generate PRDs, tech specs, task breakdowns, and sync to Azure Boards.

## Skills

| Skill | Command | Description |
|-------|---------|-------------|
| prd | `/jx-pm:prd` | Generate BRD/PRD documents (modes: lite, prd, unified) |
| techspec | `/jx-pm:techspec` | Transform PRD into framework-agnostic technical specification |
| task | `/jx-pm:task` | Convert PRD + TECH_SPEC into task.json for execution |
| ado | `/jx-pm:ado` | Sync task.json to Azure Boards (Feature → Stories → Tasks) |
| pipeline | `/jx-pm:pipeline` | Run full chain: prd → techspec → task → ado |

## Pipeline

```
/jx-pm:prd → /jx-pm:techspec → /jx-pm:task → /jx-pm:ado
```

Each skill can run standalone or chain to the next via `--chain` (next skill) or `--chain-all` (full pipeline).

## Output Files

```
docs/{NNN}_{feature_name}/
├── PRD.md (or BRD_PRD.md)   ← prd skill
├── TECH_SPEC.md              ← techspec skill
└── task.json                 ← task skill (enriched by ado skill)
```

## Configuration

- **Docs root:** Default `docs/`. Override via `--docs-root <path>` or env `JX_PM_DOCS_ROOT`.
- **ADO tenant:** Bound to task.json on first sync. Memory stores suggestion only.

## Installation

```bash
claude plugin marketplace add --source ./plugins/jx-pm
```
