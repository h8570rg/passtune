import { execSync } from "node:child_process";
import { expect, type Page } from "@playwright/test";

const SUPABASE_LOCAL_URL = "http://127.0.0.1:54421";

let cachedSecretKey: string | null = null;

/** 手元の Supabase のシークレットキーを `supabase status` から読む（リポジトリにキーを書かない） */
function getLocalSecretKey(): string {
  if (cachedSecretKey) return cachedSecretKey;
  const output = execSync("pnpm exec supabase status --output-format json", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  const json = output.slice(output.indexOf("{"));
  const status = JSON.parse(json) as { env?: { SECRET_KEY?: string }; SECRET_KEY?: string };
  const key = status.env?.SECRET_KEY ?? status.SECRET_KEY;
  if (!key)
    throw new Error(
      "手元の Supabase のシークレットキーを取得できませんでした。pnpm supabase:start を実行してください。",
    );
  cachedSecretKey = key;
  return key;
}

export function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;
}

export function uniqueHandle(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}`.slice(0, 20);
}

/** 管理用 API で 6 桁の確認コードを発行する（手元のメールにはコードが入らないため） */
export async function issueOtp(email: string): Promise<string> {
  const secretKey = getLocalSecretKey();
  const response = await fetch(`${SUPABASE_LOCAL_URL}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "magiclink", email }),
  });
  const data = (await response.json()) as { email_otp?: string };
  if (!data.email_otp) throw new Error(`Failed to issue OTP: ${JSON.stringify(data)}`);
  return data.email_otp;
}

/** メールの確認コードでログインする（未登録なら登録になる） */
export async function login(page: Page, email: string, next?: string) {
  await page.goto(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  await page.getByLabel("メールアドレス").fill(email);
  await page.getByRole("button", { name: "確認コードを送る" }).click();
  await expect(page.getByText("確認メールを送りました")).toBeVisible();
  const otp = await issueOtp(email);
  await page.locator('input[name="token"]').fill(otp);
  await page.getByRole("button", { name: "ログイン", exact: true }).click();
}

/** 新しい利用者として登録し、プロフィールを作る */
export async function signUp(page: Page, prefix: string) {
  const email = uniqueEmail(prefix);
  const handle = uniqueHandle(prefix);
  const displayName = `${prefix} さん`;
  await login(page, email);
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByLabel("ユーザー ID").fill(handle);
  await page.getByLabel("表示名").fill(displayName);
  await page.getByRole("button", { name: "はじめる" }).click();
  await expect(page).toHaveURL(/\/$/);
  return { email, handle, displayName };
}
