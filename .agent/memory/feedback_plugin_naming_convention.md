# Plugin Naming Convention Preference

## Context
When installing plugins into the Antigravity CLI (`agy`), the initial approach appended the publisher group (`Jairosoft.jodex`) to the plugin name, resulting in long slash commands like `/Jairosoft.jodex.jx-kb:init`. 

## Preference
- **Shorter Naming:** The publisher prefix must be omitted when linking or copying plugin directories for installation.
- **Commands:** Use the short plugin name, e.g., `/jx-kb:init`, instead of the fully qualified publisher string.
- **Scripts:** The installation and uninstallation scripts (`bash` and `PowerShell`) have been refactored to rely purely on the plugin name (`jx-*`) instead of calculating or appending a `PUBLISHER_GROUP`.
- **Documentation:** When updating `README.md` or `INSTALLATION-GUIDE-ANTIGRAVITY-CLI.md`, document the slash commands using the short names (e.g., `/jx-qa`, `/jx-pm`).
