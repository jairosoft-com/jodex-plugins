---
title: Backlog
updated: 2026-05-20
---

# Backlog

## P0 — Critical

## P1 — High

- [[Automate Plugin Creation Like Skill Creation]] — `/jx-skill:create-plugin` to scaffold plugin skeletons and marketplace entries with the same safety model as skill creation (#jx-skill, #plugin, #scaffolding, #dx)
- [[Skill Creator for Jodex Plugins]] — `/jx-skill:create` in new jx-skill plugin; scaffolds skills inside existing plugins with convention enforcement and validation; ADO #204325 (#developer-experience, #plugins, #tooling, #jx-skill)

## P2 — Medium

- [[Align jx-qa Generate Tool Contract]] — Fix xlsx parsing tool mismatch in generate skill (#jx-qa, #security)
- [[Direct PRD-to-ADO Sync Without task.json]] — Change `/jx-pm:ado` to sync PRD directly to Azure Boards, removing `task.json` dependency (#jx-pm, #ado, #prd, #refactor)
- [[Downstream Contract Audit for Skill Output Changes]] — Build contract audit step into skill change workflow; grep output patterns across all plugins before planning (#skill-design, #contracts)
- [[Dry-Run Gate Must Include Explicit Docs-Root]] — Require explicit `--docs-root docs` in `/jx-pm:ado --dry-run` verification to avoid stale env var misdirection (#jx-pm, #ado, #safety, #verification)
- [[Fix Promotion Rename Link Retargeting]] — Retarget historical wikilinks when promoting ideas to code/ pages to preserve audit trail (#wiki, #lint, #promotion)
- [[Over-Grooming Anti-Pattern]] — Build density modes (lite/standard/dense) into grooming/triage skill to prevent scope inflation (#wiki, #idea-lifecycle, #grooming)
- [[Raw Sources Should Be Excluded From Wiki Graph]] — Exclude raw/ from wiki-tools.py page graph; implementation plan saved in `.agent/plans/fix-wiki-lint-raw-exclusion.md` (#wiki, #lint)
- [[Scaffold QA Project From Skill]] — Add /jx-qa:init skill to scaffold complete QA project (dirs, playwright.config.ts, package.json, .gitignore) (#jx-qa, #scaffolding, #dx)
- [[Schema Sources Rule Exception for Source Pages]] — Exempt source pages from ## Sources lint rule; eliminates 65 warnings, lifts health score ~82→90+ (#wiki, #schema, #lint)
- [[Slash Feedback Skill for jx-core]] — Capture user feedback via `/feedback` and create ADO Feature work items; v1 ships jx-pm + jx-qa stubs (#jx-core, #feedback, #skill, #cross-role, #ado)
- [[Wrong-Tenant Filing as Tenant Binding Validation]] — Gate feedback skill on feedback-target.json; fail closed instead of ad-hoc project selection (#jx-pm, #ado, #tenant-binding)

## P3 — Low

- [[Distilled Local Model for Test Script Generation]] — Fine-tune a smaller local model on jx-qa spec output for offline, zero-cost test generation (#jx-qa, #local-llm, #distillation)
- [[Gemma 4 for Playwright Script Generation]] — Evaluate Gemma 4 as local model for /jx-qa:generate spec output (#jx-qa, #gemma, #local-llm)
- [[GitHub Beginner Tutorial for Non-Developers]] — Beginner guide for PMs/QA/stakeholders using GitHub via web UI (issues, PRs, project boards) (#onboarding, #github, #documentation)
- [[Wiki Search Tools]] — qmd and CLI tools for scaling wiki search (#tooling, #search) — from [[Source - LLM Wiki]]
- [[Triage Wiki Lint Editorial Warnings]] — Review orphan, conflict, thin-page, and stale-idea warnings after raw-source noise is excluded (#wiki, #lint)
- [[Marp Integration]] — Markdown slide decks from wiki content (#tooling, #presentation) — from [[Source - LLM Wiki]]
- [[Claude CLI Training Course]] — Short training course for launching and using Claude Code CLI on Windows/Mac (#documentation, #onboarding, #claude-code, #cli)
- [[Dataview Queries]] — Obsidian plugin for frontmatter queries (#tooling, #obsidian) — from [[Source - LLM Wiki]]
