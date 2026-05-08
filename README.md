# jodex-qa-ai

Claude Code plugin marketplace for **qa-ai** — a QA testing pipeline that turns BRD/PRD documents into Playwright test suites.

Available as both a **Claude Code CLI plugin** and a **Claude Desktop MCP server**.

## What You Get

- `/qa-ai:extract` — Extract E2E test cases from BRD/PRD markdown into xlsx test plans
- `/qa-ai:generate` — Generate Playwright TypeScript specs from xlsx test plans
- `/qa-ai:browser` — Manual browser exploration with playwright-cli

## Requirements

- **Claude Code** CLI or **Claude Desktop**
- **Node.js** 18+
- **Playwright** (`npx playwright install`)
- **playwright-cli** (`npm install -g @playwright/cli@latest`)
- **Python 3** + `openpyxl` (`pip install openpyxl`) — *CLI plugin only*

---

## Option A: Claude Code CLI Plugin

### Installation

```bash
# Add this marketplace (one-time)
/plugin marketplace add jairosoft-com/jodex-qa-ai

# Install the plugin
/plugin install qa-ai@jodex-qa-ai

# Reload plugins
/reload-plugins
```

### Usage

```bash
# Extract test cases from a BRD
/qa-ai:extract path/to/BRD.md

# Generate Playwright specs from test plan
/qa-ai:generate

# Open browser for manual exploration
/qa-ai:browser open https://example.com
```

### Local Development

```bash
# Test plugin locally before pushing
claude --plugin-dir /path/to/jodex-qa-ai/plugins/qa-ai

# Or register as local marketplace
claude plugin marketplace add /path/to/jodex-qa-ai --scope project
claude plugin install qa-ai@jodex-qa-ai
```

### Uninstall

```bash
/plugin uninstall qa-ai@jodex-qa-ai
/plugin marketplace remove jodex-qa-ai
```

See [plugins/qa-ai/README.md](plugins/qa-ai/README.md) for detailed CLI plugin documentation.

---

## Option B: Claude Desktop MCP Server

The `mcp/` directory contains a TypeScript MCP server that exposes the same capabilities for **Claude Desktop**.

### MCP Capabilities

#### Prompts (3)

| Prompt | Description | Arguments |
|:-------|:------------|:----------|
| `qa_extract` | Extract E2E test cases from BRD/PRD markdown into an xlsx test plan | `brd_path` (required), `xlsx_path`, `mapping_path`, `area_path`, `assigned_to` |
| `qa_generate` | Read an xlsx test plan and generate Playwright TypeScript spec files | `test_plan_path` |
| `qa_browser` | Open a browser for manual exploration and debugging with playwright-cli | `subcommand` |

#### Tools (5)

| Tool | Description |
|:-----|:------------|
| `write_excel_test_plan` | Write or append test cases to an Excel (.xlsx) test plan spreadsheet |
| `read_excel_test_plan` | Read an Excel test plan and return all rows as structured JSON |
| `verify_excel_test_plan` | Read an Excel test plan and return sheet name, headers, and row count |
| `fork_excel_test_plan` | Byte-copy an xlsx file to a new versioned filename (never modifies the original) |
| `run_playwright_command` | Run `playwright-cli` or `npx playwright` commands safely |

### Build

```bash
cd mcp
npm install
npm run build
```

### Claude Desktop Configuration

Add this to your `claude_desktop_config.json`:

**Linux / macOS (direct)**:

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

**Windows 11 + WSL (bridged)**:

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

After restarting Claude Desktop, the **🔨 hammer icon** should show 5 tools and the **📎 attachment icon** should show 3 prompts.

See [mcp/README.md](mcp/README.md) for full MCP documentation.

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
├── mcp/                      # Claude Desktop MCP Server
│   ├── src/                  #   TypeScript source
│   │   ├── index.ts          #     Server entry point
│   │   └── prompts/          #     Full skill content (extract, generate, browser)
│   ├── build/                #   Compiled JavaScript output
│   ├── package.json
│   └── README.md
├── .claude-plugin/           # Marketplace registry
├── claude_cli_vs_desktop_mcp_guide.md
├── claude_desktop_wsl_integration.md
└── README.md                 # ← You are here
```

## License

MIT — see [LICENSE](LICENSE).
