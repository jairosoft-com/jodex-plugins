import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as ExcelJS from "exceljs";
import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { EXTRACT_SKILL_PROMPT } from "./prompts/extract.js";
import { GENERATE_SKILL_PROMPT } from "./prompts/generate.js";
import { BROWSER_SKILL_PROMPT } from "./prompts/browser.js";

// Initialize server
const server = new McpServer({
  name: "qa-ai-mcp",
  version: "1.0.0"
});

// =============================================================================
// Prompts
// =============================================================================

server.prompt("qa_extract",
  "Extract E2E test cases from BRD/PRD markdown documents and insert them into an Excel (.xlsx) test plan spreadsheet.",
  {
    brd_path: z.string().describe("Path to BRD/PRD markdown file"),
    xlsx_path: z.string().optional().describe("Existing test plan to fork. Omit to create new"),
    mapping_path: z.string().optional().describe("Column mapping JSON. Inferred from xlsx if absent"),
    area_path: z.string().optional().describe("Override Area Path. Default: from existing xlsx"),
    assigned_to: z.string().optional().describe("Override Assigned To. Default: from existing xlsx")
  },
  (args) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `${EXTRACT_SKILL_PROMPT}

Arguments Provided:
- brd_path: ${args.brd_path}
- xlsx_path: ${args.xlsx_path || 'None'}
- mapping_path: ${args.mapping_path || 'None'}
- area_path: ${args.area_path || 'None'}
- assigned_to: ${args.assigned_to || 'None'}
`
      }
    }]
  })
);

server.prompt("qa_generate",
  "Reads an xlsx test plan and generates Playwright TypeScript spec files by live-exploring the site.",
  {
    test_plan_path: z.string().optional().describe("Path to the xlsx test plan")
  },
  (args) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `${GENERATE_SKILL_PROMPT}

Arguments Provided:
- test_plan_path: ${args.test_plan_path || 'None'}
`
      }
    }]
  })
);

server.prompt("qa_browser",
  "Open a browser for manual exploration and debugging with playwright-cli.",
  {
    subcommand: z.string().optional().describe("The playwright-cli subcommand to start with (e.g., 'open https://example.com')"),
  },
  (args) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `${BROWSER_SKILL_PROMPT}

Arguments Provided:
- subcommand: ${args.subcommand || 'None'}
`
      }
    }]
  })
);

// =============================================================================
// Resources
// =============================================================================

// ---------------------------------------------------------------------------
// Resource: generate skill evals (static)
// ---------------------------------------------------------------------------
server.resource(
  "generate-evals",
  "qa-ai://skills/generate/evals",
  { description: "Evaluation definitions & assertions for the generate skill", mimeType: "application/json" },
  async (uri) => {
    const evalsPath = path.resolve(__dirname, "../../plugins/qa-ai/skills/generate/evals/evals.json");
    const content = fs.readFileSync(evalsPath, "utf-8");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: content
      }]
    };
  }
);

// ---------------------------------------------------------------------------
// Resource Template: playwright-cli reference docs
// ---------------------------------------------------------------------------
const REFERENCE_NAMES = [
  "element-attributes",
  "playwright-tests",
  "request-mocking",
  "running-code",
  "session-management",
  "storage-state",
  "test-generation",
  "tracing",
  "video-recording"
];

server.resource(
  "playwright-reference",
  new ResourceTemplate("qa-ai://skills/playwright-cli/references/{name}", {
    list: async () => ({
      resources: REFERENCE_NAMES.map(name => ({
        uri: `qa-ai://skills/playwright-cli/references/${name}`,
        name: `playwright-reference-${name}`,
        description: `Reference: ${name.replace(/-/g, " ")}`,
        mimeType: "text/markdown" as const
      }))
    })
  }),
  { description: "Playwright-cli reference documentation by topic", mimeType: "text/markdown" },
  async (uri, variables) => {
    const name = variables.name as string;
    // Security: validate name is in allowlist (prevents path traversal)
    if (!REFERENCE_NAMES.includes(name)) {
      throw new Error(`Unknown reference: ${name}. Available: ${REFERENCE_NAMES.join(", ")}`);
    }
    const refPath = path.resolve(__dirname, `../../plugins/qa-ai/skills/playwright-cli/references/${name}.md`);
    // Double-check resolved path stays within references directory
    const refsDir = path.resolve(__dirname, "../../plugins/qa-ai/skills/playwright-cli/references");
    if (!refPath.startsWith(refsDir)) {
      throw new Error("Invalid reference path");
    }
    if (!fs.existsSync(refPath)) {
      throw new Error(`Reference file not found: ${name}.md`);
    }
    const content = fs.readFileSync(refPath, "utf-8");
    return {
      contents: [{
        uri: uri.href,
        mimeType: "text/markdown",
        text: content
      }]
    };
  }
);

// =============================================================================
// Tools
// =============================================================================

// ---------------------------------------------------------------------------
// Tool: write_excel_test_plan (existing — unchanged)
// ---------------------------------------------------------------------------
server.tool("write_excel_test_plan",
  "Write or append test cases to an Excel test plan spreadsheet.",
  {
    destination_path: z.string().describe("Path to save the Excel file"),
    source_path: z.string().optional().describe("Path to existing Excel file to fork/append"),
    test_cases: z.array(z.object({
      title: z.string(),
      areaPath: z.string().optional(),
      assignedTo: z.string().optional(),
      state: z.string().optional(),
      steps: z.array(z.object({
        action: z.string(),
        expected: z.string()
      }))
    }))
  },
  async ({ destination_path, source_path, test_cases }) => {
    try {
      const workbook = new ExcelJS.Workbook();
      let worksheet: ExcelJS.Worksheet;

      if (source_path) {
        await workbook.xlsx.readFile(source_path);
        // Use first worksheet
        worksheet = workbook.worksheets[0];
      } else {
        worksheet = workbook.addWorksheet("Test Plan");
        // Write headers
        worksheet.addRow([
          "ID", "Work Item Type", "Title", "Test Step", "Step Action", 
          "Step Expected", "Area Path", "Assigned To", "State"
        ]);
      }

      for (const tc of test_cases) {
        // Parent row
        worksheet.addRow([
          null, 
          "Test Case", 
          tc.title, 
          "", 
          "", 
          "", 
          tc.areaPath || "", 
          tc.assignedTo || "", 
          tc.state || ""
        ]);
        
        // Child rows (steps)
        tc.steps.forEach((step, index) => {
          worksheet.addRow([
            "", 
            "", 
            "", 
            index + 1, 
            step.action, 
            step.expected, 
            "", 
            "", 
            ""
          ]);
        });
      }

      await workbook.xlsx.writeFile(destination_path);
      return {
        content: [{ type: "text", text: `Successfully wrote ${test_cases.length} test case(s) to ${destination_path}` }]
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `Error writing excel: ${e.message}` }],
        isError: true
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: read_excel_test_plan (NEW — mirrors xlsx-writer.py read)
// ---------------------------------------------------------------------------
server.tool("read_excel_test_plan",
  "Read an Excel test plan and return all rows as structured JSON.",
  {
    xlsx_path: z.string().describe("Path to the xlsx file to read")
  },
  async ({ xlsx_path }) => {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(xlsx_path);
      const worksheet = workbook.worksheets[0];
      const rows: any[][] = [];

      worksheet.eachRow({ includeEmpty: false }, (row) => {
        const values = row.values as any[];
        // ExcelJS row.values is 1-indexed (index 0 is undefined), so slice from 1
        rows.push(values.slice(1));
      });

      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }]
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `Error reading excel: ${e.message}` }],
        isError: true
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: verify_excel_test_plan (NEW — mirrors xlsx-writer.py verify)
// ---------------------------------------------------------------------------
server.tool("verify_excel_test_plan",
  "Read an Excel test plan and return its sheet name, column headers, and total row count.",
  {
    xlsx_path: z.string().describe("Path to the xlsx file to verify")
  },
  async ({ xlsx_path }) => {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(xlsx_path);
      const worksheet = workbook.worksheets[0];

      // Extract headers from row 1
      const headerRow = worksheet.getRow(1);
      const headers: string[] = [];
      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        headers.push(cell.text || "");
      });

      const result = {
        sheet: worksheet.name,
        headers: headers,
        totalRows: worksheet.rowCount
      };

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `Error verifying excel: ${e.message}` }],
        isError: true
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: fork_excel_test_plan (NEW — mirrors xlsx-writer.py fork)
// ---------------------------------------------------------------------------
server.tool("fork_excel_test_plan",
  "Byte-copy an existing xlsx file to a new versioned filename. Never modifies the original.",
  {
    source_path: z.string().describe("Path to the original xlsx file"),
    destination_path: z.string().optional().describe("Explicit destination path. If omitted, auto-generates versioned name (e.g., plan-2.xlsx)")
  },
  async ({ source_path, destination_path }) => {
    try {
      // Validate source exists
      if (!fs.existsSync(source_path)) {
        return {
          content: [{ type: "text", text: `Error: source file not found: ${source_path}` }],
          isError: true
        };
      }

      let dst = destination_path;

      if (!dst) {
        // Auto-generate versioned name: {basename}-{v}.xlsx
        const dir = path.dirname(source_path);
        const ext = path.extname(source_path);
        const base = path.basename(source_path, ext);
        let version = 2;
        dst = path.join(dir, `${base}-${version}${ext}`);
        while (fs.existsSync(dst)) {
          version++;
          dst = path.join(dir, `${base}-${version}${ext}`);
        }
      }

      // Byte-preserving copy
      fs.copyFileSync(source_path, dst);

      return {
        content: [{ type: "text", text: `Forked: ${source_path} → ${dst}` }]
      };
    } catch (e: any) {
      return {
        content: [{ type: "text", text: `Error forking excel: ${e.message}` }],
        isError: true
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: run_playwright_command (existing — unchanged)
// ---------------------------------------------------------------------------
server.tool("run_playwright_command",
  "Run playwright CLI commands safely",
  {
    command: z.string().describe("The CLI command to run (must be playwright-cli or npx)"),
    args: z.array(z.string()).optional().describe("Arguments to pass to the command")
  },
  async ({ command, args = [] }) => {
    return new Promise((resolve) => {
      // Basic security check
      if (command !== "playwright-cli" && command !== "npx") {
        resolve({
          content: [{ type: "text", text: "Error: Only 'playwright-cli' or 'npx' are allowed as base commands." }],
          isError: true
        });
        return;
      }

      // If npx, make sure it's for playwright
      if (command === "npx" && args[0] !== "playwright" && args[0] !== "-p" && args[0] !== "-y") {
        resolve({
          content: [{ type: "text", text: "Error: Only 'npx playwright' is allowed." }],
          isError: true
        });
        return;
      }

      const proc = spawn(command, args, { shell: true });
      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", (data: Buffer) => {
        stdout += data.toString();
      });

      proc.stderr.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      proc.on("close", (code: number | null) => {
        resolve({
          content: [{ type: "text", text: `Exit Code: ${code}\n\nStdout:\n${stdout}\n\nStderr:\n${stderr}` }]
        });
      });
      
      proc.on("error", (error: Error) => {
        resolve({
          content: [{ type: "text", text: `Process spawning error: ${error.message}` }],
          isError: true
        });
      });
    });
  }
);

// =============================================================================
// Start Server
// =============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("QA-AI MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
