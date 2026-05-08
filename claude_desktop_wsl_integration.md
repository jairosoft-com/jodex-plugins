# Integrating WSL Claude CLI Plugins with Claude Desktop (Windows 11)

While the **Claude Code CLI** supports a custom plugin architecture (agents, skills, hooks, etc.), **Claude Desktop** relies exclusively on the **Model Context Protocol (MCP)** to add custom tools and capabilities. 

To use your `jodex-qa-ai` plugin from WSL Ubuntu inside Claude Desktop on Windows 11, you cannot simply load the `.claude-plugin` marketplace. Instead, you need to expose your plugin's functionality via an MCP Server, and then tell Windows Claude Desktop to execute that server inside WSL.

Here is the step-by-step approach:

## Step 1: Wrap Your Plugin Logic in an MCP Server
Since Claude Desktop only understands MCP, you must create a small MCP server (using TypeScript or Python) that exposes your `qa-ai` skills (like extracting BRDs or generating Playwright specs) as **MCP Tools**.

For example, if your CLI skills are bash scripts or Node scripts, your MCP server will register those as tools and spawn the processes when Claude Desktop calls them.

## Step 2: Configure Claude Desktop on Windows to Call WSL
You can configure Claude Desktop on your Windows host to execute your MCP server inside your WSL environment. This allows the tools to interact with your Linux files, docker containers, and Playwright browsers seamlessly.

1. On Windows 11, open your Claude Desktop configuration file. It is located at:
   `%APPDATA%\Claude\claude_desktop_config.json`
   *(Usually translates to `C:\Users\<YourUsername>\AppData\Roaming\Claude\claude_desktop_config.json`)*

2. Add a new server configuration using `wsl.exe` as the command to bridge the gap into Ubuntu:

```json
{
  "mcpServers": {
    "jodex-qa-ai-mcp": {
      "command": "wsl.exe",
      "args": [
        "-d", "Ubuntu", 
        "--",
        "bash", "-c", "cd /home/sante8wsl/projects/jairosoft/ai-plugins/jodex-qa-ai/mcp && npm run start"
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

## Summary
1. **Claude CLI** = Uses `.claude-plugin` (skills, agents, hooks).
2. **Claude Desktop** = Uses **MCP**.
3. **The Bridge** = Write an MCP Server that executes your CLI skills, and configure Claude Desktop to run it via `wsl.exe`.
