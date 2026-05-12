---
title: JX PM Onboarding
type: code
tags: [jx-pm, jx-dev, jx-kb, onboarding, setup, claude-code, github, obsidian, azure-devops]
created: 2026-05-12
updated: 2026-05-12
source_count: 0
aliases: [Product owner onboarding, PO onboarding, PM onboarding, jx-pm setup, Jodex PM onboarding]
provenance: synthesis
---

# JX PM Onboarding

This guide is for a product owner who needs to use the [[Product Management Skills Plugin|jx-pm]] plugin in the Jodex delivery workflow. After onboarding, the product owner should be able to install Claude Code CLI or [[Claude Code Desktop]], install Git SCM and the Jodex plugins, create and use a GitHub account for VS Code and GitHub tooling, clone the Azure Repo through GitHub Desktop, review the local wiki in [[Obsidian]], generate a PRD, hand off to [[Developer Skills Plugin|jx-dev]] for spec and task generation, and optionally sync `task.json` to Azure Boards.

The live plugin name is `jx-pm`. Product owner and PO describe the audience, not a separate plugin. If someone asks for PEO wording, route them to `jx-pm` unless the marketplace later adds a separate plugin.

## Tooling Checklist

| Tool                      | Required?                             | Used for                                                                                            |
| ------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [[Claude Code CLI]]       | Yes                                   | Plugin install, terminal sessions, MCP setup, and verification commands                             |
| [[Claude Code Desktop]]   | Optional                              | GUI coding/product sessions, file review, integrated terminal, and visual diffs                     |
| Jodex marketplace plugins | Yes                                   | `jx-pm`, `jx-kb`, and the `jx-core` dependency                                                      |
| Git SCM                   | Yes                                   | Local source control engine used by Claude Code, GitHub Desktop, GitHub CLI, and terminal workflows |
| GitHub account            | Yes                                   | Sign in to GitHub Desktop, GitHub CLI, and VS Code                                                  |
| GitHub Desktop            | Recommended                           | Product-owner friendly branch, commit, push, and PR workflow                                        |
| GitHub CLI                | Recommended                           | Auth verification, PR creation, repo status, and terminal workflows                                 |
| Azure CLI                 | Recommended                           | Azure DevOps CLI extension, Azure Repos access checks, and scripted GitHub-to-Azure handoff support |
| VS Code                   | Recommended                           | Lightweight editor for PRDs, wiki pages, Markdown preview, and source-control review                |
| Docker Desktop            | Optional                              | Required only for the Docker-based local GitHub MCP server path                                     |
| Azure Repos access        | Yes for project work                  | Azure DevOps organization, project, and repo permissions for the product repository                 |
| [[Obsidian]]              | Recommended                           | Reading and navigating the project `wiki/` vault                                                    |
| Python 3                  | Required for `jx-kb` helper workflows | Wiki helper scripts and JSON validation                                                             |
| Node.js 20+               | Optional                              | Required only for the local Azure DevOps MCP server                                                 |
| Azure Boards/MCP access   | Optional                              | Required only when syncing work items with `/jx-pm:ado`                                             |

Azure DevOps is a hosted service, not a local app. Local Azure-related tools are Azure CLI for command-line access checks and automation, and the Azure DevOps MCP server for Claude Code when the team wants to run `/jx-pm:ado`.

## Create Anthropic Account And Request Enterprise Access

Before installing Claude Code, the product owner needs an Anthropic/Claude account tied to the assigned company identity.

Steps:

1. Create or sign in to the Anthropic account using the product owner's Gerasoft email address.
2. Confirm the email verification is complete.
3. Confirm the account can sign in at https://claude.ai.
4. Create an internal access ticket requesting that the user be added to the Anthropic Enterprise account.
5. Assign the ticket to CHOF or Ramon, or ask CHOF or Ramon directly if the team is not using a ticket queue.
6. Include the user's full name, Gerasoft email address, role, project, and requested access level.
7. Wait for confirmation that the user has been added before running Claude Code setup.

Ticket template:

```text
Request: Add product owner to Anthropic Enterprise
User: <full name>
Email: <user@gerasoft.example>
Role: Product Owner
Project: <project name>
Reason: Needs Claude Code access for JX PM onboarding and product workflow.
Approver/contact: CHOF or Ramon
```

Do not share passwords, one-time codes, recovery codes, or Enterprise admin screenshots in the ticket.

## Install Claude Code CLI

Use the CLI for plugin installation, MCP setup, and repeatable verification.

Prerequisites:

- An Anthropic/Claude account with Claude Code access, created or signed in using the assigned Gerasoft account.
- Git SCM installed locally.
- A terminal or command prompt.
- Access to the project repository.

Install with one of the official methods:

```bash
# macOS, Linux, or WSL
curl -fsSL https://claude.ai/install.sh | bash
```

```bash
# macOS with Homebrew
brew install --cask claude-code
```

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

```powershell
# Windows with WinGet
winget install Anthropic.ClaudeCode
```

Verify the install:

```bash
claude --version
claude doctor
```

Authenticate and open the project:

```bash
cd <project>
claude
```

Follow the browser sign-in prompt. On native Windows, install Git SCM for Windows so Claude Code can use Git and Git Bash; WSL setups should install and run Claude Code inside WSL.

## Install Claude Code Desktop

Claude Code Desktop is optional, but it is useful for product owners who prefer a graphical session with local file access, visual diffs, an integrated terminal, and side-by-side review.

Steps:

1. Download Claude from https://claude.com/download.
2. Install the macOS or Windows build. Linux users should use the CLI.
3. Launch Claude and sign in with the same Anthropic account used for Claude Code access.
4. Open the `Code` tab.
5. Start a local session and select the project folder.
6. Use the default permission mode during onboarding.

Claude Code Desktop includes Claude Code for GUI sessions, but install the CLI separately when you need terminal commands such as `claude doctor`, `claude mcp add`, `claude mcp list`, or plugin install commands.

Claude Code CLI and Claude Code Desktop share plugin and MCP settings. The separate Claude Desktop chat app is not the target client for Jodex plugins.

## Install Git SCM

Install Git SCM before GitHub Desktop, GitHub CLI, or Claude Code project work. Git SCM provides the local `git` command used to clone repositories, create branches, commit changes, push work, and let Claude Code inspect repository state.

Use the official Git install page for the workstation platform: https://git-scm.com/install.

macOS options:

```bash
# Recommended when Homebrew is already used on the workstation
brew install git
```

```bash
# Apple's command-line tools option
xcode-select --install
```

Windows options:

```powershell
winget install --id Git.Git -e --source winget
```

Or download the Git for Windows installer from https://git-scm.com/install/windows. During installation, keep command-line `git` available to third-party tools and install Git Bash; Claude Code and GitHub CLI workflows expect `git` to be available from the shell.

Linux options:

```bash
# Debian or Ubuntu
sudo apt-get install git
```

```bash
# Fedora
sudo dnf install git
```

```bash
# Arch Linux
sudo pacman -S git
```

Verify Git SCM:

```bash
git --version
git config --global user.name
git config --global user.email
```

If `user.name` or `user.email` is blank, set them before the first commit:

```bash
git config --global user.name "<First Last>"
git config --global user.email "<github-email@example.com>"
```

Use the same email identity the organization expects for GitHub commits. If the organization uses GitHub noreply emails, configure that address instead of a personal email.

## Set Up GitHub Access

The product owner needs a GitHub account for GitHub Desktop, GitHub CLI, VS Code sign-in, and any GitHub-hosted plugin or issue workflows:

- Create a GitHub.com account if the product owner does not already have one.
- Verify the account email address.
- Configure 2FA if required by the organization.
- Join the correct GitHub organization if plugin or issue access is managed there.
- Complete SSO if the organization requires it.

Install GitHub Desktop from https://desktop.github.com or through the official GitHub Desktop download flow. GitHub Desktop is supported on macOS and Windows; Linux users should use Git plus GitHub CLI.

Authenticate GitHub Desktop:

1. Open GitHub Desktop settings or options.
2. Use the `Accounts` pane.
3. Sign in through the browser.
4. Confirm the target organization and repository are visible.

Install GitHub CLI for terminal workflows:

```bash
# macOS
brew install gh
```

```powershell
# Windows
winget install --id GitHub.cli
```

For Linux, follow the official GitHub CLI installation instructions for the workstation's distribution.

Authenticate and verify:

```bash
gh auth login
gh auth status
```

Use GitHub Desktop for day-to-day branch and commit review if preferred. Use `gh` when the workflow needs repeatable terminal checks or PR creation.

## Install Azure CLI

Install Azure CLI when the product owner needs command-line Azure DevOps access checks, scripted repository setup, or a repeatable way to pair GitHub CLI with Azure Repos operations. The Stack Overflow migration pattern for moving many GitHub repos into Azure DevOps uses this tool chain: GitHub CLI to list source repos, Azure CLI with the Azure DevOps extension to create Azure Repos targets, Git SCM to clone and push, and Git Credential Manager or PAT auth to authenticate.

Windows:

```powershell
winget install --exact --id Microsoft.AzureCLI
```

Close and reopen PowerShell or Command Prompt after installation.

macOS:

```bash
brew update && brew install azure-cli
```

Linux or WSL:

```bash
# Debian or Ubuntu
curl -fsSL https://azurecliprod.blob.core.windows.net/deb_install.sh | sudo bash
```

For Fedora, RHEL, SLES, or other Linux distributions, use the matching Microsoft Azure CLI install instructions for that package manager.

Verify Azure CLI:

```bash
az --version
az version
```

Install or update the Azure DevOps extension:

```bash
az extension add --name azure-devops
az extension update --name azure-devops
az extension show --name azure-devops
```

Sign in and configure the default Azure DevOps organization and project:

```bash
az login
az devops configure --defaults organization=https://dev.azure.com/<organization> project=<project>
```

Verify Azure Repos access:

```bash
az repos list --output table
az devops project show --project <project> --open
```

If the product owner uses GitHub CLI and Azure CLI together, verify both sessions before any scripted repo operation:

```bash
gh auth status
az account show
az repos list --output table
```

Use `gh auth status` for GitHub CLI. Azure CLI does not provide an `az auth status` command; use `az account show` to confirm the active Azure sign-in and subscription context.

Do not use bulk import or mirror-push scripts during onboarding. Use Azure CLI only to verify access unless the repository migration task is explicitly approved by a project administrator.

## Install VS Code

Install VS Code for product-document editing, Markdown preview, and quick source-control review.

Steps:

1. Download VS Code from https://code.visualstudio.com/download.
2. Install the macOS, Windows, or Linux build for the workstation.
3. Open VS Code.
4. Select the Accounts icon.
5. Sign in with the same GitHub account created or verified in the GitHub access step.
6. Turn on Settings Sync if the product owner wants settings, keyboard shortcuts, and extensions to follow them across machines.
7. Open the cloned project folder with `File` -> `Open Folder`.

Verify:

```bash
code --version
```

If `code` is not available in the terminal, VS Code can still be used through the desktop app. Install the shell command from VS Code's command palette only if the user needs terminal launch support.

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

## Install Obsidian

Use Obsidian to read and navigate the project wiki.

Steps:

1. Download Obsidian from https://obsidian.md/download.
2. Install the app for the workstation platform.
3. Open Obsidian.
4. Select `Open folder as vault`.
5. Choose the project's `wiki/` folder.

Open the `wiki/` folder as the vault, not the repository root. This keeps wikilinks, graph view, aliases, and frontmatter queries aligned with the [[Knowledge Base Plugin|jx-kb]] wiki structure.

Useful first pages:

- `_index.md`
- `code/JX PM Onboarding.md`
- `projects/Product Management Skills Plugin.md`
- `plugins/Developer Skills Plugin.md`
- `plugins/Knowledge Base Plugin.md`

## Install The Jodex Plugins

Install the product-management plugin and the wiki companion from the marketplace:

```text
/plugin marketplace add jairosoft-com/jodex-plugins
/plugin install jx-pm@jodex-plugins
/plugin install jx-kb@jodex-plugins
/reload-plugins
```

Installing `jx-pm` also installs [[Developer Skills Plugin|jx-dev]] and [[Core Shared Conventions Plugin|jx-core]] through plugin dependencies. Install `jx-dev` explicitly only if a local plugin manager does not expose `/jx-dev:spec` and `/jx-dev:task` after reload:

```text
/plugin install jx-dev@jodex-plugins
/reload-plugins
```

Confirm these commands are visible:

```text
/jx-pm:prd
/jx-pm:pipeline
/jx-pm:ado
/jx-dev:spec
/jx-dev:task
/jx-kb:init
/jx-kb:ingest
/jx-kb:query
/jx-kb:lint
```

## Prepare The Project Repo

If the project repo was already cloned from Azure Repos through GitHub Desktop, open that local folder in Claude Code, VS Code, Obsidian, and GitHub Desktop.

For terminal-only clone workflows:

```bash
git clone <repo-url> <project>
cd <project>
git switch -c pm-onboarding
```

Or use GitHub Desktop:

1. Select `File` -> `Clone Repository`.
2. Use the `URL` tab for Azure Repos URLs.
3. Paste the Azure Repos URL with the correct username.
4. Clone to a local workspace folder.
5. Create a branch for onboarding or the product-documentation change.

Use this feature folder convention:

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

## Initialize The Project Wiki

Run the wiki init command once from the project root:

```text
/jx-kb:init wiki
```

This creates `wiki/_schema.md`, `wiki/_index.md`, `wiki/_log.md`, `wiki/_backlog.md`, taxonomy directories, and `wiki/raw/sources/`.

Do not manually create or reset the wiki scaffold if `wiki/_schema.md` already exists. If the project already has a wiki, use the existing wiki and run:

```text
/jx-kb:query "What does the wiki say about the current product workflow?" wiki
/jx-kb:lint wiki
```

Use `/jx-kb:ingest <source> wiki` for reusable source documents, product notes, meeting summaries, and decisions that future product owners should be able to retrieve.

## First Product Workflow

Run the first product-owner workflow in this order:

```text
/jx-kb:init wiki
/jx-pm:prd --mode lite --docs-root docs
/jx-dev:spec --docs-root docs
/jx-dev:task --docs-root docs
/jx-pm:ado --dry-run --docs-root docs
```

Use `--mode lite` for a small feature with limited ambiguity. Use `--mode prd` for a larger feature with multiple systems or more than five stories. Use `--mode unified` when the output must combine business justification with tactical delivery detail.

Review each generated artifact before moving to the next step:

1. `/jx-pm:prd` writes `PRD.md` or `BRD_PRD.md`.
2. `/jx-dev:spec` reads the PRD and writes `TECH_SPEC.md`.
3. `/jx-dev:task` reads the PRD and spec, then writes `task.json`.
4. `/jx-pm:ado --dry-run` previews Azure Boards changes without writing external work items.

`/jx-pm:pipeline` is currently a reduced wrapper for PRD generation. It does not run the full PRD -> spec -> task -> ADO workflow. Run the manual sequence above for the full delivery flow.

## Optional MCP Server Setup

Configure MCP servers only after Claude Code is installed, the user is authenticated, and the related service access has been verified. Use user-scoped MCP servers for onboarding unless the team intentionally wants to commit a shared `.mcp.json` project configuration.

### Azure DevOps MCP

Configure Azure DevOps MCP when the product owner will run `/jx-pm:ado`, inspect Azure Boards, or query Azure Repos through Claude Code.

Prerequisites:

- Claude Code CLI installed and authenticated.
- Node.js 20 or newer.
- Azure DevOps organization and project access.
- Azure CLI installed if using Azure CLI authentication.
- The organization short name, not the full URL. For `https://dev.azure.com/contoso`, use `contoso`.

Microsoft now recommends the remote Azure DevOps MCP Server first where the client supports streamable HTTP. For Claude Code onboarding, keep the local stdio server path as the default because it is explicit, easy to inspect with `claude mcp get`, and compatible with `/jx-pm:ado` tool-surface checks.

Install the local server with focused domains for PM/ADO sync:

```bash
node --version
claude --version
claude mcp add azure-devops --scope user -- npx -y @azure-devops/mcp <organization> -d core work work-items search
```

If the product owner already authenticated through Azure CLI and the org prefers that path:

```bash
az login
claude mcp add azure-devops --scope user -- npx -y @azure-devops/mcp <organization> --authentication azcli -d core work work-items search
```

Native Windows users may need the `cmd /c` wrapper for `npx` MCP servers:

```powershell
claude mcp add azure-devops --scope user -- cmd /c npx -y @azure-devops/mcp <organization> -d core work work-items search
```

Verify:

```bash
claude mcp list
claude mcp get azure-devops
```

Then open Claude Code in the project and run:

```text
/mcp
```

Confirm the `azure-devops` server is connected and exposes work-item create, update, read, link, child-link, batch-get, and search capabilities before any live sync. The first onboarding sync must be dry-run only:

```text
/jx-pm:ado --dry-run --docs-root docs
```

Run live `/jx-pm:ado` only after the dry run shows the expected organization, project, feature folder, and work item hierarchy.

### GitHub MCP

Configure GitHub MCP only when the product owner needs Claude Code to inspect or work with GitHub repositories, issues, pull requests, or project metadata through MCP. GitHub Desktop, GitHub CLI, and VS Code sign-in remain the normal product-owner workflow; MCP adds Claude tool access.

Prerequisites:

- GitHub account created and verified.
- GitHub CLI authenticated with `gh auth status`.
- Docker Desktop installed and running for the Docker-based local server path.
- A GitHub Personal Access Token with the narrowest repo, issue, and pull-request scopes needed for the work.

Create the token in GitHub, store it in a password manager, and do not commit it to the repo. Then add the server to Claude Code:

```bash
claude mcp add github --scope user --env GITHUB_PERSONAL_ACCESS_TOKEN=<github_pat> -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

Native Windows users may need:

```powershell
claude mcp add github --scope user --env GITHUB_PERSONAL_ACCESS_TOKEN=<github_pat> -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

Verify:

```bash
docker --version
claude mcp list
claude mcp get github
```

Then open Claude Code in the project and run:

```text
/mcp
```

Confirm the `github` server is connected before asking Claude Code to inspect GitHub issues, PRs, or repositories through MCP. Do not use broad PAT scopes unless the task explicitly requires them.

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

- `claude --version` succeeds.
- `claude doctor` succeeds.
- The product owner's Anthropic account uses their Gerasoft email address and has been added to the Anthropic Enterprise account by CHOF or Ramon.
- `git --version` succeeds.
- `git config --global user.name` and `git config --global user.email` return the expected commit identity.
- A GitHub account exists, has a verified email, and satisfies required 2FA or SSO rules.
- `az --version` succeeds if Azure CLI is installed.
- `az account show` succeeds after `az login`; do not use `az auth status`.
- `az extension show --name azure-devops` succeeds if Azure DevOps CLI operations are needed.
- `az repos list --output table` shows the expected Azure Repos after defaults are configured.
- VS Code is installed and signed in with the product owner's GitHub account.
- Claude Code Desktop can open the project in the `Code` tab if Desktop is used.
- GitHub Desktop is signed in with the product owner's GitHub account if Desktop is used.
- `gh auth status` succeeds if GitHub CLI is used.
- Azure DevOps access is confirmed by opening `Repos` -> `Files` in the target project.
- GitHub Desktop cloned the Azure Repo from the username-bearing HTTPS URL.
- `git remote -v` shows a `dev.azure.com` URL without embedded credentials.
- Obsidian opens the project's `wiki/` folder as a vault.
- `/reload-plugins` completed after plugin installation.
- `/jx-pm:prd`, `/jx-pm:pipeline`, and `/jx-pm:ado` are visible.
- `/jx-dev:spec` and `/jx-dev:task` are visible.
- `/jx-kb:init`, `/jx-kb:ingest`, `/jx-kb:query`, and `/jx-kb:lint` are visible.
- `wiki/_schema.md` exists if a wiki was initialized.
- The feature folder matches `docs/{NNN}_{feature_name}/`.
- `PRD.md` or `BRD_PRD.md` exists after `/jx-pm:prd`.
- `TECH_SPEC.md` exists after `/jx-dev:spec`.
- `task.json` exists after `/jx-dev:task`.
- `task.json` is valid JSON:

```bash
python3 -m json.tool docs/006_payment_gateway/task.json
```

- `claude mcp list` includes `azure-devops` before `/jx-pm:ado`.
- `claude mcp get github` succeeds if GitHub MCP is configured.
- `docker --version` succeeds before using the Docker-based GitHub MCP server.
- `/jx-pm:ado --dry-run` succeeds before any live Azure Boards sync.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Product owner cannot find the product-owner command | The live marketplace plugin is named `jx-pm` | Install `jx-pm@jodex-plugins` |
| Claude Code access fails after Anthropic sign-in | User created a Claude account but was not added to Anthropic Enterprise | Create or update the internal ticket and ask CHOF or Ramon to add the Gerasoft email to the Enterprise account |
| `claude: command not found` | CLI install path is not loaded | Open a new terminal and rerun the official installer if needed |
| Desktop `Code` tab is unavailable | Account does not have Claude Code access | Sign in with an account that has Claude Code access |
| `git: command not found` | Git SCM is not installed or not on PATH | Install Git SCM, open a new terminal, and rerun `git --version` |
| Commits show the wrong author | Global Git identity is missing or wrong | Set `git config --global user.name` and `git config --global user.email` |
| `az: command not found` | Azure CLI is not installed or the terminal was not restarted | Install Azure CLI, close and reopen the terminal, then run `az --version` |
| `az auth status` fails | Azure CLI does not have an `auth status` subcommand | Use `az account show` after `az login` |
| `az devops` is unavailable | Azure DevOps CLI extension is missing | Run `az extension add --name azure-devops`, then verify with `az extension show --name azure-devops` |
| `az repos list` fails | Azure CLI is not signed in, defaults are wrong, or the product owner lacks Azure Repos access | Run `az login`, configure defaults, and confirm access in Azure DevOps |
| VS Code is not signed in | GitHub account was not created or not connected in VS Code | Create or verify the GitHub account, then sign in from the VS Code Accounts menu |
| GitHub Desktop cannot clone the Azure Repo | Missing Azure Repos access, wrong username in the URL, stale credentials, or an invalid generated password/PAT | Confirm Azure DevOps access, replace `jairo` in the URL, clear stale credentials, then retry the clone |
| `gh auth status` fails | GitHub CLI is not authenticated | Run `gh auth login` and follow the browser flow |
| Azure Repo is not visible | Product owner lacks Azure DevOps project or repo access | Ask the project admin for Basic access and the correct Readers or Contributors group |
| Azure Repos clone prompts repeatedly for credentials | Git Credential Manager is disabled or stale, or the generated credential/PAT is wrong | Enable `Use Git Credential Manager`, clear stale stored credentials, verify the username in the URL, then retry with a fresh sign-in or token |
| Azure clone URL still contains `jairo` | Template URL was not personalized | Replace `jairo` with the product owner's Azure DevOps username before cloning |
| Obsidian graph is empty | Wrong folder opened as vault | Open the project `wiki/` folder, not the repo root |
| `/jx-pm:*` commands are missing | Plugin not installed or not reloaded | Install `jx-pm@jodex-plugins`, then run `/reload-plugins` |
| `/jx-dev:*` commands are missing | Dependency did not load or plugin was not reloaded | Run `/reload-plugins`, then install `jx-dev@jodex-plugins` if needed |
| `/jx-kb:*` commands are missing | Wiki plugin not installed | Install `jx-kb@jodex-plugins`, then run `/reload-plugins` |
| `/jx-pm:pipeline` does not create spec/task/ADO work items | Pipeline is currently reduced to PRD generation | Run `/jx-pm:prd`, `/jx-dev:spec`, `/jx-dev:task`, then `/jx-pm:ado` manually |
| Skill rejects the folder path | Folder does not match `{NNN}_{feature_name}` | Rename the folder, for example `006_payment_gateway` |
| ADO dry-run fails before writes | Azure DevOps MCP is missing or exposes the wrong tools | Fix MCP setup and verify `/mcp` before retrying |
| ADO sync points to the wrong project | Tenant binding or MCP organization is wrong | Stop before live sync and correct the organization/project |
| GitHub MCP does not start | Docker Desktop is not running, the PAT is invalid, or MCP was added without the token env var | Start Docker Desktop, create a narrow GitHub PAT, rerun `claude mcp add github`, and verify with `claude mcp get github` |

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
- [Git SCM install for Windows](https://git-scm.com/install/windows)
- [Git SCM install for macOS](https://git-scm.com/install/mac)
- [Git SCM install for Linux](https://git-scm.com/install/linux)
- [GitHub account setup](https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account)
- [Azure CLI install](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Azure CLI install on Windows](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest)
- [Azure CLI install on macOS](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-macos?view=azure-cli-latest)
- [Azure CLI install on Linux](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?view=azure-cli-latest)
- [Azure DevOps CLI quickstart](https://learn.microsoft.com/en-us/azure/devops/cli/?view=azure-devops)
- [Stack Overflow - GitHub CLI and Azure CLI repo migration pattern](https://stackoverflow.com/questions/75364559/is-there-a-way-to-import-multiple-repos-at-once-from-github-into-azure-devops)
- [VS Code download](https://code.visualstudio.com/download)
- [VS Code setup overview](https://code.visualstudio.com/docs/setup/setup-overview)
- [VS Code Settings Sync and GitHub sign-in](https://code.visualstudio.com/docs/configure/settings-sync)
- [Azure DevOps add organization users](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/add-organization-users?view=azure-devops)
- [Azure Repos clone guide](https://learn.microsoft.com/en-us/azure/devops/repos/git/clone?view=azure-devops)
- [Azure Repos authentication overview](https://learn.microsoft.com/en-us/azure/devops/repos/git/auth-overview?view=azure-devops)
- [Azure DevOps personal access tokens](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops)
- [GitHub Desktop clone by URL](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop)
- [GitHub Desktop Azure DevOps integration](https://github.com/desktop/desktop/blob/development/docs/integrations/azure-devops.md)
- [Azure DevOps MCP Server](https://github.com/microsoft/azure-devops-mcp)
- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [Claude Code MCP documentation](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Docker Desktop](https://docs.docker.com/desktop/)
- [Claude Code CLI quickstart](https://code.claude.com/docs/en/quickstart)
- [Claude Code Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart)
- [Claude Code Desktop reference](https://code.claude.com/docs/en/desktop)
- [GitHub CLI installation](https://github.com/cli/cli)
- [GitHub CLI quickstart](https://docs.github.com/en/github-cli/github-cli/quickstart)
- [GitHub CLI auth status](https://cli.github.com/manual/gh_auth_status)
- [GitHub Desktop installation](https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop)
- [GitHub Desktop authentication](https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/authenticating-to-github-in-github-desktop)
- [Obsidian download](https://obsidian.md/download)
- [Obsidian install guide](https://obsidian.md/help/install)
