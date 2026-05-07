---
name: init
user-invocable: true
argument-hint: "[wiki_path]"
description: >
  Initialize a new LLM Wiki directory structure. Creates taxonomy directories,
  _schema.md, _index.md, _log.md, and _backlog.md. Triggers on: "initialize wiki",
  "create wiki", "set up knowledge base", "init llm wiki", or /llm-wiki:init.
  Do not trigger for ingest, query, lint, or triage operations.
---

# Initialize LLM Wiki

Create a persistent knowledge base directory with taxonomy structure, schema, index, log, and backlog.

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|
| `wiki_path` | No | `wiki/` | Relative to project root. Must pass path safety contract |

## Phase 1: Resolve Wiki Path

Default: `wiki/` relative to project root.

If user provides a custom path, validate it:
- Must be within project root (use `wiki-tools.py` path confinement rules)
- Reject absolute paths outside project root
- Reject paths with `..` that escape project root

If wiki path already exists (check for `_schema.md`), stop and ask:
"Wiki already exists at `<path>`. Reinitialize? This resets `_schema.md` but preserves existing pages."

Do not proceed until user confirms.

## Phase 2: Create Directory Scaffold

Create the following directories (all 10 taxonomy buckets + raw sources):

```
<wiki_path>/
├── ideas/
├── concepts/
├── entities/
├── topics/
├── plugins/
├── platforms/
├── projects/
├── decisions/
├── code/
├── sources/
└── raw/
    └── sources/
```

## Phase 3: Write `_schema.md`

Write the wiki configuration document. This file is read by the LLM at the start of every operation.

```markdown
---
title: Wiki Schema
wiki_name: "<ask user or default to directory name>"
version: 1
---

# Wiki Schema

## Taxonomy

### Ideas
Raw, untriaged ideas extracted from sources or conversations. Starting point for the idea lifecycle.
Directory: `ideas/`

### Concepts
Promoted ideas; abstract principles, patterns, techniques, methodologies.
Directory: `concepts/`

### Entities
Named, specific things: people, organizations, products, places, events, dates.
Directory: `entities/`

### Topics
Broader subject areas that aggregate multiple entities and concepts.
Directory: `topics/`

### Plugins
Plugin specifications, design documents, implementation notes.
Directory: `plugins/`

### Platforms
Platform-specific documentation (Claude Code, ChatGPT, Codex, etc.).
Directory: `platforms/`

### Projects
Project pages: goals, status, timelines, dependencies.
Directory: `projects/`

### Decisions
Architectural Decision Records (ADRs): context, decision, consequences, status.
Directory: `decisions/`

### Code
Source code documentation: modules, APIs, patterns, architecture notes found in the codebase.
Directory: `code/`

### Sources
One summary page per ingested raw source document.
Directory: `sources/`

## Page Conventions

### Naming
- Title Case With Spaces (e.g., `Machine Learning.md`)
- Sanitize only filesystem-illegal characters: / \ : * ? " < > |
- Obsidian resolves `[[Machine Learning]]` to `Machine Learning.md`

### Required Frontmatter
title: Page Title
type: idea | concept | entity | topic | plugin | platform | project | decision | code | source
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
source_count: <number of raw sources that contributed>
aliases: [alternate name]

Additional fields by type:
- Ideas: status (raw | backlogged | promoted | archived), promoted_to, archive_reason
- Decisions: status (proposed | accepted | deprecated | superseded)

### Cross-References
- `[[Page Name]]` for page links
- `[[Page Name#Section]]` for heading links
- `[[Page Name|Display Text]]` for aliased display text
- Every page should have at least one inbound and one outbound link

### Contradiction Handling
When new info contradicts existing claims, add a conflict callout:
> [!conflict] <topic>
> [[Source A]] claims X.
> [[Source B]] claims Y.
> Needs resolution.

Never silently overwrite existing claims.

### Tiebreaker Rule
When uncertain which taxonomy bucket a piece of knowledge belongs in, route to `ideas/` with `status: raw`. The user will classify it during triage.

### Sources Section
Every wiki page ends with:
## Sources
- [[Source - Document Title]]

## Custom Rules
(User can add domain-specific rules here after initialization)
```

Ask the user for wiki name before writing. Default to the directory name if they skip.

## Phase 4: Write `_index.md`

```markdown
---
title: Wiki Index
updated: <today's date>
page_count: 0
---

# Wiki Index

## Ideas

_No ideas yet._

## Concepts

_No concepts yet._

## Entities

_No entities yet._

## Topics

_No topics yet._

## Plugins

_No plugins yet._

## Platforms

_No platforms yet._

## Projects

_No projects yet._

## Decisions

_No decisions yet._

## Code

_No code pages yet._

## Sources

_No sources yet._
```

## Phase 5: Write `_backlog.md`

```markdown
---
title: Backlog
updated: <today's date>
---

# Backlog

## P0 — Critical

## P1 — High

## P2 — Medium

## P3 — Low
```

## Phase 6: Write `_log.md`

```markdown
---
title: Wiki Log
---

# Wiki Log

## <today's date and time> — Init

- **Operation**: init
- **Wiki path**: <wiki_path>
- **Outcome**: Created wiki structure with 10 taxonomy buckets
- **Pages created**: _schema.md, _index.md, _log.md, _backlog.md
```

## Phase 7: Report

Print summary:

```
## Wiki Initialized

📁 Path: <wiki_path>
📂 Taxonomy: ideas, concepts, entities, topics, plugins, platforms, projects, decisions, code, sources
📄 System files: _schema.md, _index.md, _log.md, _backlog.md

Next: drop source files into <wiki_path>/raw/sources/ then run /llm-wiki:ingest <source_path>
```
