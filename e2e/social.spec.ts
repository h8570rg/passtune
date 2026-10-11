import { expect, test } from "@playwright/test";
import { signUp } from "./helpers";

test("フォローするとタイムラインに投稿が流れ、いいね・コメントが投稿者の反応に届く", async ({
  browser,
}) => {
  const alicePage = await (await browser.newContext()).newPage();
  const bobPage = await (await browser.newContext()).newPage();

  // alice が投稿する
  const alice = await signUp(alicePage, "alice");
  await alicePage.goto("/new");
  await alicePage.getByRole("searchbox", { name: "曲を検索" }).fill("アイドル YOASOBI");
  await alicePage
    .getByRole("button", { name: /を選ぶ$/ })
    .first()
    .click();
  await alicePage.getByLabel("一言（任意）").fill("みんな聴いて");
  await alicePage.getByRole("button", { name: "投稿する" }).click();
  await expect(alicePage).toHaveURL(/\/posts\//);

  // bob が alice をフォローする
  await signUp(bobPage, "bob");
  await expect(bobPage.getByText("まだ誰もフォローしていません")).toBeVisible();
  await bobPage.goto(`/u/${alice.handle}`);
  await bobPage.getByRole("button", { name: "フォローする" }).click();
  await expect(bobPage.getByRole("button", { name: "フォロー中" })).toBeVisible();

  // bob のタイムラインに alice の投稿が出る
  await bobPage.goto("/");
  await expect(bobPage.getByText("みんな聴いて")).toBeVisible();

  // いいねする
  await bobPage.getByRole("button", { name: "いいねする" }).first().click();
  await expect(bobPage.getByRole("button", { name: "いいねを取り消す" }).first()).toBeVisible();

  // コメントする
  await bobPage.locator('a[href^="/posts/"]').first().click();
  await expect(bobPage).toHaveURL(/\/posts\//);
  await bobPage.getByRole("textbox", { name: "コメント" }).fill("最高！");
  await bobPage.getByRole("button", { name: "コメントする" }).click();
  await expect(bobPage.getByText("最高！")).toBeVisible();

  // alice の反応に届く
  await alicePage.goto("/activity");
  await expect(alicePage.getByText(/さんがいいねしました/)).toBeVisible();
  await expect(alicePage.getByText(/さんがコメントしました/)).toBeVisible();
  await expect(alicePage.getByText("最高！")).toBeVisible();

  // フォロワー一覧に bob が出る
  await alicePage.goto(`/u/${alice.handle}/followers`);
  await expect(alicePage.getByRole("main").getByRole("listitem")).toHaveCount(1);

  // bob がフォローをやめる
  await bobPage.goto(`/u/${alice.handle}`);
  await bobPage.getByRole("button", { name: "フォロー中" }).click();
  await expect(bobPage.getByRole("button", { name: "フォローする" })).toBeVisible();
});

test("未ログインでいいねしようとするとログインへ移動する", async ({ page, browser }) => {
  const posterPage = await (await browser.newContext()).newPage();
  await signUp(posterPage, "poster2");
  await posterPage.goto("/new");
  await posterPage.getByRole("searchbox", { name: "曲を検索" }).fill("夜に駆ける YOASOBI");
  await posterPage
    .getByRole("button", { name: /を選ぶ$/ })
    .first()
    .click();
  await posterPage.getByRole("button", { name: "投稿する" }).click();
  await expect(posterPage).toHaveURL(/\/posts\//);

  await page.goto(posterPage.url());
  await page.getByRole("link", { name: "ログインしていいねする" }).click();
  await expect(page).toHaveURL(/\/login\?next=/);
});
