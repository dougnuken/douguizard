import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 2,
  use: { baseURL: "http://localhost:3131", trace: "retain-on-failure" },
  reporter: [["list"], ["json", { outputFile: "tests/results.json" }]],
  webServer: {
    command: "npx next start -p 3131",
    port: 3131,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
