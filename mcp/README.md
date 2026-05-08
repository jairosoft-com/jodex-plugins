# qa-ai MCP Server

MCP (Model Context Protocol) server for the **qa-ai** QA testing pipeline.  
This is the Claude Desktop equivalent of the `qa-ai` Claude Code CLI plugin.

## MCP Capabilities

### Prompts (3)

Prompts inject detailed skill instructions into Claude's context when selected.

| Prompt | Description | Arguments |
|:-------|:------------|:----------|
| `qa_extract` | Extract E2E test cases from BRD/PRD markdown into an xlsx test plan | `brd_path` (required), `xlsx_path`, `mapping_path`, `area_path`, `assigned_to` |
| `qa_generate` | Read an xlsx test plan and generate Playwright TypeScript spec files | `test_plan_path` |
| `qa_browser` | Open a browser for manual exploration and debugging with playwright-cli | `subcommand` |

### Resources (2)

Resources provide read-only reference data that can be fetched on-demand.

| Resource | URI | Description |
|:---------|:----|:------------|
| `generate-evals` | `qa-ai://skills/generate/evals` | Evaluation definitions & assertions for the generate skill |
| `playwright-reference` | `qa-ai://skills/playwright-cli/references/{name}` | Playwright-cli reference documentation by topic (9 docs) |

**Available reference names:** `element-attributes`, `playwright-tests`, `request-mocking`, `running-code`, `session-management`, `storage-state`, `test-generation`, `tracing`, `video-recording`

### Tools (5)

Tools are executable functions that Claude can call during a conversation.

| Tool | Description |
|:-----|:------------|
| `write_excel_test_plan` | Write or append test cases to an Excel (.xlsx) test plan spreadsheet |
| `read_excel_test_plan` | Read an Excel test plan and return all rows as structured JSON |
| `verify_excel_test_plan` | Read an Excel test plan and return sheet name, headers, and row count |
| `fork_excel_test_plan` | Byte-copy an xlsx file to a new versioned filename (never modifies the original) |
| `run_playwright_command` | Run `playwright-cli` or `npx playwright` commands safely |

## Mapping: CLI Plugin → MCP

| CLI Plugin Concept | MCP Equivalent |
|:-------------------|:---------------|
| `/qa-ai:extract` command | `qa_extract` prompt |
| `/qa-ai:generate` command | `qa_generate` prompt |
| `/qa-ai:browser` command | `qa_browser` prompt |
| `extract/SKILL.md` instructions | Embedded in `qa_extract` prompt content |
| `generate/SKILL.md` instructions | Embedded in `qa_generate` prompt content |
| `playwright-cli/SKILL.md` reference | Embedded in `qa_browser` prompt content |
| `xlsx-writer.py fork` | `fork_excel_test_plan` tool |
| `xlsx-writer.py append` | `write_excel_test_plan` tool |
| `xlsx-writer.py verify` | `verify_excel_test_plan` tool |
| `xlsx-writer.py read` | `read_excel_test_plan` tool |
| `Bash(playwright-cli:*)` | `run_playwright_command` tool |
| `generate/evals/evals.json` | `generate-evals` resource |
| `playwright-cli/references/*.md` | `playwright-reference` resource template |

## Setup

### Prerequisites

- **Node.js** 18+
- **Playwright** (`npx playwright install`)
- **playwright-cli** (`npm install -g @playwright/cli@latest`)

### Build

```bash
cd mcp
npm install
npm run build
```

### Verify

```bash
# Should print the server version and exit
node build/index.js --help 2>&1 || true
```

## Claude Desktop Configuration

### Linux / macOS (direct)

Add this to your Claude Desktop config file:
- **Linux**: `~/.config/Claude/claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "qa-ai": {
      "command": "node",
      "args": [
        "/absolute/path/to/jodex-qa-ai/mcp/build/index.js"
      ]
    }
  }
}
```

### Windows 11 + WSL (bridged)

If you develop in WSL Ubuntu but run Claude Desktop on Windows, use `wsl.exe` as the bridge:

Config file location: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "qa-ai": {
      "command": "wsl.exe",
      "args": [
        "-d", "Ubuntu",
        "--",
        "bash", "-c", "cd /home/sante8wsl/projects/jairosoft/ai-plugins/jodex-qa-ai/mcp && npm run start"
      ]
    }
  }
}
```

> **Important**: Always use absolute paths — Claude Desktop does not expand `~` or environment variables.

### Verify in Claude Desktop

After restarting Claude Desktop:
- The **🔨 hammer icon** should show 5 tools
- The **📎 attachment icon** (or `/` key) should show 3 prompts: `qa_extract`, `qa_generate`, `qa_browser`
- Resources (evals + 9 reference docs) are available on-demand via resource URIs

## Project Structure

```
mcp/
├── package.json              # Project config with build/start scripts
├── tsconfig.json             # TypeScript configuration (Node16)
├── src/
│   ├── index.ts              # Server entry — prompts, resources & tools
│   └── prompts/
│       ├── extract.ts        # Full extract skill (BRD → Excel)
│       ├── generate.ts       # Full generate skill (Excel → Playwright specs)
│       └── browser.ts        # Full playwright-cli reference manual
└── build/                    # Compiled JavaScript output (generated)

plugins/qa-ai/skills/         # Source data served by MCP resources
├── generate/evals/
│   └── evals.json            # Eval definitions (served as resource)
└── playwright-cli/references/
    ├── element-attributes.md # ┐
    ├── playwright-tests.md   # │
    ├── request-mocking.md    # │
    ├── running-code.md       # │ 9 reference docs
    ├── session-management.md # │ (served via resource template)
    ├── storage-state.md      # │
    ├── test-generation.md    # │
    ├── tracing.md            # │
    └── video-recording.md    # ┘
```

## Security

This MCP server follows the same **least-privilege security model** as the CLI plugin:

- **`run_playwright_command`** only allows `playwright-cli` and `npx playwright` — all other commands are rejected
- **Excel tools** operate on `.xlsx` files only — no arbitrary file system access
- **`fork_excel_test_plan`** never modifies the original file — always creates a copy
- **Resource template** validates reference names against an allowlist and checks resolved paths to prevent directory traversal
