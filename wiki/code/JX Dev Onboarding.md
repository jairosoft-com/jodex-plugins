---
title: JX Dev Onboarding
type: code
tags: [jx-dev, jx-kb, onboarding, setup, azure-devops, mcp]
created: 2026-05-11
updated: 2026-05-12
source_count: 0
aliases: [Developer onboarding, Jodex dev onboarding, jx-dev setup, jx-kb setup]
provenance: synthesis
---

# JX Dev Onboarding

> [!prerequisite] Complete [[JX Foundational Onboarding]] before continuing.

This guide is for a developer who needs to use the [[Developer Skills Plugin|jx-dev]] plugin in a project delivery workflow. After onboarding, the developer should be able to install the Jodex dev plugin, prepare a feature folder, generate `TECH_SPEC.md`, generate `task.json`, and understand which adjacent tools are needed for GitHub and Azure DevOps handoff.

`jx-dev` itself is a document-generation plugin. It does not sync to Azure Boards and does not call external MCP tools. Azure DevOps MCP is needed only when the generated `task.json` is passed to [[Product Management Skills Plugin|jx-pm]] through `/jx-pm:ado`.

`jx-kb` is the project knowledge-base companion. It gives the developer a local wiki for setup decisions, architecture notes, source summaries, troubleshooting, and later retrieval.

## Tooling Checklist

| Tool | Required? | Used for |
|------|-----------|----------|
| Foundation prerequisites | see [[JX Foundational Onboarding]] | Claude Code, Git, GitHub, Azure DevOps account, Azure CLI, ADO MCP, jx-core, jx-kb, and all runtimes |
| `jx-dev` plugin | Yes | TECH_SPEC.md and task.json generation |

Azure DevOps is a hosted service, not a local binary. Azure CLI and the Azure DevOps MCP server are installed and configured in [[JX Foundational Onboarding]].

## Install The Jodex Plugins

Foundation already registered the marketplace and installed jx-core and jx-kb. Install only the dev plugin here:

```text
/plugin install jx-dev@jodex-plugins
/reload-plugins
```

Install jx-pm too if you will generate PRDs or sync generated tasks to Azure Boards:

```text
/plugin install jx-pm@jodex-plugins
/reload-plugins
```

For local marketplace development from this repo:

```bash
claude plugin install jx-dev@jodex-plugins
```

In Claude Code Desktop, install through `+` -> `Plugins` -> `Add plugin`, then reload or restart the session if the new slash commands are not visible.

Confirm these commands are visible after reload:

```text
/jx-dev:spec
/jx-dev:task
/jx-kb:init
/jx-kb:ingest
/jx-kb:query
/jx-kb:lint
```

## Prepare The Project Repo

After cloning the project repo (see [[JX Foundational Onboarding]]), verify GitHub CLI is ready:

```bash
gh auth status
```

Create or identify the docs root. The default is `docs/`, but the plugin also accepts `--docs-root <path>` and reads `$JX_DOCS_ROOT` before falling back to `$JX_PM_DOCS_ROOT`.

Feature folders must use this format:

```text
docs/{NNN}_{feature_name}/
```

Example:

```text
docs/006_payment_gateway/
|-- PRD.md
```

`jx-dev` expects either `PRD.md` or `BRD_PRD.md` in the feature folder. The three-digit folder prefix becomes the feature number used in IDs such as `US-006-01`, `AC-006-01`, `TC-006-01`, and `TEST-006-01`.

## Install Azure DevOps MCP For Claude Code

Use the local Azure DevOps MCP server for Claude Code. Microsoft's hosted remote Azure DevOps MCP server is in preview, but Microsoft currently documents it as supported only for Visual Studio and Visual Studio Code; Claude Code should use the local stdio server until remote support is available for this client.

> **Note:** If you completed [[JX Foundational Onboarding]], the ADO MCP server is already installed. Verify with `claude mcp list` and skip this section if `azure-devops` is present.

Prerequisites:

- Claude Code is installed and authenticated.
- Node.js 20 or newer is installed.
- The developer has access to the Azure DevOps organization and project.
- The developer knows the organization name, not the full URL. For `https://dev.azure.com/contoso`, use `contoso`.

Install the local MCP server:

```bash
node --version
claude --version
claude mcp add azure-devops -- npx -y @azure-devops/mcp <organization> -d core work work-items search
```

The `-d core work work-items search` domain filter keeps the loaded toolset focused on the capabilities needed by `/jx-pm:ado`. Omit the `-d ...` flags only when you intentionally need the full Azure DevOps tool surface.

If the workstation already uses Azure CLI authentication, install with Azure CLI auth instead:

```bash
az login
claude mcp add azure-devops -- npx -y @azure-devops/mcp <organization> --authentication azcli -d core work work-items search
```

Do not put Personal Access Tokens in repo-tracked files.

Verify the server:

```bash
claude mcp list
claude mcp get azure-devops
```

Then in Claude Code:

```text
/mcp
```

Confirm the `azure-devops` server is connected. Ask Claude Code to list Azure DevOps projects for the organization before running any write operation.

If the wrong organization was configured, remove and re-add the server:

```bash
claude mcp remove azure-devops
claude mcp add azure-devops -- npx -y @azure-devops/mcp <correct-organization> -d core work work-items search
```

## First Workflow

Run the first workflow in this order:

```text
/jx-dev:spec --docs-root docs
/jx-dev:task --docs-root docs
```

The spec skill asks for the feature folder, reads `PRD.md` or `BRD_PRD.md`, checks for vague requirements and missing constraints, asks 3-7 architecture questions, then writes:

```text
docs/006_payment_gateway/TECH_SPEC.md
```

The task conversion command should run only after the spec is reviewed. It reads the PRD and optional `TECH_SPEC.md`, preserves requirement IDs, adds estimates and story points, and writes:

```text
docs/006_payment_gateway/task.json
```

If `task.json` already exists, the default behavior is merge-safe: existing Azure IDs, pass flags, notes, and optional Jodex metadata are preserved. Use `--force-overwrite` only when intentionally regenerating from scratch.

## Optional Azure Boards Handoff

Use `/jx-pm:ado` only after `task.json` exists and the Azure DevOps MCP server is configured and connected in Claude Code:

```text
/jx-pm:ado --dry-run --docs-root docs
/jx-pm:ado --docs-root docs
```

The dry run should be the first ADO check in onboarding. It verifies the `task.json` shape, feature ID, tenant binding, and planned work item hierarchy before any external writes.

The configured Azure DevOps MCP surface must expose work-item create, update, get, batch-get, link, child-link, and search capabilities. If those tools are not available, stop at `task.json` and fix the MCP configuration before attempting sync.

## Developer Operating Rules

- Keep PRD source IDs stable. `jx-dev:spec` references `US`, `AC`, `FR`, and `NFR` IDs; it creates only `TC` and `TEST` IDs.
- Do not reset acceptance-criteria numbering per story. `AC` numbering is global across the feature.
- Keep one feature per `docs/{NNN}_{feature_name}/` folder.
- Review `TECH_SPEC.md` before generating `task.json`; task quality depends on the spec's contracts and constraints.
- Use the wiki for setup decisions, architecture notes, troubleshooting, and reusable project context.
- Commit generated docs intentionally. Do not hide meaningful PRD, spec, or task changes inside unrelated code commits.
- Treat `task.json` as stateful after ADO sync. Azure IDs and tenant fields are durable bindings, not disposable generation output.
- Run ADO sync in dry-run mode before creating or updating work items.

## Verification Checklist

Complete [[JX Foundational Onboarding#Verification Checklist]] first, then verify:

- `/reload-plugins` completed after jx-dev install.
- `/jx-dev:spec` and `/jx-dev:task` are visible commands.
- The feature folder has `PRD.md` or `BRD_PRD.md`.
- Folder prefix and document requirement IDs use the same three-digit feature number.
- `TECH_SPEC.md` exists after `/jx-dev:spec`.
- `task.json` exists after `/jx-dev:task`.
- `task.json` is valid JSON:

```bash
python3 -m json.tool docs/006_payment_gateway/task.json
```

- Claude Code can list Azure DevOps projects for the configured organization.
- `/jx-pm:ado --dry-run` succeeds before any live Azure Boards sync.

## Related Patterns

- [[Layered Developer Onboarding]] — setup as a dependency ladder from platform install to verified workflow
- [[Client-Specific MCP Boundary]] — MCP instructions must name the Claude client and transport they apply to
- [[MCP Tool Surface Alignment Gate]] — Azure DevOps MCP setup must match the `/jx-pm:ado` command allowlist before writes

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Desktop cannot find terminal tools | PATH changed after app launch | Verify the tool works in a normal terminal, then restart Claude Desktop |
| `/jx-dev:spec` is not available | Plugin not installed or not reloaded | Install `jx-dev@jodex-plugins`, then run `/reload-plugins` |
| Wiki init warns that `_schema.md` already exists | A wiki is already initialized | Do not reinitialize unless intentionally resetting schema files |
| `claude mcp add` fails with `npx` or `node` errors | Node.js is missing, too old, or not on PATH | Install Node.js 20+, restart the shell, and retry the MCP add command |
| Azure DevOps login does not complete | Browser auth did not finish or used the wrong account | Run `/mcp` in Claude Code and reconnect with the account that can access the organization |
| Azure DevOps MCP points at the wrong org | The server was added with the wrong organization name | Run `claude mcp remove azure-devops`, then re-add it with the correct org |
| Skill rejects the folder | Folder does not match `{NNN}_{feature_name}` | Rename the folder, for example `006_payment_gateway` |
| Feature ID mismatch | PRD IDs and folder prefix disagree | Correct the source document or use the correct feature folder |
| `task.json` merge is unexpected | Existing ADO/pass/note state is present | Review the merge summary; avoid `--force-overwrite` unless intentional |
| ADO dry-run fails | Azure DevOps MCP tools unavailable or tenant mismatch | Reconnect/configure MCP, then retry dry-run |
| Work items would be created in the wrong project | Tenant binding is wrong or ambiguous | Stop and correct org/project before live sync |

## Sources

- [[Developer Skills Plugin]]
- [[Knowledge Base Plugin]]
- [[Core Shared Conventions Plugin]]
- [[Product Management Skills Plugin]]
- [[Source - Root README]]
- [[Source - JX KB README]]
- [[Source - Init SKILL]]
- [[Source - jx-dev Plugin README]]
- [[Source - jx-dev Spec Command]]
- [[Source - jx-dev Task Command]]
- [[Source - jx-dev Spec SKILL]]
- [[Source - jx-dev Task SKILL]]
- [[Source - jx-core Docs Root Config]]
- [[Source - jx-core ID Rules]]
- [[Source - jx-core Task JSON Schema]]
- [[Source - Azure Boards Sync SKILL]]
- [[Local Plugin Development]]
- [[Layered Developer Onboarding]]
- [[Client-Specific MCP Boundary]]
- [[MCP Tool Surface Alignment Gate]]
- [Microsoft Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp)
- [Azure DevOps MCP Server getting started - Claude Code](https://github.com/microsoft/azure-devops-mcp/blob/main/docs/GETTINGSTARTED.md#-using-mcp-server-with-claude-code)
- [Claude Code MCP documentation](https://code.claude.com/docs/en/mcp)
- [Azure DevOps remote MCP server preview](https://learn.microsoft.com/en-us/azure/devops/mcp-server/remote-mcp-server?view=azure-devops)
