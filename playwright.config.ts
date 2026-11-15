import nextEnv from "@next/env";
import { defineConfig, devices } from "@playwright/test";

nextEnv.loadEnvConfig(process.cwd());

export default defineConfig({
  globalSetup: "./e2e/global-setup.ts",
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "e2e/playwright-report", open: "never" }]],
  outputDir: "e2e/test-results",
  timeout: 60_000,
  use: {
    ...devices["Pixel 7"],
    baseURL: `http://localhost:${process.env.E2E_PORT}`,
    trace: "retain-on-failure",
    locale: "ja-JP",
  },
  webServer: {
    command: "pnpm exec next dev",
    wait: { stdout: /Local:\s+http:\/\/localhost:(?<e2e_port>\d+)/ },
  },
});
