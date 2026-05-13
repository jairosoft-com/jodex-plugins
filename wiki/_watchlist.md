---
title: Ingest Watchlist
updated: 2026-05-11
---

# Ingest Watchlist

Monitored paths for new or changed content. Run `/jx-kb:ingest` against pending items.

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

## Already Ingested (83 sources)

- `.claude-plugin/marketplace.json`
- `AGENTS.md`
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
- `plugins/jx-kb/README.md`
- `plugins/jx-kb/agents/ABOUT.md`
- `plugins/jx-kb/commands/ingest.md`
- `plugins/jx-kb/commands/init.md`
- `plugins/jx-kb/commands/lint.md`
- `plugins/jx-kb/commands/query.md`
- `plugins/jx-kb/commands/triage.md`
- `plugins/jx-kb/hooks/ABOUT.md`
- `plugins/jx-kb/prompts/ABOUT.md`
- `plugins/jx-kb/schemas/ABOUT.md`
- `plugins/jx-kb/skills/init/SKILL.md`
- `plugins/jx-kb/skills/ingest/SKILL.md`
- `plugins/jx-kb/skills/lint/SKILL.md`
- `plugins/jx-kb/skills/query/SKILL.md`
- `plugins/jx-kb/skills/triage/SKILL.md`
- `plugins/jx-qa/README.md`
- `plugins/jx-qa/agents/ABOUT.md`
- `plugins/jx-qa/commands/browser.md`
- `plugins/jx-qa/commands/extract.md`
- `plugins/jx-qa/commands/generate.md`
- `plugins/jx-qa/commands/test.md`
- `plugins/jx-qa/hooks/ABOUT.md`
- `plugins/jx-qa/prompts/ABOUT.md`
- `plugins/jx-qa/schemas/ABOUT.md`
- `plugins/jx-qa/skills/extract/SKILL.md`
- `plugins/jx-qa/skills/generate/SKILL.md`
- `plugins/jx-qa/skills/playwright-cli/SKILL.md`
- `plugins/jx-qa/skills/test/SKILL.md`
- `plugins/jx-qa/skills/playwright-cli/references/element-attributes.md`
- `plugins/jx-qa/skills/playwright-cli/references/playwright-tests.md`
- `plugins/jx-qa/skills/playwright-cli/references/request-mocking.md`
- `plugins/jx-qa/skills/playwright-cli/references/running-code.md`
- `plugins/jx-qa/skills/playwright-cli/references/session-management.md`
- `plugins/jx-qa/skills/playwright-cli/references/storage-state.md`
- `plugins/jx-qa/skills/playwright-cli/references/test-generation.md`
- `plugins/jx-qa/skills/playwright-cli/references/tracing.md`
- `plugins/jx-qa/skills/playwright-cli/references/video-recording.md`
- `plugins/jx-core/README.md`
- `plugins/jx-core/_shared/docs-root.md`
- `plugins/jx-core/_shared/id-rules.md`
- `plugins/jx-core/_shared/task-json-schema.md`
- `plugins/jx-dev/README.md`
- `plugins/jx-dev/agents/ABOUT.md`
- `plugins/jx-dev/commands/spec.md`
- `plugins/jx-dev/commands/task.md`
- `plugins/jx-dev/hooks/ABOUT.md`
- `plugins/jx-dev/prompts/ABOUT.md`
- `plugins/jx-dev/schemas/ABOUT.md`
- `plugins/jx-dev/scripts/ABOUT.md`
- `plugins/jx-dev/skills/spec/SKILL.md`
- `plugins/jx-dev/skills/spec/references/diagram-patterns.md`
- `plugins/jx-dev/skills/spec/references/template.md`
- `plugins/jx-dev/skills/task/SKILL.md`

## Pending (not yet ingested)

- `plugins/jx-core/_shared/ado.md`
- `plugins/jx-core/_shared/task.md`

## Change Detection

During ingest, compare SHA-256 of source file against stored hash in `wiki/sources/`. If hash differs, source changed since last ingest — re-ingest to update wiki pages.
