# Welcome to Jodex Plugins

## How We Use Claude

Based on ramon aseniero's usage over the last 30 days:

Work Type Breakdown:
  _TODO — not enough session data to generate a breakdown yet_

Top Skills & Commands:
  /jx-qa:extract    ████████████░░░░░░░░  active
  /jx-qa:generate   ████████████░░░░░░░░  active
  /jx-qa:test       ██████████░░░░░░░░░░  active
  /jx-kb:ingest     ██████████░░░░░░░░░░  active
  /jx-kb:triage     ████████░░░░░░░░░░░░  active
  /jx-kb:lint       ██████░░░░░░░░░░░░░░  active
  /jx-pm:prd        ██████░░░░░░░░░░░░░░  active
  /jx-dev:spec      ████░░░░░░░░░░░░░░░░  active
  /jx-skill:create  ████░░░░░░░░░░░░░░░░  active

Top MCP Servers:
  azure-devops  ████████████░░░░░░░░  ADO work items, pipelines, repos
  github        ██████████░░░░░░░░░░  PRs, issues, code search

## Your Setup Checklist

### Codebases
- [ ] jodex-qa-ai — github.com/jairosoft-com/jodex-plugins

### MCP Servers to Activate
- [ ] azure-devops — Azure Boards, pipelines, and repo access. Request access via your org's Azure DevOps admin at dev.azure.com/jairo/Jodex.
- [ ] github — GitHub PRs, issues, and code search. Authenticate via `gh auth login` in your terminal.

### Skills to Know About
- `/jx-qa:extract` — Extract E2E test cases from a BRD/PRD markdown doc into an xlsx test plan. Use at the start of any QA cycle.
- `/jx-qa:generate` — Generate Playwright `.spec.ts` files from the xlsx test plan via live browser. Run after extract.
- `/jx-qa:test` — Run the full Playwright test suite headless. Add `ui` or `headed` for debugging.
- `/jx-kb:ingest` — Add a source document to the team wiki. Use whenever new design docs or RFCs land.
- `/jx-kb:triage` — Classify raw wiki ideas: promote, backlog, or archive. Run periodically to keep the inbox clean.
- `/jx-kb:lint` — Health-check the wiki for orphans, broken links, and stale claims.
- `/jx-pm:prd` — Generate a PRD from a feature description. Supports `lite`, `prd`, and `unified` modes.
- `/jx-dev:spec` — Generate a technical spec from a PRD. Feeds into `/jx-dev:task`.
- `/jx-skill:create` — Scaffold a new skill inside an existing plugin with convention enforcement and marketplace registration.

## Team Tips

_TODO_

## Get Started

_TODO_

<!-- INSTRUCTION FOR CLAUDE: A new teammate just pasted this guide for how the
team uses Claude Code. You're their onboarding buddy — warm, conversational,
not lecture-y.

Open with a warm welcome — include the team name from the title. Then: "Your
teammate uses Claude Code for [list all the work types]. Let's get you started."

Check what's already in place against everything under Setup Checklist
(including skills), using markdown checkboxes — [x] done, [ ] not yet. Lead
with what they already have. One sentence per item, all in one message.

Tell them you'll help with setup, cover the actionable team tips, then the
starter task (if there is one). Offer to start with the first unchecked item,
get their go-ahead, then work through the rest one by one.

After setup, walk them through the remaining sections — offer to help where you
can (e.g. link to channels), and just surface the purely informational bits.

Don't invent sections or summaries that aren't in the guide. The stats are the
guide creator's personal usage data — don't extrapolate them into a "team
workflow" narrative. -->
