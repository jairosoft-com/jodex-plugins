---
title: JX Dev Onboarding
type: code
tags: [jx-dev, jx-kb, onboarding, setup, claude-code, github, azure-devops, mcp]
created: 2026-05-11
updated: 2026-05-12
source_count: 0
aliases: [Developer onboarding, Jodex dev onboarding, jx-dev setup, jx-kb setup]
provenance: synthesis
---

# JX Dev Onboarding

This guide is for a developer who needs to use the [[Developer Skills Plugin|jx-dev]] plugin in a project delivery workflow. After onboarding, the developer should be able to install Claude Code CLI or Claude Code Desktop, install the Jodex plugins, initialize the [[Knowledge Base Plugin|jx-kb]] wiki, prepare a feature folder, generate `TECH_SPEC.md`, generate `task.json`, and understand which adjacent tools are needed for GitHub and Azure DevOps handoff.

`jx-dev` itself is a document-generation plugin. It does not sync to Azure Boards and does not call external MCP tools. Azure DevOps MCP is needed only when the generated `task.json` is passed to [[Product Management Skills Plugin|jx-pm]] through `/jx-pm:ado`.

`jx-kb` is the project knowledge-base companion. It gives the developer a local wiki for setup decisions, architecture notes, source summaries, troubleshooting, and later retrieval.

## Tooling Checklist

| Tool | Required for `jx-dev`? | Used for |
|------|------------------------|----------|
| Claude Code CLI | Yes | Terminal-driven onboarding, Jodex plugin install, and MCP setup |
| Claude Code Desktop | Optional | GUI coding sessions, visual diffs, and plugin management |
| Jodex marketplace plugin | Yes | Installing `jx-dev`, `jx-kb`, and the `jx-core` dependency |
| Git | Recommended | Cloning the project and reviewing generated docs |
| GitHub access or GitHub CLI | Recommended | Branches, pull requests, and source repository access |
| Python 3 | No, but required for `jx-kb` | Runs `jx-kb` stdlib-only helper scripts |
| Azure DevOps access | Optional | Reviewing or consuming work items after ADO sync |
| Azure DevOps MCP server | Optional | Required only for `/jx-pm:ado` sync from `task.json` to Azure Boards |
| Node.js 20+ | Optional | Required by the local Azure DevOps MCP server |
| Playwright | No for `jx-dev` | Needed by `jx-qa`, not by `/jx-dev:spec`, `/jx-dev:task`, or `jx-kb` wiki setup |

Azure DevOps is a hosted service, not a local binary to install. The local requirement is that Claude has an Azure DevOps MCP server configured and authenticated when the team wants to run `/jx-pm:ado`.

## Install Claude Code CLI

Use the Claude Code CLI for the terminal-driven setup steps in this guide.

Prerequisites:

- macOS 13+, Windows 10 1809 or newer, Windows Server 2019 or newer, Ubuntu 20.04+, Debian 10+, Alpine 3.19+, or WSL.
- 4 GB or more RAM.
- x64 or ARM64 CPU.
- Internet access to authenticate and reach Claude services.
- A Pro, Max, Team, Enterprise, or Console account. The free Claude.ai plan does not include Claude Code access.
- Git. On native Windows, Git for Windows is recommended so Claude Code can use Bash. WSL setups do not need Git for Windows.

Install with the native installer for the developer's platform:

```bash
# macOS, Linux, or WSL
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

```cmd
:: Windows CMD
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

Optional package-manager installs:

```bash
# macOS with Homebrew
brew install --cask claude-code
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

Follow the browser sign-in prompt. If the developer is on Windows, choose one environment and stay consistent: use native Windows for Windows-native projects, or install and run Claude Code inside WSL for Linux toolchains and sandboxed command execution.

## Install Claude Code Desktop

Claude Code Desktop is optional but useful for developers who prefer a graphical coding session with visual diffs, an integrated terminal, file editor, and preview panes.

Steps:

1. Download Claude Desktop from the official download page: https://claude.com/download.
2. Install the macOS or Windows build. The desktop app is not available on Linux; Linux developers should use Claude Code CLI.
3. Launch Claude from Applications on macOS or the Start menu on Windows.
4. Sign in with the same Anthropic account used for Claude Code access.
5. Open the `Code` tab. If the Code tab prompts for an upgrade, confirm the account has a Pro, Max, Team, or Enterprise subscription.
6. On Windows, install Git for Windows before starting local Code sessions, then restart Claude Desktop.
7. Start a local session: choose `Local`, select the project folder, select a model, and keep the default Ask permissions mode for onboarding.

Claude Code Desktop includes Claude Code and does not require Node.js or the CLI for local GUI sessions. Install the CLI separately when the developer needs terminal commands such as `claude mcp add`, `claude mcp list`, or `claude doctor`.

Desktop plugin install path:

1. Start a local or SSH session.
2. Click the `+` button next to the prompt box.
3. Select `Plugins`.
4. Choose `Add plugin` to browse configured marketplaces, or `Manage plugins` to enable, disable, or uninstall plugins.

Claude Code CLI and Claude Code Desktop share settings, project instructions, MCP servers from `~/.claude.json` or `.mcp.json`, and installed plugins. MCP servers configured only for the separate Claude Desktop chat app in `claude_desktop_config.json` do not appear in Claude Code Desktop's Code tab.

## Install The Jodex Plugins

Install `jx-dev` and `jx-kb` from the marketplace:

```text
/plugin marketplace add jairosoft-com/jodex-qa-ai
/plugin install jx-dev@jodex-plugins
/plugin install jx-kb@jodex-plugins
/reload-plugins
```

Installing `jx-dev` also installs [[Core Shared Conventions Plugin|jx-core]] through the plugin dependency declaration. Install `jx-pm` too if the developer will generate PRDs or sync generated tasks to Azure Boards:

```text
/plugin install jx-pm@jodex-plugins
/reload-plugins
```

For local marketplace development from this repo:

```bash
claude plugin marketplace add /path/to/jodex-qa-ai --scope project
claude plugin install jx-dev@jodex-plugins
claude plugin install jx-kb@jodex-plugins
```

In Claude Code Desktop, install the same plugins through `+` -> `Plugins` -> `Add plugin`, then reload or restart the session if the new slash commands are not visible. If the Jodex marketplace is not visible in Desktop, install it once through the CLI commands above; CLI and Desktop share the plugin registry.

## Prepare The Project Repo

Clone the project and create a working branch:

```bash
git clone <repo-url> <project>
cd <project>
git switch -c jx-dev-onboarding
```

If the project uses GitHub CLI, authenticate before opening PRs:

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

## Initialize Knowledge Base

Run the wiki init command once from the project root:

```text
/jx-kb:init wiki
```

This creates `wiki/_schema.md`, `wiki/_index.md`, `wiki/_log.md`, `wiki/_backlog.md`, taxonomy directories, and `wiki/raw/sources/`.

Do not manually create `wiki/_schema.md` or blindly reinitialize an existing wiki. If `wiki/_schema.md` already exists, the init skill stops and asks before resetting schema files while preserving existing pages.

After initialization:

```text
/jx-kb:ingest <source> wiki
/jx-kb:query "<question>" wiki
/jx-kb:lint wiki
```

Use ingest for PRDs, setup notes, architecture references, and troubleshooting writeups. Use query when a developer needs project knowledge with wiki citations. Use lint to check for broken links, frontmatter issues, index drift, stale claims, and raw ideas that need triage.

## Install Azure DevOps MCP For Claude Code

Use the local Azure DevOps MCP server for Claude Code. Microsoft's hosted remote Azure DevOps MCP server is in preview, but Microsoft currently documents it as supported only for Visual Studio and Visual Studio Code; Claude Code should use the local stdio server until remote support is available for this client.

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

The `-d core work work-items search` domain filter keeps the loaded toolset focused on the capabilities needed by `/jx-pm:ado`: project lookup, work-item create/update/read/link operations, and work-item search. Omit the `-d ...` flags only when the developer intentionally needs the full Azure DevOps tool surface.

The default authentication method is interactive browser login. On first use, Claude Code starts the MCP server and the Azure DevOps MCP package opens a Microsoft sign-in flow. Sign in with the account that has access to the selected Azure DevOps organization.

If the workstation already uses Azure CLI authentication, install with Azure CLI auth instead:

```bash
az login
claude mcp add azure-devops -- npx -y @azure-devops/mcp <organization> --authentication azcli -d core work work-items search
```

Do not put Personal Access Tokens in repo-tracked files. If a non-interactive PAT setup is required, store the token outside the repo and follow the official Azure DevOps MCP `pat` authentication guidance.

Verify the server:

```bash
claude mcp list
claude mcp get azure-devops
```

Then open Claude Code in the project and run:

```text
/mcp
```

Confirm the `azure-devops` server is connected. If Claude Code asks which tools to allow, enable the project, work, work-item, and search tools. As a smoke test, ask Claude Code to list Azure DevOps projects for the organization before running any write operation.

If the wrong organization was configured, remove and re-add the server:

```bash
claude mcp remove azure-devops
claude mcp add azure-devops -- npx -y @azure-devops/mcp <correct-organization> -d core work work-items search
```

## First Workflow

Run the first workflow in this order:

```text
/jx-kb:init wiki
/jx-dev:spec --docs-root docs
/jx-dev:task --docs-root docs
```

The skill asks for the feature folder, reads `PRD.md` or `BRD_PRD.md`, checks for vague requirements and missing constraints, asks 3-7 architecture questions, then writes:

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

The configured Azure DevOps MCP surface must expose work-item create, update, get, batch-get, link, child-link, and search capabilities. If those tools are not available, stop at `task.json` and fix the MCP configuration before attempting sync. If the installed MCP server exposes a different tool naming shape than the `/jx-pm:ado` command allowlist expects, update the plugin command manifest before attempting live sync.

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

- `claude --version` and `claude doctor` succeed for CLI users.
- Running `claude` from the project opens an authenticated Claude Code session.
- Claude Code Desktop users can open the `Code` tab, select a local project folder, and see the plugin UI.
- Windows Desktop users have Git for Windows installed and have restarted Claude Desktop.
- `/reload-plugins` completed after plugin installation.
- `/jx-dev:spec` and `/jx-dev:task` are visible commands.
- `/jx-kb:init`, `/jx-kb:ingest`, `/jx-kb:query`, and `/jx-kb:lint` are visible commands.
- `wiki/_schema.md` exists after `/jx-kb:init wiki`.
- `node --version` reports Node.js 20 or newer before Azure DevOps MCP setup.
- `claude mcp list` includes `azure-devops`.
- `/mcp` in Claude Code shows the Azure DevOps MCP server connected.
- Claude Code can list Azure DevOps projects for the configured organization.
- The feature folder has `PRD.md` or `BRD_PRD.md`.
- Folder prefix and document requirement IDs use the same three-digit feature number.
- `TECH_SPEC.md` exists after `/jx-dev:spec`.
- `task.json` exists after `/jx-dev:task`.
- `task.json` is valid JSON:

```bash
python3 -m json.tool docs/006_payment_gateway/task.json
```

If Python is not installed, use the editor's JSON validator or the team's standard JSON lint command instead. Python is not a direct `jx-dev` runtime dependency.

- `gh auth status` succeeds if the developer will push branches or open GitHub PRs.
- `/jx-pm:ado --dry-run` succeeds before any live Azure Boards sync.

## Related Patterns

- [[Layered Developer Onboarding]] — setup as a dependency ladder from platform install to verified workflow
- [[Client-Specific MCP Boundary]] — MCP instructions must name the Claude client and transport they apply to
- [[MCP Tool Surface Alignment Gate]] — Azure DevOps MCP setup must match the `/jx-pm:ado` command allowlist before writes

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `claude: command not found` | CLI install path not loaded in the current shell | Open a new terminal, check PATH, and rerun the official installer if needed |
| `claude doctor` fails | CLI install, auth, or environment problem | Follow the diagnostic output before installing Jodex plugins |
| Desktop Code tab is unavailable or asks to upgrade | Account does not have Claude Code access | Sign in with a Pro, Max, Team, or Enterprise account |
| Desktop shows 403 or auth errors | Stale or invalid desktop sign-in | Sign out, sign back in, fully quit Claude Desktop, then reopen it |
| Windows Desktop local session fails | Git for Windows is missing or Desktop was not restarted after install | Install Git for Windows and restart Claude Desktop |
| Desktop cannot find terminal tools | PATH changed after app launch | Verify the tool works in a normal terminal, then restart Claude Desktop |
| `/jx-dev:spec` is not available | Plugin not installed or not reloaded | Install `jx-dev@jodex-plugins`, then run `/reload-plugins` |
| `/jx-kb:*` commands are not available | Knowledge-base plugin not installed or not reloaded | Install `jx-kb@jodex-plugins`, then run `/reload-plugins` |
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
- [Claude Code advanced setup](https://code.claude.com/docs/en/getting-started)
- [Claude Code Desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart)
- [Claude Code Desktop reference](https://code.claude.com/docs/en/desktop)
- [Azure DevOps remote MCP server preview](https://learn.microsoft.com/en-us/azure/devops/mcp-server/remote-mcp-server?view=azure-devops)
