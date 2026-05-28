---
name: feedback
user-invocable: false
description: >
  Shared feedback capture logic. Creates an ADO Feature work item from freeform text.
  Consumed by role plugin stubs (jx-pm, jx-qa) via stub delegation.
  Not directly invocable — must be called through a role plugin stub.
---

# Feedback Capture

Capture freeform feedback and create an Azure DevOps Feature work item.

---

## Phase 1: Validate Input

1. Read `$ARGUMENTS` — if blank or missing, halt:
   > "Error: No feedback text provided. Usage: `/jx-pm:feedback <your feedback text>`"
2. Identify the invoking plugin name from the stub's delegation preamble (look for "You are invoked from **{plugin}**" in the preceding context). Store as `invoking_plugin`.

---

## Phase 2: Tenant Binding

1. Read `feedback-target.json` from the working directory root.
2. **If the file does not exist:**
   - Ask the user for:
     - **Organization** — the ADO organization name (e.g., `myorg`)
     - **Project** — the ADO project name (e.g., `MyProject`)
     - **Area Path** — the area path for feedback items (e.g., `MyProject\TeamArea`)
   - Write `feedback-target.json` with these three fields:
     ```json
     {
       "organization": "<org>",
       "project": "<project>",
       "areaPath": "<area-path>"
     }
     ```
3. **If the file exists**, read `organization`, `project`, and `areaPath` from it.
4. **Validate project:** Call `mcp__azure-devops__core_list_projects` with `projectNameFilter` set to the stored project name.
   - Exactly 1 match → proceed
   - 0 matches → halt: "Project '{project}' not found in the connected ADO organization. Check feedback-target.json or your MCP connection."
   - Error → halt: "MCP connection error. Verify Azure DevOps MCP server is running."
5. **Fail closed** if `core_list_projects` returns an error or no response.

**Note:** No MCP tool exposes which organization the server is connected to. The `organization` field is persisted for user verification during typed confirmation (Phase 4), not for MCP-based validation.

---

## Phase 3: Fingerprint + Dedupe Search

1. Write the raw feedback text to `.feedback-input.tmp` using the Write tool.
2. Run the pinned helper to compute the fingerprint:
   ```
   python3 "${CLAUDE_PLUGIN_ROOT}/../jx-core/scripts/feedback-fingerprint.py" .feedback-input.tmp
   ```
   Capture the hex digest output as `fingerprint`.
3. **Cleanup:** Overwrite `.feedback-input.tmp` with empty content using the Write tool.
4. Search ADO for existing open work items with a matching fingerprint tag:
   - Call `mcp__azure-devops__search_workitem` searching for `feedback-id:{fingerprint}`
5. **If exactly 1 match:** Report it and halt:
   > "Feedback already submitted as ADO #{workItemId}. No duplicate created."
6. **If multiple matches:** Halt and surface conflict:
   > "Multiple items found with fingerprint {fingerprint}: #{id1}, #{id2}, ... Resolve manually."
7. **If 0 matches:** Proceed to Phase 4.

---

## Phase 4: Confirmation Gate

1. Summarize the feedback text into a concise title (~80 characters max).
2. Show the following preview to the user:

   > **Creating feedback in ADO**
   >
   > **Organization / Project:** {organization} / {project}
   > **Title:** {proposed title}
   > **Description:** {full feedback text}
   > **Area Path:** {areaPath}
   > **Tags:** feedback, {invoking_plugin}, feedback-id:{fingerprint}
   >
   > Creating in the ADO organization currently connected to this MCP server.

3. Require the user to type `{organization}/{project}` to confirm. Any other input cancels:
   > "Type '{organization}/{project}' to confirm:"

   If the user does not confirm, halt:
   > "Feedback submission cancelled."

---

## Phase 5: Create Work Item

1. Call `mcp__azure-devops__wit_create_work_item` with:
   - **Type:** Feature
   - **Project:** {project} (from `feedback-target.json`)
   - **Title:** the summarized title from Phase 4
   - **Description:** the full feedback text from `$ARGUMENTS`
   - **Area Path:** {areaPath} (from `feedback-target.json`)
   - **Tags:** `feedback`, `{invoking_plugin}`, `feedback-id:{fingerprint}`

2. **On success:** Report the created work item:
   > "Feedback submitted: ADO #{workItemId} — {title}"
   > "{workItemUrl}"

3. **On failure:** Surface the error clearly. Common failures:
   - Invalid area path → "Area path '{areaPath}' not found. Update feedback-target.json."
   - Feature type not in process template → "Work item type 'Feature' not available in project '{project}'."
   - Do NOT retry silently.
