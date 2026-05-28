---
title: JX Foundational Onboarding
type: code
tags: [onboarding, setup, claude-code, git, github, python, nodejs, jx-kb, shared]
created: 2026-05-12
updated: 2026-05-12
source_count: 3
aliases: [Foundational Onboarding, Common Onboarding, Shared Onboarding, Base Onboarding]
provenance: synthesis
---

# JX Foundational Onboarding

This guide covers the shared prerequisite setup required by every Jodex project role — PM, Dev, and QA. It installs common tooling, configures Git and GitHub identity, sets up Azure DevOps access, installs runtimes, and registers the shared Jodex plugins. After completing this guide, proceed to your role-specific onboarding.

## Tooling Checklist

| Tool | Required? | Used for |
|------|-----------|----------|
| Anthropic account (Enterprise) | Yes | Claude Code access via Gerasoft identity |
| [[Claude Code CLI]] | Yes | Plugin install, MCP setup, terminal sessions, verification |
| [[Claude Code Desktop]] | Yes | GUI coding/product sessions with Code tab; shared plugin and MCP settings |
| Git SCM | Yes | Local source control; required by Claude Code, GitHub Desktop, GitHub CLI |
| GitHub account | Yes | Sign in to GitHub Desktop, GitHub CLI, and VS Code |
| Azure DevOps account | Yes | Org invite, project access, Azure Repos visibility |
| GitHub CLI (`gh`) | Yes | Auth verification, PR creation, terminal workflows |
| GitHub Desktop | Yes (macOS/Windows); Linux/WSL: Git + GitHub CLI instead | Branch, commit, push, and PR workflow |
| Azure CLI + azure-devops extension | Yes | ADO command-line access; required before ADO MCP |
| Azure DevOps MCP | Yes | Enables `/jx-pm:ado` and ADO tool surface in Claude Code |
| jx-core plugin | Yes | Shared conventions baseline for all jx-* plugins |
| jx-kb plugin | Yes | Project wiki: init, ingest, query, lint |
| VS Code (or Project IDX / Cursor) | Yes | Code editor; GitHub sign-in; Settings Sync |
| [[Obsidian]] | Yes | Read and navigate project `wiki/` vault |
| uv | Yes | Python tooling manager; required by QA + jx-kb helpers |
| Python 3 | Yes | Required by QA (`openpyxl`, `playwright`), jx-kb helpers, and jx-qa direct calls |
| Node.js 20+ | Yes | Required by ADO MCP (`npx`), QA Playwright, PM/Dev workflows |

## Create Anthropic Account And Request Enterprise Access

Before installing Claude Code, you need an Anthropic account tied to your assigned company identity.

Steps:

1. Create or sign in to the Anthropic account using your Gerasoft email address.
2. Confirm email verification is complete.
3. Confirm the account can sign in at https://claude.ai.
4. Create an internal access ticket requesting that you be added to the Anthropic Enterprise account.
5. Assign the ticket to CHOF or Ramon, or ask CHOF or Ramon directly if the team is not using a ticket queue.
6. Include your full name, Gerasoft email address, role, project, and requested access level.
7. Wait for confirmation that you have been added before running Claude Code setup.

Ticket template:

```text
Request: Add team member to Anthropic Enterprise
User: <full name>
Email: <user@gerasoft.example>
Role: <Role>
Project: <project name>
Reason: Needs Claude Code access for Jodex project onboarding.
Approver/contact: CHOF or Ramon
```

Do not share passwords, one-time codes, recovery codes, or Enterprise admin screenshots in the ticket.

## Install Claude Code CLI

Use the CLI for plugin installation, MCP setup, and repeatable verification.

Prerequisites:

- An Anthropic account with Claude Code access.
- Git SCM installed locally.
- A terminal or command prompt.

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

Claude Code Desktop is **required** for all roles. All Jodex workflows use the `Code` tab and shared MCP/plugin settings.

> **Note:** Claude Code Desktop (the app with a `Code` tab for project sessions) is distinct from the Claude Desktop chat app. They have separate configurations. Jodex plugins and MCP servers are configured for Claude Code Desktop, not the chat app.

Steps:

1. Download Claude from https://claude.com/download.
2. Install the macOS or Windows build. Linux users should use the CLI.
3. Launch Claude and sign in with the same Anthropic account used for Claude Code access.
4. Open the `Code` tab.
5. Start a local session and select the project folder.
6. Use the default permission mode during onboarding.

Claude Code CLI and Claude Code Desktop share plugin and MCP settings when installed from the same account. Install the CLI separately for terminal commands such as `claude doctor`, `claude mcp add`, `claude mcp list`, and plugin install commands.

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

## Set Up GitHub Account And GitHub CLI

You need a GitHub account for GitHub Desktop, GitHub CLI, VS Code sign-in, and any GitHub-hosted plugin or issue workflows.

- Create a GitHub.com account if you do not already have one.
- Verify the account email address.
- Configure 2FA if required by the organization.
- Join the correct GitHub organization if plugin or issue access is managed there.
- Complete SSO if the organization requires it.

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

## Set Up Azure DevOps Account

All Jodex project members provision Azure DevOps access upfront, regardless of role.

Steps:

1. Accept the Azure DevOps organization invitation (sent by CHOF or Ramon).
2. Sign in at `https://dev.azure.com/<organization>`.
3. Open the target project and confirm `Repos` → `Files` shows the expected repository.
4. Confirm your access level is `Basic` and group is `Contributors` (or `Readers` for read-only work).

After Azure CLI is installed (section below), bind the tenant explicitly:

```bash
az devops configure --defaults organization=https://dev.azure.com/<organization> project=<project>
```

Verify the binding:

```bash
az devops project show
az repos list --output table
```

`az devops project show` must run without a `--project` flag to confirm defaults are set. `az repos list` must show the expected repository.

## Install uv

uv is required for all roles. QA onboarding and jx-kb helper workflows depend on it.

macOS/Linux:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

macOS with Homebrew:

```bash
brew install uv
```

Windows with WinGet:

```powershell
winget install --id=astral-sh.uv
```

Verify:

```bash
uv --version
```

## Install Python 3

Python 3 is required for all roles. Use the system `python3` and `pip` — not uv-managed shims — for direct interpreter calls.

macOS:

```bash
brew install python3
```

Or use the system Python 3 (pre-installed on macOS 12+). Verify:

```bash
python3 --version
python3 -m pip --version
```

Windows:

```powershell
winget install Python.Python.3
```

Or download from https://python.org/downloads.

Linux/WSL:

```bash
sudo apt-get install python3 python3-pip
```

- Role docs add role-specific packages via `python3 -m pip install <package>`. Always use `python3 -m pip`, not bare `pip`, to ensure packages install into the correct interpreter.
- uv (section above) handles project-level Python management for jx-kb helper workflows. It does NOT replace the system `python3` for jx-qa direct calls.

## Install Node.js 20+

Node.js 20 or newer is required for all roles: ADO MCP uses `npx`, QA uses Playwright, and PM/Dev workflows depend on Node tooling.

macOS:

```bash
brew install node
```

Windows:

```powershell
winget install OpenJS.NodeJS.LTS
```

Linux/WSL:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify:

```bash
node --version   # must be 20+
npm --version
```

## Install GitHub Desktop

GitHub Desktop is required on macOS and Windows. Linux/WSL users use Git + GitHub CLI instead.

1. Download from https://desktop.github.com.
2. Install the macOS or Windows build.
3. Open GitHub Desktop settings → `Accounts`.
4. Sign in through the browser with the GitHub account created in the previous section.
5. Confirm the target organization and repositories are visible.

Use GitHub Desktop for day-to-day branch and commit review. Use `gh` when the workflow needs repeatable terminal checks or PR creation.

## Install Azure CLI

Azure CLI is required for all roles: it is used for Azure DevOps access checks, scripted repository setup, and authenticating the ADO MCP server.

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
```

Install or update the Azure DevOps extension:

```bash
az extension add --name azure-devops
az extension update --name azure-devops
az extension show --name azure-devops
```

Sign in and configure defaults:

```bash
az login
az devops configure --defaults organization=https://dev.azure.com/<organization> project=<project>
```

Verify:

```bash
az account show
az repos list --output table
```

Use `az account show` to confirm the active Azure sign-in; Azure CLI does not have `az auth status`.

## Install VS Code

VS Code is required for all roles. Acceptable alternatives include Project IDX (Google) or any editor with GitHub integration — document the chosen editor in the team wiki.

Steps:

1. Download VS Code from https://code.visualstudio.com/download.
2. Install the macOS, Windows, or Linux build.
3. Open VS Code.
4. Select the `Accounts` icon and sign in with the GitHub account from the previous steps.
5. Turn on Settings Sync to carry settings, shortcuts, and extensions across machines.

Verify:

```bash
code --version
```

## Install Obsidian

Obsidian is required for all roles. Open only the `wiki/` folder as the vault.

Steps:

1. Download Obsidian from https://obsidian.md/download.
2. Install the app for the workstation platform.
3. Open Obsidian and select `Open folder as vault`.
4. Choose the project's `wiki/` folder — **not** the repository root.

Opening `wiki/` as the vault (not the repo root) keeps wikilinks, graph view, aliases, and frontmatter queries aligned with the [[Knowledge Base Plugin|jx-kb]] wiki structure.

Verify: wikilinks and graph view resolve correctly.

## Set Up Azure DevOps MCP

The ADO MCP server is required for all roles. It enables the ADO tool surface in Claude Code.

Prerequisites:

- Node.js 20+ installed (verify: `node --version`).
- Azure CLI authenticated and defaults configured (`az account show`, `az devops project show`).

Install using `--authentication azcli` to reuse the already-verified Azure CLI session:

```bash
claude mcp add azure-devops --scope user -- npx -y @azure-devops/mcp <organization> --authentication azcli -d core work work-items search
```

Replace `<organization>` with the organization short name — for `https://dev.azure.com/contoso`, use `contoso`.

Native Windows users may need the `cmd /c` wrapper:

```powershell
claude mcp add azure-devops --scope user -- cmd /c npx -y @azure-devops/mcp <organization> --authentication azcli -d core work work-items search
```

Verify:

```bash
claude mcp list
claude mcp get azure-devops
```

Then in Claude Code:

```text
/mcp
```

Confirm `azure-devops` is connected. Ask Claude Code to list Azure DevOps projects — the result must match the org and project configured via `az devops configure --defaults`.

The first ADO use must be dry-run only:

```text
/jx-pm:ado --dry-run --docs-root docs
```

## Register Jodex Marketplace, Install jx-core And jx-kb

All roles install the marketplace, jx-core (universal dependency), and jx-kb (wiki plugin) in foundation. Role-specific plugins are installed in the role-specific onboarding.

```text
/plugin marketplace add jairosoft-com/jodex-plugins
/plugin install jx-core@jodex-plugins
/plugin install jx-kb@jodex-plugins
/reload-plugins
```

Confirm these commands are visible after reload:

```text
/jx-kb:init
/jx-kb:ingest
/jx-kb:query
/jx-kb:lint
```

This is the first `/reload-plugins`. Your role-specific onboarding will install the role plugin and run a second `/reload-plugins`.

## Clone Project Repo And Create Working Branch

Foundation covers prerequisites only — it does **not** execute the clone. Clone execution is role-specific:

- **PM:** Azure Repos + GitHub Desktop + GCM credential flow (see [[JX PM Onboarding]])
- **Dev/QA:** `git clone <repo-url>` + `git switch -c <branch>`

Verify Git and GitHub CLI are ready before your role-specific onboarding:

```bash
git --version
gh auth status
```

Your role-specific onboarding will walk you through the actual clone step.

## Initialize Wiki

Run the wiki init command once from the project root:

```text
/jx-kb:init wiki
```

This creates `wiki/_schema.md`, `wiki/_index.md`, `wiki/_log.md`, `wiki/_backlog.md`, taxonomy directories, and `wiki/raw/sources/`.

> [!warning] **If `wiki/_schema.md` already exists, the wiki has already been initialized.**
> Do NOT run `/jx-kb:init wiki` again — it will prompt to reset schema files and can overwrite existing wiki structure. Skip this step and proceed to your role-specific onboarding.

## Verification Checklist

- `claude --version` succeeds.
- `claude doctor` succeeds.
- Anthropic account uses Gerasoft email and has been added to Anthropic Enterprise by CHOF or Ramon.
- `git --version` succeeds.
- `git config --global user.name` and `git config --global user.email` return the correct identity.
- GitHub account exists, has a verified email, and satisfies required 2FA or SSO rules.
- `gh auth status` succeeds.
- Azure DevOps account confirmed: org, project, and repo visible in DevOps portal.
- `uv --version` succeeds.
- `python3 --version` returns Python 3.x.
- `python3 -m pip --version` succeeds.
- `node --version` returns 20+.
- `npm --version` succeeds.
- macOS/Windows: GitHub Desktop installed and authenticated with GitHub account.
- Linux/WSL: GitHub Desktop skipped; Git + GitHub CLI covers clone/branch/PR workflow.
- `az --version` succeeds.
- `az account show` returns the active subscription after `az login`.
- `az extension show --name azure-devops` succeeds.
- `code --version` succeeds.
- Obsidian opens the project `wiki/` folder as vault.
- `claude mcp list` includes `azure-devops`.
- `/mcp` in Claude Code shows `azure-devops` connected.
- `/reload-plugins` completed after jx-core + jx-kb install.
- `/jx-kb:init`, `/jx-kb:ingest`, `/jx-kb:query`, `/jx-kb:lint` are visible.
- `wiki/_schema.md` exists after `/jx-kb:init wiki`.
- `git --version` and `gh auth status` confirm Git + GitHub CLI are ready for role-specific clone.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `claude: command not found` | CLI install path is not loaded | Open a new terminal and rerun the official installer |
| `claude doctor` fails | Missing dependency or auth issue | Follow the output instructions; re-authenticate if needed |
| Desktop `Code` tab unavailable or asks to upgrade | Account does not have Claude Code access | Sign in with an account that has Claude Code access |
| Desktop 403 or auth errors | Wrong Anthropic account or session expired | Sign out, sign back in with the Gerasoft account |
| Windows Desktop local session fails | Git SCM not installed or not on PATH | Install Git for Windows; restart Claude Code Desktop |
| `git: command not found` | Git SCM is not installed or not on PATH | Install Git SCM, open a new terminal, rerun `git --version` |
| Commits show wrong author | Global Git identity is missing or wrong | Set `git config --global user.name` and `git config --global user.email` |
| `gh auth status` fails | GitHub CLI is not authenticated | Run `gh auth login` and follow the browser flow |
| GitHub account or 2FA/SSO issues | Account setup incomplete | Verify email, enable 2FA, complete SSO per org policy |
| `/jx-kb:*` commands missing | jx-kb plugin not installed or not reloaded | Run `/plugin install jx-kb@jodex-plugins` then `/reload-plugins` |

## Related Patterns

- [[Layered Developer Onboarding]]
- [[Identity And Access Ladder]]
- [[Executable Setup Documentation]]

## Sources

- [[JX PM Onboarding]]
- [[JX Dev Onboarding]]
- [[JX QA Onboarding]]
