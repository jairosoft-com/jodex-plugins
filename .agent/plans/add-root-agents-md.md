# Plan: Add Root Agent Guidance and Reconcile Wiki Inventory

## Summary

Create root agent guidance for the repo with `AGENTS.md` as the canonical instruction file and a root `CLAUDE.md` shim so Claude Code discovers it automatically. Reconcile maintained wiki inventory references so `AGENTS.md`, `CLAUDE.md`, `wiki/_schema.md`, `wiki/_index.md`, and the marketplace project page agree on the current five-plugin split: `jx-qa`, `jx-kb`, `jx-pm`, `jx-dev`, and `jx-core`.

Use `AGENTS.md` casing to match repository convention, even though the original request used `AGENTS.MD`.

## Key Changes

- Add root `AGENTS.md` as the first-read instruction file for agents.
- Add root `CLAUDE.md` as a shim that points Claude Code to `AGENTS.md`.
- Keep both files concise and pointer-driven instead of duplicating `README.md`.
- Cover the current source-of-truth surfaces:
  - `README.md`
  - `plugins/*/README.md`
  - `.claude-plugin/marketplace.json`
  - `plugins/*/.claude-plugin/plugin.json`
  - `plugins/*/commands/*.md`
  - `plugins/*/skills/*/SKILL.md`
  - `plugins/jx-core/_shared/`
- Document repo-local memory behavior:
  - Read `.agent/memory/MEMORY.md` early.
  - Write memory only when explicitly requested or when a reusable project decision or preference emerges, then update `.agent/memory/MEMORY.md`.
- Document wiki behavior:
  - Use `wiki/_schema.md` as the wiki contract.
  - Update `wiki/_schema.md` so concrete plugin routing matches the current five-plugin split.
  - Refresh maintained wiki index/project/plugin pages that still describe the old three-plugin inventory.
  - State that live `README.md`, `plugins/`, and plugin manifests are authoritative for plugin inventory if wiki guidance drifts.
  - Do not silently overwrite contradictions.
  - Treat `wiki/raw/` as provenance, not maintained wiki pages.
- Document plugin workflow:
  - `/jx-pm:prd` -> `/jx-dev:spec` -> `/jx-dev:task` -> `/jx-pm:ado`
  - `jx-core` is reference-only.
- Document safety expectations:
  - Preserve narrow command permissions.
  - Prefer pinned helpers over broad interpreter or package-manager access.
  - Do not broaden tool surfaces casually.
- Document change discipline:
  - Wiki-only filings can proceed directly.
  - Code, script, plugin, or manifest changes should be planned before implementation.

## Proposed AGENTS.md Shape

- `# Agent Instructions`
- `## First Read`
- `## Repository Map`
- `## Operating Rules`
- `## Plugin Boundaries`
- `## Wiki and Memory`
- `## Validation Checklist`
- `## Do Not`

The `Do Not` section should explicitly say not to treat stale wiki/source snapshots as current plugin truth when live `plugins/` files and manifests disagree.

## Test Plan

- Confirm `AGENTS.md` and `CLAUDE.md` exist at repository root.
- Confirm `CLAUDE.md` is only a pointer and does not duplicate long-lived instructions.
- Check that `AGENTS.md` references the current five-plugin split: `jx-qa`, `jx-kb`, `jx-pm`, `jx-dev`, and `jx-core`.
- Confirm `wiki/_schema.md`, `wiki/_index.md`, and maintained project/plugin pages reference the same five plugins.
- Grep maintained guidance files for stale `tri-plugin`, `3-plugin`, and old plugin-count claims.
- Confirm `AGENTS.md` does not create a source-of-truth conflict between `wiki/_schema.md` and live plugin manifests.
- Run `python3 -m json.tool .claude-plugin/marketplace.json`.
- Run `python3 -m json.tool` on each `plugins/*/.claude-plugin/plugin.json`.
- If helper guidance changes, run:
  ```bash
  python3 -m py_compile plugins/jx-kb/scripts/wiki-tools.py plugins/jx-qa/scripts/xlsx-writer.py
  ```
- Grep `AGENTS.md` for stale command claims. It should not contain `/jx-pm:techspec`, `/jx-pm:task`, `/qa-ai:`, or `/llm-wiki:` unless explicitly described as historical.

## Assumptions

- This is a documentation/source-control change only; no plugin behavior changes.
- `AGENTS.md` is the canonical cross-agent instruction file.
- `CLAUDE.md` exists only for Claude Code automatic discovery.
- Live plugin inventory is authoritative from `README.md`, `plugins/`, and marketplace/plugin manifests.
- The root `AGENTS.md` should point to `.agent/memory/` and `wiki/`, but should not itself be ingested into the wiki unless requested separately.
