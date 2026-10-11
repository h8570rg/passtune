import { expect, type Page } from "@playwright/test";

const MAILPIT_URL = "http://127.0.0.1:54424";

export function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;
}

export function uniqueHandle(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}`.slice(0, 20);
}

/** メール確認ツール（Mailpit）に届いたメールから 6 桁の確認コードを読む */
export async function readOtpFromMail(email: string): Promise<string> {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    const search = await fetch(
      `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${email}"`)}`,
    );
    const { messages } = (await search.json()) as { messages: { ID: string }[] };
    if (messages.length > 0) {
      const message = await fetch(`${MAILPIT_URL}/api/v1/message/${messages[0].ID}`);
      const { Text } = (await message.json()) as { Text: string };
      const otp = Text.match(/\b(\d{6})\b/)?.[1];
      if (otp) return otp;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`確認コードのメールが届きませんでした: ${email}`);
}

/** メールの確認コードでログインする（未登録なら登録になる） */
export async function login(page: Page, email: string, next?: string) {
  await page.goto(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  await page.getByLabel("メールアドレス").fill(email);
  await page.getByRole("button", { name: "確認コードを送る" }).click();
  await expect(page.getByText("確認メールを送りました")).toBeVisible();
  const otp = await readOtpFromMail(email);
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
