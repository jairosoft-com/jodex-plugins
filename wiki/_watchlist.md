---
title: Ingest Watchlist
updated: 2026-05-09
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

## Already Ingested (64 sources)

- `.claude-plugin/marketplace.json`
- `README.md`
- `ai_docs/claude_cli_vs_desktop_mcp_guide.md`
- `ai_docs/claude_desktop_wsl_integration.md`
- `ai_docs/llm-wiki.md`
- `plugins/jx-pm/README.md`
- `plugins/jx-pm/agents/ABOUT.md`
- `plugins/jx-pm/commands/ado.md`
- `plugins/jx-pm/commands/pipeline.md`
- `plugins/jx-pm/commands/prd.md`
- `plugins/jx-pm/commands/task.md`
- `plugins/jx-pm/commands/techspec.md`
- `plugins/jx-pm/hooks/ABOUT.md`
- `plugins/jx-pm/prompts/ABOUT.md`
- `plugins/jx-pm/schemas/task-json-schema.md`
- `plugins/jx-pm/skills/_shared/docs-root.md`
- `plugins/jx-pm/skills/_shared/id-rules.md`
- `plugins/jx-pm/skills/ado/SKILL.md`
- `plugins/jx-pm/skills/ado/references/sync-states.md`
- `plugins/jx-pm/skills/pipeline/SKILL.md`
- `plugins/jx-pm/skills/prd/SKILL.md`
- `plugins/jx-pm/skills/prd/references/example.md`
- `plugins/jx-pm/skills/prd/references/lite-template.md`
- `plugins/jx-pm/skills/prd/references/prd-template.md`
- `plugins/jx-pm/skills/prd/references/unified-template.md`
- `plugins/jx-pm/skills/task/SKILL.md`
- `plugins/jx-pm/skills/techspec/SKILL.md`
- `plugins/jx-pm/skills/techspec/references/diagram-patterns.md`
- `plugins/jx-pm/skills/techspec/references/template.md`
- `plugins/llm-wiki/README.md`
- `plugins/llm-wiki/agents/ABOUT.md`
- `plugins/llm-wiki/commands/ingest.md`
- `plugins/llm-wiki/commands/init.md`
- `plugins/llm-wiki/commands/lint.md`
- `plugins/llm-wiki/commands/query.md`
- `plugins/llm-wiki/commands/triage.md`
- `plugins/llm-wiki/hooks/ABOUT.md`
- `plugins/llm-wiki/prompts/ABOUT.md`
- `plugins/llm-wiki/schemas/ABOUT.md`
- `plugins/llm-wiki/skills/init/SKILL.md`
- `plugins/llm-wiki/skills/ingest/SKILL.md`
- `plugins/llm-wiki/skills/lint/SKILL.md`
- `plugins/llm-wiki/skills/query/SKILL.md`
- `plugins/llm-wiki/skills/triage/SKILL.md`
- `plugins/qa-ai/README.md`
- `plugins/qa-ai/agents/ABOUT.md`
- `plugins/qa-ai/commands/browser.md`
- `plugins/qa-ai/commands/extract.md`
- `plugins/qa-ai/commands/generate.md`
- `plugins/qa-ai/hooks/ABOUT.md`
- `plugins/qa-ai/prompts/ABOUT.md`
- `plugins/qa-ai/schemas/ABOUT.md`
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

None — all monitored paths ingested.

## Change Detection

During ingest, compare SHA-256 of source file against stored hash in `wiki/sources/`. If hash differs, source changed since last ingest — re-ingest to update wiki pages.
