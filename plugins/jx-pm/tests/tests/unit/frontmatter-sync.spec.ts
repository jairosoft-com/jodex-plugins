import { test, expect } from "@playwright/test";
import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const SCRIPTS_DIR = path.resolve(__dirname, "../../../../jx-core/scripts");
const SCRIPT = path.join(SCRIPTS_DIR, "frontmatter-sync.py");

function runScript(prdContent: string, adoSyncJson: object): {
  stdout: string;
  stderr: string;
  exitCode: number;
  prdContent: string;
} {
  const tmp = path.join(os.tmpdir(), `fm-test-${Date.now()}.md`);
  fs.writeFileSync(tmp, prdContent, "utf8");
  const jsonArg = JSON.stringify(JSON.stringify(adoSyncJson));
  try {
    const stdout = execSync(`python3 "${SCRIPT}" "${tmp}" ${jsonArg}`, { encoding: "utf8" });
    const updated = fs.readFileSync(tmp, "utf8");
    return { stdout, stderr: "", exitCode: 0, prdContent: updated };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string };
    const updated = fs.existsSync(tmp) ? fs.readFileSync(tmp, "utf8") : prdContent;
    return {
      stdout: e.stdout ?? "",
      stderr: e.stderr ?? "",
      exitCode: 1,
      prdContent: updated,
    };
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

const PRD_NO_FRONTMATTER = `## Document Metadata
- **Feature ID**: 910

## Overview

Test PRD with no frontmatter.

## User Stories

### US-910-01: Test story
**As a** user **I want** something **So that** value.

**Acceptance Criteria:**

**Scenarios:**
- AC-910-01: Given something, When something, Then something.

**Validates:** Test goal
`;

const PRD_WITH_FRONTMATTER = `---
title: existing frontmatter
---

## Document Metadata
- **Feature ID**: 910

## Overview

Test PRD with existing frontmatter (no ado_sync yet).
`;

const PRD_WITH_ADO_SYNC = `---
title: existing frontmatter
ado_sync:
  organization: jairo
  project: Jodex-Test
  feature_work_item_id: 12345
---

## Document Metadata
- **Feature ID**: 910

## Overview

Test PRD with existing ado_sync block.
`;

test("writes Feature ID to PRD with no frontmatter", () => {
  const { exitCode, prdContent } = runScript(PRD_NO_FRONTMATTER, {
    feature_work_item_id: 55001,
    feature_work_item_url: "https://dev.azure.com/jairo/Jodex-Test/_workitems/edit/55001",
    organization: "jairo",
    project: "Jodex-Test",
  });
  expect(exitCode).toBe(0);
  expect(prdContent).toContain("ado_sync:");
  expect(prdContent).toContain("feature_work_item_id: 55001");
  expect(prdContent).toContain("organization: jairo");
  expect(prdContent).toContain("project: Jodex-Test");
  // Frontmatter wraps with --- delimiters
  expect(prdContent).toMatch(/^---\n/);
  expect(prdContent).toMatch(/---\n/);
});

test("writes Feature ID to PRD with existing frontmatter (no ado_sync)", () => {
  const { exitCode, prdContent } = runScript(PRD_WITH_FRONTMATTER, {
    feature_work_item_id: 55002,
    organization: "jairo",
    project: "Jodex-Test",
  });
  expect(exitCode).toBe(0);
  expect(prdContent).toContain("title: existing frontmatter");
  expect(prdContent).toContain("feature_work_item_id: 55002");
});

test("writes story ID into ado_sync.stories map", () => {
  const { exitCode, prdContent } = runScript(PRD_WITH_ADO_SYNC, {
    feature_work_item_id: 12345,
    organization: "jairo",
    project: "Jodex-Test",
    stories: { "US-910-01": 55010 },
  });
  expect(exitCode).toBe(0);
  expect(prdContent).toContain("US-910-01: 55010");
  // Existing feature_work_item_id preserved
  expect(prdContent).toContain("feature_work_item_id: 12345");
});

test("updates existing ado_sync block without duplicating it", () => {
  const { exitCode, prdContent } = runScript(PRD_WITH_ADO_SYNC, {
    feature_work_item_id: 99999,
    organization: "jairo",
    project: "Jodex-Test",
  });
  expect(exitCode).toBe(0);
  // Only one ado_sync: occurrence
  const count = (prdContent.match(/^ado_sync:/gm) ?? []).length;
  expect(count).toBe(1);
  expect(prdContent).toContain("feature_work_item_id: 99999");
});

test("atomic write: no .tmp file remains after successful write", () => {
  // Create PRD in a fresh isolated test dir so we can definitively check for leftovers
  const testDir = fs.mkdtempSync(path.join(os.tmpdir(), "fm-atomic-"));
  const prdFile = path.join(testDir, "PRD.md");
  fs.writeFileSync(prdFile, PRD_NO_FRONTMATTER, "utf8");
  const jsonArg = JSON.stringify(JSON.stringify({ feature_work_item_id: 55003 }));
  try {
    execSync(`python3 "${SCRIPT}" "${prdFile}" ${jsonArg}`);
    const filesAfter = fs.readdirSync(testDir);
    const tmpFiles = filesAfter.filter((f) => f.endsWith(".tmp"));
    expect(tmpFiles.length).toBe(0);
  } finally {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
});

test("outputs the ado_sync JSON to stdout on success", () => {
  const { exitCode, stdout } = runScript(PRD_NO_FRONTMATTER, {
    feature_work_item_id: 55004,
    organization: "jairo",
  });
  expect(exitCode).toBe(0);
  const parsed = JSON.parse(stdout);
  expect(parsed.feature_work_item_id).toBe(55004);
});

test("exits 1 on invalid JSON argument", () => {
  const tmp = path.join(os.tmpdir(), `fm-invalid-${Date.now()}.md`);
  fs.writeFileSync(tmp, PRD_NO_FRONTMATTER, "utf8");
  try {
    execSync(`python3 "${SCRIPT}" "${tmp}" 'not-json'`, { encoding: "utf8" });
    throw new Error("Expected non-zero exit");
  } catch (err: unknown) {
    const e = err as { status?: number };
    expect(e.status).toBe(1);
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
});

test("exits 1 on missing args", () => {
  try {
    execSync(`python3 "${SCRIPT}"`, { encoding: "utf8" });
    throw new Error("Expected non-zero exit");
  } catch (err: unknown) {
    const e = err as { status?: number };
    expect(e.status).toBe(1);
  }
});
