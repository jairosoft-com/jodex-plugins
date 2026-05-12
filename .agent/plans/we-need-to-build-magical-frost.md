# Plan: Foundational Onboarding Idea

## Context

Three role-specific onboarding docs exist: `JX PM Onboarding.md`, `JX Dev Onboarding.md`,
`JX QA Onboarding.md`. All three repeat the same 7–9 setup steps before diverging into
role-specific tooling. A foundational (shared) onboarding page would eliminate that
duplication and give each role doc a single "complete foundation first" prerequisite.

User wants to: extract common elements → file as wiki idea → refine later.

---

## Common Elements Extracted

Comparing all three docs, these steps appear in every role onboarding:

| Step | PM | Dev | QA |
|------|----|----|-----|
| Anthropic account + Claude Code access tier | ✅ (explicit section) | ✅ (prerequisites) | ✅ (prerequisites) |
| Claude Code CLI install + verify | ✅ | ✅ | ✅ |
| Claude Code Desktop (optional) | ✅ | ✅ | ✅ |
| Git SCM install + identity config | ✅ | ✅ | ✅ |
| GitHub account + GitHub CLI (`gh auth`) | ✅ | ✅ | implied |
| Python 3 install + verify | ✅ | ✅ | ✅ |
| Jodex marketplace registration | ✅ | ✅ | ✅ |
| `jx-kb` install + `/reload-plugins` | ✅ | ✅ | ✅ |
| Project repo clone + working branch | ✅ | ✅ | ✅ |
| `/jx-kb:init wiki` | ✅ | ✅ | ✅ |

Node.js appears in all three but at different required versions (18+ QA, 20+ PM/Dev) and
for different reasons — include as a note, not a firm baseline step.

---

## Plan

### Step 1 — Create idea file

**File:** `wiki/ideas/Foundational Onboarding.md`

Frontmatter:
```yaml
title: Foundational Onboarding
type: idea
tags: [onboarding, jx-kb, setup, claude-code, git, shared]
created: 2026-05-12
updated: 2026-05-12
source_count: 3
aliases: [Common Onboarding, Base Onboarding, Shared Onboarding, Jodex Onboarding Foundation]
provenance: synthesis
status: backlogged
promoted_to:
archive_reason:
```

Body outline to include in idea file:
1. **Problem** — PM, Dev, QA onboarding docs each repeat the same ~9 setup steps.
   Maintenance burden; drift risk when install commands change.
2. **Proposed page type** — `code/` (alongside the three existing onboarding docs),
   titled `JX Foundational Onboarding.md`
3. **Scope of shared steps** (the table above)
4. **Out of scope** — Node.js version differences, role-specific plugins, Azure CLI,
   Obsidian, Playwright, openpyxl — stay in role docs
5. **Open questions for refinement**
   - Should GitHub CLI be required or recommended in foundation?
   - Node.js: include as optional with a version note, or omit entirely?
   - Does PM Enterprise-account step belong in foundation or stay PM-only?
   - How should role docs reference foundation? ("Complete foundation first" callout?)
6. **Sources** — links to all three onboarding pages

### Step 2 — Update `_backlog.md`

Add under **P2 — Medium**:
```
- [[Foundational Onboarding]] — Extract common setup steps from PM/Dev/QA onboarding into a shared prerequisite doc (#onboarding, #jx-kb)
```

---

## Critical Files

| File | Action |
|------|--------|
| `wiki/ideas/Foundational Onboarding.md` | Create (new idea page) |
| `wiki/_backlog.md` | Edit — add entry under P2 |

## Source Docs Read

- `wiki/code/JX PM Onboarding.md`
- `wiki/code/JX Dev Onboarding.md`
- `wiki/code/JX QA Onboarding.md`
- `wiki/_backlog.md`
- `wiki/_schema.md`

## Verification

After execution:
1. `wiki/ideas/Foundational Onboarding.md` exists with valid frontmatter (`type: idea`, `status: backlogged`)
2. `_backlog.md` P2 section contains `[[Foundational Onboarding]]` entry
3. Run `/jx-kb:lint wiki` — no new orphan or broken-link errors introduced
