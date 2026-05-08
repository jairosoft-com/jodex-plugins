# jodex-qa-ai: Project Analysis

## Overview

The `jodex-qa-ai` repository serves as a **Claude Code CLI Plugin Marketplace** and houses the **qa-ai** plugin. The main goal of this plugin is to automate the Quality Assurance testing pipeline by seamlessly transitioning from plain text Business Requirement Documents (BRDs) and Product Requirement Documents (PRDs) into executable Playwright end-to-end (E2E) test suites.

The project now provides **two parallel interfaces** for the same QA automation pipeline:
1. **Claude Code CLI Plugin** — for use with the `claude` CLI via slash commands.
2. **Claude Desktop MCP Server** — for use with Claude Desktop via the Model Context Protocol.

## Top-Level Repository Structure

```
jodex-qa-ai/
├── .agent/memory.md                          # Agent-persistent instructions (GitHub workflow, PR rules)
├── .claude/settings.json                     # Workspace config enabling the qa-ai plugin
├── .claude-plugin/marketplace.json           # Marketplace registry manifest
├── plugins/qa-ai/                            # Claude Code CLI Plugin
│   ├── .claude-plugin/plugin.json            #   Plugin identity manifest
│   ├── commands/                             #   Slash commands (extract, generate, browser)
│   ├── skills/                               #   AI skill instructions (extract, generate, playwright-cli)
│   ├── scripts/                              #   Pinned helper scripts (xlsx-writer.py)
│   ├── agents/                               #   Placeholder for custom subagents
│   ├── hooks/                                #   Placeholder for lifecycle hooks
│   ├── prompts/                              #   Placeholder for shared prompt fragments
│   ├── schemas/                              #   Placeholder for structured output schemas
│   └── README.md
├── mcp/                                      # Claude Desktop MCP Server
│   ├── src/
│   │   ├── index.ts                          #   Server entry point — registers all prompts & tools
│   │   └── prompts/
│   │       ├── extract.ts                    #   Full extract skill (BRD → Excel)
│   │       ├── generate.ts                   #   Full generate skill (Excel → Playwright specs)
│   │       └── browser.ts                    #   Full playwright-cli reference manual
│   ├── build/                                #   Compiled JavaScript output
│   ├── package.json                          #   Project config (build/start scripts)
│   ├── tsconfig.json                         #   TypeScript configuration (Node16)
│   └── README.md
├── claude_cli_vs_desktop_mcp_guide.md        # Architectural comparison guide
├── claude_desktop_wsl_integration.md         # WSL ↔ Windows bridging guide
├── ANALYZED.md                               # ← This document
└── README.md                                 # Project README (CLI + MCP usage)
```

---

## Part 1: The `plugins/qa-ai` CLI Plugin

This directory is the core of the `qa-ai` plugin. It follows the standard Claude Code plugin architecture, mapping user slash commands to AI skills.

### 1. Manifest
- **`.claude-plugin/plugin.json`**: Declares the plugin's identity, version (`1.0.0`), description, and author metadata.

### 2. Commands (`commands/`)
Maps CLI slash commands to specific workflows.
- **`extract.md`** (`/qa-ai:extract`): Command to parse BRD/PRD markdown files and extract E2E test cases into an Excel (`.xlsx`) test plan. Allowed tools: `python3 xlsx-writer.py`, Read, Write.
- **`generate.md`** (`/qa-ai:generate`): Command to read the `.xlsx` test plan and generate corresponding Playwright TypeScript specification files (`.spec.ts`). Allowed tools: `playwright-cli:*`, `npx playwright test:*`, `ls:*`, Read, Write.
- **`browser.md`** (`/qa-ai:browser`): Command for manual browser exploration and debugging using `playwright-cli`. Allowed tools: `playwright-cli:*`.

### 3. Skills (`skills/`)
The underlying logic, constraints, and instructions the AI uses to fulfill the commands.
- **`extract/SKILL.md`** (213 lines): Defines a 6-phase workflow — scan requirements, classify as E2E-testable, discover xlsx structure, generate concrete assertion steps, write to Excel in an Azure DevOps-compatible format, and produce a coverage report. Includes dedup rules, hybrid AC handling, and versioned file naming.
- **`generate/SKILL.md`** (145 lines): Instructs the AI on parsing the `.xlsx` test plan, skipping existing tests (idempotency), opening a live browser to capture semantic locators via `generate-locator`, and writing the final Playwright TypeScript code with a mandatory `// Test Case TBD - <Title>` comment format.
- **`playwright-cli/SKILL.md`** (388 lines): A comprehensive reference manual for the `playwright-cli` tool covering all commands: core interactions, navigation, keyboard, mouse, screenshots, tabs, storage (cookies/localStorage/sessionStorage), network mocking, DevTools, tracing, video recording, snapshots, element targeting (refs/CSS/locators), and session management.

### 4. Scripts (`scripts/`)
Contains strict, single-purpose helper scripts to limit AI permissions.
- **`xlsx-writer.py`**: A Python script utilizing `openpyxl` with 4 subcommands:
  - `fork <src> <dst>` — Byte-copy an xlsx file via `shutil.copy2`
  - `append <xlsx> <json>` — Append rows from a JSON array to an xlsx
  - `verify <xlsx>` — Print sheet name, headers, and row count
  - `read <xlsx>` — Print all rows as JSON
  - Includes input validation: rejects shell metacharacters and non-`.xlsx` extensions.

### 5. Future Extensibility (Placeholders)
The plugin includes placeholder directories with `ABOUT.md` files indicating areas for future expansion:
- **`agents/`**: For custom subagents.
- **`hooks/`**: For lifecycle hooks.
- **`prompts/`**: For shared prompt fragments.
- **`schemas/`**: For structured output schemas.

---

## Part 2: The `mcp/` MCP Server (Claude Desktop)

The `mcp/` directory contains a TypeScript MCP server that exposes the same QA automation capabilities for **Claude Desktop** using the Model Context Protocol.

### Architecture

- **Language**: TypeScript (Node.js)
- **SDK**: `@modelcontextprotocol/sdk` — the official MCP SDK
- **Transport**: `stdio` — Claude Desktop launches the server as a child process and communicates over standard input/output
- **Excel Library**: `exceljs` — replaces the CLI plugin's `openpyxl`/Python dependency

### Concept Mapping: CLI Plugin → MCP

The Claude Code CLI plugin uses **Commands**, **Skills**, and **Scripts**. The MCP server uses **Prompts** and **Tools**. Here is the exact mapping:

| CLI Plugin Concept | MCP Equivalent | How It Works |
|:-------------------|:---------------|:-------------|
| **Command** (`/qa-ai:extract`) | **Prompt** (`qa_extract`) | User selects the prompt in Claude Desktop via the attachment icon or `/` key. The prompt injects the full skill instructions into Claude's context. |
| **Command** (`/qa-ai:generate`) | **Prompt** (`qa_generate`) | Same mechanism — prompt injects the generate skill instructions. |
| **Command** (`/qa-ai:browser`) | **Prompt** (`qa_browser`) | Same mechanism — prompt injects the full playwright-cli reference manual. |
| **Skill** (`SKILL.md`) | **Prompt Content** | The complete, unabridged SKILL.md text is embedded as a TypeScript string constant and returned as the prompt's message content. No summarization — full fidelity. |
| **Script** (`xlsx-writer.py fork`) | **Tool** (`fork_excel_test_plan`) | Structured MCP tool. Claude sends a JSON payload; the server byte-copies the file. |
| **Script** (`xlsx-writer.py append`) | **Tool** (`write_excel_test_plan`) | Structured MCP tool. Claude sends test cases as JSON; the server writes them to xlsx using `exceljs`. |
| **Script** (`xlsx-writer.py verify`) | **Tool** (`verify_excel_test_plan`) | Structured MCP tool. Returns sheet name, headers, and row count. |
| **Script** (`xlsx-writer.py read`) | **Tool** (`read_excel_test_plan`) | Structured MCP tool. Returns all rows as structured JSON. |
| **`Bash(playwright-cli:*)`** | **Tool** (`run_playwright_command`) | Structured MCP tool. Only allows `playwright-cli` and `npx playwright` commands. |

### MCP Capabilities Summary

#### Prompts (3)

| Prompt | Description | Key Arguments |
|:-------|:------------|:--------------|
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

### MCP Configuration

To use the MCP server with Claude Desktop, add it to `claude_desktop_config.json`:

**Linux / macOS (direct)**:
```json
{
  "mcpServers": {
    "qa-ai": {
      "command": "node",
      "args": ["/absolute/path/to/jodex-qa-ai/mcp/build/index.js"]
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
        "-d", "Ubuntu", "--",
        "bash", "-c", "cd /home/sante8wsl/projects/jairosoft/ai-plugins/jodex-qa-ai/mcp && npm run start"
      ]
    }
  }
}
```

> **Note**: Always use absolute paths. Claude Desktop does not expand `~` or environment variables.

---

## Security Posture

Both the CLI plugin and the MCP server follow a **least-privilege security model**:

| Principle | CLI Plugin | MCP Server |
|:----------|:-----------|:-----------|
| **No Broad Permissions** | No raw `python3` or `node` shell access | `run_playwright_command` rejects everything except `playwright-cli` and `npx playwright` |
| **Pinned Executables** | Locked to `scripts/xlsx-writer.py` and `npx playwright test` | Excel tools operate on `.xlsx` files only; no arbitrary filesystem access |
| **Safe Input Handling** | User inputs passed as quoted `argv` | `fork_excel_test_plan` never modifies the original file — always creates a copy |

---

## Workflow Summary

The intended user journey is identical across both interfaces:

### Via CLI (`claude` terminal)
1. User provides a BRD markdown file.
2. `/qa-ai:extract` is invoked → **`extract` Skill** parses the text → Passes data to `xlsx-writer.py` → Outputs `test-plan.xlsx`.
3. User verifies the Excel sheet.
4. `/qa-ai:generate` is invoked → **`generate` Skill** reads the `.xlsx` → Uses **`playwright-cli` Skill** to find locators → Outputs `*.spec.ts` files.

### Via Claude Desktop (MCP)
1. User selects the `qa_extract` prompt and provides the BRD path.
2. Claude reads the BRD, extracts requirements, and calls the `write_excel_test_plan` tool → Outputs `test-plan.xlsx`.
3. User verifies the Excel sheet.
4. User selects the `qa_generate` prompt. Claude calls `read_excel_test_plan` to parse the xlsx, `run_playwright_command` to open browsers and capture locators, then writes `*.spec.ts` files.
