---
title: Rebrand Skills to jx Namespace
type: idea
tags: [plugin, naming, branding, jx-qa, jx-kb, jx-namespace]
created: 2026-05-09
updated: 2026-05-09
source_count: 0
aliases: [jx rebrand, jx namespace, skill rebranding]
provenance: synthesis
status: completed
---

# Rebrand Skills to jx Namespace

Rebrand all marketplace plugins to a unified `jx-*` naming convention, matching the pattern established by [[Product Management Skills Plugin|jx-pm]].

## Decisions

| Question | Decision |
|----------|----------|
| qa-ai structure | Rename only — single plugin `jx-qa` with all skills intact |
| llm-wiki brand | Rebrand to `jx-kb` (knowledge base) |
| ADO standalone? | No — stays inside `jx-pm` as a skill |
| Migration path | Hard cutover — no aliases, clean break. Pre-release with zero external users; sole developer is the only consumer |

## Rename Mapping

| Current Plugin | New Plugin | Skills (unchanged) | Slash Commands |
|---|---|---|---|
| `qa-ai` | **jx-qa** | extract, generate, playwright-cli, test | `/jx-qa:extract`, `/jx-qa:generate`, `/jx-qa:browser`, `/jx-qa:test` |
| `llm-wiki` | **jx-kb** | init, ingest, query, lint, triage | `/jx-kb:init`, `/jx-kb:ingest`, `/jx-kb:query`, `/jx-kb:lint`, `/jx-kb:triage` |
| `jx-pm` | **jx-pm** | prd, techspec, task, ado, pipeline | *(no change)* |

## Ripple Effect Checklist

Per [[Naming Ripple Effect]], each rename touches:

- [ ] Directory: `plugins/jx-qa/` → `plugins/jx-qa/`, `plugins/jx-kb/` → `plugins/jx-kb/`
- [ ] Plugin manifest: `.claude-plugin/plugin.json` → update `name` field
- [ ] Marketplace manifest: `.claude-plugin/marketplace.json` → update `plugins[].name` and `source` path
- [ ] Plugin descriptions: update `description` field in both manifests
- [ ] Wiki pages: update all `[[QA Testing Plugin|jx-qa]]` and `[[Knowledge Base Plugin|jx-kb]]` wikilinks and prose
- [ ] CLAUDE.md / MEMORY.md: update any references
- [ ] ABOUT.md files: update plugin name references in each ABOUT.md
- [ ] Codex plugin: `.codex-plugin/plugin.json` if dual-support exists

## Rationale

- Consistent `jx-*` brand across all Jodex plugins
- Short, memorable prefixes (`jx-qa` vs `qa-ai`)
- Single-plugin-multi-skill pattern matches `jx-pm` architecture
- `jx-kb` distinguishes knowledge base from generic wiki concept
- Hard cutover keeps codebase clean — no alias maintenance debt

## Related

- [[Naming Ripple Effect]] — full rename cascade reference
- [[Jodex Plugin Marketplace]] — marketplace manifest updates
- [[Plugin Architecture]] — plugin format and naming
- [[Product Management Skills Plugin]] — naming precedent
