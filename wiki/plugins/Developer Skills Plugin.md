---
title: Developer Skills Plugin
type: plugin
tags: [plugin, developer, tech-spec, task, jx-dev]
created: 2026-05-11
updated: 2026-05-12
source_count: 3
aliases: [jx-dev, jx-dev plugin]
provenance: synthesis
---

# Developer Skills Plugin

Plugin name: **jx-dev**. Developer workflow plugin for turning PRDs into technical specifications and task breakdowns.

## Commands

| Command | Skill | Purpose |
|---------|-------|---------|
| `/jx-dev:spec` | spec | Generate `TECH_SPEC.md` from a PRD |
| `/jx-dev:task` | task | Convert PRD + technical spec into canonical `task.json` |

## Dependencies

- [[Core Shared Conventions Plugin|jx-core]] provides shared ID rules, docs-root resolution, and task JSON schema.
- The full PM-to-delivery chain is `/jx-pm:prd` -> `/jx-dev:spec` -> `/jx-dev:task` -> `/jx-pm:ado`.

## Onboarding

Use [[JX Dev Onboarding]] when a developer needs setup guidance for Claude Code CLI/Desktop, the plugin, knowledge-base initialization, GitHub workflow, Azure DevOps MCP installation, and the first `PRD.md` -> `TECH_SPEC.md` -> `task.json` run.

## Notes

`jx-dev` was extracted from [[Product Management Skills Plugin|jx-pm]] so developer-facing specification and task work lives outside the PM plugin.

## Sources

- [[Source - jx-dev Plugin README]]
- [[Source - jx-dev Spec Command]]
- [[Source - jx-dev Task Command]]
