/**
 * Dry-run test layer — requires Claude Agent SDK and ADO read-only PAT.
 * Phase 0 prerequisite: verify SDK can load local marketplace plugins before running.
 *
 * Run: npx playwright test --project=dry-run
 */
import { test, expect } from "@playwright/test";
import path from "path";
import { runAdoSkill } from "../../helpers/skill-runner.js";

const FIXTURES = path.resolve(__dirname, "../../fixtures");
const READONLY_PAT = process.env["AZURE_DEVOPS_TOKEN_READONLY"];

test.beforeAll(() => {
  if (!READONLY_PAT) {
    throw new Error("AZURE_DEVOPS_TOKEN_READONLY is required for dry-run tests.");
  }
  // ANTHROPIC_API_KEY is optional when Claude Code CLI uses OAuth keychain credentials.
});

test("901 normal dry-run: output contains feature title and story IDs", async () => {
  const { messages } = await runAdoSkill(
    path.join(FIXTURES, "901_dry_run_normal/PRD.md"),
    { dryRun: true, adoPat: READONLY_PAT }
  );
  const combined = messages.join("\n");
  expect(combined).toContain("test_notification_preferences");
  expect(combined).toContain("US-901-01");
  expect(combined).toContain("US-901-02");
  expect(combined).toMatch(/will create|planned|dry.run/i);
});

test("901 normal dry-run: temp fixture frontmatter unchanged after run", async () => {
  // skill-runner.ts passes a temp copy — committed fixture must stay clean
  const fixturePath = path.join(FIXTURES, "901_dry_run_normal/PRD.md");
  const { readFileSync } = await import("fs");
  const before = readFileSync(fixturePath, "utf8");

  await runAdoSkill(fixturePath, { dryRun: true, adoPat: READONLY_PAT });

  const after = readFileSync(fixturePath, "utf8");
  expect(after).toBe(before); // committed fixture must not be mutated
});

test("901 normal dry-run: no new ADO items in sandbox tag range after run", async () => {
  const { AdoClient } = await import("../../helpers/ado-client.js");
  const client = new AdoClient(READONLY_PAT!);

  const before = await client.queryByTag("prd:FEAT-901");
  try {
    await runAdoSkill(
      path.join(FIXTURES, "901_dry_run_normal/PRD.md"),
      { dryRun: true, adoPat: READONLY_PAT }
    );
  } catch {
    // maxTurns errors are acceptable here — proves no writes if skill never wrote
  }
  const after = await client.queryByTag("prd:FEAT-901");

  expect(after.length).toBe(before.length); // no new items created (dry-run guarantee)
});

test("902 routing dry-run: output shows AC routing per format_group", async () => {
  const { messages } = await runAdoSkill(
    path.join(FIXTURES, "902_dry_run_routing/PRD.md"),
    { dryRun: true, adoPat: READONLY_PAT }
  );
  const combined = messages.join("\n");
  expect(combined).toContain("US-902-01");
  expect(combined).toContain("US-902-02");
  expect(combined).toContain("US-902-03");
  // Quality-gate-only story should show excluded ACs
  expect(combined).toMatch(/excluded|quality.gate/i);
});

test("903 orphan dry-run: output reports stale story ID US-903-STALE", async () => {
  const { messages } = await runAdoSkill(
    path.join(FIXTURES, "903_dry_run_orphan/PRD.md"),
    { dryRun: true, adoPat: READONLY_PAT }
  );
  const combined = messages.join("\n");
  expect(combined).toMatch(/US-903-STALE|orphan/i);
});

test("dry-run with read-only PAT: write tool calls return 401 (no ADO writes)", async () => {
  // Primary dry-run no-write guarantee: SDK invoked with read-only PAT.
  // If the skill attempts any ADO write, it will receive 401 which surfaces as an error.
  // This test passes only if no write errors appear in output.
  const { messages } = await runAdoSkill(
    path.join(FIXTURES, "901_dry_run_normal/PRD.md"),
    { dryRun: true, adoPat: READONLY_PAT }
  );
  const combined = messages.join("\n");
  expect(combined).not.toMatch(/401|Unauthorized|write.failed/i);
});
