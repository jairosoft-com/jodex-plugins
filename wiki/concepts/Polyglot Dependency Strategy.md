---
title: Polyglot Dependency Strategy
type: concept
tags: [architecture, dependencies, polyglot, python, typescript]
created: 2026-05-08
updated: 2026-05-08
source_count: 0
aliases: [dependency management, polyglot setup]
provenance: synthesis
---

# Polyglot Dependency Strategy

Strategy for managing Python and TypeScript/Node dependencies in a plugin-based project that uses both languages.

## Current State (2026-05-08)

| Script | Plugin | External Deps |
|--------|--------|---------------|
| `xlsx-writer.py` | [[QA AI]] | None (stdlib only) |
| `wiki-tools.py` | [[LLM Wiki]] | None (stdlib only) |
| TypeScript files | — | None exist yet |

No `pyproject.toml`, `requirements.txt`, or `package.json` exist in the project.

## Recommended Approach: Per-Plugin Deps + Root Justfile

### Per-Plugin Dependencies

Each plugin manages its own deps independently:

```
plugins/qa-ai/
├── pyproject.toml          # Python deps (e.g., openpyxl)
├── package.json            # Node deps (e.g., playwright)
└── scripts/xlsx-writer.py

plugins/llm-wiki/
├── pyproject.toml          # Python deps (if needed)
└── scripts/wiki-tools.py
```

### Root Justfile (Orchestrator)

Single entry point for all setup across languages:

```just
setup-all: setup-py setup-node

setup-py:
    cd plugins/qa-ai && uv venv && uv pip install -r pyproject.toml
    cd plugins/llm-wiki && uv venv && uv pip install -r pyproject.toml

setup-node:
    cd plugins/qa-ai && npm install
```

### Python Tooling

- **`uv`** — fast Python package manager (recommended by [[NotebookLM Integration|NotebookLM]])
- For standalone scripts: `uv run --script` (zero-config, inline deps)
- For broader env: `pyproject.toml` + `uv`

### TypeScript/Node Tooling

- **`npm`** or **`pnpm`** for package management
- Per-plugin `package.json` or root-level workspaces if monorepo grows

## Alternatives Considered

| Approach | Pros | Cons |
|----------|------|------|
| Root-level single `pyproject.toml` + `package.json` | Simple, one install | Flat, scales poorly with multiple plugins |
| Per-plugin deps (chosen) | Isolated, modular, matches plugin structure | Multiple install steps |
| `Justfile` orchestrator (chosen) | Single `just setup`, polyglot-native | Extra tool dependency |

## Cross-Language Contracts

For data passed between Python and TypeScript:
- **`.spec/` directory** with JSON Schema or Protocol Buffers
- Prevents field name drift when AI context-switches between languages

## NotebookLM Source

Analysis sourced from **Agent Skill Plugin Marketplace Architecture** notebook, which recommends the polyglot monorepo pattern with role-based language separation.

## Related

- [[Plugin Architecture]] — plugin directory structure
- [[Pinned Helper]] — restricted script execution pattern used by Python scripts
- [[wiki-tools.py]] — stdlib-only Python helper for LLM Wiki
- [[xlsx-writer.py]] — stdlib-only Python helper for QA AI
- [[NotebookLM Integration]] — notebook used for this analysis
- [[Codex Plugin Compatibility]] — cross-platform plugin considerations
