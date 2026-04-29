# jodex-qa-ai

Claude Code plugin marketplace for **qa-ai** — a QA testing pipeline that turns BRD/PRD documents into Playwright test suites.

## What You Get

- `/qa-ai:extract` — Extract E2E test cases from BRD/PRD markdown into xlsx test plans
- `/qa-ai:generate` — Generate Playwright TypeScript specs from xlsx test plans
- `/qa-ai:browser` — Manual browser exploration with playwright-cli

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
/plugin install qa-ai@jodex-qa-ai

# Reload plugins
/reload-plugins
```

## Installation — Claude Code Desktop

Open the integrated terminal and run the same commands:

```bash
/plugin marketplace add jairosoft-com/jodex-qa-ai
/plugin install qa-ai@jodex-qa-ai
/reload-plugins
```

## Local Development

```bash
# Test plugin locally before pushing
claude --plugin-dir /path/to/jodex-qa-ai/plugins/qa-ai

# Or register as local marketplace
claude plugin marketplace add /path/to/jodex-qa-ai --scope project
claude plugin install qa-ai@jodex-qa-ai
```

## Usage

```bash
# Extract test cases from a BRD
/qa-ai:extract path/to/BRD.md

# Generate Playwright specs from test plan
/qa-ai:generate

# Open browser for manual exploration
/qa-ai:browser open https://example.com
```

See [plugins/qa-ai/README.md](plugins/qa-ai/README.md) for detailed documentation.

## Uninstall

```bash
/plugin uninstall qa-ai@jodex-qa-ai
/plugin marketplace remove jodex-qa-ai
```

## License

MIT — see [LICENSE](LICENSE).
