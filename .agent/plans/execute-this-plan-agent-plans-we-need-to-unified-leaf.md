# Execution Plan: JX Foundational Onboarding Promotion

## Context

Promoting `wiki/ideas/JX Foundational Onboarding.md` (status: backlogged, P2) to a full
code page. The idea captures shared prerequisite setup steps repeated independently in PM,
Dev, and QA onboarding docs. Promotion means: create the foundation doc, trim the 3 role
docs, rename the idea file, update metadata. Specification is in
`.agent/plans/we-need-to-build-magical-frost.md`.

## Pre-Flight State (verified)

| File | State |
|------|-------|
| `wiki/ideas/JX Foundational Onboarding.md` | EXISTS — status: backlogged |
| `wiki/code/JX Foundational Onboarding.md` | DOES NOT EXIST — safe to create |
| `wiki/ideas/JX Foundational Onboarding (Promoted).md` | DOES NOT EXIST — safe to create via git mv |
| `wiki/_index.md` | page_count: 219; idea entry at line 22 |
| `wiki/_backlog.md` | P2 entry at line 14 |

## Execution Order

### Phase A — Git Rename + Idea Frontmatter Update

1. `git mv "wiki/ideas/JX Foundational Onboarding.md" "wiki/ideas/JX Foundational Onboarding (Promoted).md"`
2. Edit renamed file frontmatter:
   - `title: JX Foundational Onboarding (Promoted)`
   - `status: promoted`
   - `promoted_to: [[JX Foundational Onboarding]]`

### Phase B — Create Foundation Code Page

**File:** `wiki/code/JX Foundational Onboarding.md`

**Strategy:** Write from scratch per spec. Extract/adapt (not copy verbatim) from:

| Section | Source | PM Lines |
|---------|--------|----------|
| Anthropic account | PM Onboarding | 40–67 |
| Claude Code CLI | PM Onboarding | 68–116 |
| Claude Code Desktop | PM Onboarding | 117–133 |
| Git SCM | PM Onboarding | 134–193 |
| GitHub account + CLI | PM Onboarding | 194–235 |
| Azure CLI | PM Onboarding | 236–303 |
| VS Code | PM Onboarding | 304–409 |
| Obsidian | PM Onboarding | 410–431 |
| ADO MCP | PM Onboarding | 543–653 |
| uv install | NEW — write from spec | — |
| Python 3 | NEW — write from spec | — |
| Node.js 20+ | NEW — write from spec | — |
| Azure DevOps account | NEW section — write from spec | — |
| GitHub Desktop | PM Onboarding (adapt) | ~within 194–235 |
| Jodex marketplace + jx-core + jx-kb | All 3 role docs | varies |
| Clone prerequisites | Dev Onboarding | ~148–180 |
| jx-kb:init wiki | All 3 role docs | varies |
| Verification Checklist | Extract from PM 654+, Dev 305+ | varies |
| Troubleshooting | Extract from PM 694+, Dev 340+ | varies |

**Key adaptations:**
- Anthropic ticket template: generalize `Product Owner` → `<Role>` placeholder
- Claude Code Desktop: must distinguish from Claude Desktop chat app explicitly
- GitHub Desktop: macOS/Windows only; Linux/WSL uses Git + GitHub CLI
- `/jx-kb:init wiki` warning block: must include "skip if _schema.md exists" note

**Frontmatter:**
```yaml
title: JX Foundational Onboarding
type: code
tags: [onboarding, setup, claude-code, git, github, python, nodejs, jx-kb, shared]
created: 2026-05-12
updated: 2026-05-12
source_count: 3
aliases: [Foundational Onboarding, Common Onboarding, Shared Onboarding, Base Onboarding]
provenance: synthesis
```

### Phase C — Update Role Docs

#### JX PM Onboarding (787 lines)

**Add prerequisite callout** after frontmatter, before intro paragraph:
```
> [!prerequisite] Complete [[JX Foundational Onboarding]] before continuing.
```

**Remove sections entirely:**
- `## Create Anthropic Account And Request Enterprise Access` (line 40)
- `## Install Claude Code CLI` (line 68)
- `## Install Claude Code Desktop` (line 117)
- `## Install Git SCM` (line 134)
- `## Set Up GitHub Access` (line 194)
- `## Install Azure CLI` (line 236)
- `## Install VS Code` (line 304)
- `## Install Obsidian` (line 410)
- `## Initialize The Project Wiki` (line 501)
- `## Optional MCP Server Setup` → `### Azure DevOps MCP` (line 543+)
- `## Optional MCP Server Setup` → `### GitHub MCP` (remove)

**Trim `## Install The Jodex Plugins`** (line 432):
- Remove: marketplace add + jx-core + jx-kb + first reload
- Keep: `/plugin install jx-pm@jodex-plugins` + `/reload-plugins`
- Add note: foundation owns marketplace/jx-core/jx-kb; do not install jx-dev/jx-qa manually

**Trim `## Prepare The Project Repo`** (line 464):
- Remove: generic git clone block
- Keep: Azure Repos URL, GitHub Desktop clone, GCM credential flow, feature folder convention, docs/{NNN}_{feature_name}/ rules (REQUIRED by /jx-pm:prd)

**Trim `## First Product Workflow`** (line 520):
- Remove: /jx-dev:spec, /jx-dev:task from PM command sequence
- Keep: /jx-pm:prd + /jx-pm:ado
- Add handoff note: PM hands off to Dev after PRD; returns for /jx-pm:ado after task.json exists

**Trim `## Tooling Checklist`** (line 18):
- Remove: all foundation-owned rows
- Keep: jx-pm plugin, Azure Repos access
- Add row: Foundation prerequisites → see [[JX Foundational Onboarding]]

**Trim `## Verification Checklist`** (line 654):
- Remove: all foundation-owned items
- Add: "Complete [[JX Foundational Onboarding#Verification Checklist]] first."
- Keep PM-specific: Azure Repos access, /jx-pm:prd + /jx-pm:pipeline + /jx-pm:ado visible, feature folder, /jx-pm:ado --dry-run

**Trim `## Troubleshooting`** (line 694):
- Remove: claude/git/gh shared rows
- Keep: Azure CLI, VS Code, GitHub Desktop, Obsidian, jx-pm, ADO MCP rows

#### JX Dev Onboarding (391 lines)

**Add prerequisite callout** after frontmatter.

**Remove sections entirely:**
- `## Install Claude Code CLI` (line 37–94)
- `## Install Claude Code Desktop` (line 95–119)
- `## Initialize Knowledge Base` (line 181–202)

**Trim `## Install The Jodex Plugins`** (line 120):
- Remove: marketplace add + jx-kb install + first reload
- Keep: jx-dev install + second /reload-plugins
- Add note: foundation owns marketplace + jx-kb

**Trim `## Prepare The Project Repo`** (line 148):
- Remove: generic clone block
- Keep: feature folder convention, gh auth status note, docs-root guidance

**Trim `## First Workflow`** (line 257):
- Remove: /jx-kb:init wiki from command sequence
- Starts with /jx-dev:spec directly

**Trim `## Tooling Checklist`** (line 20):
- Remove: foundation-owned rows (Claude Code CLI, Desktop, Git, GitHub, Python, Node.js, jx-kb, Azure DevOps account, Azure CLI, ADO MCP)
- Keep: jx-dev plugin
- Add Foundation row at top

**Trim `## Verification Checklist`** (line 305):
- Add: "Complete [[JX Foundational Onboarding#Verification Checklist]] first."
- Keep: jx-dev specific items

**Trim `## Troubleshooting`** (line 340):
- Remove: claude/desktop/git shared rows
- Keep: jx-dev, wiki init, Node.js/MCP, feature folder, ADO rows

#### JX QA Onboarding (171 lines)

**Add prerequisite callout** after frontmatter.

**Replace `## Prerequisites`** (line 18):
Replace entire section with Foundation reference + QA-specific additions (Node.js packages, Playwright browsers).

**Trim `## Git Setup`** (line 43) → rename to `## Repository Setup`:
- Remove: clone/init/branch commands
- Keep: .gitignore block, commit hygiene rules, QA directory scaffold (mkdir -p raw/articles test-plans tests)

**Trim `## Install Plugins`** (line 78):
- Remove: marketplace add + jx-kb install + first reload
- Keep: jx-qa install + second /reload-plugins
- Add note: foundation owns marketplace + jx-kb

**Remove `## Initialize Knowledge Base`** (line 104–117) entirely.

**Trim `## First Workflow`** (line 118):
- Remove: /jx-kb:init wiki
- Starts with /jx-qa:extract directly

**Add `## Verification Checklist`** before `## Reporting Issues`:
```markdown
## Verification Checklist

Complete [[JX Foundational Onboarding#Verification Checklist]] first, then verify:

- `/jx-qa:extract`, `/jx-qa:generate`, `/jx-qa:test` are visible commands.
- `python3 -c "import openpyxl"` succeeds.
- `npx playwright --version` succeeds.
- `npm run test` or `npx playwright test` runs without config errors.
- `raw/articles/` directory exists for BRD/PRD inputs.
- `test-plans/` directory exists for xlsx outputs.
- `tests/` directory exists for generated specs.
```

### Phase D — Update Wiki Metadata

**`wiki/_index.md`:**
- `page_count: 219` → `220` (new code page added)
- Replace Ideas entry `[[JX Foundational Onboarding]]` (line 22) with:
  `[[JX Foundational Onboarding (Promoted)]] — Shared prerequisite setup steps ... [promoted]`
- Add to Code section (after line 163, before Sources):
  `[[JX Foundational Onboarding]] — Shared prerequisite setup for all Jodex project roles: Claude Code, Git, GitHub CLI, uv, Python 3, Node.js 20+, jx-kb (#onboarding, #setup, #shared, #jx-kb)`

**`wiki/_backlog.md`:**
- Remove line 14: `- [[JX Foundational Onboarding]] — Extract common setup steps...`
- Update `updated: 2026-05-12` (already current)

## Critical Files

| File | Role |
|------|------|
| `wiki/ideas/JX Foundational Onboarding.md` | Source idea → git mv to Promoted |
| `wiki/code/JX PM Onboarding.md` | Content source + file to modify |
| `wiki/code/JX Dev Onboarding.md` | File to modify |
| `wiki/code/JX QA Onboarding.md` | File to modify |
| `wiki/_index.md` | Metadata update |
| `wiki/_backlog.md` | Remove completed entry |

## Verification

Run all checks from `.agent/plans/we-need-to-build-magical-frost.md` Verification section:

```bash
# Structural
test -f "wiki/code/JX Foundational Onboarding.md"
test -f "wiki/ideas/JX Foundational Onboarding (Promoted).md"
grep "^status: promoted" "wiki/ideas/JX Foundational Onboarding (Promoted).md"
grep "^promoted_to:" "wiki/ideas/JX Foundational Onboarding (Promoted).md"
test ! -f "wiki/ideas/JX Foundational Onboarding.md"
grep "^type: code" "wiki/code/JX Foundational Onboarding.md"
grep "prerequisite" "wiki/code/JX PM Onboarding.md"
grep "prerequisite" "wiki/code/JX Dev Onboarding.md"
grep "prerequisite" "wiki/code/JX QA Onboarding.md"

# Removal checks
grep "Create Anthropic Account" "wiki/code/JX PM Onboarding.md"  # expect: no match
grep "Install Claude Code CLI" "wiki/code/JX PM Onboarding.md"   # expect: no match
grep "/plugin install jx-dev\|/plugin install jx-qa" "wiki/code/JX PM Onboarding.md"  # expect: no match

# Addition checks
grep "Verification Checklist" "wiki/code/JX QA Onboarding.md"   # expect: match
grep "jx-pm:prd\|jx-pm:ado\|jx-pm:pipeline" "wiki/code/JX PM Onboarding.md"  # expect: match

# Metadata
awk '/^## Code/,/^## [A-Z]/' wiki/_index.md | grep "JX Foundational Onboarding"  # expect: match
grep "page_count: 220" wiki/_index.md  # expect: match
grep "JX Foundational Onboarding" wiki/_backlog.md  # expect: no match

# Wiki health
python3 plugins/jx-kb/scripts/wiki-tools.py orphans wiki
python3 plugins/jx-kb/scripts/wiki-tools.py broken-links wiki
python3 plugins/jx-kb/scripts/wiki-tools.py frontmatter-check wiki
```

## Deliberate Deviations From Source Spec

**page_count: magical-frost Verification check 14 contradicts itself.**
- Check 14 says: `value is still 219 (move, not add)` — WRONG/STALE in the spec
- Check 14b says: wiki-tools.py page count returns `220`
- Promotion creates a distinct new code page (new basename) → page_count increments to 220
- **This plan uses 220. Ignore check 14; use check 14b as authoritative.**

## Pre-Phase B: Batch Read PM Source Sections

Before writing the foundation doc (~400-600 lines), read ALL source ranges in one batch:
- PM lines 40–67 (Anthropic account)
- PM lines 68–116 (Claude Code CLI)
- PM lines 117–133 (Claude Code Desktop)
- PM lines 134–193 (Git SCM)
- PM lines 194–235 (GitHub account + CLI + GitHub Desktop)
- PM lines 236–303 (Azure CLI)
- PM lines 304–409 (VS Code — note: large range, may span other content)
- PM lines 410–431 (Obsidian)
- PM lines 543–653 (ADO MCP)

Read Dev Onboarding plugin install section (lines 120–147) and QA plugin install (lines 78–90) for jx-core/jx-kb install block.
Then compose the foundation doc in a single Write pass.

## Risks

1. **Optional MCP Server Setup header in PM** — Both subsections (Azure DevOps MCP + GitHub MCP) are removed. The parent `## Optional MCP Server Setup` header must ALSO be removed entirely (not left as empty section).
2. **Anthropic ticket template** — Must generalize `Product Owner` to `<Role>`. Read PM lines 40-67 carefully.
3. **PM First Workflow** — Must NOT remove /jx-pm:ado, only /jx-dev:spec + /jx-dev:task.
4. **QA directory scaffold** — `mkdir -p raw/articles test-plans tests` must stay in QA even though clone moves to foundation.
5. **jx-dev mentions in PM** — Handoff notes mentioning jx-dev are OK; only explicit `/plugin install jx-dev` is banned.
6. **git mv then edit renamed file** — After `git mv`, edit frontmatter using the NEW path `wiki/ideas/JX Foundational Onboarding (Promoted).md` — not the old path.
7. **QA `## Derived From`** (line 158) — Leave untouched. Spec doesn't address it; foundation uses `## Sources` for its own page.
