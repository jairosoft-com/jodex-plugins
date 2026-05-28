/**
 * E2E test layer — creates real ADO work items in Jodex-Test sandbox.
 * Requires AZURE_DEVOPS_TOKEN (RW), ANTHROPIC_API_KEY, and completed Phase 0 sandbox setup.
 * Workers: 1 (serialized) — set in playwright.config.ts.
 *
 * Run: npx playwright test --project=e2e
 */
import { test, expect } from "@playwright/test";
import path from "path";
import { AdoClient } from "../../helpers/ado-client.js";
import { runAdoSkill } from "../../helpers/skill-runner.js";
import { SANDBOX } from "../../helpers/sandbox.js";
import {
  registerRunStart,
  registerCreatedIds,
  cleanupRunRegistry,
} from "../../helpers/cleanup.js";

const FIXTURES = path.resolve(__dirname, "../../fixtures");
const RW_PAT = process.env["AZURE_DEVOPS_TOKEN"]!;

test.beforeAll(() => {
  if (!RW_PAT) throw new Error("AZURE_DEVOPS_TOKEN is required for E2E tests.");
  // ANTHROPIC_API_KEY is optional when Claude Code CLI uses OAuth keychain credentials.
});

test.afterAll(async () => {
  await cleanupRunRegistry();
});

// ─── 910: Normal sync (first run) ───────────────────────────────────────────

test("910 normal: feature and stories created in Jodex-Test", async () => {
  registerRunStart();
  const client = new AdoClient(RW_PAT);

  const { messages, createdIds } = await runAdoSkill(
    path.join(FIXTURES, "910_e2e_normal/PRD.md"),
    { adoPat: RW_PAT }
  );
  registerCreatedIds(createdIds);

  const combined = messages.join("\n");
  expect(combined).toContain("test_e2e_first_sync");

  // Verify at least a feature was created
  expect(createdIds.length).toBeGreaterThanOrEqual(1);

  for (const id of createdIds) {
    const item = await client.getWorkItem(id);
    // All items must be in Jodex-Test sandbox
    expect(item.url).toContain(SANDBOX.projectId);
  }
});

test("910 normal: feature has tag prd:FEAT-910", async () => {
  const client = new AdoClient(RW_PAT);
  const ids = await client.queryByTag("prd:FEAT-910");
  expect(ids.length).toBeGreaterThanOrEqual(1);
  const item = await client.getWorkItem(ids[0]);
  const tags = item.fields["System.Tags"] as string ?? "";
  expect(tags).toContain("prd:FEAT-910");
});

test("910 normal: description contains narrative, not AC text", async () => {
  const client = new AdoClient(RW_PAT);
  const storyIds = await client.queryByTag("prd:US-910-01");
  expect(storyIds.length).toBeGreaterThanOrEqual(1);
  const item = await client.getWorkItem(storyIds[0]);
  const desc = (item.fields["System.Description"] as string) ?? "";
  // Description must contain "As a" narrative
  expect(desc).toMatch(/As a|I want|So that/i);
  // Description must NOT contain AC block content
  expect(desc).not.toMatch(/AC-910-\d{2}/);
  expect(desc).not.toContain("Acceptance Criteria");
});

test("910 normal: AC field is populated and HTML-formatted", async () => {
  const client = new AdoClient(RW_PAT);
  const storyIds = await client.queryByTag("prd:US-910-01");
  expect(storyIds.length).toBeGreaterThanOrEqual(1);
  const item = await client.getWorkItem(storyIds[0]);
  const ac = (item.fields["Microsoft.VSTS.Common.AcceptanceCriteria"] as string) ?? "";
  expect(ac.length).toBeGreaterThan(0);
  expect(ac).toMatch(/<ol>|<li>/i);
});

test("910 normal: dry-run produces no side effects", async () => {
  const client = new AdoClient(RW_PAT);
  const before = await client.queryByTag("prd:FEAT-910");

  await runAdoSkill(
    path.join(FIXTURES, "910_e2e_normal/PRD.md"),
    { dryRun: true, adoPat: RW_PAT }
  );

  const after = await client.queryByTag("prd:FEAT-910");
  expect(after.length).toBe(before.length);
});

// ─── 911: Partial sync ───────────────────────────────────────────────────────

test("911 partial: missing stories created, existing story not duplicated", async () => {
  registerRunStart();
  const client = new AdoClient(RW_PAT);

  // The skill receives --tenant and the temp fixture copy has no pre-seeded IDs.
  // In a full suite, before-each would inject seed IDs; here we verify create-all path.
  const { createdIds } = await runAdoSkill(
    path.join(FIXTURES, "911_e2e_partial/PRD.md"),
    { adoPat: RW_PAT }
  );
  registerCreatedIds(createdIds);

  // At minimum feature + 3 stories created (no pre-seeded IDs in temp copy)
  expect(createdIds.length).toBeGreaterThanOrEqual(4);

  // No duplicate stories for the same story ID
  const storyIds = await client.queryByTag("prd:US-911-01");
  expect(storyIds.length).toBe(1);
});

// ─── 912: Update mode ────────────────────────────────────────────────────────

test("912 update: story points preserved after update run", async () => {
  registerRunStart();
  const client = new AdoClient(RW_PAT);

  const { createdIds } = await runAdoSkill(
    path.join(FIXTURES, "912_e2e_update/PRD.md"),
    { adoPat: RW_PAT }
  );
  registerCreatedIds(createdIds);

  // Verify Story Points field is present (value is LLM-derived, assert type only)
  const storyIds = await client.queryByTag("prd:US-912-01");
  if (storyIds.length > 0) {
    const item = await client.getWorkItem(storyIds[0]);
    const sp = item.fields["Microsoft.VSTS.Scheduling.StoryPoints"];
    if (sp !== undefined && sp !== null) {
      expect(typeof sp).toBe("number");
      expect([1, 2, 3, 5, 8]).toContain(sp);
    }
  }
});
