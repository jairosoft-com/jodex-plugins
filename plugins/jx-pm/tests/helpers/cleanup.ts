import { AdoClient } from "./ado-client.js";
import { SANDBOX, FIXTURE_RANGE } from "./sandbox.js";

const runRegistry = new Set<number>();
let runStartTimestamp: Date | null = null;

export function registerRunStart(): void {
  runStartTimestamp = new Date();
}

export function registerCreatedIds(ids: number[]): void {
  for (const id of ids) runRegistry.add(id);
}

/**
 * Patch all registered IDs to Removed.
 * On crash: also queries parent-link children of created features to catch untagged stories.
 * Hard-delete if ADO_CLEANUP_DESTROY=true.
 */
export async function cleanupRunRegistry(): Promise<void> {
  const pat = process.env["AZURE_DEVOPS_TOKEN"];
  if (!pat) {
    console.warn("AZURE_DEVOPS_TOKEN not set — skipping ADO cleanup");
    return;
  }
  const client = new AdoClient(pat);
  const destroy = process.env["ADO_CLEANUP_DESTROY"] === "true";

  const toRemove = new Set<number>(runRegistry);

  // Orphan detection: children of created features created after runStartTimestamp
  if (runStartTimestamp) {
    for (const id of runRegistry) {
      try {
        const item = await client.getWorkItem(id);
        const type = item.fields["System.WorkItemType"] as string;
        if (type === "Feature") {
          const childIds = await client.getChildIds(id);
          for (const childId of childIds) {
            if (!runRegistry.has(childId) && childId >= FIXTURE_RANGE.min && childId <= FIXTURE_RANGE.max) {
              const child = await client.getWorkItem(childId);
              const created = new Date(child.fields["System.CreatedDate"] as string);
              if (created >= runStartTimestamp) {
                toRemove.add(childId);
                console.log(`Cleanup: orphan story ${childId} added (created ${created.toISOString()})`);
              }
            }
          }
        }
      } catch (e) {
        console.warn(`Cleanup: skipping child scan for ${id}: ${e}`);
      }
    }
  }

  for (const id of toRemove) {
    try {
      if (destroy) {
        await client.hardDelete(id);
        console.log(`Cleanup: hard-deleted ${id}`);
      } else {
        await client.patchToRemoved(id);
        console.log(`Cleanup: PATCH-to-Removed ${id}`);
      }
    } catch (e) {
      console.warn(`Cleanup: failed to clean ${id}: ${e}`);
    }
  }

  runRegistry.clear();
  runStartTimestamp = null;
}

/**
 * Pre-run sweep: remove all fixture-range items (any state) from prior runs.
 * - Patches any Active/New items to Removed first (reversible, uses RW PAT).
 * - Hard-deletes Removed items if AZURE_DEVOPS_TOKEN_CLEANUP is present.
 * This prevents stale items from polluting duplicate-detection assertions.
 */
export async function preRunSweep(): Promise<void> {
  const rwPat = process.env["AZURE_DEVOPS_TOKEN"];
  const cleanupPat = process.env["AZURE_DEVOPS_TOKEN_CLEANUP"];

  if (!rwPat && !cleanupPat) {
    console.warn("No ADO PAT available for pre-run sweep — skipping. Stale items may affect duplicate assertions.");
    return;
  }

  const rwClient = rwPat ? new AdoClient(rwPat) : null;
  const cleanupClient = cleanupPat ? new AdoClient(cleanupPat) : null;

  // Step 1: Find ALL fixture-range items regardless of state
  const allIds = rwClient
    ? await rwClient.queryFixtureRange()  // no state filter = all states
    : [];
  console.log(`Pre-run sweep: found ${allIds.length} fixture-range items (all states)`);

  // Step 2: Patch Active items to Removed
  for (const id of allIds) {
    try {
      if (rwClient) await rwClient.patchToRemoved(id);
      console.log(`Pre-run sweep: PATCH-to-Removed ${id}`);
    } catch (e) {
      console.warn(`Pre-run sweep: could not patch ${id}: ${e}`);
    }
  }

  // Step 3: Hard-delete Removed items (requires Delete scope PAT)
  if (cleanupClient && allIds.length > 0) {
    // Re-query to confirm Removed state before deleting
    const removedIds = await cleanupClient.queryFixtureRange("Removed");
    for (const id of removedIds) {
      try {
        await cleanupClient.hardDelete(id);
        console.log(`Pre-run sweep: hard-deleted ${id}`);
      } catch (e) {
        console.warn(`Pre-run sweep: could not hard-delete ${id}: ${e}`);
      }
    }
  }
}
