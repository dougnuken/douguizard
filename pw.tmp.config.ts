import base from "/home/user/douguizard/playwright.config";
import { defineConfig } from "@playwright/test";
export default defineConfig({ ...base, testDir: "/home/user/douguizard/tests/e2e", reporter: [["list"]], use: { ...base.use, launchOptions: { executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" } } });
