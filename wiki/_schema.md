---
title: Wiki Schema
wiki_name: "Jodex Plugin Skills"
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
- Obsidian resolves double-bracket page links to matching `.md` filenames, for example `Machine Learning` to `Machine Learning.md`

### Required Frontmatter
title: Page Title
type: idea | concept | entity | topic | plugin | platform | project | decision | code | source
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
source_count: <number of raw sources that contributed>
aliases: [alternate name]
provenance: source-derived | synthesis | model-derived

Additional fields by type:
- Ideas: status (raw | backlogged | promoted | archived), promoted_to, archive_reason
- Decisions: status (proposed | accepted | deprecated | superseded)

### Cross-References
- Use double-bracket page links for page references
- Use heading anchors for section references
- Use aliases for alternate display text
- Every page should have at least one inbound and one outbound link

### Contradiction Handling
When new info contradicts existing claims, add a conflict callout:
> [!conflict] <topic>
> Source A claims X.
> Source B claims Y.
> Needs resolution.

Never silently overwrite existing claims.

### Tiebreaker Rule
When uncertain which taxonomy bucket a piece of knowledge belongs in, route to `ideas/` with `status: raw`. The user will classify it during triage.

### Sources Section
Every wiki page ends with:
## Sources
- Source page links, for example Source - Document Title

## Custom Rules

### Plugin Component Taxonomy
Route as `concepts/`: Skill, Slash Command, Hook, Agent, Prompt, Plugin Manifest, Marketplace, MCP Server, MCP Tool

### Concrete Plugin Routing
Maintain one current page per plugin. Prefer new plugin pages in `plugins/`. Current concrete plugin inventory: jx-qa, jx-kb, jx-pm, jx-dev, jx-core

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

Pages created by `/jx-kb:ingest` default to `source-derived`. Query results filed back require explicit human action to set `synthesis`. No page may be set to `source-derived` without a corresponding source in `## Sources`.
