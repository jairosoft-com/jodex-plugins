import fs from "fs";
import path from "path";
import { SANDBOX } from "./sandbox.js";

const FIXTURES_DIR = path.resolve(__dirname, "../fixtures");

interface Frontmatter {
  ado_sync?: {
    organization?: string;
    project?: string;
  };
}

function parseFrontmatter(content: string): Frontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  try {
    // Minimal YAML parse: extract ado_sync.project and ado_sync.organization
    const fm = match[1];
    const orgMatch = fm.match(/organization:\s*(.+)/);
    const projMatch = fm.match(/project:\s*(.+)/);
    const org = orgMatch ? orgMatch[1].trim().replace(/^["']|["']$/g, "") : undefined;
    const project = projMatch ? projMatch[1].trim().replace(/^["']|["']$/g, "") : undefined;
    if (!org && !project) return {};
    return { ado_sync: { organization: org, project } };
  } catch {
    return {};
  }
}

function getFixturePrds(): string[] {
  if (!fs.existsSync(FIXTURES_DIR)) return [];
  const entries = fs.readdirSync(FIXTURES_DIR, { withFileTypes: true });
  const prds: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    for (const name of ["PRD.md", "BRD_PRD.md"]) {
      const prd = path.join(FIXTURES_DIR, entry.name, name);
      if (fs.existsSync(prd)) prds.push(prd);
    }
  }
  return prds;
}

/**
 * Validate that:
 * 1. All fixture ado_sync.project values match SANDBOX.project (not env)
 * 2. Fixture folder NNN prefix matches Feature ID and story US-NNN-NN prefixes
 */
export function runFixtureGuard(): void {
  const prds = getFixturePrds();
  const errors: string[] = [];

  for (const prd of prds) {
    const content = fs.readFileSync(prd, "utf8");
    const fm = parseFrontmatter(content);

    if (fm.ado_sync?.project && fm.ado_sync.project !== SANDBOX.project) {
      errors.push(
        `${prd}: ado_sync.project="${fm.ado_sync.project}" expected "${SANDBOX.project}"`
      );
    }
    if (fm.ado_sync?.organization && fm.ado_sync.organization !== SANDBOX.org) {
      errors.push(
        `${prd}: ado_sync.organization="${fm.ado_sync.organization}" expected "${SANDBOX.org}"`
      );
    }

    // Validate folder NNN prefix vs Feature ID vs story prefixes
    const folderName = path.basename(path.dirname(prd));
    const folderPrefixMatch = folderName.match(/^(\d{3})_/);
    if (!folderPrefixMatch) continue;
    const folderPrefix = folderPrefixMatch[1];

    const featureIdMatch = content.match(/Feature ID[:\*]+\s*(\d+)/i);
    if (featureIdMatch) {
      const featureId = featureIdMatch[1].padStart(3, "0");
      if (featureId !== folderPrefix) {
        errors.push(`${prd}: Feature ID ${featureId} does not match folder prefix ${folderPrefix}`);
      }
    }

    const storyHeadings = content.matchAll(/### US-(\d{3})-\d{2}:/g);
    for (const m of storyHeadings) {
      if (m[1] !== folderPrefix) {
        errors.push(`${prd}: story US-${m[1]}-XX prefix does not match folder prefix ${folderPrefix}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Fixture guard failed:\n${errors.join("\n")}`);
  }
}
