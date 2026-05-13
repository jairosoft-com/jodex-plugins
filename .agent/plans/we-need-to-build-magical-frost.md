# Plan: Promote JX Foundational Onboarding Idea → Code Page

## Context

`wiki/ideas/JX Foundational Onboarding.md` is a fully-groomed, adversarially-reviewed
idea (23 findings resolved across 5 rounds). It documents the shared prerequisite steps
that PM, Dev, and QA onboarding docs each repeat independently. Promoting it means:
writing the actual foundation doc, trimming the 3 role docs, and updating metadata.

---

## Files To Create

| File | Action |
|------|--------|
| `wiki/code/JX Foundational Onboarding.md` | **Create** — new foundation code page |
| `wiki/ideas/JX Foundational Onboarding (Promoted).md` | **Rename** via `git mv` from `wiki/ideas/JX Foundational Onboarding.md` — preserves idea lifecycle record per wiki schema |

The idea file is renamed (not deleted) to match the repo pattern for promoted ideas
(see: `wiki/ideas/Cross-Plugin Shared Convention Layer (Promoted).md`).
The code page is a separate new file. Both files coexist with distinct basenames —
no wikilink ambiguity.

## Files To Modify

| File | What changes |
|------|-------------|
| `wiki/code/JX Foundational Onboarding.md` | Replace idea content with full foundation doc (post-move) |
| `wiki/code/JX PM Onboarding.md` | Remove shared sections; add prerequisite callout; trim checklist + troubleshooting |
| `wiki/code/JX Dev Onboarding.md` | Remove shared sections; add prerequisite callout; trim checklist + troubleshooting |
| `wiki/code/JX QA Onboarding.md` | Remove shared sections; add prerequisite callout; add Verification Checklist section |
| `wiki/_index.md` | Move idea entry to Code section; page_count stays 219 (move, not add) |
| `wiki/_backlog.md` | Remove P2 `[[JX Foundational Onboarding]]` entry (work complete after promotion) |

---

## Accepted Design Decisions (do not re-raise in review)

| Decision | Rationale |
|----------|-----------|
| Azure DevOps account + Azure CLI + ADO MCP required for ALL roles | Team policy: all Gerasoft project members provision ADO access upfront. Simpler single onboarding path. Trust boundary expansion is accepted. |
| PM stops at PRD — hands off to Dev for spec/task | PM role boundary is PRD + ADO sync only. Dev owns TECH_SPEC.md and task.json. PM returns for /jx-pm:ado after Dev delivers task.json. |
| uv + Python 3 + Node.js 20+ required in foundation | Needed by ADO MCP npx, QA Playwright, and jx-kb helpers. Making them required avoids workflow failures when roles skip them. |
| Claude Code Desktop required (not optional) | All roles use the Code tab. Not optional. |

---

## Step 1 — Create `wiki/code/JX Foundational Onboarding.md` + Rename Idea File

**Step 1a:** Rename idea file to preserve lifecycle record:
```bash
git mv "wiki/ideas/JX Foundational Onboarding.md" "wiki/ideas/JX Foundational Onboarding (Promoted).md"
```
Then update frontmatter of the renamed idea file:
- `title:` → `JX Foundational Onboarding (Promoted)`
- `status:` → `promoted`
- `promoted_to:` → `[[JX Foundational Onboarding]]`

**Step 1b:** Create `wiki/code/JX Foundational Onboarding.md` as a new file with foundation doc content below.

### Frontmatter
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

### Section structure (in order)

1. **Intro paragraph** — who this is for, what it covers, ends with:
   "After completing this guide, proceed to your role-specific onboarding."

2. **## Tooling Checklist** — two-column table: Required vs Optional

   Required:
   - Anthropic account (Enterprise)
   - Claude Code CLI
   - Claude Code Desktop
   - Git SCM
   - GitHub account
   - Azure DevOps account (org invite, project access)
   - GitHub CLI (gh)
   - GitHub Desktop  ← macOS/Windows only; Linux/WSL uses Git + GitHub CLI instead
   - Azure CLI + azure-devops extension
   - Azure DevOps MCP
   - jx-core plugin
   - jx-kb plugin

   Required (editors + wiki):
   - VS Code (or equivalent: Project IDX, Cursor, etc.)  # code editor with GitHub sign-in
   - Obsidian              # wiki/ vault viewer

   Required (runtimes):
   - uv                    # Python tooling manager; required by QA + jx-kb helpers
   - Python 3              # via uv; required by QA + jx-kb helpers
   - Node.js 20+           # required by ADO MCP npx, QA Playwright, PM/Dev workflows

3. **## Create Anthropic Account And Request Enterprise Access**
   Source: PM onboarding lines 40–66 — adapt, do NOT copy verbatim.
   The PM ticket template identifies the user as "Product Owner" — wrong for Dev/QA.
   Generalize with `<Role>` placeholder in title, role, and reason fields:
   ```text
   Request: Add team member to Anthropic Enterprise
   User: <full name>
   Email: <user@gerasoft.example>
   Role: <Product Owner | Developer | QA Engineer>
   Project: <project name>
   Reason: Needs Claude Code access for Jodex project onboarding.
   Approver/contact: CHOF or Ramon
   ```
   Everything else (steps 1–7, security notes) adapts normally from PM source.

4. **## Install Claude Code CLI**
   Source: PM onboarding lines 68–115 (all platforms: macOS/Linux curl, Homebrew,
   Windows PowerShell, WinGet, verify commands)
   Note: keep Windows/WSL guidance from Dev onboarding

5. **## Install Claude Code Desktop**
   Source: PM onboarding lines 117–132
   Required — not optional. All roles install it.
   IMPORTANT: must explicitly distinguish Claude Code Desktop (Code tab,
   shared MCP/plugin settings) from Claude Desktop chat app (separate config)

6. **## Install Git SCM**
   Source: PM onboarding lines 136–192 (all platforms, identity config)

7. **## Set Up GitHub Account And GitHub CLI**
   Source: PM onboarding lines 194–234, GitHub account + GitHub CLI portions
   Mark GitHub CLI as required, not recommended

7b. **## Set Up Azure DevOps Account**
    NEW SECTION — not currently in any doc as a standalone step
    Content:
    - Accept Azure DevOps org invitation (from CHOF or Ramon)
    - Sign in at `https://dev.azure.com/<organization>`
    - Confirm target project and repo are visible under Repos → Files
    - Access level: Basic; group: Contributors (or Readers for read-only)
    - After `az login`, bind the tenant explicitly:
      ```bash
      az devops configure --defaults organization=https://dev.azure.com/<organization> project=<project>
      ```
    - Verify tenant binding: `az devops project show` (no --project flag; must use default)
    - Also verify: `az repos list --output table` shows the expected repo

8. **## Install uv**
   NEW CONTENT — Required for all roles
   - macOS/Linux: `curl -LsSf https://astral.sh/uv/install.sh | sh`
   - macOS Homebrew: `brew install uv`
   - Windows WinGet: `winget install --id=astral-sh.uv`
   - Verify: `uv --version`
   - Note: QA onboarding and jx-kb helper workflows require this; install now to save time

9. **## Install Python 3**
   NEW CONTENT — Required for all roles. Use system python3 + pip (not uv-managed shims).
   - macOS: `brew install python3` or use system Python 3 (pre-installed on macOS 12+)
   - Windows: `winget install Python.Python.3` or download from https://python.org/downloads
   - Linux/WSL: `sudo apt-get install python3 python3-pip` (Debian/Ubuntu)
   - Verify: `python3 --version` (must return Python 3.x)
   - Verify pip: `python3 -m pip --version`
   - Note: role docs add role-specific packages via `python3 -m pip install <package>`
   - Note: jx-qa pinned helper calls `python3` directly — this must be the interpreter
     that has role-specific packages installed. Use `python3 -m pip`, not bare `pip`,
     to ensure packages install into the correct interpreter.
   - Note: uv (installed in section 8) is used for project-level Python management by
     jx-kb helper workflows; it does NOT replace the system python3 for jx-qa direct calls.

10. **## Install Node.js 20+**
    Required for all roles — needed by ADO MCP npx, QA Playwright, PM/Dev workflows
    All platforms:
    - macOS: `brew install node`
    - Windows: `winget install OpenJS.NodeJS.LTS`
    - Verify: `node --version` (must be 20+), `npm --version`
    - Note: role docs specify required packages on top

11. **## Install GitHub Desktop**
    Source: PM onboarding GitHub Desktop section (previously PM-only; now foundation)
    - Download from https://desktop.github.com
    - macOS + Windows only; Linux uses Git + GitHub CLI (already covered)
    - Authenticate with the GitHub account created in section 7
    - Recommended for all roles; required by PM Azure Repos clone workflow

12. **## Install Azure CLI**
    Source: PM onboarding Install Azure CLI section (previously PM-only; now foundation)
    - All platforms: macOS Homebrew, Windows WinGet, Linux/WSL curl
    - Install azure-devops extension: `az extension add --name azure-devops`
    - Authenticate: `az login`; verify: `az account show`
    - Required by PM Azure Repos workflow; useful for Dev ADO scripting

13. **## Install VS Code**
    Source: PM onboarding Install VS Code section — Required for all roles
    - Download from https://code.visualstudio.com/download
    - Sign in with GitHub account; enable Settings Sync
    - Verify: `code --version`
    - Note: acceptable alternatives include Project IDX (Google) or other editors
      with GitHub integration — document chosen editor in team wiki

14. **## Install Obsidian**
    Source: PM onboarding Install Obsidian section — Required for all roles
    - Download from https://obsidian.md/download
    - Open project `wiki/` folder as vault (NOT repo root)
    - Verify: wikilinks and graph view resolve correctly

15. **## Set Up Azure DevOps MCP**
    Source: PM onboarding Optional MCP Server Setup → Azure DevOps MCP (previously PM-optional; now foundation)
    - Prerequisites: Node.js 20+ (already installed), Azure CLI authenticated + defaults configured
    - Install using `--authentication azcli` to reuse the already-verified Azure CLI session:
      ```bash
      claude mcp add azure-devops --scope user -- npx -y @azure-devops/mcp <organization> --authentication azcli -d core work work-items search
      ```
    - Verify: `claude mcp list`, `claude mcp get azure-devops`, then `/mcp` in Claude Code
    - Confirm correct tenant: ask Claude Code to list Azure DevOps projects — must show the
      same org/project as `az devops configure --defaults` above
    - First ADO use must be dry-run: `/jx-pm:ado --dry-run --docs-root docs`

16. **## Register Jodex Marketplace, Install jx-core And jx-kb**
    Source: all three role docs (install blocks) + jx-core is universal dependency
    ```
    /plugin marketplace add jairosoft-com/jodex-plugins
    /plugin install jx-core@jodex-plugins
    /plugin install jx-kb@jodex-plugins
    /reload-plugins
    ```
    Note: jx-core is universal — required by jx-pm, jx-dev, jx-qa. Installing it in
    foundation means all roles share the same core conventions baseline.
    Note: this is the FIRST /reload-plugins; role docs do a SECOND reload
    after their role-specific plugin install

17. **## Clone Project Repo And Create Working Branch**
    Foundation covers PREREQUISITES only — does NOT execute the clone.
    Content:
    - Explain that clone execution is role-specific:
      - PM: Azure Repos + GitHub Desktop + GCM credential flow (see JX PM Onboarding)
      - Dev/QA: generic `git clone <repo-url>` + `git switch -c <branch>`
    - Verify Git and GitHub CLI are ready: `git --version`, `gh auth status`
    - "Your role-specific onboarding will walk you through the actual clone step."
    Note: do NOT include a clone command in foundation — PM users must use the Azure
    credential flow documented in JX PM Onboarding, not a bare git clone.

18. **## Initialize Wiki**
    Source: all three role docs (identical step)
    ```
    /jx-kb:init wiki
    ```
    ⚠️ **Warning block required in doc:**
    "If `wiki/_schema.md` already exists, the wiki has already been initialized.
    Do NOT run `/jx-kb:init wiki` again — it will prompt to reset schema files
    and can overwrite existing wiki structure. Skip this step and proceed to
    your role-specific onboarding."

19. **## Verification Checklist**
    Shared items extracted from PM/Dev checklists:
    - `claude --version` succeeds
    - `claude doctor` succeeds
    - Anthropic account uses Gerasoft email + added to Enterprise by CHOF or Ramon
    - `git --version` succeeds
    - `git config --global user.name` and `user.email` return correct identity
    - GitHub account exists, verified email, 2FA/SSO satisfied
    - `gh auth status` succeeds
    - Azure DevOps account confirmed: org + project + repo visible
    - `uv --version` succeeds
    - `python3 --version` returns Python 3.x
    - `python3 -m pip --version` succeeds
    - `node --version` returns 20+, `npm --version` succeeds
    - macOS/Windows: GitHub Desktop installed and authenticated with GitHub account
    - Linux/WSL: skip GitHub Desktop; Git + GitHub CLI covers clone/branch/PR workflow
    - `az --version` succeeds; `az account show` returns active subscription
    - `az extension show --name azure-devops` succeeds
    - `code --version` succeeds
    - Obsidian opens project `wiki/` as vault
    - `claude mcp list` includes `azure-devops`
    - `/mcp` in Claude Code shows azure-devops connected
    - `/reload-plugins` completed after jx-core + jx-kb install
    - `/jx-kb:init`, `/jx-kb:ingest`, `/jx-kb:query`, `/jx-kb:lint` visible
    - `wiki/_schema.md` exists
    - `git --version` and `gh auth status` confirm Git + GitHub CLI ready for clone
    - (Actual clone executed in role-specific onboarding, not here)

20. **## Troubleshooting**
    Shared diagnostic rows extracted from PM + Dev troubleshooting tables:
    - `claude: command not found` → fix
    - `claude doctor` fails → fix
    - Desktop Code tab unavailable / asks to upgrade → fix
    - Desktop 403/auth errors → fix
    - Windows Desktop local session fails (Git missing) → fix
    - `git: command not found` → fix
    - Commits show wrong author → fix
    - `gh auth status` fails → fix
    - GitHub account / 2FA / SSO issues → fix
    - `/jx-kb:*` commands missing → fix

21. **## Related Patterns**
    - [[Layered Developer Onboarding]]
    - [[Identity And Access Ladder]]
    - [[Executable Setup Documentation]]

22. **## Sources**
    - [[JX PM Onboarding]]
    - [[JX Dev Onboarding]]
    - [[JX QA Onboarding]]

---

## Step 2 — Update `wiki/code/JX PM Onboarding.md`

### Add at top (after frontmatter, before intro paragraph)
```
> [!prerequisite] Complete [[JX Foundational Onboarding]] before continuing.
```

### Remove these sections entirely
- `## Create Anthropic Account And Request Enterprise Access` (foundation owns it)
- `## Install Claude Code CLI` (foundation owns it)
- `## Install Claude Code Desktop` (foundation owns it)
- `## Install Git SCM` (foundation owns it)
- `## Set Up GitHub Access` (foundation owns GitHub account + CLI + GitHub Desktop)
- `## Install Azure CLI` (foundation owns it)
- `## Install VS Code` (foundation owns it)
- `## Install Obsidian` (foundation owns it)
- `## Initialize The Project Wiki` (foundation runs /jx-kb:init wiki)
- `## Optional MCP Server Setup` → `### Azure DevOps MCP` (foundation owns it)
- `## Optional MCP Server Setup` → `### GitHub MCP` (Docker Desktop removed; out of scope)

### Modify these sections

**`## Install The Jodex Plugins`** — trim to jx-pm only
Remove: marketplace add + jx-core + jx-kb + first reload (foundation owns all)
Remove: jx-dev fallback note (PM role does NOT install jx-dev or jx-qa)
Keep only:
```
/plugin install jx-pm@jodex-plugins
/reload-plugins
```
Add note: "Foundation already registered the marketplace and installed jx-core and jx-kb.
Do not run /plugin install jx-dev or /plugin install jx-qa manually — those belong to
Dev and QA roles respectively. jx-dev is installed automatically as a jx-pm dependency;
PM users will see /jx-dev:spec and /jx-dev:task commands but should not run them directly
— those belong to the Dev role handoff."

**`## Prepare The Project Repo`** — keep Azure Repos flow + feature-folder convention
Remove: generic git clone block (foundation owns)
Keep:
- Azure Repos URL, GitHub Desktop clone, GCM credential flow
- `docs/{NNN}_{feature_name}/` convention, example folder, three-digit ID rule
  (CRITICAL: these rules are required by `/jx-pm:prd` and downstream Dev workflows;
  do NOT remove them even though generic clone moves to foundation)

**`## First Product Workflow`** — PM stops at PRD; hand off to Dev
Before: `/jx-kb:init wiki` → `/jx-pm:prd` → `/jx-dev:spec` → `/jx-dev:task` → `/jx-pm:ado`
After:
```
/jx-pm:prd --mode lite --docs-root docs
```
Add explicit handoff note after /jx-pm:prd step:
"After PRD is reviewed, hand off to the Dev role to generate TECH_SPEC.md and task.json
using /jx-dev:spec and /jx-dev:task. Return here to run /jx-pm:ado once task.json exists."
PM still owns /jx-pm:ado — it runs AFTER Dev delivers task.json.
Remove: /jx-dev:spec and /jx-dev:task from PM workflow command sequence entirely.

**`## Tooling Checklist`** — replace all shared rows with Foundation reference
Remove rows: Claude Code CLI, Claude Code Desktop, Git SCM, GitHub account,
GitHub CLI, Python 3, Node.js, GitHub Desktop, Azure CLI, VS Code, Obsidian,
Azure DevOps MCP, marketplace, jx-core, jx-kb (all foundation-owned)
Keep rows: jx-pm plugin, Azure Repos access (project-specific)
Add row at top: Foundation prerequisites | see [[JX Foundational Onboarding]]

**`## Verification Checklist`** — replace shared items with Foundation link
Remove: all foundation-owned items (claude, git, gh, python, node, GitHub Desktop,
Azure CLI, VS Code, Obsidian, jx-kb, ADO MCP — all verified in foundation)
Add at top: "Complete [[JX Foundational Onboarding#Verification Checklist]] first."
Keep PM-specific items only:
- Azure Repos access confirmed (project + repo visible in DevOps portal)
- `/jx-pm:prd`, `/jx-pm:pipeline`, `/jx-pm:ado` visible
- Feature folder matches `docs/{NNN}_{feature_name}/`
- `/jx-pm:ado --dry-run` succeeds before any live ADO sync
Remove: jx-dev:spec / jx-dev:task check (PM does NOT install jx-dev)

**`## Troubleshooting`** — remove shared diagnostic rows
Remove: claude/git/gh rows that are now in Foundation troubleshooting
Keep: Azure CLI, VS Code, GitHub Desktop, Obsidian, jx-pm, ADO MCP rows

---

## Step 3 — Update `wiki/code/JX Dev Onboarding.md`

### Add at top
```
> [!prerequisite] Complete [[JX Foundational Onboarding]] before continuing.
```

### Remove these sections entirely
- `## Install Claude Code CLI` (foundation owns it)
- `## Install Claude Code Desktop` (foundation owns it)
- `## Initialize Knowledge Base` (foundation runs /jx-kb:init wiki)

### Modify these sections

**`## Install The Jodex Plugins`** — trim to role-specific only
Remove: marketplace add + jx-kb install + first reload (foundation owns)
Keep: jx-dev install + second /reload-plugins (+ optional jx-pm install)
Add note: "Foundation already registered the marketplace and installed jx-kb."

**`## Prepare The Project Repo`** — remove generic clone block (foundation owns)
Keep: feature folder convention, gh auth status note, docs-root guidance

**`## First Workflow`** — remove `/jx-kb:init wiki` from command sequence
Starts with `/jx-dev:spec` directly

**`## Tooling Checklist`** — replace shared rows with Foundation reference
Remove: Claude Code CLI, Claude Code Desktop, Git, GitHub, Python, Node.js, jx-kb,
Azure DevOps account, Azure CLI, ADO MCP (all foundation-owned; required, not optional)
Keep: jx-dev plugin
Add Foundation row at top: "Foundation prerequisites | see [[JX Foundational Onboarding]]"

**`## Verification Checklist`** — replace shared items with Foundation link
Add: "Complete [[JX Foundational Onboarding#Verification Checklist]] first."
Keep: jx-dev specific items (feature folder, PRD.md, TECH_SPEC.md, task.json, ADO MCP)

**`## Troubleshooting`** — remove shared rows
Remove: claude/desktop/git rows (now in Foundation)
Keep: jx-dev, wiki init, Node.js/MCP, feature folder, ADO rows

---

## Step 4 — Update `wiki/code/JX QA Onboarding.md`

### Add at top
```
> [!prerequisite] Complete [[JX Foundational Onboarding]] before continuing.
```

### Remove / replace these sections

**`## Prerequisites`** — replace with Foundation reference
Replace entire section with:
"See [[JX Foundational Onboarding]] for shared prerequisites (Claude Code, Git,
GitHub, uv, Python 3, Node.js 20+). QA-specific additions: Node.js packages,
Playwright browsers."

**`## Git Setup`** — trim clone/init/branch; keep .gitignore + QA directory scaffold
Remove: clone/init/branch commands (foundation owns)
Keep:
- .gitignore block and commit hygiene rules
- Explicit creation of QA-specific directories (foundation does NOT create these):
  ```bash
  mkdir -p raw/articles test-plans tests
  ```
  These are required before `/jx-qa:extract`, `/jx-qa:generate`, and test output work.
Rename to: `## Repository Setup`

**`## Install Plugins`** — trim to jx-qa only
Remove: marketplace add + jx-kb install + first reload (foundation owns)
Keep: jx-qa install + second /reload-plugins
Add note: "Foundation already registered the marketplace and installed jx-kb."

**`## Initialize Knowledge Base`** — REMOVE ENTIRELY
(foundation runs /jx-kb:init wiki)

**`## First Workflow`** — remove /jx-kb:init wiki
Starts with /jx-qa:extract directly

### Add new section: `## Verification Checklist`
Insert before `## Reporting Issues`:
```
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

---

## Step 5 — Update Wiki Metadata

**`wiki/ideas/JX Foundational Onboarding (Promoted).md`** — renamed from original idea file
- `title:` → `JX Foundational Onboarding (Promoted)`
- `status: promoted`
- `promoted_to: [[JX Foundational Onboarding]]`

**`wiki/_index.md`**
- `page_count: 219` → `page_count: 220` (rename creates distinct basename = one new maintained page)
- Replace idea entry `[[JX Foundational Onboarding]]` with `[[JX Foundational Onboarding (Promoted)]] — ... [promoted]`
- Add to `## Code` section:
  `[[JX Foundational Onboarding]] — Shared prerequisite setup for all Jodex project roles: Claude Code, Git, GitHub CLI, uv, Python 3, Node.js 20+, jx-kb (#onboarding, #setup, #shared, #jx-kb)`

**`wiki/_backlog.md`**
- Remove the P2 entry: `- [[JX Foundational Onboarding]] — Extract common setup steps...`
- Update `updated:` date to 2026-05-12

---

## Source References (for content extraction)

| Content | Source file | Approx lines |
|---------|------------|-------------|
| Enterprise access section | `wiki/code/JX PM Onboarding.md` | 40–66 |
| Claude Code CLI section | `wiki/code/JX PM Onboarding.md` | 68–115 |
| Claude Code Desktop section | `wiki/code/JX PM Onboarding.md` | 117–132 |
| Git SCM section | `wiki/code/JX PM Onboarding.md` | 136–192 |
| GitHub account + CLI | `wiki/code/JX PM Onboarding.md` | 194–234 |
| uv install | NEW — not in existing docs | — |
| Python 3 via uv | NEW — not in existing docs | — |
| Node.js 20+ | NEW as required step | — |
| Jodex marketplace + jx-kb | All three role docs | varies |
| Generic repo clone | `wiki/code/JX Dev Onboarding.md` | ~148–156 |
| /jx-kb:init wiki | All three role docs | varies |
| Shared troubleshooting rows | PM + Dev troubleshooting tables | varies |

---

## Verification

### Structural checks
1. `test -f "wiki/code/JX Foundational Onboarding.md"` → exits 0 (code page exists)
2. `test -f "wiki/ideas/JX Foundational Onboarding (Promoted).md"` → exits 0 (idea record preserved)
2b. `grep "^status: promoted" "wiki/ideas/JX Foundational Onboarding (Promoted).md"` → match
2c. `grep "^promoted_to:" "wiki/ideas/JX Foundational Onboarding (Promoted).md"` → non-empty
2d. `test ! -f "wiki/ideas/JX Foundational Onboarding.md"` → exits 0 (original idea file renamed, not kept)
3. `grep "^type: code" "wiki/code/JX Foundational Onboarding.md"` → match
4. `grep "prerequisite" "wiki/code/JX PM Onboarding.md"` → callout present
5. `grep "prerequisite" "wiki/code/JX Dev Onboarding.md"` → callout present
6. `grep "prerequisite" "wiki/code/JX QA Onboarding.md"` → callout present

### Removal checks
7. `grep "Create Anthropic Account" "wiki/code/JX PM Onboarding.md"` → no match (removed)
8. `grep "Install Claude Code CLI" "wiki/code/JX PM Onboarding.md"` → no match (removed)
9. `grep "/plugin install jx-dev\|/plugin install jx-qa" "wiki/code/JX PM Onboarding.md"` → no match (PM does NOT manually install jx-dev or jx-qa)
   Note: mentions of jx-dev in handoff notes and dependency explanations are acceptable;
   only explicit `/plugin install jx-dev` commands are banned from PM doc.

### Addition checks
10. `grep "Verification Checklist" "wiki/code/JX QA Onboarding.md"` → match (added)
11. `grep "jx-pm:prd\|jx-pm:ado\|jx-pm:pipeline" "wiki/code/JX PM Onboarding.md"` → match (PM commands present)

### Index + metadata checks
12. `awk '/^## Code/,/^## [A-Z]/' wiki/_index.md | grep "JX Foundational Onboarding"` → match (in Code section)
13. `awk '/^## Ideas/,/^## [A-Z]/' wiki/_index.md | grep "JX Foundational Onboarding"` → match only `(Promoted)` variant, NOT bare `[[JX Foundational Onboarding]]`
14. `grep "page_count" wiki/_index.md` → value is still 219 (move, not add)
14b. `python3 plugins/jx-kb/scripts/wiki-tools.py page-list wiki | python3 -c "import sys,json; pages=json.load(sys.stdin); print(len(pages))"` → 220
15. Ticket template in foundation doc contains `<Role>` placeholder — NOT "Product Owner"
15b. `grep "JX Foundational Onboarding" wiki/_backlog.md` → no match (removed from backlog)

### Wiki health check
16. Run these three helper commands (pinned helper at `plugins/jx-kb/scripts/wiki-tools.py`):
    ```bash
    python3 plugins/jx-kb/scripts/wiki-tools.py orphans wiki
    python3 plugins/jx-kb/scripts/wiki-tools.py broken-links wiki
    python3 plugins/jx-kb/scripts/wiki-tools.py frontmatter-check wiki
    ```
    OR run `/jx-kb:lint wiki` — confirm no broken wikilinks, orphan pages, or index drift.
    Note: `wiki/wiki-tools.py` does NOT exist; helper is under `plugins/jx-kb/scripts/wiki-tools.py`.
    Note: no `lint` subcommand exists — use `orphans`, `broken-links`, `frontmatter-check`.
