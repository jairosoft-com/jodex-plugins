# jx-local

Plugin for creating local, project-scoped artifacts in the user's project directory.

## Skills

### `create-prompt`

Create a reusable prompt file under `.agent/prompts/` with YAML frontmatter and markdown body.

**Command:** `/jx-local:create-prompt`

**Usage:**

```bash
# Create a prompt interactively
/jx-local:create-prompt --name code-review --description "Code review prompt"

# Create with tags
/jx-local:create-prompt --name code-review --description "Code review prompt" --tags "review, code"

# Scaffold without body input
/jx-local:create-prompt --name code-review --description "Code review prompt" --scaffold-only

# List existing prompts
/jx-local:create-prompt --list
```

**Prompt file format:**

```markdown
---
name: code-review
description: 'Code review prompt for pull requests'
tags: [review, code]
---

You are a code reviewer. Analyze the following code for...
```

**Prompts are saved to:** `.agent/prompts/<name>.md`

## Local Development

```bash
claude --plugin-dir /path/to/jodex-plugins/plugins/jx-local
claude plugin marketplace add /path/to/jodex-plugins --scope project
claude plugin install jx-local@jodex-plugins
```

## Metadata

- Category: productivity
- Author: ramon
