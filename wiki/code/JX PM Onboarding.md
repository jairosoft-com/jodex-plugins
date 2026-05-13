---
title: JX PM Onboarding
type: code
tags: [jx-pm, jx-dev, jx-kb, onboarding, setup, azure-devops]
created: 2026-05-12
updated: 2026-05-12
source_count: 0
aliases: [Product owner onboarding, PO onboarding, PM onboarding, jx-pm setup, Jodex PM onboarding]
provenance: synthesis
---

# JX PM Onboarding

> [!prerequisite] Complete [[JX Foundational Onboarding]] before continuing.

This guide is for a product owner who needs to use the [[Product Management Skills Plugin|jx-pm]] plugin in the Jodex delivery workflow. After onboarding, the product owner should be able to clone the Azure Repo through GitHub Desktop, review the local wiki in [[Obsidian]], generate a PRD, hand off to [[Developer Skills Plugin|jx-dev]] for spec and task generation, and optionally sync `task.json` to Azure Boards.

The live plugin name is `jx-pm`. Product owner and PO describe the audience, not a separate plugin. If someone asks for PEO wording, route them to `jx-pm` unless the marketplace later adds a separate plugin.

## Tooling Checklist

| Tool | Required? | Used for |
|------|-----------|----------|
| Foundation prerequisites | see [[JX Foundational Onboarding]] | Claude Code, Git, GitHub, Azure CLI, ADO MCP, jx-core, jx-kb, and all runtimes |
| `jx-pm` plugin | Yes | PRD generation, pipeline, and Azure Boards sync |
| Azure Repos access | Yes for project work | Azure DevOps organization, project, and repo permissions for the product repository |

Azure DevOps is a hosted service, not a local app. Azure CLI and the Azure DevOps MCP server are installed and configured in [[JX Foundational Onboarding]].

## Get Azure Repos Access And Clone With GitHub Desktop

Use this flow when the product repository lives in Azure Repos but the product owner will use GitHub Desktop as the local Git client.

### Request Azure Repos Access

Ask the Azure DevOps project administrator for:

- Azure DevOps organization URL, for example `https://dev.azure.com/<organization>`.
- Project name.
- Repository name.
- Access level: `Basic` for users who need to contribute code or docs.
- Project group: `Contributors` for normal branch/commit/push work, or `Readers` for read-only access.
- Confirmation that Azure Repos is enabled for the project.

Accept the Azure DevOps invitation and confirm access:

1. Open `https://dev.azure.com/<organization>`.
2. Sign in with the account the administrator added.
3. Open the target project.
4. Open `Repos` -> `Files`.
5. Confirm the target repository is visible.

### Get The Azure Repo URL

In Azure DevOps:

1. Open the project.
2. Open `Repos` -> `Files`.
3. Select the target repository.
4. Select `Clone`.
5. Copy the HTTPS clone URL.

The URL usually has this shape:

```text
https://jairo@dev.azure.com/<organization>/<project>/_git/<repo>
```

Replace `jairo` with the product owner's Azure DevOps username, generated Git username, or organization sign-in alias:

```text
https://<username>@dev.azure.com/<organization>/<project>/_git/<repo>
```

Do not put the password, generated Git password, or PAT in the URL. Paste only the username-bearing clone URL into GitHub Desktop, then enter the secret only when the credential prompt appears.

### Generate Or Prepare Git Credentials

Use the most secure credential path available in the product owner's Azure DevOps environment:

1. Preferred current path: use Git Credential Manager with Microsoft Entra sign-in. In GitHub Desktop, open `File` -> `Options` -> `Advanced` on Windows, or `GitHub Desktop` -> `Preferences` -> `Advanced` on macOS, then enable `Use Git Credential Manager`. When GitHub Desktop starts the clone, GCM opens a browser sign-in prompt for Azure DevOps and stores the resulting credential outside GitHub Desktop.
2. PAT fallback: if interactive sign-in fails or the org requires tokens, create a Personal Access Token in Azure DevOps under `User settings` -> `Personal access tokens` -> `New Token`. Use the narrowest repo scope that allows the expected work, set an expiration date, copy the token once, and store it in a secure password manager.
3. Legacy generated Git credentials: if the Azure Repos clone dialog still has `Generate Git Credentials`, use it to generate a username/password pair for this repo workflow. Current Azure DevOps Services documentation says this button was removed in January 2025, so treat it as an older Azure DevOps Server or tenant-specific option.

When GitHub Desktop asks for credentials:

- Username: use the username from the clone URL, generated Git username, or Azure DevOps sign-in alias.
- Password: use the generated Git password or PAT. For Microsoft Entra/Git Credential Manager, finish the browser sign-in instead of pasting a password.

Never paste credentials into wiki pages, PRDs, `task.json`, screenshots, issue comments, or chat transcripts.

### Clone In GitHub Desktop

1. Open GitHub Desktop.
2. Confirm the product owner is signed in with their GitHub account.
3. Confirm `Use Git Credential Manager` is enabled in the Advanced settings.
4. Select `File` -> `Clone Repository`.
5. Select the `URL` tab.
6. Paste the Azure Repos HTTPS URL after replacing `jairo` with the product owner's username.
7. Choose the local folder path.
8. Select `Clone`.
9. Complete the Azure DevOps credential prompt with Git Credential Manager, generated Git credentials, or PAT.
10. If GitHub Desktop shows `Authentication Failed` while using a PAT or generated credential, enter the Azure DevOps username, paste the PAT or generated password, and select `Save and Retry`.
11. After clone completes, create a branch for onboarding or product-documentation work.

Verify the remote:

```bash
git remote -v
```

The `origin` URL should point to `dev.azure.com` and should not contain a password or token.

## Install The Jodex Plugins

Foundation already registered the marketplace and installed jx-core and jx-kb. Install only the PM plugin here:

```text
/plugin install jx-pm@jodex-plugins
/reload-plugins
```

Do not run `/plugin install jx-dev` or `/plugin install jx-qa` manually — those belong to Dev and QA roles respectively. `jx-dev` is installed automatically as a `jx-pm` dependency; PM users will see `/jx-dev:spec` and `/jx-dev:task` commands but should not run them directly — those belong to the Dev role handoff.

Confirm these commands are visible:

```text
/jx-pm:prd
/jx-pm:pipeline
/jx-pm:ado
/jx-kb:init
/jx-kb:ingest
/jx-kb:query
/jx-kb:lint
```

## Prepare The Project Repo

After cloning from Azure Repos through GitHub Desktop, open the local folder in Claude Code, VS Code, Obsidian, and GitHub Desktop.

Use this feature folder convention for all product documentation:

```text
docs/{NNN}_{feature_name}/
```

Example:

```text
docs/006_payment_gateway/
|-- PRD.md
|-- TECH_SPEC.md
`-- task.json
```

The three-digit prefix drives requirement IDs such as `US-006-01`, `AC-006-01`, `TC-006-01`, and `TEST-006-01`. Do not use `000`, and do not reset acceptance-criteria numbering per user story.

## First Product Workflow

Run the first product-owner workflow in this order:

```text
/jx-pm:prd --mode lite --docs-root docs
```

Use `--mode lite` for a small feature with limited ambiguity. Use `--mode prd` for a larger feature with multiple systems or more than five stories. Use `--mode unified` when the output must combine business justification with tactical delivery detail.

After PRD is reviewed, hand off to the Dev role to generate `TECH_SPEC.md` and `task.json` using `/jx-dev:spec` and `/jx-dev:task`. Return here to run `/jx-pm:ado` once `task.json` exists.

```text
/jx-pm:ado --dry-run --docs-root docs
```

Run live `/jx-pm:ado` only after the dry run shows the expected organization, project, feature folder, and work item hierarchy.

`/jx-pm:pipeline` is currently a reduced wrapper for PRD generation. It does not run the full PRD -> spec -> task -> ADO workflow. Run the manual sequence above for the full delivery flow.

## Product Owner Operating Rules

- Use one branch per product-documentation or feature-planning task.
- Keep one feature per `docs/{NNN}_{feature_name}/` folder.
- Review `PRD.md` or `BRD_PRD.md` before asking for `TECH_SPEC.md`.
- Review `TECH_SPEC.md` before generating `task.json`.
- Treat `task.json` as stateful after ADO sync. Azure IDs and tenant fields are durable bindings.
- Run `/jx-pm:ado --dry-run` before any live Azure Boards sync.
- Do not use `--new-tenant`, `--prune`, force-recreate, or state-sync operations unless the team intentionally approves the external-state change.
- Commit generated product docs intentionally. Do not mix product docs, code changes, and unrelated local setup churn in one commit.
- Use the wiki for reusable product decisions, onboarding notes, meeting summaries, and workflow troubleshooting.

## Verification Checklist

Complete [[JX Foundational Onboarding#Verification Checklist]] first, then verify:

- Azure Repos access confirmed: org, project, and repo visible in DevOps portal.
- GitHub Desktop cloned the Azure Repo from the username-bearing HTTPS URL.
- `git remote -v` shows a `dev.azure.com` URL without embedded credentials.
- `/reload-plugins` completed after jx-pm install.
- `/jx-pm:prd`, `/jx-pm:pipeline`, and `/jx-pm:ado` are visible.
- The feature folder matches `docs/{NNN}_{feature_name}/`.
- `/jx-pm:ado --dry-run` succeeds before any live Azure Boards sync.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Product owner cannot find the product-owner command | The live marketplace plugin is named `jx-pm` | Install `jx-pm@jodex-plugins` |
| Claude Code access fails after Anthropic sign-in | User created a Claude account but was not added to Anthropic Enterprise | Create or update the internal ticket and ask CHOF or Ramon to add the Gerasoft email to the Enterprise account |
| `az: command not found` | Azure CLI is not installed or the terminal was not restarted | Install Azure CLI (see [[JX Foundational Onboarding]]), close and reopen the terminal, then run `az --version` |
| `az auth status` fails | Azure CLI does not have an `auth status` subcommand | Use `az account show` after `az login` |
| `az devops` is unavailable | Azure DevOps CLI extension is missing | Run `az extension add --name azure-devops`, then verify with `az extension show --name azure-devops` |
| `az repos list` fails | Azure CLI is not signed in, defaults are wrong, or the product owner lacks Azure Repos access | Run `az login`, configure defaults, and confirm access in Azure DevOps |
| VS Code is not signed in | GitHub account was not created or not connected in VS Code | Create or verify the GitHub account, then sign in from the VS Code Accounts menu |
| GitHub Desktop cannot clone the Azure Repo | Missing Azure Repos access, wrong username in the URL, stale credentials, or an invalid generated password/PAT | Confirm Azure DevOps access, replace `jairo` in the URL, clear stale credentials, then retry the clone |
| Azure Repo is not visible | Product owner lacks Azure DevOps project or repo access | Ask the project admin for Basic access and the correct Readers or Contributors group |
| Azure Repos clone prompts repeatedly for credentials | Git Credential Manager is disabled or stale, or the generated credential/PAT is wrong | Enable `Use Git Credential Manager`, clear stale stored credentials, verify the username in the URL, then retry with a fresh sign-in or token |
| Azure clone URL still contains `jairo` | Template URL was not personalized | Replace `jairo` with the product owner's Azure DevOps username before cloning |
| Obsidian graph is empty | Wrong folder opened as vault | Open the project `wiki/` folder, not the repo root |
| `/jx-pm:*` commands are missing | Plugin not installed or not reloaded | Install `jx-pm@jodex-plugins`, then run `/reload-plugins` |
| `/jx-dev:*` commands are missing | Dependency did not load or plugin was not reloaded | Run `/reload-plugins`, then install `jx-dev@jodex-plugins` if needed |
| `/jx-pm:pipeline` does not create spec/task/ADO work items | Pipeline is currently reduced to PRD generation | Run `/jx-pm:prd`, hand off to Dev for `/jx-dev:spec` and `/jx-dev:task`, then run `/jx-pm:ado` manually |
| Skill rejects the folder path | Folder does not match `{NNN}_{feature_name}` | Rename the folder, for example `006_payment_gateway` |
| ADO dry-run fails before writes | Azure DevOps MCP is missing or exposes the wrong tools | Fix MCP setup and verify `/mcp` before retrying |
| ADO sync points to the wrong project | Tenant binding or MCP organization is wrong | Stop before live sync and correct the organization/project |

## Related Patterns

- [[Identity And Access Ladder]] — product-owner onboarding as ordered identity, repository, credential, and MCP access verification
- [[Layered Developer Onboarding]] — setup as a dependency ladder from platform install to verified workflow
- [[Client-Specific MCP Boundary]] — MCP instructions must name the Claude client and transport they apply to
- [[MCP Tool Surface Alignment Gate]] — Azure DevOps MCP setup must match command expectations before writes

## Sources

- [[Product Management Skills Plugin]]
- [[Developer Skills Plugin]]
- [[Knowledge Base Plugin]]
- [[Core Shared Conventions Plugin]]
- [[Source - Root README]]
- [[Source - jx-pm Plugin README]]
- [[Source - jx-pm PRD Command]]
- [[Source - PRD Generator SKILL]]
- [[Source - Pipeline Command]]
- [[Source - Pipeline SKILL]]
- [[Source - ADO Command]]
- [[Source - Azure Boards Sync SKILL]]
- [[Source - jx-dev Plugin README]]
- [[Source - jx-dev Spec Command]]
- [[Source - jx-dev Task Command]]
- [[Source - jx-core Docs Root Config]]
- [[Source - jx-core ID Rules]]
- [[Source - JX KB README]]
- [[Source - Init SKILL]]
- [[Local Plugin Development]]
- [Git SCM install](https://git-scm.com/install)
- [Azure DevOps add organization users](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/add-organization-users?view=azure-devops)
- [Azure Repos clone guide](https://learn.microsoft.com/en-us/azure/devops/repos/git/clone?view=azure-devops)
- [Azure Repos authentication overview](https://learn.microsoft.com/en-us/azure/devops/repos/git/auth-overview?view=azure-devops)
- [Azure DevOps personal access tokens](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops)
- [GitHub Desktop clone by URL](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop)
- [GitHub Desktop Azure DevOps integration](https://github.com/desktop/desktop/blob/development/docs/integrations/azure-devops.md)
- [Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp)
- [Claude Code MCP documentation](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Claude Code CLI quickstart](https://code.claude.com/docs/en/quickstart)
- [Claude Code Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart)
- [Obsidian download](https://obsidian.md/download)
