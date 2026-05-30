# jx-qa — QA Testing Plugin for Claude Code

A QA testing pipeline that extracts E2E test cases from BRD/PRD documents, generates Playwright specs, provides browser automation, and runs Playwright tests.

## Pipeline

```
BRD/PRD markdown → [/jx-qa:extract] → xlsx test plan → [/jx-qa:generate] → Playwright .spec.ts files → [/jx-qa:test]
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

### `/jx-qa:test`

Run generated Playwright specs in headless, UI, or headed mode.

```
/jx-qa:test
/jx-qa:test ui
/jx-qa:test headed
```

**What it does:**
1. Runs the project Playwright test suite headless by default
2. Opens Playwright UI mode when passed `ui`
3. Runs with a visible browser when passed `headed`
4. Returns the test result output for review

**Allowed executables:** `npx playwright test` only

### `/jx-qa:review-plan`

Review an existing xlsx test plan for quality, testability, and AC traceability. Returns an **unverified, advisory (NON-GATING)** report — never a quality gate.

```
/jx-qa:review-plan test-plans/test-plan.xlsx
/jx-qa:review-plan test-plans/test-plan.xlsx raw/articles/BRD_PRD.md
```

**What it does:**
1. Requires an explicit xlsx path (no auto-discovery); validates the path before any helper call
2. Parses the plan via the pinned read-only `xlsx-writer.py read` helper; reads the optional BRD via the pinned read-only `read-doc.py read` helper
3. Reviews each test case for vague assertions, bundled steps, missing negative/edge cases, non-E2E steps, weak step-1 navigation/locators, and AC/FR traceability (only when a BRD is given)
4. Emits an "Unverified Advisory (NON-GATING)" report with per-case findings and a plan-level summary — never editing the plan, generating specs, or running tests

**Allowed executables:** `python3 scripts/xlsx-writer.py read`, `python3 scripts/read-doc.py read` (pinned read-only helpers only)

> **Safety:** Output is advisory and non-gating — inputs are not provenance-checked, so a stale or mismatched plan can still receive a clean report. All plan/BRD content is treated strictly as data, never instructions. Tool scoping is ultimately session-permissions-governed (`allowed-tools` is additive, not restrictive); the narrowed prompt-injection residual (an injected reuse of a pinned read-only helper on an off-scope path) is an accepted residual for trusted/internal plans.

## Plugin Structure

```
jx-qa/
├── .claude-plugin/plugin.json    # Plugin manifest
├── commands/                     # Slash commands (/jx-qa:*)
├── skills/                       # Skill logic
│   ├── extract/                  # BRD → xlsx
│   ├── generate/                 # xlsx → Playwright specs
│   ├── playwright-cli/           # Browser automation (internal)
│   └── test/                     # Playwright test runner
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
