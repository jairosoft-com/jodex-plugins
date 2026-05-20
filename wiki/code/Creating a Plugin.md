---
title: Creating a Plugin
type: code
tags: [plugin, how-to, architecture, onboarding]
created: 2026-05-10
updated: 2026-05-20
source_count: 0
aliases: [plugin creation, new plugin, writing a plugin]
provenance: conversation-derived
---

# Creating a Plugin

End-to-end guide for adding a new plugin to the Claude Code plugin architecture. For adding skills to an existing plugin, see [[Creating a Skill]].

## Automation Shortcut

Use `/jx-skill:create-plugin` for the standard Jodex plugin skeleton. It is backed by [[plugin-creator.py]], creates package metadata and component `ABOUT.md` files, appends the marketplace entry, and leaves first-skill creation to `/jx-skill:create`.

## Step 1: Create Directory Structure

```
plugins/<your-plugin>/
├── .claude-plugin/
│   └── plugin.json          # Required — manifest
├── commands/                # Slash command wrappers (.md)
├── skills/                  # Skill implementations (subdirs)
├── scripts/                 # Pinned helper scripts
├── agents/                  # Custom subagent definitions
├── hooks/                   # Lifecycle event handlers
├── prompts/                 # Shared prompt fragments
├── schemas/                 # Output schemas
└── README.md
```

Only `.claude-plugin/plugin.json` strictly required. For a functional user-facing plugin, add `commands/` and `skills/`. Other directories optional — place `ABOUT.md` placeholder in empty ones per project convention.

**Naming**: Always lowercase with hyphens (`jx-qa`, not `Jx_QA`). Case-sensitive throughout the system. See [[Naming Ripple Effect]].

## Step 2: Write plugin.json

Minimal manifest at `plugins/<your-plugin>/.claude-plugin/plugin.json`:

```json
{
  "name": "your-plugin",
  "version": "1.0.0",
  "description": "What it does",
  "author": { "name": "Your Name", "email": "you@example.com" }
}
```

Optional `dependencies` field if plugin consumes shared conventions from another plugin (e.g., `jx-core`). Dependent plugins assume sibling layout under `plugins/`. See [[Plugin Dependency Declaration]], [[Cross-Plugin Shared Convention Layer]].

```json
{
  "name": "jx-pm",
  "version": "1.0.0",
  "description": "Pm.Ai Harness: generate PRDs and sync to Azure Boards.",
  "author": { "name": "Jairosoft", "email": "ramon@jairosoft.com" },
  "dependencies": ["jx-core", "jx-dev"]
}
```

## Step 3: Register in Marketplace

**Most commonly missed step.** Creating the directory is not enough — register in `.claude-plugin/marketplace.json` at repo root. Without this, marketplace will not list or install plugin. See [[Marketplace]].

Add entry to `plugins` array:

```json
{
  "name": "your-plugin",
  "description": "Short display description",
  "author": { "name": "Your Name" },
  "category": "productivity",
  "source": "./plugins/your-plugin"
}
```

## Step 4: Verify 3-Way Naming Sync

Three values **must match exactly** (case-sensitive). Mismatch = silent "Plugin not found" errors with no diagnostic:

| Surface | Location | Value |
|---------|----------|-------|
| Directory | `plugins/your-plugin/` | `your-plugin` |
| Plugin manifest | `.claude-plugin/plugin.json` → `name` | `"your-plugin"` |
| Marketplace entry | `.claude-plugin/marketplace.json` → `plugins[].name` | `"your-plugin"` |

See [[Naming Ripple Effect]] for rename cascade risks. Per [[ADR-001 Treat Marketplace Metadata As Listing Source]], marketplace manifest owns listing text.

## Step 5: Add First Skill

Follow [[Creating a Skill]] for full skill creation steps. Minimum:

1. Create `plugins/<plugin>/skills/<skill-name>/SKILL.md` with frontmatter + phased body
2. Create `plugins/<plugin>/commands/<skill-name>.md` with `allowed-tools` declaration
3. `name` field in SKILL.md frontmatter must match directory name exactly

Command file is where tool permissions live — SKILL.md does not grant tool access. See [[Slash Command]].

## Step 6: Make It Available

Three options, from lightest to most persistent:

### Option A: --plugin-dir (Session Only)

```bash
claude --plugin-dir ./plugins/your-plugin
```

Multiple plugins:

```bash
claude --plugin-dir ./plugins/plugin-a --plugin-dir ./plugins/plugin-b
```

Must pass flag each launch. Best for active development. See [[Local Plugin Development]].

### Option B: Directory-Source Marketplace (Persistent Dev)

Add to `.claude/settings.local.json` (gitignored, **not** `settings.json`):

```json
{
  "extraKnownMarketplaces": {
    "jodex-plugins": {
      "source": {
        "source": "directory",
        "path": "/absolute/path/to/repo"
      }
    }
  }
}
```

Absolute path = must go in `settings.local.json`. See [[Settings Portability]], [[Directory-Source Marketplace]].

### Option C: GitHub Marketplace (Distribution)

```bash
claude /plugin marketplace add <github-repo>
claude /plugin install <plugin-name>@<marketplace-name>
```

See [[Marketplace]].

## Step 7: Hot Reload

After editing plugin files mid-session:

```
/reload-plugins
```

Picks up changes without restarting CLI. See [[Local Plugin Development]].

## Common Pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Missing marketplace entry | "Plugin not found" on install | Add to `.claude-plugin/marketplace.json` (Step 3) |
| Name mismatch across surfaces | Silent install failure | Verify 3-way sync (Step 4) |
| Tool permissions in SKILL.md | Skill runs but tools denied | Move `allowed-tools` to command `.md` file |
| Absolute path in settings.json | Breaks on other machines | Use `settings.local.json` for absolute paths |
| Case mismatch in name | Plugin not recognized | Lowercase with hyphens only |

## Minimum Files Checklist

For a new plugin with one skill:

| # | File | Action |
|---|------|--------|
| 1 | `plugins/<name>/.claude-plugin/plugin.json` | Create |
| 2 | `plugins/<name>/skills/<skill>/SKILL.md` | Create |
| 3 | `plugins/<name>/commands/<skill>.md` | Create |
| 4 | `.claude-plugin/marketplace.json` | Modify — add entry |
| 5 | `plugins/<name>/README.md` | Create |

## Advanced Patterns

- **[[Mode Flag Pattern]]** — Merge similar skills with `--mode` flag when 80%+ structure shared
- **[[Skill Chaining]]** — Inter-skill pipeline via `--chain` flag
- **[[Template-as-Reference Pattern]]** — Keep SKILL.md focused, put templates in `references/`
- **[[Shared Reference Extraction]]** — Extract common logic to `skills/_shared/`
- **[[Cross-Plugin Shared Convention Layer]]** — Reference-only plugin for shared conventions
- **[[Agent Definition]]** — Custom subagent `.md` files in `agents/`
- **[[Configurable Default Chain]]** — CLI flag → env var → default resolution

## Sources

- Derived from inspection of existing plugins (`jx-qa`, `jx-kb`, `jx-pm`) and wiki concept pages
