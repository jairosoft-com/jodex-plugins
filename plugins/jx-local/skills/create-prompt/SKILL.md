---
name: create-prompt
user-invocable: true
argument-hint: "[--name <slug>] [--description \"...\"] [--tags \"...\"] [--scaffold-only] [--list]"
description: >
  Create a reusable prompt file under .agent/prompts/
  Triggers on: "create prompt", "new prompt", "add prompt", "save prompt", /jx-local:create-prompt.
  Do not trigger for: plugin scaffolding, skill creation, wiki operations, test generation.
---

# Create Prompt

Create a reusable prompt file under `.agent/prompts/` with YAML frontmatter and markdown body.

## Arguments

| Argument | Flag | Required | Default | Notes |
|----------|------|----------|---------|-------|
| Prompt name | `--name` | Yes (unless `--list`) | — | kebab-case slug (e.g., `code-review`). Prompted if missing. |
| Description | `--description` | Yes (unless `--list`) | — | One-line summary. Prompted if missing. |
| Tags | `--tags` | No | `[]` | Comma-separated, each tag must match `^[a-z0-9]+(-[a-z0-9]+)*$`. |
| Scaffold only | `--scaffold-only` | No | `false` | If set, skip interactive body input. |
| List | `--list` | No | `false` | List existing prompts and exit. |

---

## Phase 1: Parse Arguments

Extract values from invocation flags. For any missing required value, prompt interactively.

If `--list` is set → skip to **List Mode** (below), then exit. No other args required.

If `--name` missing → ask: "What should this prompt be called? (kebab-case, e.g. `code-review`)"
If `--description` missing → ask: "One-line description of this prompt:"

### List Mode

1. Run: `python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py" list`
2. Parse the JSON array output. Display as table: `| Name | Description | Tags |`
3. If empty, display: "No prompts found in .agent/prompts/. Create one with `/jx-local:create-prompt`."
4. Exit.

---

## Phase 2: Validate

Run all validations sequentially. **Halt on first failure.**

### Step 2a — Agent-side name pre-check (shell-safety gate)

Before any Bash call, verify `name` matches `^[a-z][a-z0-9]*(-[a-z0-9]+)*$` and length <= 50. Only names passing this regex are safe to use as positional args. On failure: display error, ask user for corrected name. Do not invoke any Bash commands until this passes.

### Step 2b — Name format (helper confirmation)

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py" validate-name <name>
```

On failure (exit 1): display the JSON error from stderr, ask user for corrected name.

### Step 2c — Tag validation

Each tag must match `^[a-z0-9]+(-[a-z0-9]+)*$`. Validate agent-side. On failure: display which tag is invalid and the expected format.

### Step 2d — Description validation

Must be single-line, max 200 chars. Validate agent-side.

### Step 2e — Pre-check collision (advisory)

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py" check-collision <name>
```

On collision (exit 1): display "Prompt '<name>' already exists at <path>. Edit it directly or choose a different name." and halt.

---

## Phase 3: Collect Body

- If **not** `--scaffold-only`: ask the user "Enter the prompt content (markdown):" and use their response as the body.
- If `--scaffold-only`: use placeholder body `<!-- TODO: Write your prompt here -->`.

---

## Phase 4: Confirm & Write

### Step 4a — Display preview

```
## Planned Prompt

File: .agent/prompts/<name>.md
Name: <name>
Description: <description>
Tags: <tags>

--- Preview ---
---
name: <name>
description: '<description>'
tags: [<tags>]
---

<first 5 lines of body or full body if short>
--- End Preview ---

Proceed? (yes/no)
```

Do NOT proceed until user confirms.

### Step 4b — Write via helper (file-based data transport)

All user-controlled content is passed via files, not shell args. Use the `.agent/prompts/` directory itself for staging (the helper creates it if needed).

1. Use the **Write tool** to save metadata to `.agent/prompts/.metadata.json`:
   ```json
   {
     "name": "<name>",
     "description": "<description>",
     "tags": ["<tag1>", "<tag2>"]
   }
   ```

2. Use the **Write tool** to save body content to `.agent/prompts/.body.md`.

3. Invoke the helper (only literal file paths in shell args — no shell variables):
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/scripts/prompt-creator.py" write \
     --metadata-file ".agent/prompts/.metadata.json" \
     --body-file ".agent/prompts/.body.md"
   ```

The helper cleans up `.metadata.json` and `.body.md` staging files after writing.

On success (exit 0): proceed to Phase 5.
On failure (exit 1): display the JSON error from stderr. If field is `collision`, the file was created between pre-check and write — inform user.

---

## Phase 5: Verify & Report

### Step 5a — Read back and verify

Read `.agent/prompts/<name>.md` and verify:
- File exists and is non-empty
- Starts with `---`
- Contains `name:`, `description:`, `tags:` fields exactly once each
- `tags:` value is a YAML array
- Body section is non-empty (unless `--scaffold-only`)

### Step 5b — Report

```
## Prompt Created

File: .agent/prompts/<name>.md
Name: <name>
Description: <description>
Tags: <tags>

Usage: reference this prompt in your workflows or read it with:
  cat .agent/prompts/<name>.md

List all prompts:
  /jx-local:create-prompt --list
```
