---
title: JX Foundational Onboarding (Promoted)
type: idea
tags: [onboarding, jx-kb, setup, claude-code, git, shared]
created: 2026-05-12
updated: 2026-05-12
source_count: 3
aliases: [Foundational Onboarding, Common Onboarding, Base Onboarding, Shared Onboarding, Jodex Onboarding Foundation]
provenance: synthesis
status: promoted
promoted_to: "[[JX Foundational Onboarding]]"
archive_reason:
---

# JX Foundational Onboarding

## Scope Note

Foundation is both an extraction (shared steps from PM and Dev) and an addition for QA
(steps implied but not written out in the QA doc). QA onboarding will shrink to role-only
content; foundation fills the gaps QA currently relies on as implicit prerequisites.

## Problem

[[JX PM Onboarding]] and [[JX Dev Onboarding]] explicitly repeat the same 7–9 setup steps
before diverging into role-specific tooling. [[JX QA Onboarding]] implies these steps as
prerequisites but never writes them out, leaving QA users to discover the gaps on their
own. When an install command or URL changes, PM and Dev docs need updating independently;
QA users have no doc to update at all — compounding the drift risk.

A foundational onboarding page would contain the shared prerequisite steps once. Each
role doc would reference it with a "complete foundation first" callout and then cover
role-specific tooling — including adjacent-plugin workflow steps needed for handoff
(e.g., PM doc retains jx-dev handoff steps; Dev doc retains optional /jx-pm:ado steps).

## Proposed Page

- **Type:** `code/`
- **Title:** `JX Foundational Onboarding.md`
- **Audience:** Any user joining a Jodex project, regardless of role.

## Shared Steps (common to PM, Dev, and QA)

| Step | PM | Dev | QA |
|------|:--:|:---:|:--:|
| Anthropic account + Enterprise access request (CHOF / Ramon) | ✅ | ✅ | ✅ |
| Claude Code CLI install + verify | ✅ | ✅ | ✅ |
| Claude Code Desktop (optional; distinct from Claude Desktop chat app) | ✅ | ✅ | ✅ |
| Git SCM install + identity config (`user.name`/`user.email`) | ✅ | ✅ | ✅ |
| GitHub account + GitHub CLI (`gh auth`) — required | ✅ | ✅ | ✅ |
| `uv` install + verify | ✅ | ✅ | ✅ |
| Python 3 install + verify (via `uv`) | ✅ | ✅ | ✅ |
| Node.js 20+ install + verify | ✅ | ✅ | ✅ |
| Jodex marketplace registration (`/plugin marketplace add jairosoft-com/jodex-plugins`) | ✅ | ✅ | ✅ |
| `jx-kb` install + `/reload-plugins` (first reload) | ✅ | ✅ | ✅ |
| Project repo clone + working branch | ✅ | ✅ | ✅ |
| `/jx-kb:init wiki` | ✅ | ✅ | ✅ |

## Out of Scope for Foundation

Keep these in role-specific docs:

- Role-specific Node.js packages (Playwright, ADO MCP npx commands) — stay in role docs.
  Foundation installs Node.js 20+ as baseline (satisfies QA's 18+ and PM/Dev's 20+
  requirement; role docs add packages on top).
- Role-specific Python packages (`openpyxl` for QA) — stay in QA doc. Foundation
  installs `uv` + Python 3 baseline only. `jx-kb` helper deps are foundation-owned
  (jx-kb install is a shared step); list them in foundation, not role docs.
- Azure Repos / GitHub Desktop / GCM credential flow — PM only. Foundation covers generic
  `git clone` + branch; PM doc retains Azure credential path.
- Role-specific plugins: `jx-pm`, `jx-dev`, `jx-qa`
- Azure CLI + Azure Repos clone (GCM credential flow) — PM only.
- Azure DevOps MCP setup — Dev only (used for optional /jx-pm:ado handoff).
  Dev doc does not contain Azure Repos clone steps.
- Obsidian — PM only
- Playwright, `playwright-cli`, `openpyxl` — QA only
- GitHub Desktop — PM only

## Decision Rationale

These steps are marked **required** in foundation even though current role docs mark some
as optional or recommended. The elevation is intentional — role docs will be updated to
match when the foundation page is written.

| Decision | Current role-doc treatment | Foundation rationale |
|----------|---------------------------|---------------------|
| Enterprise access (CHOF / Ramon ticket) | PM-only explicit step; Dev/QA implicit | All Gerasoft project members use the same Anthropic Enterprise account. One ticket path for everyone reduces onboarding confusion. |
| GitHub CLI (`gh auth`) | PM: Recommended; Dev: Recommended; QA: not mentioned | All team members need GitHub access for branches, PRs, and issue reporting. Making it required eliminates the gap where QA users have no documented GitHub setup path. |
| Node.js 20+ | PM: Optional (ADO MCP only); Dev: Optional; QA: Required at 18+ | Foundation sets 20+ as baseline — satisfies all role minimums and eliminates the version ambiguity. Role docs add role-specific packages on top; no role is blocked by 20+. |
| `uv` + Python 3 | Not in current role docs (pip assumed) | `uv` is the team's Python tooling standard going forward. Baking it into foundation means all roles start from the same Python environment. Role docs specify packages only. |

## Open Questions for Refinement

1. **GitHub CLI** — Required in foundation for all roles. ~~Open — resolved.~~
2. **Node.js** — Required in foundation at 20+ (baseline for all roles). Role docs add
   role-specific npm packages (Playwright, ADO MCP) on top. ~~Open — resolved.~~
   **Decision: uv for Python, Node.js 20+ required in foundation.**
3. **Enterprise account step** — Moved to foundation. All roles use the Gerasoft
   Enterprise account via ticket to CHOF or Ramon. ~~Open — resolved.~~
4. **Reference pattern** — Each role doc adds a callout block at the top:
   `> [!prerequisite] Complete [[JX Foundational Onboarding]] before continuing.`
   ~~Open — resolved.~~
5. **Verification checklist** — Foundation page ends with a checklist for shared steps.
   PM and Dev role checklists remove shared items + link to foundation checklist.
   QA doc currently has no checklist — writing the foundation doc triggers adding one to
   QA: shared items point to foundation; QA-specific items listed inline. ~~Open — resolved.~~

## Role Doc Updates Required When Promoting to Code Page

When the foundational doc is written, role docs must be updated to remove steps now
covered by foundation:

- Remove Anthropic Enterprise access setup from role docs (PM doc currently owns it;
  foundation owns it after promotion — PM doc must not duplicate it).
- Remove `/jx-kb:init wiki` from role first-workflow command sequences (foundation runs
  it; role first-workflow starts after foundation is complete).
- Remove shared prerequisite steps (Claude Code CLI, Git, GitHub CLI, Python, Node.js,
  marketplace registration, jx-kb install) from role tooling checklists or replace with
  a single "see Foundation" reference.
- Role plugin install blocks must add their role-specific plugin + call `/reload-plugins`
  as a second reload (foundation already did first reload after jx-kb install).
- Remove shared troubleshooting entries that apply to all roles (Claude/Git/GitHub CLI
  diagnostics) once a foundation troubleshooting section exists.
- Add a `## Verification Checklist` section to QA onboarding (currently missing):
  shared steps point to foundation checklist; QA-specific steps listed inline.
- Foundation must include a `## Troubleshooting` section covering shared diagnostics
  (Claude CLI, Git, GitHub CLI, Python, Node.js). Role docs trim entries that duplicate
  foundation troubleshooting; keep role-specific entries.
- Foundation must maintain the client-boundary distinction: Claude Code Desktop (Code tab,
  shared MCP/plugin settings) vs Claude Desktop chat app (separate, different config).
  Do not flatten these two clients into one setup step.

## Sources

- [[JX PM Onboarding]]
- [[JX Dev Onboarding]]
- [[JX QA Onboarding]]
