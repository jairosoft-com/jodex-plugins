---
title: Backlog
updated: 2026-05-20
---

# Backlog

## P0 — Critical

## P1 — High

- [[Automate Plugin Creation Like Skill Creation]] — Scaffolding command to generate plugin directory layout, manifest, and starter files in one step (#jx-core, #plugin, #scaffolding, #dx)

## P2 — Medium

- [[Over-Grooming Anti-Pattern]] — Build density modes (lite/standard/dense) into grooming/triage skill to prevent scope inflation (#wiki, #idea-lifecycle, #grooming)
- [[Wrong-Tenant Filing as Tenant Binding Validation]] — Gate feedback skill on feedback-target.json; fail closed instead of ad-hoc project selection (#jx-pm, #ado, #tenant-binding)
- [[Schema Sources Rule Exception for Source Pages]] — Exempt source pages from ## Sources lint rule; eliminates 65 warnings, lifts health score ~82→90+ (#wiki, #schema, #lint)
- [[Scaffold QA Project From Skill]] — Add /jx-qa:init skill to scaffold complete QA project (dirs, playwright.config.ts, package.json, .gitignore) (#jx-qa, #scaffolding, #dx)
- [[Align jx-qa Generate Tool Contract]] — Fix xlsx parsing tool mismatch in generate skill (#jx-qa, #security)
- [[Raw Sources Should Be Excluded From Wiki Graph]] — Exclude raw/ from wiki-tools.py page graph; implementation plan saved in `.agent/plans/fix-wiki-lint-raw-exclusion.md` (#wiki, #lint)
- [[Downstream Contract Audit for Skill Output Changes]] — Build contract audit step into skill change workflow; grep output patterns across all plugins before planning (#skill-design, #contracts)
- [[Fix Promotion Rename Link Retargeting]] — Retarget historical wikilinks when promoting ideas to code/ pages to preserve audit trail (#wiki, #lint, #promotion)
- [[Slash Feedback Skill for jx-core]] — Capture user feedback via `/feedback` and create ADO Feature work items; v1 ships jx-pm + jx-qa stubs (#jx-core, #feedback, #skill, #cross-role, #ado)

## P3 — Low

- [[Distilled Local Model for Test Script Generation]] — Fine-tune a smaller local model on jx-qa spec output for offline, zero-cost test generation (#jx-qa, #local-llm, #distillation)
- [[Gemma 4 for Playwright Script Generation]] — Evaluate Gemma 4 as local model for /jx-qa:generate spec output (#jx-qa, #gemma, #local-llm)
- [[GitHub Beginner Tutorial for Non-Developers]] — Beginner guide for PMs/QA/stakeholders using GitHub via web UI (issues, PRs, project boards) (#onboarding, #github, #documentation)
- [[Wiki Search Tools]] — qmd and CLI tools for scaling wiki search (#tooling, #search) — from [[Source - LLM Wiki]]
- [[Triage Wiki Lint Editorial Warnings]] — Review orphan, conflict, thin-page, and stale-idea warnings after raw-source noise is excluded (#wiki, #lint)
- [[Marp Integration]] — Markdown slide decks from wiki content (#tooling, #presentation) — from [[Source - LLM Wiki]]
- [[Claude CLI Training Course]] — Short training course for launching and using Claude Code CLI on Windows/Mac (#documentation, #onboarding, #claude-code, #cli)
- [[Dataview Queries]] — Obsidian plugin for frontmatter queries (#tooling, #obsidian) — from [[Source - LLM Wiki]]
