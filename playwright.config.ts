import { defineConfig, devices } from "@playwright/test";

/**
 * F8: WebKit y Firefox solo corren el smoke (`navegadores.spec.ts`) y solo con
 * `PW_NAVEGADORES=1` (antes: `npx playwright install webkit firefox`). Sin la
 * variable, la suite es la de siempre en Chromium.
 */
const NAVEGADORES = process.env.PW_NAVEGADORES === "1";

/** Puerto de `next start` y de `baseURL`; `PW_PORT` lo cambia (varios agentes o corridas a la vez). */
const PUERTO = Number(process.env.PW_PORT ?? 3131);

export default defineConfig({
  testDir: "tests/e2e",
  // Falla de entrada si `reuseExistingServer` encuentra un servidor de otro build.
  globalSetup: "./tests/servidorAlDia.ts",
  // 60s was fine when the suite was smaller. The content walks now visit six
  // routes each with a full reveal settle, and screenshot tests contend for the
  // same two workers; a run should fail on defects, not on contention.
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 2,
  use: { baseURL: `http://localhost:${PUERTO}`, trace: "retain-on-failure" },
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
    command: `npx next start -p ${PUERTO}`,
    port: PUERTO,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
