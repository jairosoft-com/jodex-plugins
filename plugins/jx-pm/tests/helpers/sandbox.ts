/**
 * Hardcoded sandbox constants — single source of truth for ADO test project identity.
 * Org/project/GUID are committed here; never read from env.
 * Only credentials (PATs, API keys) come from env.
 */
export const SANDBOX = {
  org: "jairo",
  project: "Jodex-Test",
  // Committed GUID recorded in Phase 0 after creating the Jodex-Test ADO project.
  projectId: "b1759078-5eff-4621-af06-838351fed491",
} as const;

/** Returns the --tenant flag value derived from committed constants. */
export const tenantValue = (): string => `${SANDBOX.org}/${SANDBOX.project}`;

/** Reserved numeric range for all fixture work items. */
export const FIXTURE_RANGE = { min: 901, max: 999 } as const;
