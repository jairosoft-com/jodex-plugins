# Installation Guide: Deploying `jodex-plugins` using Antigravity CLI (`agy`)

This guide provides step-by-step instructions on how to install and deploy `jodex-plugins` using the Antigravity CLI (`agy`). Since `agy` is a terminal-based application, you will need to use PowerShell in Administrator mode for Windows, or Bash for Linux/WSL.

You **do not need to clone the entire repository** (`https://github.com/jairosoft-com/jodex-plugins`). You only need to download and run the necessary scripts for your operating system.

---

## Prerequisites: Installing Azure CLI

Before installing the plugins, you need to have the Azure CLI installed and authenticated.

### Windows
1. Download and install the Azure CLI by running the following command in an Administrator PowerShell terminal:
   ```powershell
   $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; rm .\AzureCLI.msi
   ```
2. Restart your PowerShell terminal to ensure the `az` command is available.

### Linux / WSL
1. Run the following commands in your Bash terminal:
   ```bash
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

### Authenticating with Azure
Go to your terminal and run the following command first to verify if you are already authenticated:
```bash
az account show
```
If you are not authenticated, you need to log in to Azure. Run the following command:
```bash
az login --allow-no-subscriptions
```
After a successful login, run `az account show` again to verify your authentication.

---

## Installing `jodex-plugins`

We have provided dedicated scripts for both Windows (PowerShell) and Linux/WSL (Bash). Choose the instructions corresponding to your operating system. 

### Windows (PowerShell)

**Important:** You must run these commands in a **PowerShell terminal running as Administrator**.

1. Download the installation script:
   ```powershell
   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/jairosoft-com/jodex-plugins/main/scripts/install-github-agy-jodex-plugins.ps1" -OutFile "install-github-agy-jodex-plugins.ps1"
   ```

2. Execute the script to install the plugins:
   ```powershell
   .\install-github-agy-jodex-plugins.ps1
   ```
   *Note: If you encounter an execution policy error, you may need to run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` first.*

### Linux / WSL (Bash)

1. Download the installation script using `curl`:
   ```bash
   curl -O https://raw.githubusercontent.com/jairosoft-com/jodex-plugins/main/scripts/install-github-agy-jodex-plugins.sh
   ```

2. Make the script executable:
   ```bash
   chmod +x install-github-agy-jodex-plugins.sh
   ```

3. Run the script:
   ```bash
   ./install-github-agy-jodex-plugins.sh
   ```

---

## Installing MCP Azure DevOps

To integrate Azure DevOps with `agy`, you need to configure the Azure DevOps MCP.

### 1. Create a Personal Access Token (PAT)
1. Open your default web browser and navigate to the Azure DevOps portal you normally use.
2. In the top right corner, click on the **User settings** icon and select **Personal access tokens**.
3. Create a **New Token** and name it `Antigravity CLI MCP`.
4. Grant the necessary scopes and click **Create**.
5. **Copy** this token, as you will need it for the next step.

### 2. Configure `mcp_config.json`
You need to add the Azure DevOps MCP configuration to your `agy` settings.

The `mcp_config.json` file is located at:
- **Windows**: `C:\Users\<your username>\.gemini\config\mcp_config.json`
- **Linux / WSL**: `$HOME/.gemini/config/mcp_config.json`

Open the `mcp_config.json` file using your preferred text editor (e.g., **Notepad** on Windows or **Nano** on Linux/WSL). Copy and paste the following configuration into the file:

```json
{
  "mcpServers": {
    "azure-devops": {
      "command": "npx",
      "args": [
        "-y",
        "@azure-devops/mcp@latest",
        "jairo",
        "-a",
        "env"
      ],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "https://dev.azure.com/jairo",
        "AZURE_DEVOPS_AUTH_METHOD": "pat",
        "AZURE_DEVOPS_PAT": "YOUR AZURE DEVOPS PERSONAL ACCESS TOKEN",
        "AZURE_DEVOPS_DEFAULT_PROJECT": "REPLACE THIS YOUR PROJECT NAME e.g. 'Jairosoft Portfolio'"
      }
    }
  }
}
```

**Important:** You must replace the following values before saving:
- Replace `"YOUR AZURE DEVOPS PERSONAL ACCESS TOKEN"` with the new `Antigravity CLI MCP` PAT you just created.
- Replace `"REPLACE THIS YOUR PROJECT NAME e.g. 'Jairosoft Portfolio'"` with the name of the project you belong to in Azure DevOps (e.g., `Jairosoft Portfolio`).

Save the `mcp_config.json` file after making these changes.

### 3. Verify MCP Installation
1. Go back to your terminal and start the Antigravity CLI:
   ```bash
   agy
   ```
2. Once inside `agy`, run the following command to verify that the `MCP Azure DevOps` is installed and running:
   ```
   /mcp
   ```

---

## Next Steps

After running the installation scripts successfully and configuring the MCP, your `agy` CLI will have the `jodex-plugins` loaded and ready to use. You can refer to the main [README.md](README.md) for more details.
