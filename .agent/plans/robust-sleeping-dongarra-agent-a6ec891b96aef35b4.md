# Phase 4 Plan: Wiki Content Updates

## Overview
Update wiki markdown file **contents** for the `qa-ai` → `jx-qa` and `llm-wiki` → `jx-kb` rename. Phase 2 already renamed the files; this phase updates references, wikilinks, paths, and frontmatter inside those files.

**Exclusions**: `wiki/raw/sources/` (immutable), `wiki/_log.md` historical entries (append-only).

---

## 4.1 Wikilink Replacements

### `[[QA AI]]` → `[[QA Testing Plugin|jx-qa]]`
**20 occurrences in 19 files:**
- wiki/topics/QA Test Automation.md (1)
- wiki/topics/Browser Automation.md (1)
- wiki/_index.md (1) — also needs prose update in the listing description
- wiki/entities/Playwright.md (1)
- wiki/ideas/Align jx-qa Generate Tool Contract.md (2)
- wiki/ideas/Rebrand Skills to jx Namespace.md (1) — inside checklist prose, will be checked off in 4.5
- wiki/sources/Source - Extract SKILL Sequence.md (1)
- wiki/sources/Source - Playwright CLI SKILL.md (1)
- wiki/projects/Jodex Plugin Marketplace.md (3)
- wiki/projects/Product Management Skills Plugin.md (1)
- wiki/code/xlsx-writer.py.md (1)
- wiki/code/Creating a Skill.md (1)
- wiki/concepts/Semantic Locator.md (1)
- wiki/concepts/Polyglot Dependency Strategy.md (1)
- wiki/concepts/Marketplace.md (1)
- wiki/concepts/Plugin Metadata Surfaces.md (2)
- wiki/concepts/E2E Test Case.md (1)
- wiki/concepts/Pinned Helper.md (1)
- wiki/concepts/Test Code Generation.md (1)

### `[[LLM Wiki]]` → `[[Knowledge Base Plugin|jx-kb]]`
**17 occurrences in 14 files** (only plugin references — NOT Karpathy concept):
- wiki/topics/Plugin Dogfooding Workflow.md (2)
- wiki/_index.md (1) — line 104, plugin listing
- wiki/entities/Obsidian.md (1) — section heading "## [[LLM Wiki]] Plugin Compatibility"
- wiki/sources/Source - Ingest SKILL.md (1)
- wiki/sources/Source - JX KB README.md (1) — line 24 "[[LLM Wiki]] plugin overview"
- wiki/code/wiki-tools.py.md (1)
- wiki/projects/Jodex Plugin Marketplace.md (4)
- wiki/concepts/Pinned Helper.md (1)
- wiki/concepts/Polyglot Dependency Strategy.md (1)
- wiki/concepts/Plugin Metadata Surfaces.md (1)
- wiki/concepts/User Confirmation Gate.md (1)
- wiki/concepts/Marketplace.md (1)
- wiki/concepts/Path Confinement.md (1)

**MUST NOT replace** — these are NOT plugin references:
- `wiki/sources/Source - LLM Wiki.md` — Karpathy concept source, not plugin. Contains `[[Source - LLM Wiki]]` in _index.md line 141; do not touch.
- `wiki/ideas/Rebrand Skills to jx Namespace.md` line 42 — inside a checklist string showing old name, will be handled as checked-off item in 4.5.
- `wiki/topics/Knowledge Management.md` — mentions "The LLM Wiki pattern" (plain text, no wikilink) — leave as-is.
- `wiki/entities/Vannevar Bush.md` — mentions "LLM Wiki pattern" (plain text) — leave as-is.
- `wiki/plugins/Knowledge Base Plugin.md` line 14 — "Based on Karpathy's LLM Wiki pattern" (plain text) — leave as-is.

### `[[Align qa-ai Generate Tool Contract]]` → `[[Align jx-qa Generate Tool Contract]]`
**5 occurrences in 5 files:**
- wiki/topics/Plugin Dogfooding Workflow.md (1)
- wiki/_index.md (1) — line 13
- wiki/_backlog.md (1) — line 14
- wiki/concepts/Plugin Metadata Surfaces.md (1)
- wiki/projects/Jodex Plugin Marketplace.md (1)

### Source page wikilink renames (16 pairs)
Replace old `[[Source - X]]` wikilinks with new names across all wiki .md files (excluding raw/ and _log.md historical entries). Each pair:

| Old | New |
|-----|-----|
| `[[Source - QA AI README]]` | `[[Source - JX QA README]]` |
| `[[Source - QA AI Agents Directory]]` | `[[Source - JX QA Agents Directory]]` |
| `[[Source - QA AI Hooks Directory]]` | `[[Source - JX QA Hooks Directory]]` |
| `[[Source - QA AI Prompts Directory]]` | `[[Source - JX QA Prompts Directory]]` |
| `[[Source - QA AI Schemas Directory]]` | `[[Source - JX QA Schemas Directory]]` |
| `[[Source - LLM Wiki README]]` | `[[Source - JX KB README]]` |
| `[[Source - LLM Wiki Prompts Directory]]` | `[[Source - JX KB Prompts Directory]]` |
| `[[Source - LLM Wiki Schemas Directory]]` | `[[Source - JX KB Schemas Directory]]` |
| `[[Source - llm-wiki Agents Guide]]` | `[[Source - jx-kb Agents Guide]]` |
| `[[Source - llm-wiki Hooks Guide]]` | `[[Source - jx-kb Hooks Guide]]` |
| `[[Source - llm-wiki Ingest Command]]` | `[[Source - jx-kb Ingest Command]]` |
| `[[Source - llm-wiki Init Command]]` | `[[Source - jx-kb Init Command]]` |
| `[[Source - llm-wiki Lint Command]]` | `[[Source - jx-kb Lint Command]]` |
| `[[Source - llm-wiki Query Command]]` | `[[Source - jx-kb Query Command]]` |
| `[[Source - llm-wiki Triage Command]]` | `[[Source - jx-kb Triage Command]]` |

Locations: mainly in wiki/_index.md (15 occurrences), wiki/plugins/QA Testing Plugin.md, wiki/plugins/Knowledge Base Plugin.md, wiki/concepts/*.md, wiki/sources/*.md (cross-references between source pages), wiki/entities/*.md.

**MUST NOT touch**: `[[Source - LLM Wiki]]` (Karpathy concept source page, NOT a plugin source). Appears in _index.md line 141 and _backlog.md line 20.

---

## 4.2 Prose/Path Replacements

Apply in all wiki .md files (excluding `wiki/raw/*` and `wiki/_log.md`):

| Find | Replace | Notes |
|------|---------|-------|
| `/qa-ai:` | `/jx-qa:` | Slash command references |
| `/llm-wiki:` | `/jx-kb:` | Slash command references |
| `plugins/qa-ai/` | `plugins/jx-qa/` | Directory path references |
| `plugins/llm-wiki/` | `plugins/jx-kb/` | Directory path references |

**Affected files** (from rg scan): ~50 files across wiki/sources/, wiki/plugins/, wiki/code/, wiki/concepts/, wiki/_watchlist.md, wiki/_index.md, wiki/_schema.md, wiki/topics/, wiki/entities/.

Note: `wiki/_watchlist.md` has 36 occurrences of old paths — it tracks monitored directories and will need heavy updates.

---

## 4.3 Frontmatter Updates (3 renamed plugin/idea pages)

### wiki/plugins/QA Testing Plugin.md
```yaml
# BEFORE:
title: QA AI
tags: [testing, playwright, qa]
aliases: [qa-ai, qa-ai plugin]

# AFTER:
title: QA Testing Plugin
tags: [testing, playwright, jx-qa]
aliases: [jx-qa, jx-qa plugin, qa-ai]
```
Also update heading: `# QA AI` → `# QA Testing Plugin`

### wiki/plugins/Knowledge Base Plugin.md
```yaml
# BEFORE:
title: LLM Wiki
tags: [knowledge-base, wiki, llm]
aliases: [llm-wiki, llm-wiki plugin]

# AFTER:
title: Knowledge Base Plugin
tags: [knowledge-base, wiki, jx-kb]
aliases: [jx-kb, jx-kb plugin, llm-wiki]
```
Also update heading: `# LLM Wiki` → `# Knowledge Base Plugin`

### wiki/ideas/Align jx-qa Generate Tool Contract.md
```yaml
# BEFORE:
title: Align qa-ai Generate Tool Contract
tags: [qa-ai, tooling, security]
aliases: [qa-ai generate allowed tools mismatch]

# AFTER:
title: Align jx-qa Generate Tool Contract
tags: [jx-qa, tooling, security]
aliases: [jx-qa generate allowed tools mismatch]
```
Also update heading: `# Align qa-ai Generate Tool Contract` → `# Align jx-qa Generate Tool Contract`

---

## 4.4 Source Page Updates (36 files)

### raw_path updates (36 files)
All files matched by: `rg -l 'raw_path: plugins/(qa-ai|llm-wiki)|Original path.*plugins/(qa-ai|llm-wiki)' wiki/sources/`

Replace in each:
- `plugins/qa-ai/` → `plugins/jx-qa/`
- `plugins/llm-wiki/` → `plugins/jx-kb/`

These appear in both `raw_path:` frontmatter fields and `**Original path**:` prose lines.

### Title/aliases/tags updates (16 renamed source pages)
Files already renamed by Phase 2 but frontmatter still has old names:

**5 QA AI source pages** (tags: qa-ai → jx-qa, titles/headings update):
| File | Old title | New title |
|------|-----------|-----------|
| Source - JX QA README.md | Source - QA AI README | Source - JX QA README |
| Source - JX QA Agents Directory.md | Source - QA AI Agents Directory | Source - JX QA Agents Directory |
| Source - JX QA Hooks Directory.md | Source - QA AI Hooks Directory | Source - JX QA Hooks Directory |
| Source - JX QA Prompts Directory.md | Source - QA AI Prompts Directory | Source - JX QA Prompts Directory |
| Source - JX QA Schemas Directory.md | Source - QA AI Schemas Directory | Source - JX QA Schemas Directory |

**3 LLM Wiki source pages** (tags: llm-wiki → jx-kb, titles/headings update):
| File | Old title | New title |
|------|-----------|-----------|
| Source - JX KB README.md | Source - LLM Wiki README | Source - JX KB README |
| Source - JX KB Prompts Directory.md | Source - LLM Wiki Prompts Directory | Source - JX KB Prompts Directory |
| Source - JX KB Schemas Directory.md | Source - LLM Wiki Schemas Directory | Source - JX KB Schemas Directory |

**7 jx-kb command/guide source pages** (tags: llm-wiki → jx-kb, titles/headings update):
| File | Old title | New title |
|------|-----------|-----------|
| Source - jx-kb Agents Guide.md | Source - llm-wiki Agents Guide | Source - jx-kb Agents Guide |
| Source - jx-kb Hooks Guide.md | Source - llm-wiki Hooks Guide | Source - jx-kb Hooks Guide |
| Source - jx-kb Ingest Command.md | Source - llm-wiki Ingest Command | Source - jx-kb Ingest Command |
| Source - jx-kb Init Command.md | Source - llm-wiki Init Command | Source - jx-kb Init Command |
| Source - jx-kb Lint Command.md | Source - llm-wiki Lint Command | Source - jx-kb Lint Command |
| Source - jx-kb Query Command.md | Source - llm-wiki Query Command | Source - jx-kb Query Command |
| Source - jx-kb Triage Command.md | Source - llm-wiki Triage Command | Source - jx-kb Triage Command |

Also: 1 additional source page `Source - Browser Command.md` has `/qa-ai:browser` references that need `/jx-qa:browser` (covered by 4.2 prose replacements).

---

## 4.5 Manual Review Files

### wiki/_schema.md (line 101)
```
# BEFORE:
Each plugin gets own page in `plugins/`: qa-ai, llm-wiki

# AFTER:
Each plugin gets own page in `plugins/`: jx-qa, jx-kb
```

### wiki/concepts/Naming Ripple Effect.md
Update the case sensitivity section examples (lines 41-53) to use `jx-qa` as the current name while preserving the pattern documentation. Specifically:
- Line 41: `qa-ai` → `jx-qa` and `Qa-Ai` → `Jx-Qa` in case-sensitivity examples
- Lines 47-53: Update the three-location example from `qa-ai` to `jx-qa`
- Line 54: Convention example: `qa-ai` → `jx-qa`

**Note**: The marketplace rename example (lines 18, 60-64) is a historical event — leave as-is.

### wiki/ideas/Rebrand Skills to jx Namespace.md
- Change `status: backlogged` → `status: completed` in frontmatter
- Check off all checklist items: `- [ ]` → `- [x]`
- Update tags if needed (already has jx-namespace tag)

---

## 4.6 wiki/_log.md — Append New Entry

Append at the TOP (newest-first order, after the frontmatter and heading but before the first ## entry):

```markdown
## 2026-05-09T<current-time> — Rename

- **Operation**: rename
- **Changes**: `qa-ai` → `jx-qa`, `llm-wiki` → `jx-kb`
- **Scope**: plugin directories, manifests, wiki pages, source pages
- **Outcome**: Success — per [[Rebrand Skills to jx Namespace]]
```

Wait — the task says "Append a new entry at the end". But the log is reverse-chronological (newest first). **Clarification needed**: The existing log format places newest entries at the top. The task says "append at the end" which would place it at the bottom (oldest). I'll follow the task instruction literally and append at the end of the file, but flag this inconsistency.

---

## Flags / Ambiguities

1. **`_index.md` line 15 stale text**: The Rebrand Skills entry says "jx-brpd, jx-gen, jx-pw, jx-pm" which doesn't match the actual decision (jx-qa, jx-kb, jx-pm). This should be updated to match. Recommend: update the description to "Unify all plugins under jx-* naming: jx-qa, jx-kb, jx-pm".

2. **`_index.md` Plugins section prose**: Lines 104-105 have descriptive text. After wikilink replacement, line 104 would become `[[Knowledge Base Plugin|jx-kb]] — LLM-maintained knowledge base plugin for Claude Code`. The description phrase "LLM-maintained knowledge base" is still accurate conceptually (it IS maintained by LLM). Keep it? Or change to "Knowledge base plugin for Claude Code"?

3. **`_index.md` Code section line 127**: "Pinned helper script for LLM Wiki plugin" — this is plain text. Should it update to "jx-kb plugin"? The 4.2 replacements don't cover plain text "LLM Wiki" without brackets.

4. **`_index.md` Sources section lines 142, 171-179**: The `[[Source - LLM Wiki README]]` and `[[Source - llm-wiki * Command]]` entries need wikilink updates AND their descriptive text updated. E.g., "LLM Wiki plugin docs" → "JX KB plugin docs".

5. **`_index.md` Sources section lines 187-190**: The `[[Source - QA AI *]]` entries need wikilink updates AND descriptive text updates.

6. **`_backlog.md` line 14**: `[[Align qa-ai Generate Tool Contract]]` needs updating (covered in 4.1), but also has `(#qa-ai, #security)` tag text — should this update to `(#jx-qa, #security)`?

7. **`_backlog.md` line 17**: Rebrand idea — after status becomes "completed", should it be removed from backlog?

8. **Log entry position**: Task says "append at end" but log is reverse-chronological. Following task literally.

9. **`wiki/_schema.md` line 121**: Contains `/llm-wiki:ingest` — covered by 4.2 prose replacement.

---

## Execution Order

1. **4.1 wikilinks** — Use sed for bulk `[[Source - *]]` replacements; use Edit for `[[QA AI]]` and `[[LLM Wiki]]` (need context awareness for Karpathy exclusion).
2. **4.2 prose/paths** — sed across all eligible files.
3. **4.3 frontmatter** — Edit tool for 3 pages.
4. **4.4 source pages** — sed for raw_path/Original path, Edit for frontmatter of 16 renamed pages.
5. **4.5 manual files** — Edit tool for _schema.md, Naming Ripple Effect, Rebrand idea.
6. **4.6 log entry** — Append to _log.md.
7. **Verification** — rg to confirm no remaining old references (excluding raw/ and _log.md historical).

## Estimated File Count
~60-70 files will be modified.
