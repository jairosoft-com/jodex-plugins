# jodex-qa-ai

Claude Code plugin marketplace for **qa-ai** — a QA testing pipeline that turns BRD/PRD documents into Playwright test suites.

Available as a **Claude Code CLI plugin**.

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

## Installation

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
