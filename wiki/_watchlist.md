---
title: Ingest Watchlist
updated: 2026-05-08
---

# Ingest Watchlist

Monitored paths for new or changed content. Run `/llm-wiki:ingest` against pending items.

## Monitored Directories

| Directory | Pattern | Description |
|-----------|---------|-------------|
| `ai_docs/` | `*.md` | Architecture guides, reference docs |
| `plugins/*/README.md` | exact | Plugin overview docs |
| `plugins/*/skills/*/SKILL.md` | exact | Skill implementation files |
| `plugins/*/skills/*/references/*.md` | glob | Playwright + skill reference docs |
| `plugins/*/commands/*.md` | glob | Slash command definitions |
| `plugins/*/agents/ABOUT.md` | exact | Agent descriptions |
| `plugins/*/hooks/ABOUT.md` | exact | Hook descriptions |
| `.claude-plugin/marketplace.json` | exact | Marketplace manifest |
| `README.md` | exact | Project root README |

## Already Ingested (23 sources)

- `.claude-plugin/marketplace.json`
- `ai_docs/claude_cli_vs_desktop_mcp_guide.md`
- `ai_docs/claude_desktop_wsl_integration.md`
- `ai_docs/llm-wiki.md`
- `plugins/llm-wiki/README.md`
- `plugins/llm-wiki/skills/init/SKILL.md`
- `plugins/llm-wiki/skills/ingest/SKILL.md`
- `plugins/llm-wiki/skills/lint/SKILL.md`
- `plugins/llm-wiki/skills/query/SKILL.md`
- `plugins/llm-wiki/skills/triage/SKILL.md`
- `plugins/qa-ai/README.md`
- `plugins/qa-ai/skills/extract/SKILL.md`
- `plugins/qa-ai/skills/generate/SKILL.md`
- `plugins/qa-ai/skills/playwright-cli/SKILL.md`
- `plugins/qa-ai/skills/playwright-cli/references/element-attributes.md`
- `plugins/qa-ai/skills/playwright-cli/references/playwright-tests.md`
- `plugins/qa-ai/skills/playwright-cli/references/request-mocking.md`
- `plugins/qa-ai/skills/playwright-cli/references/running-code.md`
- `plugins/qa-ai/skills/playwright-cli/references/session-management.md`
- `plugins/qa-ai/skills/playwright-cli/references/storage-state.md`
- `plugins/qa-ai/skills/playwright-cli/references/test-generation.md`
- `plugins/qa-ai/skills/playwright-cli/references/tracing.md`
- `plugins/qa-ai/skills/playwright-cli/references/video-recording.md`

## Pending (not yet ingested)

- `README.md` (project root)
- `plugins/llm-wiki/commands/ingest.md`
- `plugins/llm-wiki/commands/init.md`
- `plugins/llm-wiki/commands/lint.md`
- `plugins/llm-wiki/commands/query.md`
- `plugins/llm-wiki/commands/triage.md`
- `plugins/llm-wiki/agents/ABOUT.md`
- `plugins/llm-wiki/hooks/ABOUT.md`
- `plugins/llm-wiki/prompts/ABOUT.md`
- `plugins/llm-wiki/schemas/ABOUT.md`
- `plugins/qa-ai/commands/browser.md`
- `plugins/qa-ai/commands/extract.md`
- `plugins/qa-ai/commands/generate.md`
- `plugins/qa-ai/agents/ABOUT.md`
- `plugins/qa-ai/hooks/ABOUT.md`
- `plugins/qa-ai/prompts/ABOUT.md`
- `plugins/qa-ai/schemas/ABOUT.md`

## Change Detection

During ingest, compare SHA-256 of source file against stored hash in `wiki/sources/`. If hash differs, source changed since last ingest — re-ingest to update wiki pages.
