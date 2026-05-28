import { test, expect } from "@playwright/test";
import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const SCRIPTS_DIR = path.resolve(__dirname, "../../../../jx-core/scripts");
const SCRIPT = path.join(SCRIPTS_DIR, "validate-ac-blocks.sh");

function runScript(prdContent: string): { stdout: string; stderr: string; exitCode: number } {
  const tmp = path.join(os.tmpdir(), `ac-test-${Date.now()}.md`);
  fs.writeFileSync(tmp, prdContent, "utf8");
  try {
    const stdout = execSync(`bash "${SCRIPT}" "${tmp}"`, { encoding: "utf8" });
    return { stdout, stderr: "", exitCode: 0 };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string };
    return {
      stdout: e.stdout ?? "",
      stderr: e.stderr ?? "",
      exitCode: 1,
    };
  } finally {
    fs.unlinkSync(tmp);
  }
}

const VALID_PRD = `
## User Stories

### US-001-01: Valid story
**As a** user **I want** something **So that** I get value

**Acceptance Criteria:**

**Scenarios:**
- AC-001-01: Given something, When something, Then something

**Validates:** Some goal
`;

const INVALID_PRD_ORPHAN = `
## User Stories

### US-001-01: Story with orphan line
**As a** user **I want** something **So that** I get value

**Acceptance Criteria:**

**Scenarios:**
- AC-001-01: Given something, When something, Then something
This is an orphan continuation line that should cause an error.

**Validates:** Some goal
`;

const INVALID_PRD_MULTIPLE_ORPHANS = `
## User Stories

### US-001-01: Story with multiple orphan lines
**As a** user **I want** something **So that** I get value

**Acceptance Criteria:**

- AC-001-01: First AC is valid
orphan line one
orphan line two

**Validates:** Some goal
`;

const VALID_PRD_MULTI_SUBHEADER = `
## User Stories

### US-001-01: Story with multiple sub-headers
**As a** user **I want** something **So that** I get value

**Acceptance Criteria:**

**Scenarios:**
- AC-001-01: Given something, When something, Then something

**Rules:**
- AC-001-02: Rule constraint

**Quality Gates:**
- AC-001-03: Lint passes

**Validates:** Some goal
`;

const VALID_PRD_WITH_FORMAT_RATIONALE = `
## User Stories

### US-001-01: Story with format rationale comment
**As a** user **I want** something **So that** I get value

*Format: Scenario-Based — user-facing flow*

**Acceptance Criteria:**

**Scenarios:**
- AC-001-01: Given something, When something, Then something

**Validates:** Some goal
`;

test("valid PRD with Scenarios sub-header exits 0", () => {
  const { exitCode, stdout } = runScript(VALID_PRD);
  expect(exitCode).toBe(0);
  expect(stdout).toContain("AC block validation passed");
});

test("valid PRD with multiple sub-headers exits 0", () => {
  const { exitCode } = runScript(VALID_PRD_MULTI_SUBHEADER);
  expect(exitCode).toBe(0);
});

test("valid PRD with format rationale comment exits 0", () => {
  const { exitCode } = runScript(VALID_PRD_WITH_FORMAT_RATIONALE);
  expect(exitCode).toBe(0);
});

test("PRD with orphan continuation line exits 1 with line number", () => {
  const { exitCode, stderr } = runScript(INVALID_PRD_ORPHAN);
  expect(exitCode).toBe(1);
  expect(stderr).toContain("Orphan line detected in AC block (line");
  expect(stderr).toContain("orphan");
});

test("PRD with multiple orphan lines reports count and exits 1", () => {
  const { exitCode, stderr } = runScript(INVALID_PRD_MULTIPLE_ORPHANS);
  expect(exitCode).toBe(1);
  expect(stderr).toMatch(/2 orphan line\(s\) found/);
});

test("PRD with orphan reports possible continuation of AC line number", () => {
  const { exitCode, stderr } = runScript(INVALID_PRD_ORPHAN);
  expect(exitCode).toBe(1);
  // Should report "Possible continuation of AC on line N"
  expect(stderr).toContain("Possible continuation of AC on line");
});

test("script errors on missing file with exit 2", () => {
  const tmp = `/tmp/nonexistent-${Date.now()}.md`;
  try {
    execSync(`bash "${SCRIPT}" "${tmp}"`, { encoding: "utf8" });
    throw new Error("Expected non-zero exit");
  } catch (err: unknown) {
    const e = err as { status?: number };
    expect(e.status).toBe(2);
  }
});

test("script errors with no args with exit 2", () => {
  try {
    execSync(`bash "${SCRIPT}"`, { encoding: "utf8" });
    throw new Error("Expected non-zero exit");
  } catch (err: unknown) {
    const e = err as { status?: number };
    expect(e.status).toBe(2);
  }
});
