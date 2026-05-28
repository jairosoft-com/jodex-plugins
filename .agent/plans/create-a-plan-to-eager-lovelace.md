# LLM Wiki Plugin — Implementation Plan

## Context

Karpathy's LLM Wiki pattern: instead of RAG (re-derive knowledge per query), the LLM **incrementally builds and maintains a persistent wiki** — structured, interlinked markdown files. Knowledge compounds across sources. The wiki is the artifact; the LLM is the maintainer.

This plan implements LLM Wiki as a new plugin (`llm-wiki`) in the jodex-qa-ai marketplace, following the exact same patterns as the existing `qa-ai` plugin.

---

## Architecture

### Three Layers

| Layer | Location | Owner | Mutability |
|-------|----------|-------|------------|
| Raw sources | `wiki/raw/sources/` | User | Immutable (LLM reads only) |
| Wiki | `wiki/` (configurable) | LLM | LLM creates, updates, maintains |
| Schema | `wiki/_schema.md` | User + LLM co-evolve | Configuration document |

> **Canonical raw-source location**: `wiki/raw/sources/`. Raw sources live *inside* the wiki directory so the entire knowledge base is a single self-contained tree. All commands, examples, and verification steps use this path.

### Five Commands

| Command | Purpose |
|---------|---------|
| `/llm-wiki:init` | Create wiki directory scaffold, schema, index, log, backlog |
| `/llm-wiki:ingest` | Process source → extract knowledge → create/update wiki pages + ideas |
| `/llm-wiki:triage` | Review raw ideas → promote to concepts, backlog for execution, or archive |
| `/llm-wiki:query` | Search index → read pages → synthesize answer with citations |
| `/llm-wiki:lint` | Health-check: orphans, broken links, contradictions, stale claims, stale ideas |

---

## Plugin Structure

```
plugins/llm-wiki/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── init.md
│   ├── ingest.md
│   ├── triage.md
│   ├── query.md
│   └── lint.md
├── skills/
│   ├── init/SKILL.md
│   ├── ingest/
│   │   ├── SKILL.md
│   │   └── evals/evals.json
│   ├── triage/
│   │   ├── SKILL.md
│   │   └── evals/evals.json
│   ├── query/
│   │   ├── SKILL.md
│   │   └── evals/evals.json
│   └── lint/
│       ├── SKILL.md
│       └── evals/evals.json
├── scripts/
│   └── wiki-tools.py
├── agents/ABOUT.md
├── hooks/ABOUT.md
├── prompts/ABOUT.md
├── schemas/ABOUT.md
└── README.md
```

---

## Knowledge Base Directory (User's Project)

Created by `/llm-wiki:init`. One wiki per project.

```
wiki/
├── _schema.md          # LLM configuration: taxonomy, conventions, rules
├── _index.md           # Content catalog (LLM reads first on every operation)
├── _log.md             # Chronological operation log (append-only)
├── _backlog.md         # Prioritized backlog: promoted ideas awaiting execution
│
├── ideas/              # Raw ideas needing triage (inbox)
├── concepts/           # Triaged + promoted ideas; abstract principles, patterns
├── entities/           # People, orgs, products, places
├── topics/             # Broader subject areas aggregating concepts/entities
├── plugins/            # Plugin specs, design docs, implementation notes
├── platforms/          # Platform-specific docs (Claude Code, ChatGPT, Codex)
├── projects/           # Project pages: goals, status, timelines
├── decisions/          # Architectural Decision Records (ADRs)
├── code/               # Source code documentation: modules, APIs, patterns found in codebase
├── sources/            # One summary page per ingested source
└── raw/
    └── sources/        # User drops immutable source files here
```

### Idea Lifecycle

```
raw source → /llm-wiki:ingest → ideas/ (raw, untriaged)
                                   ↓
                          /llm-wiki:triage → concepts/ (promoted)
                                           → _backlog.md (queued for execution)
                                           → archived (discarded with reason)
```

Ideas start in `ideas/` with `status: raw`. During triage (part of ingest or standalone), the LLM presents each idea and user decides: **promote** (→ concept/entity/plugin/etc), **backlog** (→ `_backlog.md` entry), or **archive** (mark `status: archived` with reason).

---

## Implementation Steps

### Step 1: Plugin Scaffold

**Files to create:**

- `plugins/llm-wiki/.claude-plugin/plugin.json`
  ```json
  {
    "name": "llm-wiki",
    "version": "1.0.0",
    "description": "Personal knowledge base: ingest sources, build an LLM-maintained wiki, query with citations, lint for health.",
    "author": { "name": "Jairosoft", "email": "ramon@jairosoft.com" }
  }
  ```

- `plugins/llm-wiki/agents/ABOUT.md`, `hooks/ABOUT.md`, `prompts/ABOUT.md`, `schemas/ABOUT.md` — following qa-ai template

- Update `/.claude-plugin/marketplace.json` — add llm-wiki entry

### Step 2: Helper Script — `scripts/wiki-tools.py`

Stdlib-only Python. Subcommands:

| Subcommand | Output | Purpose |
|------------|--------|---------|
| `snapshot <source_path> <wiki_path>` | JSON `{dest, sha256, size}` | Copy source into `wiki/raw/sources/<sha256_prefix>-<filename>`, return destination path + content hash + size. Collision-resistant: SHA-256 prefix prevents basename conflicts. Idempotent: if identical hash already exists, returns existing path without re-copying |
| `fingerprint <file_path>` | JSON `{sha256, size, name}` | Compute content hash + size for dedup checks without copying |
| `orphans <wiki_path>` | JSON list | Pages with zero inbound wikilinks |
| `broken-links <wiki_path>` | JSON list | Wikilinks pointing to non-existent pages |
| `backlinks <wiki_path>` | JSON dict | Full backlink map: `{page: [linking pages]}` |
| `wikilinks <path>` | JSON list | Extract all `[[wikilinks]]` from file or directory |
| `frontmatter-check <wiki_path>` | JSON list | Pages with missing/malformed frontmatter |
| `page-list <wiki_path>` | JSON list | All `.md` pages (excluding `_`-prefixed) |

**Dedup identity**: SHA-256 content hash (not filename + byte size). Two files with same name but different content get distinct snapshots. Same content from different paths deduplicates correctly.

**Snapshot naming**: `wiki/raw/sources/<sha256_first8>-<original_filename>`. Example: `wiki/raw/sources/a1b2c3d4-module.py`. Preserves human-readable name while preventing collisions.

Security: same `SHELL_META` validation as `xlsx-writer.py`. Skip wikilinks inside fenced code blocks.

### Path Safety Contract

All user-supplied paths (`wiki_path`, `source_path`) enforced by both the helper script and skill instructions:

1. **Resolve symlinks** — `os.path.realpath()` before any operation
2. **Normalize** — collapse `..`, `.`, double slashes
3. **Confine to project root** — use path-aware containment, NOT string prefix:
   ```python
   from pathlib import Path
   candidate = Path(user_path).resolve()
   project_root = Path.cwd().resolve()
   candidate.relative_to(project_root)  # raises ValueError if not contained
   ```
   This prevents sibling-prefix bypass (e.g. `/repo-other` passing a check for `/repo`). Fail closed with clear error on ValueError.
4. **No escape** — after normalization, path must not traverse above project root. Symlinks resolved before containment check
5. **wiki_path default** — `wiki/` relative to project root. If user provides custom path, same confinement rules apply
6. **source_path** — must resolve to an existing file within project root. During ingest: source is read from original location (read-only) for analysis. After user confirmation, `wiki-tools.py snapshot` copies it into `wiki/raw/sources/<sha256_prefix>-<filename>` as immutable record. No wiki mutations occur before user approval

### Step 3: Init Skill + Command

**Command** (`commands/init.md`):
```yaml
---
description: Initialize an LLM Wiki (directory structure, schema, index, log)
argument-hint: "[wiki_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*), Read, Write
---
```

**Skill phases** (`skills/init/SKILL.md`):
1. Resolve wiki path (default: `wiki/`)
2. Check if exists — ask before reinitialize
3. Create directory scaffold (all 10 taxonomy directories)
4. Write `_schema.md` — taxonomy (10 buckets), naming conventions, frontmatter requirements, cross-ref rules, contradiction handling, tiebreaker rule: **when uncertain which bucket, route to `ideas/` with `status: raw`**
5. Write empty `_index.md` with section headers for all 10 taxonomy buckets
6. Write empty `_backlog.md` with priority sections (P0-P3)
7. Write `_log.md` with init entry
8. Report what was created

### Step 4: Ingest Skill + Command

**Command** (`commands/ingest.md`):
```yaml
---
description: Ingest a source document into the LLM Wiki
argument-hint: "<source_path> [wiki_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*), Read, Write
---
```

**Skill phases** (`skills/ingest/SKILL.md`):
1. **Validate & fingerprint** — wiki exists? Read `_schema.md`. Locate source file (must be within project root per Path Safety Contract). Run `wiki-tools.py fingerprint <source_path>` to get SHA-256 hash + size. Check `_log.md` for matching hash (dedup). If duplicate found, warn user and ask: re-ingest or skip. **No files copied yet.**
2. **Analyze source** — read source from its **original location** (read-only). Extract across all taxonomy types: entities, concepts, topics, raw ideas, plugin refs, platform notes, project context, decision implications, code patterns. Supported source types:
   - **Markdown / plain text** — full content extraction (default)
   - **Source code files** (`.py`, `.ts`, `.js`, `.sh`, etc.) — treated as text. LLM extracts: module purpose, public exports/functions, key patterns, dependencies, API surface. Creates `code/` pages with structured documentation. Detected by file extension; no explicit flag needed
3. **Plan wiki updates** — present table (CREATE/UPDATE, page name, type, reason). Raw/ambiguous extractions go to `ideas/` with `status: raw`. Clear, well-defined extractions go directly to their taxonomy bucket. **Wait for user confirmation. No wiki mutations before this point.**
4. **Snapshot source** — after user confirms, run `wiki-tools.py snapshot <source_path> <wiki_path>` to copy source into `wiki/raw/sources/<sha256_prefix>-<filename>`. This is the first write operation. If user cancels at Phase 3, nothing was written.
5. **Create/update pages** — YAML frontmatter, structured content, `[[wikilinks]]`, `## Sources` section referencing the snapshot path. Contradictions get `> [!conflict]` callouts (never silently overwrite)
6. **Cross-reference pass** — run `backlinks` script, add missing wikilinks in prose
7. **Update `_index.md`** — add/update entries, re-sort alphabetically, update page count
8. **Append to `_log.md`** — source SHA-256 hash, snapshot path, pages created/updated, conflicts flagged, ideas extracted
9. **Report** — structured summary + count of new ideas needing triage

### Step 5: Triage Skill + Command

**Command** (`commands/triage.md`):
```yaml
---
description: Triage raw ideas — promote to concepts/backlog or archive
argument-hint: "[wiki_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*), Read, Write
---
```

**Skill phases** (`skills/triage/SKILL.md`):
1. **Load ideas** — scan `ideas/` for pages with `status: raw`. Read `_backlog.md` for context on existing priorities
2. **Present for triage** — show each idea with summary, source, extracted claims. For each, ask user:
   - **Promote** → move to appropriate taxonomy bucket (concepts/, plugins/, decisions/, etc.), update type + status in frontmatter
   - **Backlog** → add entry to `_backlog.md` with priority (P0-P3), link to idea page, update `status: backlogged`
   - **Archive** → update `status: archived`, add `archive_reason` to frontmatter, leave in `ideas/` (don't delete)
3. **Execute decisions** — move/update files per user choices, update cross-references
4. **Update `_index.md`** — reflect promotions (move entries from Ideas to target section)
5. **Update `_backlog.md`** — add new backlog entries, re-sort by priority
6. **Log** — append triage entry with counts (promoted, backlogged, archived)

**`_backlog.md` format:**
```markdown
---
title: Backlog
updated: 2026-05-06
---

# Backlog

## P0 — Critical
- [[Plugin Hot-Reload]] — needed for dev workflow (#plugin, #dx) — from [[Source: Dev Meeting Notes]]

## P1 — High
- [[Cross-Platform Schema]] — unify plugin format across platforms (#architecture)

## P2 — Medium

## P3 — Low
```

### Step 6: Query Skill + Command

**Command** (`commands/query.md`):
```yaml
---
description: Query the LLM Wiki — synthesize answer with citations
argument-hint: "<question> [wiki_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*), Read, Write
---
```

**Skill phases** (`skills/query/SKILL.md`):
1. **Load context** — read `_schema.md` + `_index.md`
2. **Find relevant pages** — keyword match in index, follow link graph one hop, tag match. Read 3-15 pages
3. **Synthesize answer** — cite with `[[Page Name]]`, surface conflicts, note gaps
4. **Offer to file** — if answer is a useful aggregation, offer to save as new wiki page (user picks taxonomy bucket)
5. **Log** — append query entry to `_log.md`

### Step 7: Lint Skill + Command

**Command** (`commands/lint.md`):
```yaml
---
description: Health-check the LLM Wiki
argument-hint: "[wiki_path]"
allowed-tools: Bash(python3 "${CLAUDE_PLUGIN_ROOT}/scripts/wiki-tools.py":*), Read, Write
---
```

**Skill phases** (`skills/lint/SKILL.md`):
1. **Structural checks** — run `orphans`, `broken-links`, `frontmatter-check` via script
2. **Index drift** — compare `_index.md` entries vs files on disk
3. **Content quality** (LLM-driven) — unresolved conflicts, stale pages (>90 days), missing wikilinks in prose, thin pages (<3 sentences), duplicates
4. **Stale ideas** — flag `ideas/` pages with `status: raw` older than 14 days as needing triage
5. **Generate report** — Errors / Warnings / Info sections + health score (0-100)
6. **Offer auto-fix** — missing index entries, missing wikilinks, orphan resolution
7. **Log** — append lint entry

### Step 8: Evals

One `evals.json` per skill (ingest, triage, query, lint). Assertions covering:
- **Ingest**: page created with valid frontmatter, index updated, log updated, wikilinks present, ideas extracted to `ideas/`
- **Triage**: promoted ideas moved to correct bucket, backlog updated, archived ideas keep `archive_reason`
- **Query**: answer has `[[citations]]`, pages consulted exist, log updated
- **Lint**: report has severity sections, orphans/broken-links correctly detected, stale ideas flagged, log updated

### Step 9: README + Registration

- `plugins/llm-wiki/README.md` — pipeline diagram, usage examples, security model
- Update `/.claude-plugin/marketplace.json` — add llm-wiki plugin entry
- Update `/.claude/settings.json` — enable plugin

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Separate plugin vs in qa-ai | Separate `llm-wiki` plugin | Orthogonal domain, independent lifecycle |
| Platform | Claude Code first | Port to ChatGPT/Codex later |
| Wiki scope | One per project | Simpler routing, covers primary use case |
| Page naming | Title Case With Spaces | Obsidian-native `[[wikilink]]` resolution |
| Cross-references | `[[wikilinks]]` (Obsidian-style) | Bidirectional, graph-viewable |
| Contradiction handling | `> [!conflict]` callouts | Never silently overwrite — user resolves |
| Source format v1 | Markdown, plain text, and source code files | Zero external dependencies; code files read as text |
| Schema location | `wiki/_schema.md` (user's project) | User can customize per wiki |
| Helper script | stdlib-only Python | Matches qa-ai zero-dep pattern |
| Confirmation gate | Ingest Phase 3 (plan table) | User approves before any writes |
| Idea lifecycle | `ideas/` → triage → promote/backlog/archive | Raw ideas captured fast, refined deliberately |

### Taxonomy (10 Buckets)

| Directory | Type | What goes here |
|-----------|------|----------------|
| `ideas/` | idea | Raw, untriaged ideas extracted from sources or conversations |
| `concepts/` | concept | Promoted ideas; abstract principles, patterns, techniques |
| `entities/` | entity | Named things: people, orgs, products, places |
| `topics/` | topic | Broader subject areas aggregating concepts + entities |
| `plugins/` | plugin | Plugin specs, design docs, implementation notes |
| `platforms/` | platform | Platform-specific docs (Claude Code, ChatGPT, Codex, etc.) |
| `projects/` | project | Project pages: goals, status, timelines, dependencies |
| `decisions/` | decision | ADRs: context, decision, consequences, status |
| `code/` | code | Source code docs: modules, APIs, patterns, architecture notes |
| `sources/` | source | One summary page per ingested raw source |

---

## Wiki Page Format

Every wiki page has YAML frontmatter + structured content.

**Standard page:**
```markdown
---
title: Machine Learning
type: concept
tags: [ai, ml, statistics]
created: 2026-05-06
updated: 2026-05-06
source_count: 2
aliases: [ML]
---

# Machine Learning

Content with [[wikilinks]] to related pages...

## Sources
- [[Source - Paper on Transformers]]
```

**Idea page** (extra fields for lifecycle):
```markdown
---
title: Plugin Hot-Reload Mechanism
type: idea
status: raw | backlogged | promoted | archived
tags: [plugin, dx]
created: 2026-05-06
updated: 2026-05-06
source_count: 1
promoted_to: concepts/Plugin Hot-Reload.md  # set on promote
archive_reason: "duplicate of [[Existing Concept]]"  # set on archive
---
```

**Decision page** (ADR format):
```markdown
---
title: ADR-001 Use Obsidian Wikilinks
type: decision
status: accepted | proposed | deprecated | superseded
tags: [architecture, tooling]
created: 2026-05-06
updated: 2026-05-06
---

# ADR-001: Use Obsidian Wikilinks

## Context
...

## Decision
...

## Consequences
...
```

**Type enum:** `idea | concept | entity | topic | plugin | platform | project | decision | code | source`

---

## Critical Files to Modify

| File | Action |
|------|--------|
| `/.claude-plugin/marketplace.json` | Add llm-wiki entry |
| `/.claude/settings.json` | Enable llm-wiki plugin |

## Critical Files to Reference

| File | Why |
|------|-----|
| `plugins/qa-ai/skills/extract/SKILL.md` | Multi-phase skill pattern, frontmatter, confirmation gates |
| `plugins/qa-ai/commands/extract.md` | Command delegation pattern, allowed-tools syntax |
| `plugins/qa-ai/scripts/xlsx-writer.py` | Pinned helper script pattern, path validation, security |
| `plugins/qa-ai/.claude-plugin/plugin.json` | Manifest template |

---

## Verification

1. **Init**: Run `/llm-wiki:init` → verify directory scaffold (10 taxonomy dirs), `_schema.md`, `_index.md`, `_log.md`, `_backlog.md` created
2. **Ingest markdown**: Drop markdown in `wiki/raw/sources/`, run `/llm-wiki:ingest <path>` → verify pages created, index updated, log updated, wikilinks present, raw ideas in `ideas/`
3. **Ingest source code**: Run `/llm-wiki:ingest src/module.py` → verify file copied to `wiki/raw/sources/module.py`, then `code/` page created with module structure, exports, patterns
4. **Triage**: After ingest produces raw ideas → run `/llm-wiki:triage` → promote one (verify moved to target bucket, `status: promoted`, `promoted_to` set), backlog one (verify `_backlog.md` entry added), archive one (verify `status: archived` + `archive_reason`, file stays in `ideas/`)
5. **Query**: Run `/llm-wiki:query "question"` → verify answer has `[[citations]]`, log updated
6. **Lint**: Run `/llm-wiki:lint` → verify report generated, orphans/broken-links detected, stale ideas flagged
7. **Idempotency**: Re-ingest same source → verify no duplicate pages or index entries
8. **Contradiction**: Ingest conflicting source → verify `[!conflict]` callout added, not silent overwrite
9. **Path safety — sibling prefix**: Run `/llm-wiki:init /project-other/wiki` from `/project` → verify rejected (not contained)
10. **Path safety — symlink escape**: Create symlink `wiki/raw/sources/escape → /etc/passwd`, run ingest → verify rejected after symlink resolution
11. **Path safety — traversal**: Run `/llm-wiki:ingest ../../outside-file.md` → verify rejected
12. **Obsidian**: Open wiki directory in Obsidian → verify wikilinks resolve, graph view shows connections
