---
title: Wiki Index
updated: 2026-05-07
page_count: 49
---

# Wiki Index

## Ideas

- [[Dataview Queries]] — Obsidian plugin for frontmatter queries (#tooling, #obsidian)
- [[Marp Integration]] — Markdown slide decks from wiki content (#tooling, #presentation)
- [[Wiki Search Tools]] — qmd and CLI tools for wiki search at scale (#tooling, #search)

## Concepts

- [[Conflict Callout]] — Pattern for handling contradictions between sources (#wiki, #contradiction)
- [[Cross-Reference Pass]] — Bidirectional wikilink pass after page creation (#wiki, #linking)
- [[Health Score]] — 0-100 score quantifying wiki quality from lint (#wiki, #metrics)
- [[Hook]] — Plugin lifecycle event handler (#plugin, #lifecycle)
- [[Idea Lifecycle]] — Progression: raw → promoted/backlogged/archived (#wiki, #workflow)
- [[Index]] — Content catalog for wiki navigation via _index.md (#architecture, #wiki)
- [[Ingest]] — Core operation: absorb source documents into wiki pages (#operation, #wiki)
- [[Link Graph Traversal]] — Page discovery via wikilink graph during query (#wiki, #navigation)
- [[Lint]] — Periodic health-check operation for wiki (#operation, #maintenance)
- [[Log]] — Append-only chronological record of wiki operations (#architecture, #audit)
- [[Marketplace]] — Plugin distribution mechanism for Claude Code CLI (#distribution, #plugin)
- [[MCP Server]] — Model Context Protocol server for Claude Desktop extensibility (#protocol, #mcp)
- [[MCP Tool]] — Individual capability exposed by MCP Server (#protocol, #tool)
- [[Multi-Phase Skill]] — Structural pattern: numbered phases with gates (#pattern, #architecture)
- [[Path Confinement]] — Security pattern: path safety contract with relative_to() (#security, #validation)
- [[Pinned Helper]] — Security pattern: restricted script execution (#security, #execution)
- [[Plugin Architecture]] — .claude-plugin format for Claude Code CLI (#architecture, #plugin)
- [[Query]] — Search wiki and synthesize answers with citations (#operation, #retrieval)
- [[Raw Sources]] — Immutable source document layer (#architecture, #provenance)
- [[Schema]] — Wiki configuration document _schema.md (#architecture, #configuration)
- [[SHA-256 Fingerprinting]] — Content-based dedup via hash (#security, #dedup)
- [[Skill]] — Multi-phase instructional module powering slash commands (#plugin, #implementation)
- [[Slash Command]] — User-facing command wrapper /plugin:command (#plugin, #user-facing)
- [[Taxonomy Routing]] — Classification rules for routing knowledge to buckets (#classification, #wiki)
- [[Triage]] — Classify raw ideas: promote, backlog, or archive (#operation, #classification)
- [[User Confirmation Gate]] — Security pattern: no writes before explicit approval (#security, #ux)

## Entities

- [[Anthropic]] — AI safety company behind Claude (#company, #ai)
- [[Obsidian]] — Markdown knowledge management app, wiki viewer/IDE (#tool, #editor)
- [[Playwright]] — Browser automation framework by Microsoft (#tool, #testing)
- [[Vannevar Bush]] — Memex originator (1945), personal knowledge store vision (#person, #history)

## Topics

- [[Knowledge Management]] — Capturing, organizing, maintaining, and retrieving knowledge (#knowledge-base, #wiki)
- [[QA Test Automation]] — Automated test generation from requirements documents (#testing, #qa)

## Plugins

- [[LLM Wiki]] — LLM-maintained knowledge base plugin for Claude Code (#knowledge-base, #wiki)
- [[QA AI]] — QA testing pipeline: BRD → xlsx → Playwright specs (#testing, #playwright)

## Platforms

- [[Claude Code CLI]] — CLI with proprietary plugin architecture (#claude, #cli)
- [[Claude Desktop]] — Desktop app with MCP-only extensibility (#claude, #desktop)
- [[WSL]] — Windows Subsystem for Linux, bridge for CLI-to-Desktop integration (#windows, #linux)

## Projects

_No projects yet._

## Decisions

_No decisions yet._

## Code

- [[wiki-tools.py]] — Pinned helper script for LLM Wiki plugin (#script, #python)
- [[xlsx-writer.py]] — Pinned helper script for QA AI plugin (#script, #python)

## Sources

- [[Source - Claude CLI vs Desktop MCP Guide]] — CLI vs Desktop architecture comparison (#architecture, #migration)
- [[Source - Claude Desktop WSL Integration]] — WSL integration guide for Desktop on Windows 11 (#wsl, #integration)
- [[Source - Init SKILL]] — 7-phase init skill for wiki initialization (#skill, #init)
- [[Source - Ingest SKILL]] — 9-phase ingest skill, core operation (#skill, #ingest)
- [[Source - Lint SKILL]] — 6-phase lint skill for wiki health-checking (#skill, #lint)
- [[Source - LLM Wiki]] — LLM Wiki pattern document by Karpathy (#pattern, #architecture)
- [[Source - LLM Wiki README]] — LLM Wiki plugin README with pipeline, security, commands (#plugin, #documentation)
- [[Source - QA AI README]] — QA AI plugin README with BRD pipeline and security (#plugin, #documentation)
- [[Source - Query SKILL]] — 5-phase query skill with link graph traversal (#skill, #query)
- [[Source - Triage SKILL]] — 6-phase triage skill for idea classification (#skill, #triage)
