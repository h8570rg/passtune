import { expect, test } from "@playwright/test";
import { signUp } from "./helpers";

test("曲を検索して投稿し、ログインなしでも見られ、削除できる", async ({ page, browser }) => {
  await signUp(page, "poster");

  await page.goto("/new");
  await page.getByRole("searchbox", { name: "曲を検索" }).fill("夜に駆ける YOASOBI");
  await page
    .getByRole("button", { name: /夜に駆ける（YOASOBI）を選ぶ/ })
    .first()
    .click();
  await expect(page.getByText("この曲で合っていますか？")).toBeVisible();
  await page.getByLabel("一言（任意）").fill("最近ずっと聴いてる");
  await page.getByRole("button", { name: "投稿する" }).click();

  await expect(page).toHaveURL(/\/posts\/[0-9a-f-]{36}$/);
  await expect(page.getByText("最近ずっと聴いてる")).toBeVisible();
  await expect(page.getByText("夜に駆ける").first()).toBeVisible();
  await expect(page.getByText("provided courtesy of iTunes")).toBeVisible();
  await expect(page.getByText("0 回再生")).toBeVisible();
  const postUrl = page.url();

  // ログインなしでも投稿を見られる。再生回数は投稿者にしか見えない
  const guest = await browser.newPage();
  await guest.goto(postUrl);
  await expect(guest.getByText("最近ずっと聴いてる")).toBeVisible();
  await expect(guest.getByText("回再生")).toHaveCount(0);

  // Spotify の認証情報がない手元では、Spotify の検索結果へ転送される
  const spotifyHref = await guest.getByRole("link", { name: "Spotify" }).getAttribute("href");
  const response = await guest.request.get(spotifyHref ?? "", { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  expect(response.headers().location).toContain("open.spotify.com/");
  await guest.close();

  // 削除
  await page.getByRole("button", { name: "投稿のメニュー" }).click();
  await page.getByRole("menuitem", { name: "削除" }).click();
  await page.getByRole("button", { name: "削除する" }).click();
  await expect(page).toHaveURL(/\/u\//);
  await expect(page.getByText("まだ投稿がありません")).toBeVisible();
});
