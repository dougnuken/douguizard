import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  // 60s was fine when the suite was smaller. The content walks now visit six
  // routes each with a full reveal settle, and screenshot tests contend for the
  // same two workers; a run should fail on defects, not on contention.
  timeout: 90_000,
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
