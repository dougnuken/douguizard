import { defineConfig, devices } from "@playwright/test";

/**
 * F8: WebKit y Firefox solo corren el smoke (`navegadores.spec.ts`) y solo con
 * `PW_NAVEGADORES=1` (antes: `npx playwright install webkit firefox`). Sin la
 * variable, la suite es la de siempre en Chromium.
 */
const NAVEGADORES = process.env.PW_NAVEGADORES === "1";

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
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    ...(NAVEGADORES
      ? [
          { name: "webkit", testMatch: /navegadores\.spec\.ts/, use: { ...devices["Desktop Safari"] } },
          { name: "firefox", testMatch: /navegadores\.spec\.ts/, use: { ...devices["Desktop Firefox"] } },
        ]
      : []),
  ],
  webServer: {
    command: "npx next start -p 3131",
    port: 3131,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
