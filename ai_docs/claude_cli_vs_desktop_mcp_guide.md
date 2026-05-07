# Claude Ecosystem: CLI Plugins vs. Desktop Connectors

When building extensions for Anthropic's Claude, it is crucial to understand the distinction between the **Claude Code CLI** and **Claude Desktop**, as they use completely different architectures for extensibility.

## 1. Architectural Differences

### Claude Code CLI
- **Format**: Uses a proprietary plugin architecture (`.claude-plugin` format).
- **Components**: Contains Agents, Skills, Hooks, Prompts, and Commands.
- **Distribution**: Can be installed from a GitHub repository URL using the CLI's marketplace command (e.g., `claude /plugin marketplace add <repo>`).

### Claude Desktop
- **Format**: Relies exclusively on the **Model Context Protocol (MCP)**.
- **Components**: Connects to standalone MCP Servers via standard input/output (`stdio`) or HTTP/SSE.
- **Distribution**: The in-app "Connectors" directory is a **closed, curated marketplace** managed by Anthropic (featuring integrations like Jira, Slack, Google Drive). 
- **Limitation**: There is currently no open public registry where independent developers can directly "deploy" and publish custom plugins to be globally searchable within the Claude Desktop app.

## 2. Migrating from CLI Plugin to Desktop Connector

If you have built a Claude CLI Plugin (like `jairosoft-com/jodex-qa-ai`) and want users to access it in Claude Desktop, you must:
1. **Convert it to an MCP Server**: Rewrite the entry point using the official MCP SDK (TypeScript/Python) so that your CLI skills are registered as MCP Tools.
2. **Distribute Independently**: Host the MCP server on GitHub or npm.
3. **Manual Installation**: Users must manually add your MCP server to their `claude_desktop_config.json`.

---

## 3. Integrating WSL MCP Servers with Claude Desktop (Windows 11)

If you are developing your MCP server in WSL Ubuntu but running Claude Desktop on Windows 11, you can configure Claude Desktop to execute the server inside your WSL environment. This allows the tools to interact seamlessly with your Linux files, Docker containers, and Playwright browsers.

### Configuration Steps

1. On Windows 11, open your Claude Desktop configuration file located at:
   `%APPDATA%\Claude\claude_desktop_config.json`
   *(e.g., `C:\Users\<YourUsername>\AppData\Roaming\Claude\claude_desktop_config.json`)*

2. Add a new server configuration using `wsl.exe` as the command to bridge the gap into Ubuntu:

```json
{
  "mcpServers": {
    "jodex-qa-ai-mcp": {
      "command": "wsl.exe",
      "args": [
        "-d", "Ubuntu", 
        "--",
        "bash", "-c", "cd /home/sante8wsl/projects/jairosoft/ai-plugins/jodex-qa-ai && npm run start-mcp"
      ]
    }
  }
}
```
*Note: Replace `"npm run start-mcp"` with whatever command runs your actual MCP server wrapper.*

### Why this works:
- `wsl.exe` is native to Windows and can be executed by Claude Desktop.
- `-d Ubuntu` ensures it runs in your specific WSL distribution.
- `-- bash -c "..."` runs the command in a Linux shell, setting the correct directory and starting the server using standard Input/Output (`stdio`), which MCP requires.
