import { defineConfig, devices } from "@playwright/test";

// 手元の Supabase（pnpm supabase:start）の既定値。公開されている開発用の値。
const SUPABASE_LOCAL_URL = "http://127.0.0.1:54421";
const SUPABASE_LOCAL_PUBLISHABLE_KEY = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
// Next.js 16 は同じディレクトリで開発サーバーを 2 つ起動できないため、pnpm dev と同じポートを使い、起動済みなら再利用する
const PORT = 3000;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "e2e/playwright-report", open: "never" }]],
  outputDir: "e2e/test-results",
  timeout: 60_000,
  use: {
    ...devices["Pixel 7"],
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    locale: "ja-JP",
  },
  webServer: {
    command: `pnpm exec next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: SUPABASE_LOCAL_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: SUPABASE_LOCAL_PUBLISHABLE_KEY,
    },
  },
});
