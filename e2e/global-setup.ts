import { execSync } from "node:child_process";

export default function globalSetup() {
  execSync("pnpm run supabase:reset", { stdio: "inherit" });
}
