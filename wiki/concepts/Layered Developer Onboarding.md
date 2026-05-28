---
title: Layered Developer Onboarding
type: concept
tags: [onboarding, developer-experience, setup, workflow, plugin]
created: 2026-05-12
updated: 2026-05-12
source_count: 0
aliases: [onboarding ladder, capability ladder, setup ladder]
provenance: synthesis
---

# Layered Developer Onboarding

Layered Developer Onboarding is the pattern of teaching a plugin workflow in dependency order rather than by feature list. Each layer must be installed, authenticated, and verified before the next workflow layer depends on it.

## Pattern

For Jodex developer onboarding, the durable setup sequence is:

1. Install [[Claude Code CLI]] or [[Claude Code Desktop]].
2. Install the Jodex [[Marketplace]] and required plugins.
3. Prepare the project repository and docs root.
4. Initialize the project wiki with [[Knowledge Base Plugin|jx-kb]].
5. Configure optional external handoff tools such as Azure DevOps MCP.
6. Run the first functional workflow.
7. Verify outputs and record troubleshooting notes in the wiki.

This order keeps platform access, plugin availability, repo structure, wiki state, external integrations, and workflow execution as separate checks.

## Jodex Instance

[[JX Dev Onboarding]] now follows this pattern:

| Layer | Setup Result |
|-------|--------------|
| Platform | Claude Code CLI or Claude Code Desktop is installed and authenticated |
| Plugin registry | `jx-dev`, `jx-kb`, and optional `jx-pm` are installed |
| Repo shape | `docs/{NNN}_{feature_name}/` contains `PRD.md` or `BRD_PRD.md` |
| Knowledge base | `wiki/_schema.md`, index, log, backlog, taxonomy folders, and raw sources exist |
| External MCP | Azure DevOps MCP is connected only when `/jx-pm:ado` will run |
| First workflow | `/jx-dev:spec` produces `TECH_SPEC.md`; `/jx-dev:task` produces `task.json` |
| Verification | CLI, plugin, wiki, JSON, GitHub, and Azure dry-run checks pass |

## Why It Matters

This pattern prevents onboarding docs from implying that one install command makes the whole delivery workflow ready. It also lets a developer stop at a useful layer. A developer can use `jx-dev` and `jx-kb` without Azure DevOps MCP, and can defer `/jx-pm:ado` until the team needs external work-item sync.

## Related

- [[JX Dev Onboarding]]
- [[Developer Skills Plugin]]
- [[Knowledge Base Plugin]]
- [[Client-Specific MCP Boundary]]
- [[MCP Tool Surface Alignment Gate]]
- [[Repository Source of Truth Precedence]]

## Sources

- [[JX Dev Onboarding]]
- [[Developer Skills Plugin]]
- [[Knowledge Base Plugin]]
