# jx-qa — QA Testing Plugin for Claude Code

A QA testing pipeline that extracts E2E test cases from BRD/PRD documents, generates Playwright specs, and provides browser automation.

## Pipeline

```
BRD/PRD markdown → [/jx-qa:extract] → xlsx test plan → [/jx-qa:generate] → Playwright .spec.ts files
                                                              ↓ uses
                                                        [playwright-cli] (browser automation)
```

## Requirements

- **Python 3** + `openpyxl` (`pip install openpyxl`)
- **Node.js** 18+
- **Playwright** (`npx playwright install`)
- **playwright-cli** (`npm install -g @playwright/cli@latest`)

## Commands

### `/jx-qa:extract`

Extract E2E test cases from a BRD/PRD markdown document into an xlsx test plan.

```
/jx-qa:extract raw/articles/BRD_PRD.md
/jx-qa:extract raw/articles/BRD_PRD.md test-plans/test-plan.xlsx
```

**What it does:**
1. Scans BRD for acceptance criteria, functional/non-functional requirements
2. Classifies each as E2E-testable or not (waits for user confirmation)
3. Generates test case steps with concrete assertions
4. Writes to xlsx in Azure DevOps format (fork existing or create new)
5. Prints coverage report

**Allowed executables:** `python3 scripts/xlsx-writer.py` (pinned helper only)

### `/jx-qa:generate`

Generate Playwright TypeScript spec files from an xlsx test plan.

```
/jx-qa:generate
/jx-qa:generate test-plans/test-plan.xlsx
```

**What it does:**
1. Parses xlsx test plan
2. Skips test cases that already have spec files (idempotent)
3. Opens live browser, follows test steps, captures semantic locators
4. Writes `.spec.ts` files with `// Test Case TBD - <Title>` comment
5. Runs specs to verify they pass

**Allowed executables:** `playwright-cli`, `npx playwright test`, `ls`

### `/jx-qa:browser`

Open a browser for manual exploration and debugging.

```
/jx-qa:browser open https://example.com
/jx-qa:browser snapshot
/jx-qa:browser close
```

**Allowed executables:** `playwright-cli` only

## Plugin Structure

```
jx-qa/
├── .claude-plugin/plugin.json    # Plugin manifest
├── commands/                     # Slash commands (/jx-qa:*)
├── skills/                       # Skill logic
│   ├── extract/                  # BRD → xlsx
│   ├── generate/                 # xlsx → Playwright specs
│   └── playwright-cli/           # Browser automation (internal)
├── agents/                       # Custom subagents (future)
├── hooks/                        # Lifecycle hooks (future)
├── prompts/                      # Shared prompt fragments (future)
├── schemas/                      # Output schemas (future)
├── scripts/                      # Helper scripts
│   └── xlsx-writer.py            # Pinned openpyxl helper
└── README.md
```

## Security

- No broad interpreter permissions (`python3:*`, `node:*`, `npm:*`, `npx:*`)
- Python execution pinned to `scripts/xlsx-writer.py` only
- `npx` narrowed to `npx playwright test` (test runner, not package installer)
- All user inputs passed as quoted argv, never interpolated into shell
- Helper script validates paths and rejects shell metacharacters

## Uninstall

```bash
/plugin uninstall jx-qa@jodex-plugins
/plugin marketplace remove jodex-plugins
```
