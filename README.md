# jodex-plugins

Claude Code plugin marketplace by **Jairosoft** — six plugins spanning QA automation, knowledge management, product management, developer tooling, skill/plugin scaffolding, and shared conventions.

## Plugins

| Plugin | Category | Description |
|--------|----------|-------------|
| **jx-qa** | QA | Extract E2E test cases from BRDs, generate Playwright specs, automate browser interactions |
| **jx-kb** | Knowledge | LLM-maintained wiki: ingest sources, query with citations, lint for health |
| **jx-pm** | Product | Generate PRDs, sync to Azure Boards |
| **jx-dev** | Developer | Generate technical specifications and task breakdowns from PRDs |
| **jx-core** | Core | Shared conventions and executable skill logic (ADO sync, task conversion) consumed by role plugins. No user-facing commands |
| **jx-plugin** | Productivity | Skill and plugin scaffolding: create skills inside existing plugins and new plugin skeletons with convention enforcement |

### jx-qa

```
/jx-qa:extract <brd_path>          Extract test cases from BRD/PRD → xlsx test plan
/jx-qa:generate [xlsx_path]        Generate Playwright specs from xlsx via live browser
/jx-qa:browser <subcommand>        Manual browser exploration with playwright-cli
/jx-qa:test [ui|headed]            Run Playwright tests
```

### jx-kb

```
/jx-kb:init [wiki_path]            Initialize an LLM Wiki
/jx-kb:ingest <source> [wiki]      Ingest source document into wiki
/jx-kb:query <question> [wiki]     Search wiki and synthesize answer with citations
/jx-kb:lint [wiki_path]            Health-check: orphans, broken links, stale claims
/jx-kb:triage [wiki_path]          Classify raw ideas: promote, backlog, or archive
```

### jx-pm

```
/jx-pm:prd [--mode lite|prd|unified]   Generate a PRD
/jx-pm:pipeline [--mode ...]           Run full PRD generation pipeline
/jx-pm:ado [--dry-run] [--tenant ...]  Sync task.json to Azure Boards
```

### jx-dev

```
/jx-dev:spec [--docs-root <path>]              Generate tech spec from PRD
/jx-dev:task [--docs-root <path>]              Convert PRD + tech spec → task.json
```

### jx-plugin

```
/jx-plugin:create-skill [--plugin <name>] [--skill <name>]   Scaffold a new skill
/jx-plugin:create-plugin --plugin <jx-name> --description "..."   Scaffold a new plugin skeleton
```

### Dependencies

```
jx-pm  → jx-core, jx-dev
jx-dev → jx-core
```

## Requirements

- **Claude Code** CLI or Desktop
- **Python 3** + `openpyxl` (for jx-qa, jx-kb)
- **Node.js 18+** + **Playwright** (for jx-qa)
- **Azure DevOps MCP server** (for jx-pm:ado only)

## Installation — Claude Code CLI

```bash
# Add marketplace (one-time)
/plugin marketplace add jairosoft-com/jodex-plugins

# Install plugins you need
/plugin install jx-qa@jodex-plugins
/plugin install jx-kb@jodex-plugins
/plugin install jx-pm@jodex-plugins
/plugin install jx-dev@jodex-plugins
/plugin install jx-plugin@jodex-plugins

# Reload
/reload-plugins
```

Installing jx-pm or jx-dev will also pull jx-core automatically via dependencies.

## Local Development

```bash
# Test a single plugin locally
claude --plugin-dir /path/to/jodex-plugins/plugins/jx-qa

# Or register as local marketplace
claude plugin marketplace add /path/to/jodex-plugins --scope project
claude plugin install jx-qa@jodex-plugins
```

## Uninstall

```bash
/plugin uninstall jx-qa@jodex-plugins
/plugin uninstall jx-kb@jodex-plugins
/plugin uninstall jx-pm@jodex-plugins
/plugin uninstall jx-dev@jodex-plugins
/plugin uninstall jx-plugin@jodex-plugins
/plugin marketplace remove jodex-plugins
```

See [plugins/qa-ai/README.md](plugins/qa-ai/README.md) for detailed CLI plugin documentation.

---

## Project Structure

```
jodex-qa-ai/
├── plugins/qa-ai/            # Claude Code CLI Plugin
│   ├── .claude-plugin/       #   Plugin manifest
│   ├── commands/             #   Slash commands (extract, generate, browser)
│   ├── skills/               #   AI skill instructions
│   ├── scripts/              #   Pinned helper scripts (xlsx-writer.py)
│   └── README.md
├── .claude-plugin/           # Marketplace registry
└── README.md                 # ← You are here
```

## License

MIT — see [LICENSE](LICENSE).
