# Plan: Dogfood LLM Wiki on This Repo

## Context

This repo (`jodex-qa-ai`) is a Claude Code plugin marketplace with two plugins: **qa-ai** (QA test automation) and **llm-wiki** (LLM-maintained knowledge base). The llm-wiki plugin already exists with 5 commands (init, ingest, triage, query, lint). The goal is to **use the plugin on itself** — create a wiki instance inside this repo documenting the domain of "building plugin skills for Claude Code." The repo becomes both the plugin source AND its own knowledge base.

---

## Step 1: Initialize Wiki

Run `/llm-wiki:init wiki/`

- Wiki name: **"Claude Code Plugin Skills"**
- Creates: 10 taxonomy dirs + `_schema.md`, `_index.md`, `_log.md`, `_backlog.md`
- Verify: `ls wiki/` shows expected structure

## Step 2: Customize Schema

Edit `wiki/_schema.md` — append domain-specific rules to `## Custom Rules`:

```markdown
## Custom Rules

### Plugin Component Taxonomy
Route as `concepts/`: Skill, Slash Command, Hook, Agent, Prompt, Plugin Manifest, Marketplace, MCP Server, MCP Tool

### Concrete Plugin Routing
Each plugin gets own page in `plugins/`: qa-ai, llm-wiki

### Platform Routing
Each platform gets page in `platforms/`: Claude Code CLI, Claude Desktop, Obsidian, WSL

### Design Pattern Routing
Cross-cutting patterns → `concepts/`: Pinned Helper, User Confirmation Gate, Path Confinement, SHA-256 Fingerprinting, Idempotent Operation, Conflict Callout, Multi-Phase Skill, Taxonomy Routing

### Helper Scripts
Concrete scripts (wiki-tools.py, xlsx-writer.py) → `code/`

### Linking Preference
Shared concepts appearing across multiple SKILLs → link to shared concept page, don't duplicate prose

### Provenance Tracking
Add `provenance` to required frontmatter fields. Values:
- `source-derived` — created/updated by ingest from a raw source (default for all ingest operations)
- `synthesis` — human-approved model analysis filed back into wiki
- `model-derived` — model-generated content not yet reviewed

Pages created by `/llm-wiki:ingest` default to `source-derived`. Query results filed back require explicit human action to set `synthesis`. No page may be set to `source-derived` without a corresponding source in `## Sources`.
```

## Step 3: Update `.gitignore`

Add:
```
# Wiki raw source snapshots (originals already in repo)
wiki/raw/
```

Rationale: all sources already live in-repo; `wiki/raw/sources/` copies are byte-duplicates. SHA-256 in `_log.md` provides provenance. Wiki pages themselves ARE tracked in git.

## Step 4: Ingest Sources (14 total, one at a time)

Each ingest pauses at Phase 3 for user confirmation (existing safeguard — human-in-loop before any wiki writes). Order is foundational-first so later sources link to established vocabulary.

**Atomicity via git**: Commit after each successful ingest (`wiki: ingest <source filename>`). Each ingest = one git checkpoint. Recovery from interrupted ingest = `git reset --hard HEAD`. This gives 14 recoverable transactions + clean audit trail of what the LLM wrote per source.

### Round 1 — Foundational (the pattern itself)
| # | Source | Expected Pages |
|---|--------|---------------|
| 4a | `ai_docs/llm-wiki.md` | Core concepts (Ingest, Triage, Query, Lint, Schema, Index), Karpathy entity, Obsidian entity |

### Round 2 — Platform vocabulary
| # | Source | Expected Pages |
|---|--------|---------------|
| 4b | `ai_docs/claude_cli_vs_desktop_mcp_guide.md` | Platforms (Claude Code CLI, Claude Desktop), concepts (MCP Server, MCP Tool, Plugin Architecture) |
| 4c | `ai_docs/claude_desktop_wsl_integration.md` | Updates existing platform pages, tests conflict detection (overlapping WSL config with 4b) |

### Round 3 — Plugin overviews
| # | Source | Expected Pages |
|---|--------|---------------|
| 4d | `plugins/llm-wiki/README.md` | `plugins/LLM Wiki.md` with pipeline, commands, security model |
| 4e | `plugins/qa-ai/README.md` | `plugins/QA AI.md` with pipeline, commands, requirements |

### Round 4 — llm-wiki SKILL files
| # | Source | Expected Pages |
|---|--------|---------------|
| 4f | `plugins/llm-wiki/skills/init/SKILL.md` | Enriches Schema, Taxonomy, Index concepts |
| 4g | `plugins/llm-wiki/skills/ingest/SKILL.md` | Concepts: SHA-256 Fingerprinting, User Confirmation Gate, Cross-Reference Pass |
| 4h | `plugins/llm-wiki/skills/triage/SKILL.md` | Concepts: Idea Lifecycle, Triage, Backlog |
| 4i | `plugins/llm-wiki/skills/query/SKILL.md` | Concepts: Link Graph Traversal, Citation |
| 4j | `plugins/llm-wiki/skills/lint/SKILL.md` | Concepts: Health Score, Orphan Page |

### Round 5 — qa-ai SKILL files
| # | Source | Expected Pages |
|---|--------|---------------|
| 4k | `plugins/qa-ai/skills/extract/SKILL.md` | Concepts: E2E Test Case, Acceptance Criteria; code: xlsx-writer.py |
| 4l | `plugins/qa-ai/skills/generate/SKILL.md` | Concepts: Semantic Locator, Test Plan, Idempotent Operation |
| 4m | `plugins/qa-ai/skills/playwright-cli/SKILL.md` | Concepts: Browser Automation; entity: Playwright CLI |

### Round 6 — Marketplace config
| # | Source | Expected Pages |
|---|--------|---------------|
| 4n | `.claude-plugin/marketplace.json` | Updates Marketplace concept (may be skipped if JSON unsupported) |

## Step 5: Triage Raw Ideas

Run `/llm-wiki:triage wiki/`

- **Promote** well-formed concepts to correct taxonomy
- **Backlog** interesting but underdeveloped ideas
- **Archive** duplicates or noise

## Step 6: Lint & Verify

Run `/llm-wiki:lint wiki/`

Verify:
- Zero broken links or missing index entries
- Health score >= 80
- At least one `> [!conflict]` block from overlapping WSL sources (4b/4c)
- Accept auto-fix suggestions

## Step 7: Functional Test Query

Run `/llm-wiki:query "What is the difference between a skill and a slash command in Claude Code plugins?" wiki/`

**Verification only** — do NOT file query results back into wiki. This tests retrieval and synthesis quality, not content creation.

Verify: coherent answer with `[[citations]]` to Skill, Slash Command, Plugin Manifest pages.

## Step 8: Commit

Stage `wiki/` (minus `wiki/raw/` per gitignore) + updated `.gitignore`. Commit with descriptive message.

---

## Expected Outcome

~40-60 wiki pages across taxonomy:
- **14 source summaries** in `sources/`
- **15-25 concept pages** (skills, patterns, design principles)
- **2 plugin pages** (qa-ai, llm-wiki)
- **3-4 platform pages** (Claude Code CLI, Desktop, Obsidian, WSL)
- **2-5 entity pages** (Karpathy, Anthropic, Jairosoft, Playwright)
- **2-4 topic pages** (Browser Automation, QA Test Automation, Knowledge Management)
- **2 code pages** (wiki-tools.py, xlsx-writer.py)

## Deferred: Playwright Reference Docs (Optional Phase 2)

9 files in `plugins/qa-ai/skills/playwright-cli/references/` (1,306 lines) are tactical CLI reference — not core domain knowledge. Can ingest later if deeper Playwright coverage wanted.

## Out of Scope

- **External/sensitive source policy** — Codex flagged lack of guardrails for high-risk sources (Slack threads, meeting transcripts, customer calls). Not applicable here: all 14 sources are already-committed public repo files. Policy controls for external sources deferred to when the plugin is used with non-repo inputs.
- **Plugin architecture changes** — Provenance tracking and atomicity are addressed at the plan level (schema field + git commits). Deeper plugin-level changes (atomic ingest transactions, source classification engine) are separate work if needed later.

## Known Risks

1. **Session length** — 14 ingests may span multiple sessions. Resume by checking `_log.md` for last completed SHA-256
2. **JSON ingest** — marketplace.json may be rejected as unsupported format. Skip if so; Marketplace concept seeded from README ingests
3. **Working directory** — wiki-tools.py uses `Path.cwd()` as project root. Ensure cwd is `/Users/jairo/Projects/jodex-qa-ai`

## Critical Files

- `plugins/llm-wiki/skills/init/SKILL.md` — init sequence
- `plugins/llm-wiki/skills/ingest/SKILL.md` — ingestion workflow (core of plan)
- `plugins/llm-wiki/scripts/wiki-tools.py` — pinned helper for all operations
- `ai_docs/llm-wiki.md` — foundational source (first ingest)
- `.gitignore` — needs wiki/raw/ exclusion
