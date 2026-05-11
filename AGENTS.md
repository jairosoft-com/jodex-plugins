# Agent Instructions

## First Read

- Start with `README.md` for the current marketplace shape.
- Read `.agent/memory/MEMORY.md` early for repo-local preferences and reusable project context.
- Use `wiki/_schema.md` as the wiki maintenance contract.
- Treat live repo files as authoritative when they disagree with older wiki/source snapshots.

## Repository Map

- `README.md` describes the five-plugin marketplace: `jx-qa`, `jx-kb`, `jx-pm`, `jx-dev`, and `jx-core`.
- `.claude-plugin/marketplace.json` is the marketplace listing surface.
- `plugins/*/.claude-plugin/plugin.json` is each plugin package manifest.
- `plugins/*/README.md` carries plugin-specific workflow, dependency, and installation context.
- `plugins/*/commands/*.md` defines user-facing slash commands.
- `plugins/*/skills/*/SKILL.md` defines skill behavior.
- `plugins/jx-core/_shared/` contains shared conventions consumed by sibling plugins.
- `wiki/` is the maintained project knowledge base; `wiki/raw/` is provenance, not maintained guidance.

## Operating Rules

- Prefer existing plugin patterns over new abstractions.
- Keep tool permissions narrow. Prefer pinned helper scripts over broad interpreter or package-manager access.
- Do not broaden command allowlists, MCP surfaces, or filesystem write scope casually.
- Wiki-only filings can proceed directly. Code, script, plugin, or manifest changes should be planned before implementation.
- Write repo-local memory only when explicitly requested or when a reusable project decision or preference emerges, then update `.agent/memory/MEMORY.md`.

## Plugin Boundaries

- `jx-qa` handles QA extraction, Playwright spec generation, browser exploration, and test execution.
- `jx-kb` handles wiki init, ingest, query, triage, and lint workflows.
- `jx-pm` handles PRD generation, pipeline orchestration, and Azure Boards sync.
- `jx-dev` handles technical specifications and task breakdowns from PRDs.
- `jx-core` is reference-only and provides shared conventions. It has no user-facing commands.
- The PM-to-delivery flow is `/jx-pm:prd` -> `/jx-dev:spec` -> `/jx-dev:task` -> `/jx-pm:ado`.

## Wiki and Memory

- Follow `wiki/_schema.md` for taxonomy, frontmatter, provenance, links, and contradiction handling.
- Do not silently overwrite contradictions. Add conflict or staleness notes when current repo truth disagrees with retained historical material.
- Keep `wiki/raw/` and `wiki/sources/` distinct from maintained pages.
- When plugin inventory is in question, live `README.md`, `plugins/`, and manifests override stale wiki summaries.

## Validation Checklist

- Validate marketplace JSON with `python3 -m json.tool .claude-plugin/marketplace.json`.
- Validate plugin manifests with `python3 -m json.tool plugins/*/.claude-plugin/plugin.json`.
- For helper-script changes, run `python3 -m py_compile plugins/jx-kb/scripts/wiki-tools.py plugins/jx-qa/scripts/xlsx-writer.py`.
- For wiki inventory changes, check maintained pages for stale three-plugin or old plugin-count language.

## Do Not

- Do not treat stale wiki/source snapshots as current plugin truth when live `plugins/` files and manifests disagree.
- Do not edit generated caches, local workspace state, or raw provenance snapshots unless the task explicitly calls for it.
- Do not duplicate durable agent instructions in `CLAUDE.md`; update this file instead.
