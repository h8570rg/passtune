import { expect, test } from "@playwright/test";
import { login, signUp, uniqueEmail } from "./helpers";

test("新規登録してプロフィールを作り、ログアウトできる", async ({ page }) => {
  const { handle, displayName } = await signUp(page, "auth");
  await expect(page.getByRole("navigation", { name: "メイン" })).toBeVisible();

  await page.goto(`/u/${handle}`);
  await expect(page.getByRole("heading", { name: displayName })).toBeVisible();

  await page.goto("/settings");
  await page.getByRole("button", { name: "ログアウト" }).click();
  await expect(page.getByRole("link", { name: "ログイン" })).toBeVisible();
});

test("ユーザー ID の形式が違うとエラーになる", async ({ page }) => {
  await login(page, uniqueEmail("invalid"));
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByLabel("ユーザー ID").fill("ab");
  await page.getByLabel("表示名").fill("テスト");
  await page.getByRole("button", { name: "はじめる" }).click();
  await expect(page.getByText("3 文字以上")).toBeVisible();
});

test("ログイン必須の画面は、未ログインだとログインへ移動する", async ({ page }) => {
  await page.goto("/new");
  await expect(page).toHaveURL(/\/login\?next=%2Fnew$/);
});
