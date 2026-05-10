# jodex-qa-ai

Claude Code plugin marketplace for **jx-qa** — a QA testing pipeline that turns BRD/PRD documents into Playwright test suites.

## What You Get

- `/jx-qa:extract` — Extract E2E test cases from BRD/PRD markdown into xlsx test plans
- `/jx-qa:generate` — Generate Playwright TypeScript specs from xlsx test plans
- `/jx-qa:browser` — Manual browser exploration with playwright-cli

## Requirements

- **Claude Code** CLI or Desktop
- **Python 3** + `openpyxl` (`pip install openpyxl`)
- **Node.js** 18+
- **Playwright** (`npx playwright install`)
- **playwright-cli** (`npm install -g @playwright/cli@latest`)

## Installation — Claude Code CLI

```bash
# Add this marketplace (one-time)
/plugin marketplace add jairosoft-com/jodex-qa-ai

# Install the plugin
/plugin install jx-qa@jodex-plugins

# Reload plugins
/reload-plugins
```

## Installation — Claude Code Desktop

Open the integrated terminal and run the same commands:

```bash
/plugin marketplace add jairosoft-com/jodex-qa-ai
/plugin install jx-qa@jodex-plugins
/reload-plugins
```

## Local Development

```bash
# Test plugin locally before pushing
claude --plugin-dir /path/to/jodex-qa-ai/plugins/jx-qa

# Or register as local marketplace
claude plugin marketplace add /path/to/jodex-qa-ai --scope project
claude plugin install jx-qa@jodex-plugins
```

## Usage

```bash
# Extract test cases from a BRD
/jx-qa:extract path/to/BRD.md

# Generate Playwright specs from test plan
/jx-qa:generate

# Open browser for manual exploration
/jx-qa:browser open https://example.com
```

See [plugins/jx-qa/README.md](plugins/jx-qa/README.md) for detailed documentation.

## Uninstall

```bash
/plugin uninstall jx-qa@jodex-plugins
/plugin marketplace remove jodex-plugins
```

## License

MIT — see [LICENSE](LICENSE).
