---
title: Wiki Index
updated: 2026-05-07
page_count: 79
---

# Wiki Index

## Ideas

- [[Dataview Queries]] — Obsidian plugin for frontmatter queries (#tooling, #obsidian) [backlogged P3]
- [[Marp Integration]] — Markdown slide decks from wiki content (#tooling, #presentation) [backlogged P3]
- [[Wiki Search Tools]] — qmd and CLI tools for wiki search at scale (#tooling, #search) [backlogged P3]

## Concepts

- [[Codex Plugin Compatibility]] — Claude Code vs Codex plugin format differences and conversion tools (#plugin, #codex)
- [[Conflict Callout]] — Pattern for handling contradictions between sources (#wiki, #contradiction)
- [[Cross-Reference Pass]] — Bidirectional wikilink pass after page creation (#wiki, #linking)
- [[Filing Workflow]] — Process for persisting conversation insights back to wiki (#wiki, #workflow)
- [[E2E Test Case]] — Classification of requirements as E2E-testable or not (#testing, #classification)
- [[Health Score]] — 0-100 score quantifying wiki quality from lint (#wiki, #metrics)
- [[Hook]] — Plugin lifecycle event handler (#plugin, #lifecycle)
- [[Idea Lifecycle]] — Progression: raw → promoted/backlogged/archived (#wiki, #workflow)
- [[Idempotent Operation]] — Safe re-run pattern, skips existing work (#pattern, #safety)
- [[Index]] — Content catalog for wiki navigation via _index.md (#architecture, #wiki)
- [[Ingest]] — Core operation: absorb source documents into wiki pages (#operation, #wiki)
- [[Link Graph Traversal]] — Page discovery via wikilink graph during query (#wiki, #navigation)
- [[Lint]] — Periodic health-check operation for wiki (#operation, #maintenance)
- [[Log]] — Append-only chronological record of wiki operations (#architecture, #audit)
- [[Marketplace]] — Plugin distribution mechanism for Claude Code CLI (#distribution, #plugin)
- [[MCP Server]] — Model Context Protocol server for Claude Desktop extensibility (#protocol, #mcp)
- [[MCP Tool]] — Individual capability exposed by MCP Server (#protocol, #tool)
- [[Memory vs Wiki Separation]] — When to use agent memory vs wiki pages (#architecture, #persistence)
- [[Multi-Phase Skill]] — Structural pattern: numbered phases with gates (#pattern, #architecture)
- [[Naming Ripple Effect]] — How marketplace/plugin renames cascade through the system (#pattern, #naming)
- [[NotebookLM Integration]] — Associated NotebookLM notebooks and capabilities (#notebooklm, #tooling)
- [[NotebookLM Research Oracle]] — Querying NotebookLM as external knowledge source during wiki work (#pattern, #research)
- [[Path Confinement]] — Security pattern: path safety contract with relative_to() (#security, #validation)
- [[Pinned Helper]] — Security pattern: restricted script execution (#security, #execution)
- [[Plugin Architecture]] — .claude-plugin format for Claude Code CLI (#architecture, #plugin)
- [[Polyglot Dependency Strategy]] — Python + TypeScript dependency management for plugin projects (#architecture, #dependencies)
- [[Query]] — Search wiki and synthesize answers with citations (#operation, #retrieval)
- [[Raw Sources]] — Immutable source document layer (#architecture, #provenance)
- [[Request Mocking]] — Network interception/mocking for testing (#testing, #network)
- [[Schema]] — Wiki configuration document _schema.md (#architecture, #configuration)
- [[Session Memory Model]] — Agent knowledge retention: in-session vs cross-session persistence (#persistence, #memory)
- [[Semantic Locator]] — Stable element locators via live browser discovery (#testing, #locator)
- [[SHA-256 Fingerprinting]] — Content-based dedup via hash (#security, #dedup)
- [[Skill]] — Multi-phase instructional module powering slash commands (#plugin, #implementation)
- [[Slash Command]] — User-facing command wrapper /plugin:command (#plugin, #user-facing)
- [[Storage State]] — Browser state persistence for auth reuse (#testing, #persistence)
- [[Taxonomy Routing]] — Classification rules for routing knowledge to buckets (#classification, #wiki)
- [[Test Code Generation]] — Auto-generating TypeScript from CLI interactions (#testing, #codegen)
- [[Tracing]] — Execution trace capture for debugging (#debugging, #observability)
- [[Triage]] — Classify raw ideas: promote, backlog, or archive (#operation, #classification)
- [[User Confirmation Gate]] — Security pattern: no writes before explicit approval (#security, #ux)
- [[Wiki Query Patterns]] — Query types: retrieval, exploratory, generative (#wiki, #query)

## Entities

- [[Anthropic]] — AI safety company behind Claude (#company, #ai)
- [[Obsidian]] — Markdown knowledge management app, wiki viewer/IDE (#tool, #editor)
- [[Playwright]] — Browser automation framework by Microsoft (#tool, #testing)
- [[Vannevar Bush]] — Memex originator (1945), personal knowledge store vision (#person, #history)

## Topics

- [[Browser Automation]] — Programmatic browser control for testing and automation (#testing, #playwright)
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

- [[Source - Claude CLI vs Desktop MCP Guide]] — CLI vs Desktop architecture comparison (#architecture)
- [[Source - Claude Desktop WSL Integration]] — WSL integration guide (#wsl)
- [[Source - Element Attributes Reference]] — DOM attribute inspection via eval (#playwright)
- [[Source - Extract SKILL]] — BRD → xlsx test plan (#skill)
- [[Source - Generate SKILL]] — xlsx → Playwright specs via live browser (#skill)
- [[Source - Init SKILL]] — Wiki initialization (#skill)
- [[Source - Ingest SKILL]] — Core ingest operation (#skill)
- [[Source - Lint SKILL]] — Wiki health-checking (#skill)
- [[Source - LLM Wiki]] — LLM Wiki pattern by Karpathy (#pattern)
- [[Source - LLM Wiki README]] — LLM Wiki plugin docs (#plugin)
- [[Source - Marketplace Config]] — marketplace.json manifest (#config)
- [[Source - Playwright CLI SKILL]] — Browser automation skill (#skill)
- [[Source - Playwright Tests Reference]] — Running/debugging tests (#playwright)
- [[Source - QA AI README]] — QA AI plugin docs (#plugin)
- [[Source - Query SKILL]] — Wiki query with citations (#skill)
- [[Source - Request Mocking Reference]] — Network interception/mocking (#playwright)
- [[Source - Running Code Reference]] — run-code for arbitrary Playwright (#playwright)
- [[Source - Session Management Reference]] — Named browser sessions (#playwright)
- [[Source - Storage State Reference]] — Cookies, localStorage management (#playwright)
- [[Source - Test Generation Reference]] — Auto-generating test code (#playwright)
- [[Source - Tracing Reference]] — Execution trace capture (#playwright)
- [[Source - Triage SKILL]] — Idea classification (#skill)
- [[Source - Video Recording Reference]] — WebM capture with overlays (#playwright)
