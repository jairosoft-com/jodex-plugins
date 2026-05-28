import { query } from "@anthropic-ai/claude-agent-sdk";
import fs from "fs";
import os from "os";
import path from "path";
import { tenantValue } from "./sandbox.js";

const REPO_ROOT = path.resolve(__dirname, "../../../..");

/** Assert plugin paths exist before SDK invocation — prevents running against installed versions. */
function assertPluginPaths(): void {
  const required = [
    path.join(REPO_ROOT, "plugins/jx-pm"),
    path.join(REPO_ROOT, "plugins/jx-core"),
    path.join(REPO_ROOT, "plugins/jx-dev"),
  ];
  for (const p of required) {
    if (!fs.existsSync(p)) {
      throw new Error(`Plugin path not found: ${p}. REPO_ROOT=${REPO_ROOT}`);
    }
  }
}

export interface SkillRunResult {
  messages: string[];
  exitCode: number;
}

export interface RunOptions {
  dryRun?: boolean;
  extraArgs?: string;
  /** Override PAT via env; use for read-only PAT in dry-run tests. */
  adoPat?: string;
}

/**
 * Copy fixture to a per-run temp dir and invoke /jx-pm:ado against it.
 * Returns the collected messages and a snapshot diff of ado_sync frontmatter.
 */
export async function runAdoSkill(
  fixturePrdPath: string,
  opts: RunOptions = {}
): Promise<{ messages: string[]; createdIds: number[] }> {
  assertPluginPaths();

  const runId = `jx-pm-ado-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const tmpDir = path.join(os.tmpdir(), runId);
  const fixtureDir = path.dirname(fixturePrdPath);
  const prdName = path.basename(fixturePrdPath);

  fs.mkdirSync(tmpDir, { recursive: true });
  const tmpPrd = path.join(tmpDir, prdName);
  fs.copyFileSync(fixturePrdPath, tmpPrd);

  const beforeIds = readAdoSyncIds(fixturePrdPath);

  const args: string[] = [
    `--tenant ${tenantValue()}`,
    `--docs-root ${tmpDir}`,
    ...(opts.dryRun ? ["--dry-run"] : []),
    ...(opts.extraArgs ? [opts.extraArgs] : []),
  ];

  const prompt = `/jx-pm:ado ${args.join(" ")}`;
  const messages: string[] = [];

  try {
    const env: Record<string, string> = { ...process.env as Record<string, string> };
    if (opts.adoPat) env["AZURE_DEVOPS_TOKEN"] = opts.adoPat;

    for await (const msg of query({
      prompt,
      options: {
        maxTurns: 80,
        cwd: REPO_ROOT,
        plugins: [
          { type: "local" as const, path: path.join(REPO_ROOT, "plugins/jx-pm") },
          { type: "local" as const, path: path.join(REPO_ROOT, "plugins/jx-core") },
          { type: "local" as const, path: path.join(REPO_ROOT, "plugins/jx-dev") },
        ],
      },
    })) {
      const m = msg as Record<string, unknown>;
      // Collect text from assistant turns
      if (m.type === "assistant") {
        const content = (m.message as Record<string, unknown>)?.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            const b = block as Record<string, unknown>;
            if (b.type === "text" && typeof b.text === "string") {
              messages.push(b.text);
            }
          }
        }
      }
      // Collect the final result string
      if (m.type === "result" && typeof m.result === "string" && m.result) {
        messages.push(m.result);
      }
    }

    const afterIds = readAdoSyncIds(tmpPrd);
    const createdIds = diffIds(afterIds, beforeIds);
    return { messages, createdIds };
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/** Parse all numeric ADO work item IDs from ado_sync frontmatter. */
export function readAdoSyncIds(prdPath: string): Set<number> {
  if (!fs.existsSync(prdPath)) return new Set();
  const content = fs.readFileSync(prdPath, "utf8");
  const idSet = new Set<number>();
  const matches = content.matchAll(/:\s*(\d{4,})\s*(?:#|$)/gm);
  for (const m of matches) {
    const n = parseInt(m[1], 10);
    if (n > 0) idSet.add(n);
  }
  return idSet;
}

function diffIds(after: Set<number>, before: Set<number>): number[] {
  return [...after].filter((id) => !before.has(id));
}
