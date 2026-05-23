import { AdoClient } from "./helpers/ado-client.js";
import { SANDBOX } from "./helpers/sandbox.js";
import { runFixtureGuard } from "./helpers/fixture-guard.js";
import { preRunSweep } from "./helpers/cleanup.js";

async function globalSetup(): Promise<void> {
  // Always run fixture guard (format-only, no ADO connection)
  runFixtureGuard();
  console.log("Fixture guard passed.");

  // ADO preflight only when credentials are present (skip for unit-only runs)
  const pat = process.env["AZURE_DEVOPS_TOKEN"];
  if (!pat) {
    console.log("AZURE_DEVOPS_TOKEN not set — skipping ADO preflight (unit-only run).");
    return;
  }

  // Guard 1: REST identity preflight — live project GUID must match committed SANDBOX.projectId
  if (SANDBOX.projectId === "PLACEHOLDER_REPLACE_IN_PHASE_0") {
    throw new Error(
      "SANDBOX.projectId is still PLACEHOLDER. Complete Phase 0: create Jodex-Test, record GUID, commit to helpers/sandbox.ts."
    );
  }

  const client = new AdoClient(pat);
  const liveProject = await client.getProject();

  if (liveProject.id !== SANDBOX.projectId) {
    throw new Error(
      `ADO identity mismatch. Expected projectId=${SANDBOX.projectId}. Got id=${liveProject.id} name=${liveProject.name}`
    );
  }
  if (liveProject.name !== SANDBOX.project) {
    throw new Error(
      `ADO name mismatch. Expected project=${SANDBOX.project}. Got name=${liveProject.name}`
    );
  }
  console.log(`ADO identity verified: ${SANDBOX.project} (${SANDBOX.projectId})`);

  // Pre-run sweep: hard-delete stale Removed items in 901–999 range
  await preRunSweep();
  console.log("Pre-run sweep complete.");
}

export default globalSetup;
