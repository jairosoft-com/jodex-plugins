# Plan: Rebrand Plugins to jx Namespace

## Context

All three marketplace plugins should follow a unified `jx-*` naming convention. `jx-pm` already uses it. This plan renames `qa-ai` → `jx-qa` and `llm-wiki` → `jx-kb`. Pre-release, sole developer, hard cutover — no aliases needed.

## Decisions

| Question | Decision |
|----------|----------|
| Wiki page names | Descriptive: `QA Testing Plugin.md`, `Knowledge Base Plugin.md` (matches jx-pm style) |
| Wiki wikilinks | `[[QA Testing Plugin\|jx-qa]]`, `[[Knowledge Base Plugin\|jx-kb]]` |
| Source pages | Rename all source files with old names in filename (16 file renames) |
| Source `raw_path:` | Update ALL 36 source pages that reference old plugin paths (dynamic worklist) |
| `ai_docs/llm-wiki.md` | Keep as-is (documents Karpathy pattern, not plugin) |
| `Source - LLM Wiki.md` | Keep as-is (refers to upstream concept, not plugin) |

## Replacement Safety Rules

**Scoped replacements only** — never blind find-replace `qa-ai` or `llm-wiki` across entire repo.

| Token | Replace when... | Do NOT replace when... |
|-------|----------------|----------------------|
| `qa-ai` | Plugin slug, slash command prefix, `plugins/qa-ai/` path, manifest name, settings key | Part of repo name `jodex-qa-ai` |
| `llm-wiki` | Plugin slug, slash command prefix, `plugins/llm-wiki/` path, manifest name, settings key | Karpathy pattern ref in `ai_docs/llm-wiki.md`, `Source - LLM Wiki.md` concept page |
| `QA AI` | Wiki page title, wikilink target | — |
| `LLM Wiki` | Wiki page title, wikilink target | `Source - LLM Wiki.md` (Karpathy concept) |

**Negative checks after replacement** — grep for corrupted slugs:
```bash
grep -rn "jodex-jx-qa\|jodex-jx-kb\|karpathy/jx-kb" --include="*.md" --include="*.json" .
```
Expected: zero hits.

## Commit Strategy

Two commits, but the split keeps plugin resolution intact at every commit:
1. **Commit 1 (atomic runtime rename)**: Directory `git mv` + plugin.json + marketplace.json + settings files — all together so plugin triad is never broken
2. **Commit 2 (docs/wiki)**: All content changes — READMEs, commands, skills, wiki pages, source pages, ai_docs

---

## Phase 1: Atomic Runtime Rename (Commit 1)

All steps in this phase land in one commit. Plugin resolution works at every commit boundary.

### 1.1 Directory renames
```bash
git mv plugins/qa-ai plugins/jx-qa
git mv plugins/llm-wiki plugins/jx-kb
```

### 1.2 Plugin manifests (same commit)
- `plugins/jx-qa/.claude-plugin/plugin.json`: `"name": "jx-qa"`, description: `"QA Harness: extract E2E test cases from BRDs, generate Playwright specs, automate browser interactions."`
- `plugins/jx-kb/.claude-plugin/plugin.json`: `"name": "jx-kb"`

### 1.3 Marketplace manifest (same commit)
`.claude-plugin/marketplace.json`:
- qa-ai entry: name → `jx-qa`, source → `./plugins/jx-qa`, updated description
- llm-wiki entry: name → `jx-kb`, source → `./plugins/jx-kb`

### 1.4 Settings files (same commit)
`.claude/settings.json`:
- `"qa-ai@jodex-plugins"` → `"jx-qa@jodex-plugins"`
- `"llm-wiki@jodex-plugins"` → `"jx-kb@jodex-plugins"`

`.claude/settings.local.json`:
- `"qa-ai@jodex-plugins"` → `"jx-qa@jodex-plugins"`
- `"llm-wiki@jodex-plugins"` → `"jx-kb@jodex-plugins"`
- `"Skill(llm-wiki:query)"` → `"Skill(jx-kb:query)"`
- `"Skill(llm-wiki:lint)"` → `"Skill(jx-kb:lint)"`

---

## Phase 2: Wiki File Renames (Commit 2 start)

### 2.1 Wiki plugin page renames
```bash
git mv "wiki/plugins/QA AI.md" "wiki/plugins/QA Testing Plugin.md"
git mv "wiki/plugins/LLM Wiki.md" "wiki/plugins/Knowledge Base Plugin.md"
```

### 2.2 Wiki idea file rename
```bash
git mv "wiki/ideas/Align qa-ai Generate Tool Contract.md" "wiki/ideas/Align jx-qa Generate Tool Contract.md"
```

### 2.3 Source page filename renames (16 files)
```bash
# QA AI sources (5)
git mv "wiki/sources/Source - QA AI README.md" "wiki/sources/Source - JX QA README.md"
git mv "wiki/sources/Source - QA AI Agents Directory.md" "wiki/sources/Source - JX QA Agents Directory.md"
git mv "wiki/sources/Source - QA AI Hooks Directory.md" "wiki/sources/Source - JX QA Hooks Directory.md"
git mv "wiki/sources/Source - QA AI Prompts Directory.md" "wiki/sources/Source - JX QA Prompts Directory.md"
git mv "wiki/sources/Source - QA AI Schemas Directory.md" "wiki/sources/Source - JX QA Schemas Directory.md"

# LLM Wiki sources (11, excluding "Source - LLM Wiki.md" which stays — Karpathy concept)
git mv "wiki/sources/Source - LLM Wiki README.md" "wiki/sources/Source - JX KB README.md"
git mv "wiki/sources/Source - LLM Wiki Prompts Directory.md" "wiki/sources/Source - JX KB Prompts Directory.md"
git mv "wiki/sources/Source - LLM Wiki Schemas Directory.md" "wiki/sources/Source - JX KB Schemas Directory.md"
git mv "wiki/sources/Source - llm-wiki Agents Guide.md" "wiki/sources/Source - jx-kb Agents Guide.md"
git mv "wiki/sources/Source - llm-wiki Hooks Guide.md" "wiki/sources/Source - jx-kb Hooks Guide.md"
git mv "wiki/sources/Source - llm-wiki Ingest Command.md" "wiki/sources/Source - jx-kb Ingest Command.md"
git mv "wiki/sources/Source - llm-wiki Init Command.md" "wiki/sources/Source - jx-kb Init Command.md"
git mv "wiki/sources/Source - llm-wiki Lint Command.md" "wiki/sources/Source - jx-kb Lint Command.md"
git mv "wiki/sources/Source - llm-wiki Query Command.md" "wiki/sources/Source - jx-kb Query Command.md"
git mv "wiki/sources/Source - llm-wiki Triage Command.md" "wiki/sources/Source - jx-kb Triage Command.md"
```

---

## Phase 3: Plugin Content (~23 files, still Commit 2)

### 3.1 jx-qa plugin (was qa-ai)
Scoped replace in files under `plugins/jx-qa/` only:
- `/qa-ai:` → `/jx-qa:` (slash commands)
- `qa-ai` → `jx-qa` when used as plugin slug (NOT inside `jodex-qa-ai`)
- `Qa.Ai Harness:` → `QA Harness:` (description)

Files: README.md, commands/{extract,generate,test,browser}.md, skills/generate/SKILL.md

**Command mapping note**: Skill dir is `playwright-cli` but command file is `browser.md`. Slash command is `/jx-qa:browser` (not `/jx-qa:playwright-cli`). The command file name determines the slash command.

### 3.2 jx-kb plugin (was llm-wiki)
Scoped replace in files under `plugins/jx-kb/` only:
- `/llm-wiki:` → `/jx-kb:` (slash commands)
- `llm-wiki` → `jx-kb` when used as plugin slug

Files: README.md, commands/{init,ingest,lint,query,triage}.md, skills/*/SKILL.md (5 skills)

### 3.3 ABOUT.md cross-references (4 files under jx-kb)
- `See qa-ai plugin` → `See jx-qa plugin`

---

## Phase 4: Wiki Content (~60 files, still Commit 2)

### 4.1 Wikilink replacements (project-wide in wiki/)
| Find | Replace |
|------|---------|
| `[[QA AI]]` | `[[QA Testing Plugin\|jx-qa]]` |
| `[[LLM Wiki]]` | `[[Knowledge Base Plugin\|jx-kb]]` |
| `[[Align qa-ai Generate Tool Contract]]` | `[[Align jx-qa Generate Tool Contract]]` |
| All 16 renamed source page wikilinks | Updated to match new filenames |

### 4.2 Prose/path replacements in wiki/ (scoped, not blind)
- `/qa-ai:` → `/jx-qa:`
- `/llm-wiki:` → `/jx-kb:`
- `plugins/qa-ai/` → `plugins/jx-qa/`
- `plugins/llm-wiki/` → `plugins/jx-kb/`

### 4.3 Frontmatter updates in renamed pages
Each renamed wiki page: update `title:`, `aliases:`, `tags:`, heading

### 4.4 Source page `raw_path:` and path updates (36 files — dynamic worklist)
Generate worklist dynamically:
```bash
rg -l 'raw_path: plugins/(qa-ai|llm-wiki)|Original path.*plugins/(qa-ai|llm-wiki)' wiki/sources/
```
Update ALL matched files — `raw_path:` and `**Original path**:` fields.
Replace `plugins/qa-ai/` → `plugins/jx-qa/` and `plugins/llm-wiki/` → `plugins/jx-kb/` in these fields.

### 4.5 Manual review files (not safe for blind replace)
- `wiki/_schema.md` line 101 — prose rewrite (`qa-ai, llm-wiki` → `jx-qa, jx-kb`)
- `wiki/concepts/Naming Ripple Effect.md` — `qa-ai` used as example; update examples to use new names
- `wiki/ideas/Rebrand Skills to jx Namespace.md` — update status to `promoted` or `completed`, fix slash command mapping (`/jx-qa:browser` not `/jx-qa:playwright-cli`)

### 4.6 `wiki/_log.md` — append new entry (do NOT rewrite history)

---

## Phase 5: Top-Level Files (still Commit 2)

### 5.1 Root README.md (~15 references)
- All qa-ai slash commands → jx-qa (note: `/jx-qa:browser`, not `/jx-qa:playwright-cli`)
- Install/uninstall examples updated
- Plugin paths updated
- Keep `jodex-qa-ai` repo name references unchanged

### 5.2 ai_docs/ — selective
- `ai_docs/claude_desktop_wsl_integration.md`: Only replace plugin-specific refs (`/qa-ai:`, `plugins/qa-ai/`). Keep `jodex-qa-ai` repo name intact.
- `ai_docs/claude_cli_vs_desktop_mcp_guide.md`: Keep `jodex-qa-ai` repo/MCP server refs unchanged.
- `ai_docs/llm-wiki.md`: NO changes (Karpathy pattern doc)

---

## Excluded Surfaces

| Surface | Reason |
|---------|--------|
| `wiki/raw/sources/*` | Immutable snapshots |
| `wiki/_log.md` history | Audit trail, append only |
| `.obsidian/workspace.json` | Auto-regenerated |
| `.claude/worktrees/*` | Stale worktree |
| `.claude/data/sessions/*` | Historical |
| `Source - LLM Wiki.md` | Karpathy concept, not plugin |
| `ai_docs/llm-wiki.md` | Upstream pattern doc |
| `jodex-qa-ai` (repo name) | Repo slug, not a plugin name |

---

## Verification

Split into plugin-identity checks (must be zero) and concept-reference checks (allowed).

### 1. Plugin identity checks (ALL must return zero hits)

These tokens are unambiguously plugin identifiers. No legitimate reason to survive the rename.

```bash
# Old plugin slugs in actionable positions (slash commands, install coords, settings keys)
grep -rn '/qa-ai:\|/llm-wiki:\|qa-ai@\|llm-wiki@\|Skill(qa-ai\|Skill(llm-wiki' \
  --include="*.md" --include="*.json" . \
  | grep -v "wiki/raw/sources/" | grep -v "wiki/_log.md" \
  | grep -v ".agent/" | grep -v ".obsidian/" \
  | grep -v "worktrees/" | grep -v "sessions/"

# Old plugin paths (directory references)
grep -rn 'plugins/qa-ai\|plugins/llm-wiki' \
  --include="*.md" --include="*.json" . \
  | grep -v "wiki/raw/sources/" | grep -v "wiki/_log.md" \
  | grep -v ".agent/" | grep -v ".obsidian/" \
  | grep -v "worktrees/" | grep -v "sessions/"

# Old plugin manifest names (standalone, not inside jodex-qa-ai)
grep -rn '"name": "qa-ai"\|"name": "llm-wiki"' \
  --include="*.json" . \
  | grep -v "worktrees/" | grep -v "sessions/"

# Old description branding
grep -rn 'Qa\.Ai' --include="*.md" --include="*.json" . \
  | grep -v "wiki/raw/sources/" | grep -v "wiki/_log.md" \
  | grep -v ".agent/" | grep -v "worktrees/" | grep -v "sessions/"
```

### 2. Wiki page identity checks (must return zero hits)

Old wiki page names as wikilink targets — these should all be renamed.

```bash
grep -rn '\[\[QA AI\]\]\|\[\[LLM Wiki\]\]' \
  --include="*.md" . \
  | grep -v "wiki/raw/sources/" | grep -v "wiki/_log.md" \
  | grep -v ".agent/" | grep -v "worktrees/" \
  | grep -v "Source - LLM Wiki.md"
```

### 3. Corruption check (must return zero hits)

Catch blind-replace damage to repo name or upstream references.

```bash
grep -rn 'jodex-jx-qa\|jodex-jx-kb\|karpathy/jx-kb' --include="*.md" --include="*.json" .
```

### 4. Concept reference audit (allowed — review only)

"LLM Wiki" as an upstream pattern name (Karpathy's concept) is intentionally preserved. This check lists them for human review — hits are expected and OK.

```bash
# Expected hits: ai_docs/llm-wiki.md, Source - LLM Wiki.md,
# Knowledge Management.md, Vannevar Bush.md, and wiki plugin page prose
# referencing the upstream pattern
grep -rn 'LLM Wiki' --include="*.md" . \
  | grep -v "wiki/raw/sources/" | grep -v "wiki/_log.md" \
  | grep -v ".agent/" | grep -v "worktrees/" | grep -v "sessions/" \
  | grep -v '\[\[LLM Wiki\]\]'
```

Every hit must be a conceptual/pattern reference, NOT a plugin identifier. If any hit contains a slash command, plugin path, install instruction, or settings key — it's a missed rename.

### 5. Structural validation
- Plugin triad consistency (directory = plugin.json name = marketplace.json entry)
- Settings files reference new names
- Wiki broken-link check (all wikilink targets resolve to existing files)

---

## Estimate

~110 files touched, 2 directory renames, ~18 file renames

## Fixes Applied from Adversarial Reviews

### Round 1
| Finding | Fix |
|---------|-----|
| [high] Blind replacement corrupts `jodex-qa-ai` | Scoped replacements only + negative corruption check |
| [high] Commit 1 breaks plugin resolution | Directory moves atomic with manifest+settings in one commit |
| [medium] Source metadata under-scoped (16 vs 36) | Dynamic worklist via `rg`, update all 36 matches |
| [medium] Verification excludes ai_docs/claude | Removed blanket exclusion, only filter `jodex-qa-ai` repo name |
| [medium] `/jx-qa:playwright-cli` doesn't exist | Fixed to `/jx-qa:browser` (command file = `browser.md`) |

### Round 2
| Finding | Fix |
|---------|-----|
| [high] `jodex-qa-ai` line filter masks stale plugin IDs | Replaced single grep with token-specific checks — no whole-line filtering |
| [medium] `LLM Wiki` concept vs plugin conflict | Split verification into plugin-identity checks (zero-hit) and concept audit (review-only) |
