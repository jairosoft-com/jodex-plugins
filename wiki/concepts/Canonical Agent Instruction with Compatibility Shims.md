---
title: Canonical Agent Instruction with Compatibility Shims
type: concept
tags: [agent, instructions, compatibility, pattern]
created: 2026-05-11
updated: 2026-05-11
source_count: 1
aliases: [agent instruction shim, CLAUDE.md shim, AGENTS.md canonical instructions]
provenance: synthesis
---

# Canonical Agent Instruction with Compatibility Shims

A cross-agent repository pattern: keep one durable instruction file as the canonical source, then add thin compatibility shims for agent tools that discover different filenames.

In this repo, `AGENTS.md` is the canonical instruction file and `CLAUDE.md` is a shim that points [[Claude Code CLI]] agents to `AGENTS.md`.

## Pattern

| File | Role |
|------|------|
| `AGENTS.md` | Canonical cross-agent repository instructions |
| `CLAUDE.md` | Claude Code discovery shim that points to `AGENTS.md` |

The shim should be intentionally small. It should route the agent to the canonical file and state that durable instruction updates belong there.

## Source-Backed Details

[[Source - Agent Instructions]] makes `AGENTS.md` the first-read instruction surface for agents. It also defines source-of-truth precedence, plugin boundaries, wiki/memory rules, validation checks, and the rule that durable instruction updates should not be duplicated in `CLAUDE.md`.

## Why It Matters

Different agents discover different root instruction files. A compatibility shim gives each agent an entry point without creating multiple long-lived instruction surfaces that can drift.

This works best when the canonical file also names source-of-truth precedence. In this repo, live `README.md`, `plugins/*/README.md`, plugin manifests, and `plugins/` override stale wiki or source snapshots for plugin inventory.

## Implementation Rules

- Keep the canonical file pointer-driven and concise.
- Keep compatibility shims thin.
- Add source-of-truth precedence rules to the canonical file.
- Update maintained wiki/schema/index pages when repo inventory changes.
- Qualify memory writes: write memory only when explicitly requested or when a reusable project decision or preference emerges.

## Related

- [[Codex Plugin Compatibility]]
- [[Session Memory Model]]
- [[Filing Workflow]]
- [[Jodex Plugin Marketplace]]
- [[Repository Source of Truth Precedence]]

## Sources

- Session synthesis, 2026-05-11
- [[Source - Agent Instructions]]
