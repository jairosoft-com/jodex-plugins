import { defineConfig } from "@playwright/test";
import path from "path";

export default defineConfig({
  globalSetup: "./global-setup.ts",
  timeout: 720_000, // 12 min per test — E2E ADO write runs can take 5–10 min

  projects: [
    {
      name: "unit",
      testDir: path.join(__dirname, "tests/unit"),
      testMatch: "**/*.spec.ts",
      use: {},
    },
    {
      name: "dry-run",
      testDir: path.join(__dirname, "tests/dry-run"),
      testMatch: "**/*.spec.ts",
      use: {},
    },
    {
      name: "e2e",
      testDir: path.join(__dirname, "tests/e2e"),
      testMatch: "**/*.spec.ts",
      workers: 1, // serialized — E2E tests mutate ADO state
      use: {},
    },
  ],

  reporter: [["list"], ["html", { open: "never" }]],
});
