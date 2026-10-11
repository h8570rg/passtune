import { expect, test } from "@playwright/test";
import { login, signUp, uniqueEmail, uniqueHandle } from "./helpers";

test("招待リンクから登録すると、招待した人を自動でフォローする（招待した人が ID を変えても使える）", async ({
  browser,
}) => {
  const inviterContext = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const inviterPage = await inviterContext.newPage();
  const inviter = await signUp(inviterPage, "inviter");
  await inviterPage.goto(`/u/${inviter.handle}`);
  await inviterPage.getByRole("button", { name: "招待リンクをコピー" }).click();
  const inviteUrl = await inviterPage.evaluate(() => navigator.clipboard.readText());
  expect(inviteUrl).toMatch(/\/i\/[0-9a-f-]{36}\?openExternalBrowser=1$/);

  // 招待した人が、リンクを送ったあとにユーザー ID を変える
  const newHandle = uniqueHandle("renamed");
  await inviterPage.goto("/settings");
  await inviterPage.getByLabel("ユーザー ID").fill(newHandle);
  await inviterPage.getByRole("button", { name: "保存する" }).click();
  await expect(inviterPage).toHaveURL(new RegExp(`/u/${newHandle}$`));

  // 招待された人が、古いリンクを開く（LINE から開いた想定のパラメーター付き）
  const guestContext = await browser.newContext();
  const guestPage = await guestContext.newPage();
  await guestPage.goto(new URL(inviteUrl).pathname + new URL(inviteUrl).search);
  await expect(guestPage).toHaveURL(new RegExp(`/u/${newHandle}\\?invited=1$`));
  await expect(
    guestPage.getByText(`${inviter.displayName} さんから Passtune に招待されました`),
  ).toBeVisible();

  // 登録する
  await guestPage.getByRole("link", { name: "登録してはじめる" }).click();
  await login(guestPage, uniqueEmail("invitee"));
  await expect(guestPage).toHaveURL(/\/onboarding$/);
  await guestPage.getByLabel("ユーザー ID").fill(uniqueHandle("invitee"));
  await guestPage.getByLabel("表示名").fill("招待された人");
  await guestPage.getByRole("button", { name: "はじめる" }).click();
  await expect(guestPage).toHaveURL(/\/$/);

  // 招待した人をフォローしている
  await guestPage.goto(`/u/${newHandle}`);
  await expect(guestPage.getByRole("button", { name: "フォロー中" })).toBeVisible();
});

test("利用規約とプライバシーポリシーを表示できる", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "利用規約" })).toBeVisible();
  await expect(page.getByText("運営者: h8570rg")).toBeVisible();
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "プライバシーポリシー" })).toBeVisible();
  await expect(page.getByText("外部送信")).toBeVisible();
});

test("PWA の manifest とアイコンを配信している", async ({ request }) => {
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBe(true);
  const json = (await manifest.json()) as { name: string; icons: { src: string }[] };
  expect(json.name).toBe("Passtune");
  for (const icon of json.icons) {
    const response = await request.get(icon.src);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
  const sw = await request.get("/sw.js");
  expect(await sw.text()).toContain("fetch");
});
