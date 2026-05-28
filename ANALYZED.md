# jodex-qa-ai: Project Analysis

## Overview

The `jodex-qa-ai` repository serves as a **Claude Code CLI Plugin Marketplace** and houses the **qa-ai** plugin. The main goal of this plugin is to automate the Quality Assurance testing pipeline by seamlessly transitioning from plain text Business Requirement Documents (BRDs) and Product Requirement Documents (PRDs) into executable Playwright end-to-end (E2E) test suites.

The project provides a **Claude Code CLI Plugin** for the QA automation pipeline, for use with the `claude` CLI via slash commands.

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
├── ANALYZED.md                               # ← This document
└── README.md                                 # Project README
```

---

## The `plugins/qa-ai` CLI Plugin

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

## Security Posture

The CLI plugin follows a **least-privilege security model**:

| Principle | CLI Plugin |
|:----------|:-----------|
| **No Broad Permissions** | No raw `python3` or `node` shell access |
| **Pinned Executables** | Locked to `scripts/xlsx-writer.py` and `npx playwright test` |
| **Safe Input Handling** | User inputs passed as quoted `argv` |

---

## Workflow Summary

The intended user journey is as follows:

### Via CLI (`claude` terminal)
1. User provides a BRD markdown file.
2. `/qa-ai:extract` is invoked → **`extract` Skill** parses the text → Passes data to `xlsx-writer.py` → Outputs `test-plan.xlsx`.
3. User verifies the Excel sheet.
4. `/qa-ai:generate` is invoked → **`generate` Skill** reads the `.xlsx` → Uses **`playwright-cli` Skill** to find locators → Outputs `*.spec.ts` files.
