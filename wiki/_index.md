---
title: Wiki Index
updated: 2026-05-09
page_count: 164
---

# Wiki Index

## Ideas

- [[Dataview Queries]] — Obsidian plugin for frontmatter queries (#tooling, #obsidian) [backlogged P3]
- [[Marp Integration]] — Markdown slide decks from wiki content (#tooling, #presentation) [backlogged P3]
- [[Align jx-qa Generate Tool Contract]] — Bring generate workflow instructions into alignment with allowed tools (#jx-qa, #tooling) [backlogged P2]
- [[Raw Sources Should Be Excluded From Wiki Graph]] — Keep raw snapshots out of page graph and lint checks (#wiki, #lint) [backlogged P2]
- [[Rebrand Skills to jx Namespace]] — Unify all plugins under jx-* naming: jx-qa, jx-kb, jx-pm (#plugin, #naming) [completed]
- [[Wiki Search Tools]] — qmd and CLI tools for wiki search at scale (#tooling, #search) [backlogged P3]

## Concepts

- [[Ad-hoc vs Manifest-Driven Workflows]] — Two workflow modes: manual target selection vs manifest-tracked suggestions (#pattern, #workflow)
- [[Agent Team Execution]] — Parallel agent orchestration with sequential foundation and tmux visibility (#pattern, #agent, #orchestration)
- [[Atomic Rename Boundary]] — Runtime-critical rename changes must land in one commit (#pattern, #naming, #git)
- [[Codex Plugin Compatibility]]
- [[Configurable Default Chain]] — CLI flag → env var → hardcoded default resolution order (#pattern, #configuration) — Claude Code vs Codex plugin format differences and conversion tools (#plugin, #codex)
- [[Conflict Callout]] — Pattern for handling contradictions between sources (#wiki, #contradiction)
- [[Cross-Reference Pass]] — Bidirectional wikilink pass after page creation (#wiki, #linking)
- [[Directory-Source Marketplace]] — Local directory as marketplace source instead of GitHub (#plugin, #marketplace)
- [[Dynamic Worklist Generation]] — Generate file lists from grep/rg at execution time, never hardcode (#pattern, #refactoring)
- [[Filing Workflow]] — Process for persisting conversation insights back to wiki (#wiki, #workflow)
- [[Golden Thread Traceability]] — Unbroken chain from business objective to test case via requirement IDs (#pattern, #requirements)
- [[Fail-Closed Lookup]] — Require exactly 1 match from external system; halt on 0 or 2+ (#pattern, #safety)
- [[E2E Test Case]] — Classification of requirements as E2E-testable or not (#testing, #classification)
- [[Health Score]] — 0-100 score quantifying wiki quality from lint (#wiki, #metrics)
- [[Hook]] — Plugin lifecycle event handler (#plugin, #lifecycle)
- [[Idea Lifecycle]] — Progression: raw → promoted/backlogged/archived (#wiki, #workflow)
- [[Idempotent Operation]] — Safe re-run pattern, skips existing work (#pattern, #safety)
- [[Index]] — Content catalog for wiki navigation via _index.md (#architecture, #wiki)
- [[Iterative Adversarial Review]] — Multi-pass design hardening: review, resolve, re-submit until clean (#pattern, #quality)
- [[Ingest]] — Core operation: absorb source documents into wiki pages (#operation, #wiki)
- [[Link Graph Traversal]] — Page discovery via wikilink graph during query (#wiki, #navigation)
- [[Local Plugin Development]] — --plugin-dir workflow for local disk plugin dev (#plugin, #development)
- [[Lint]] — Periodic health-check operation for wiki (#operation, #maintenance)
- [[Log]] — Append-only chronological record of wiki operations (#architecture, #audit)
- [[Marketplace]] — Plugin distribution mechanism for Claude Code CLI (#distribution, #plugin)
- [[MCP Server]] — Model Context Protocol server for Claude Desktop extensibility (#protocol, #mcp)
- [[MCP Tool]] — Individual capability exposed by MCP Server (#protocol, #tool)
- [[Memory vs Wiki Separation]]
- [[Mode Flag Pattern]] — Merge N similar skills into 1 with --mode flag when 80%+ structure shared (#pattern, #plugin) — When to use agent memory vs wiki pages (#architecture, #persistence)
- [[Multi-Phase Skill]] — Structural pattern: numbered phases with gates (#pattern, #architecture)
- [[Naming Ripple Effect]] — How marketplace/plugin renames cascade through the system (#pattern, #naming)
- [[Requirement ID System]] — {TYPE}-{feature_number}-{seq} format with global AC counter (#pattern, #requirements)
- [[NotebookLM Integration]] — Associated NotebookLM notebooks and capabilities (#notebooklm, #tooling)
- [[NotebookLM Research Oracle]] — Querying NotebookLM as external knowledge source during wiki work (#pattern, #research)
- [[Per-Item Write-Back]] — Persist external IDs to disk after each individual operation, not batch (#pattern, #crash-recovery)
- [[Path Confinement]] — Security pattern: path safety contract with relative_to() (#security, #validation)
- [[Pinned Helper]] — Security pattern: restricted script execution (#security, #execution)
- [[Plugin Architecture]] — .claude-plugin format for Claude Code CLI (#architecture, #plugin)
- [[Plugin Metadata Surfaces]] — Where plugin descriptions and listing metadata live (#plugin, #metadata)
- [[Polyglot Dependency Strategy]] — Python + TypeScript dependency management for plugin projects (#architecture, #dependencies)
- [[Query]] — Search wiki and synthesize answers with citations (#operation, #retrieval)
- [[Raw Sources]] — Immutable source document layer (#architecture, #provenance)
- [[Request Mocking]] — Network interception/mocking for testing (#testing, #network)
- [[Scoped Replacement Pattern]] — Safe bulk rename with substring hazard avoidance and corruption checks (#pattern, #naming, #safety)
- [[Schema]] — Wiki configuration document _schema.md (#architecture, #configuration)
- [[Session Memory Model]] — Agent knowledge retention: in-session vs cross-session persistence (#persistence, #memory)
- [[Semantic Locator]] — Stable element locators via live browser discovery (#testing, #locator)
- [[Skill Chaining]] — Inter-skill output→input pipeline via --chain flag (#pattern, #plugin)
- [[Skill Generalization]] — Process of porting project-specific skills to generic reusable plugins (#pattern, #porting)
- [[Split Verification Pattern]] — Dual-tier checks for renames with preserved concept references (#pattern, #verification, #safety)
- [[Shared Reference Extraction]] — Extract repeated skill logic into _shared/ files, reference by path (#pattern, #DRY)
- [[Settings Portability]] — settings.json (committed) vs settings.local.json (gitignored) split pattern (#pattern, #configuration)
- [[SHA-256 Fingerprinting]] — Content-based dedup via hash (#security, #dedup)
- [[Skill]] — Multi-phase instructional module powering slash commands (#plugin, #implementation)
- [[Slash Command]] — User-facing command wrapper /plugin:command (#plugin, #user-facing)
- [[Storage State]] — Browser state persistence for auth reuse (#testing, #persistence)
- [[Tombstone Pattern]] — Mark synced items as removed instead of deleting; preserve external bindings (#pattern, #sync)
- [[Template-as-Reference Pattern]] — Store templates in references/ subdir, keep SKILL.md behavior-only (#pattern, #organization)
- [[Taxonomy Routing]] — Classification rules for routing knowledge to buckets (#classification, #wiki)
- [[Three-Surface Plugin Ecosystem]] — CLI + Code Desktop + Codex Desktop shared plugin registry (#architecture, #plugin)
- [[Test Code Generation]] — Auto-generating TypeScript from CLI interactions (#testing, #codegen)
- [[Tracing]] — Execution trace capture for debugging (#debugging, #observability)
- [[Triage]] — Classify raw ideas: promote, backlog, or archive (#operation, #classification)
- [[User Confirmation Gate]] — Security pattern: no writes before explicit approval (#security, #ux)
- [[Watchlist Pattern]] — Manifest-driven tracking list for scan-based operations (#pattern, #workflow)
- [[Wiki Query Patterns]] — Query types: retrieval, exploratory, generative (#wiki, #query)
- [[ADO State Sync Model]] — Bottom-up state transition model for Azure Boards sync (#jx-pm, #ado, #state-machine)
- [[Agent Definition]] — Custom AI subagent definition format for plugins (#plugin, #subagent, #orchestration)
- [[Measurability Mandate]] — Every requirement must be testable with concrete metrics (#pattern, #requirements)
- [[Mermaid Diagram Patterns]] — Reference library of 7 diagram types for architecture visualization (#jx-pm, #techspec, #mermaid)
- [[Socratic Interview]] — 3-7 architectural questions tied to specific design decisions (#pattern, #architecture)
- [[Tenant Binding]] — File-authoritative binding to external system tenant (#pattern, #safety)

## Entities

- [[Anthropic]] — AI safety company behind Claude (#company, #ai)
- [[Obsidian]] — Markdown knowledge management app, wiki viewer/IDE (#tool, #editor)
- [[Playwright]] — Browser automation framework by Microsoft (#tool, #testing)
- [[Vannevar Bush]] — Memex originator (1945), personal knowledge store vision (#person, #history)

## Topics

- [[Browser Automation]] — Programmatic browser control for testing and automation (#testing, #playwright)
- [[Knowledge Management]] — Capturing, organizing, maintaining, and retrieving knowledge (#knowledge-base, #wiki)
- [[Plugin Dogfooding Workflow]] — Feedback loop between plugin source, wiki, and discussion (#plugin, #workflow)
- [[QA Test Automation]] — Automated test generation from requirements documents (#testing, #qa)

## Plugins

- [[Knowledge Base Plugin|jx-kb]] — LLM-maintained knowledge base plugin for Claude Code (#knowledge-base, #wiki)
- [[QA Testing Plugin|jx-qa]] — QA testing pipeline: BRD → xlsx → Playwright specs (#testing, #playwright)

## Platforms

- [[Claude Code CLI]] — CLI with proprietary plugin architecture (#claude, #cli)
- [[Claude Code Desktop]] — Desktop app sharing plugin registry with CLI (#claude, #desktop)
- [[Codex Desktop]] — Codex desktop app sharing plugin registry with CLI (#codex, #desktop)
- [[Claude Desktop]] — Desktop app with MCP-only extensibility (#claude, #desktop)
- [[WSL]] — Windows Subsystem for Linux, bridge for CLI-to-Desktop integration (#windows, #linux)

## Projects

- [[Jodex Plugin Marketplace]] — Tri-plugin marketplace dogfooding its own wiki workflow (#plugin, #marketplace)
- [[Product Management Skills Plugin]] — jx-pm: 5 skills (prd, techspec, task, ado, pipeline) for PM/PO workflows (#plugin, #product-management) [active]

## Decisions

- [[ADR-001 Treat Marketplace Metadata As Listing Source]] — Marketplace manifest owns listing text (#plugin, #metadata)

## Code

- [[Creating a Skill]] — Step-by-step guide for adding a new skill to a Claude Code plugin (#skill, #how-to)
- [[wiki-tools.py]] — Pinned helper script for jx-kb plugin (#script, #python)
- [[xlsx-writer.py]] — Pinned helper script for jx-qa plugin (#script, #python)

## Sources

- [[Source - Claude CLI vs Desktop MCP Guide]] — CLI vs Desktop architecture comparison (#architecture)
- [[Source - Claude Desktop WSL Integration]] — WSL integration guide (#wsl)
- [[Source - Element Attributes Reference]] — DOM attribute inspection via eval (#playwright)
- [[Source - Extract SKILL]] — BRD → xlsx test plan (#skill)
- [[Source - Extract SKILL Sequence]] — Mermaid sequence diagram for extract 6-phase flow (#skill, #sequence-diagram)
- [[Source - Generate SKILL]] — xlsx → Playwright specs via live browser (#skill)
- [[Source - Init SKILL]] — Wiki initialization (#skill)
- [[Source - Ingest SKILL]] — Core ingest operation (#skill)
- [[Source - Lint SKILL]] — Wiki health-checking (#skill)
- [[Source - LLM Wiki]] — LLM Wiki pattern by Karpathy (#pattern)
- [[Source - JX KB README]] — LLM Wiki plugin docs (#plugin)
- [[Source - Marketplace Config]] — marketplace.json manifest (#config)
- [[Source - Playwright CLI SKILL]] — Browser automation skill (#skill)
- [[Source - Playwright Tests Reference]] — Running/debugging tests (#playwright)
- [[Source - JX QA README]] — QA AI plugin docs (#plugin)
- [[Source - Query SKILL]] — Wiki query with citations (#skill)
- [[Source - Request Mocking Reference]] — Network interception/mocking (#playwright)
- [[Source - Running Code Reference]] — run-code for arbitrary Playwright (#playwright)
- [[Source - Session Management Reference]] — Named browser sessions (#playwright)
- [[Source - Storage State Reference]] — Cookies, localStorage management (#playwright)
- [[Source - Test Generation Reference]] — Auto-generating test code (#playwright)
- [[Source - Tracing Reference]] — Execution trace capture (#playwright)
- [[Source - Triage SKILL]] — Idea classification (#skill)
- [[Source - Video Recording Reference]] — WebM capture with overlays (#playwright)
- [[Source - ADO Command]] — /jx-pm:ado command definition and tool permissions (#jx-pm, #command)
- [[Source - ADO Sync States Reference]] — Azure Boards state transition rules for sync (#jx-pm, #ado)
- [[Source - Azure Boards Sync SKILL]] — task.json to Azure Boards hierarchy with state sync (#skill, #jx-pm, #ado)
- [[Source - Browser Command]] — /jx-qa:browser slash command definition (#jx-qa, #command, #playwright)
- [[Source - Docs Root Config]] — Shared docs-root resolution: flag → env → default (#skill, #jx-pm, #config)
- [[Source - Extract Command]] — /jx-qa:extract slash command definition (#jx-qa, #command)
- [[Source - Generate Command]] — /jx-qa:generate slash command definition (#jx-qa, #command)
- [[Source - ID Rules]] — Shared folder validation and requirement ID generation rules (#skill, #jx-pm, #id-system)
- [[Source - jx-pm Agents Stub]] — Placeholder for future jx-pm agent configurations (#jx-pm, #stub)
- [[Source - jx-pm Hooks Stub]] — Placeholder for future jx-pm lifecycle hooks (#jx-pm, #stub)
- [[Source - jx-pm Plugin README]] — Plugin overview: 5 skills, pipeline chain, output structure (#jx-pm, #plugin)
- [[Source - jx-pm PRD Command]] — jx-pm PRD generation command with mode flags and skill chaining (#jx-pm, #command)
- [[Source - jx-pm Prompts Stub]] — Placeholder for future jx-pm prompt fragments (#jx-pm, #stub)
- [[Source - jx-pm Task Command]] — jx-pm task.json generation command from PRD + TECH_SPEC (#jx-pm, #command)
- [[Source - jx-pm Techspec Command]] — jx-pm tech spec generation command from PRD (#jx-pm, #command)
- [[Source - JX KB Prompts Directory]] — Prompt fragment directory for jx-kb plugin (#jx-kb, #prompts)
- [[Source - JX KB Schemas Directory]] — JSON Schema directory for jx-kb plugin (#jx-kb, #schemas)
- [[Source - jx-kb Agents Guide]] — llm-wiki agent definition format and use cases (#jx-kb, #agents)
- [[Source - jx-kb Hooks Guide]] — llm-wiki hooks format and lifecycle events (#jx-kb, #hooks)
- [[Source - jx-kb Ingest Command]] — llm-wiki ingest slash command definition (#jx-kb, #command)
- [[Source - jx-kb Init Command]] — llm-wiki init slash command definition (#jx-kb, #command)
- [[Source - jx-kb Lint Command]] — llm-wiki lint/health-check slash command definition (#jx-kb, #command)
- [[Source - jx-kb Query Command]] — llm-wiki query slash command definition (#jx-kb, #command)
- [[Source - jx-kb Triage Command]] — llm-wiki triage slash command definition (#jx-kb, #command)
- [[Source - Mermaid Diagram Patterns]] — 7 Mermaid diagram types for tech spec generation (#jx-pm, #techspec)
- [[Source - Pipeline Command]] — /jx-pm:pipeline command definition and flags (#jx-pm, #command)
- [[Source - Pipeline SKILL]] — Convenience wrapper running full PM pipeline (#skill, #jx-pm, #pipeline)
- [[Source - PRD Example Lite]] — Complete lite-mode PRD example (one-click checkout) (#jx-pm, #prd)
- [[Source - PRD Generator SKILL]] — PRD generation skill with 3 modes, golden thread, INVEST stories (#skill, #jx-pm, #prd)
- [[Source - PRD Lite Template]] — Minimal viable PRD template with placeholders (#jx-pm, #prd)
- [[Source - PRD Standard Template]] — Mid-weight PRD template with design/tech sections (#jx-pm, #prd)
- [[Source - JX QA Agents Directory]] — Agent definition directory for jx-qa plugin (#jx-qa, #agents)
- [[Source - JX QA Hooks Directory]] — Hooks lifecycle directory for jx-qa plugin (#jx-qa, #hooks)
- [[Source - JX QA Prompts Directory]] — Prompt fragment directory for jx-qa plugin (#jx-qa, #prompts)
- [[Source - JX QA Schemas Directory]] — JSON Schema directory for jx-qa plugin (#jx-qa, #schemas)
- [[Source - Root README]] — Root project README with installation and usage docs (#marketplace, #readme)
- [[Source - Task JSON Converter SKILL]] — PRD/tech spec to canonical task.json with estimates (#skill, #jx-pm, #task)
- [[Source - Task JSON Schema]] — Canonical JSON schema for task.json structure (#skill, #jx-pm, #schema)
- [[Source - Tech Spec Generator SKILL]] — Tech spec from PRD with Mermaid, JSON Schema, OpenAPI, ADRs (#skill, #jx-pm, #techspec)
- [[Source - Tech Spec Template]] — 8-section TECH_SPEC.md template with EARS syntax (#jx-pm, #techspec)
- [[Source - Unified BRD-PRD Template]] — Combined BRD+PRD template with strategic + tactical sections (#jx-pm, #prd)
