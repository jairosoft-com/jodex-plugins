# jx-pm — Product Management Skills Plugin

Generate PRDs and sync to Azure Boards.

## Dependencies

- **jx-core** — shared conventions (ID rules, docs-root resolution, task JSON schema)

## Skills

| Skill | Command | Description |
|-------|---------|-------------|
| prd | `/jx-pm:prd` | Generate BRD/PRD documents (modes: lite, prd, unified) |
| ado | `/jx-pm:ado` | Sync task.json to Azure Boards (Feature → Stories → Tasks) |
| pipeline | `/jx-pm:pipeline` | Run PRD generation (reduced — see full workflow below) |

## Full Workflow

The complete pipeline spans two plugins. Run each skill in order:

```
/jx-pm:prd        → PRD.md
/jx-dev:spec      → TECH_SPEC.md
/jx-dev:task      → task.json
/jx-pm:ado        → Azure work items
```

## Output Files

```
docs/{NNN}_{feature_name}/
├── PRD.md (or BRD_PRD.md)   ← prd skill
├── TECH_SPEC.md              ← jx-dev:spec
├── task.json                 ← jx-dev:task (enriched by ado skill)
```

## Configuration

- **Docs root:** Default `docs/`. Override via `--docs-root <path>` or env `$JX_DOCS_ROOT`. Backward-compatible fallback: `$JX_PM_DOCS_ROOT`.
- **ADO tenant:** Bound to task.json on first sync. Memory stores suggestion only.

## Installation

```bash
claude plugin marketplace add --source ./plugins/jx-pm
```
