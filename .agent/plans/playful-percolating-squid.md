# Plan: Promote ADO MCP Installation Idea to Code Page

## Context

The groomed idea "Azure DevOps MCP Installation for Claude Code CLI" has been triaged, refined, and passed adversarial review. It consolidates ADO MCP setup instructions currently scattered across JX Foundational Onboarding and JX Dev Onboarding into a single quick-reference page with a 4-step verification checklist and PAT security warnings.

Two adversarial review findings were filed as raw ideas for later work:
- **Link retargeting**: historical log wikilinks will resolve to the new code/ page after rename — accepted, follows existing promotion precedent
- **Docs-root**: dry-run command must keep explicit `--docs-root docs` — applied in this plan

## Steps

### 1. Create the code/ page

**File:** `wiki/code/Azure DevOps MCP Installation for Claude Code CLI.md`

~80 lines, single-screen target. Sections:

- Frontmatter (type: code, provenance: synthesis, source_count: 0)
- Lead paragraph with cross-links to [[JX Foundational Onboarding]] and [[Client-Specific MCP Boundary]]
- Prerequisites: Node.js 20+, Azure CLI authenticated
- Install (Azure CLI Auth — Recommended): macOS/Linux + Windows commands
- PAT Fallback: env var command + security warning callout
- Verification Checklist: 4 steps ending with `/jx-pm:ado --dry-run --docs-root docs`
- Wrong Org?: remove and re-add commands
- Sources section

### 2. Rename and update the idea file

- **Rename** `wiki/ideas/Azure DevOps MCP Installation for Claude Code CLI.md` → `wiki/ideas/Azure DevOps MCP Installation for Claude Code CLI (Promoted).md`
- Update frontmatter: title add `(Promoted)`, `status: promoted`, add `promoted_to` field

### 3. Update `wiki/_index.md`

- Frontmatter: `updated: 2026-05-18`, `page_count: 227` (currently 226)
- Ideas section: change `[backlogged P2]` → `[promoted]`, update wikilink to `(Promoted)`
- Code section: insert new entry between Creating a Skill and JX Dev Onboarding

### 4. Update `wiki/_log.md`

Insert promotion log entry above the existing `2026-05-18 — Ideas Filed` entry.

## Verification

1. `wiki/code/Azure DevOps MCP Installation for Claude Code CLI.md` exists with all 7 sections
2. `wiki/ideas/` has only the `(Promoted)` version, no un-suffixed file
3. `wiki/_index.md` has promoted idea entry + new code/ entry, page_count = 227
4. `grep -r "Azure DevOps MCP Installation" wiki/` shows no broken references
5. Dry-run command in the code/ page includes `--docs-root docs`
