# jx-kb — LLM-Maintained Knowledge Base Plugin for Claude Code

A personal knowledge base where the LLM incrementally builds and maintains a persistent wiki. Based on [Karpathy's LLM Wiki pattern](https://github.com/karpathy/llm-wiki).

## Pipeline

```
raw source → [/jx-kb:ingest] → wiki pages (entities, concepts, ideas, code...)
                                        ↓
                                  [/jx-kb:triage] → promote / backlog / archive
                                        ↓
                                  [/jx-kb:query] → synthesized answers with [[citations]]
                                        ↓
                                  [/jx-kb:lint] → health report + auto-fixes
```

## Requirements

- **Python 3** (stdlib only — no external dependencies)

## Commands

### `/jx-kb:init`

Initialize a wiki directory structure.

```
/jx-kb:init
/jx-kb:init my-wiki/
```

Creates: 10 taxonomy directories, `_schema.md`, `_index.md`, `_log.md`, `_backlog.md`.

### `/jx-kb:ingest`

Ingest a source document into the wiki.

```
/jx-kb:ingest raw/articles/research-paper.md
/jx-kb:ingest src/module.py
```

**What it does:**
1. Fingerprints source (SHA-256) for dedup
2. Analyzes content — extracts entities, concepts, ideas, code patterns
3. Presents planned wiki changes for user confirmation
4. Snapshots source into `wiki/raw/sources/` (first write, after confirmation)
5. Creates/updates wiki pages with cross-references
6. Updates index and log

**Supported sources:** Markdown, plain text, source code files (`.py`, `.ts`, `.js`, `.sh`, etc.)

### `/jx-kb:triage`

Review and classify raw ideas.

```
/jx-kb:triage
```

**What it does:**
1. Scans `ideas/` for `status: raw` pages
2. Presents each idea for classification
3. User decides: promote (to concept/entity/etc), backlog (with priority), or archive

### `/jx-kb:query`

Query the wiki with natural language.

```
/jx-kb:query "What is the relationship between X and Y?"
```

**What it does:**
1. Searches index for relevant pages
2. Reads pages and follows link graph
3. Synthesizes answer with `[[citations]]`
4. Optionally files answer back as a new wiki page

### `/jx-kb:lint`

Health-check the wiki.

```
/jx-kb:lint
```

**What it does:**
1. Finds orphan pages, broken links, frontmatter issues
2. Detects index drift, stale claims, unresolved conflicts
3. Flags ideas stuck in `status: raw` for >14 days
4. Generates report with health score (0-100)
5. Offers auto-fixes for common issues

## Wiki Structure

```
wiki/
├── _schema.md       # LLM configuration
├── _index.md        # Content catalog
├── _log.md          # Operation log
├── _backlog.md      # Prioritized backlog
├── ideas/           # Raw ideas (inbox)
├── concepts/        # Promoted ideas, patterns
├── entities/        # People, orgs, products
├── topics/          # Broader subject areas
├── plugins/         # Plugin specs
├── platforms/       # Platform docs
├── projects/        # Project pages
├── decisions/       # ADRs
├── code/            # Source code docs
├── sources/         # Source summaries
└── raw/sources/     # Immutable source copies
```

## Plugin Structure

```
jx-kb/
├── .claude-plugin/plugin.json
├── commands/              # Slash commands (/jx-kb:*)
├── skills/                # Skill logic (multi-phase instructions)
│   ├── init/
│   ├── ingest/
│   ├── triage/
│   ├── query/
│   └── lint/
├── scripts/
│   └── wiki-tools.py      # Pinned helper (stdlib-only)
├── agents/                # Custom subagents (future)
├── hooks/                 # Lifecycle hooks (future)
├── prompts/               # Shared prompt fragments (future)
├── schemas/               # Output schemas (future)
└── README.md
```

## Security

- No broad interpreter permissions (`python3:*`, `node:*`)
- Python execution pinned to `scripts/wiki-tools.py` only
- All paths validated: symlink resolution, normalization, project-root confinement
- Path containment uses `Path.relative_to()` (not string prefix — immune to sibling-prefix bypass)
- Shell metacharacter rejection on all user-supplied paths
- No wiki mutations before user confirmation gate

## Obsidian Compatibility

- `[[wikilinks]]` for cross-references (resolves natively in Obsidian)
- YAML frontmatter on all pages (compatible with Dataview plugin)
- `> [!conflict]` callouts (renders as Obsidian callout blocks)
- Graph view shows full knowledge graph
- Aliases in frontmatter for alternate page names

## Uninstall

```bash
/plugin uninstall jx-kb@jodex-plugins
```
