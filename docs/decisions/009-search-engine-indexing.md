# 009: 検索エンジンへの掲載

- Status: DECIDED
- Date: 2026-10-11（2026-10-17 更新: 身内だけで使う間は LP も載せない）
- Area: Product
- Related: [002](002-audience-and-openness.md), [004](004-product-strategy.md), [ui-design](../technical/ui-design.md)

## Context

- 投稿とプロフィールは、ログインなしでも URL を知っていれば見られる（[mvp](../product/mvp.md)）。
- 体験の中心は知り合い同士で、リンクを広める使い方は想定しない（[002](002-audience-and-openness.md)、[004](004-product-strategy.md)）。
- 一方で、友人から「Passtune」と聞いた人が名前で検索したときに、サービスにたどり着けるようにしたい。

## Options considered

| Option | メリット | デメリット | 相性 | 後から変更できるか |
|---|---|---|---|---|
| すべて載せる | 曲名などで検索から人が来る可能性 | 利用者の表示名や好みが検索結果に出る。知り合い中心の方針と合わない | 低い | 一度載ると消えるまで時間がかかる |
| すべて載せない | 最も安全 | 名前で検索してもたどり着けない | 中 | 容易 |
| **LP だけ載せる** | 名前で検索すると LP に来る。利用者の情報は出ない | LP を作る手間 | 高い | 容易 |

## Decision

- 検索エンジンに載せるのは **LP（未ログインの `/`）だけ**。投稿・プロフィールなど、ほかのページは載せない。（開発者が決定）
- LP は検索から来た人向けに作る（構成と文言は [ui-design](../technical/ui-design.md) の「LP」。文言は AI の起案）。

### 2026-10-17 の更新（開発者が決定）

- 本番化しても、しばらくは **身内だけ（リンクを知っている人だけ）** で使う。その間は **LP も検索エンジンに載せない**。
- 公開すると決めたら、Vercel の本番の環境変数に `SEARCH_INDEXING=enabled` を入れて再デプロイする（LP だけが載る）。
- 「リンクを知っている人だけ」は、検索に載せないことで実現する（パスワードなどの入口の制限はしない）。URL を知っていれば誰でも開けて、登録もできる。

## How（実装）

- root layout の metadata で全ページを `noindex, nofollow` にし、`/` だけ `SEARCH_INDEXING=enabled` のとき `index, follow` で上書きする（`lib/utils/indexing.ts`）。載せない間は sitemap も空。
- `robots.txt`: 本番は全体の巡回を許可（noindex を読ませるため）し、中身のない転送用の `/go/`・`/i/`・`/auth/` だけ禁止。本番以外（Vercel のプレビュー）は全体を禁止。
- `sitemap.xml` は `/` だけ。共有用の画像（OGP）は `app/opengraph-image.tsx`。

## Tradeoffs / Consequences

- 曲名やアーティスト名で検索して来る人はいない。広がり方は、引き続き友人からの直接の声かけ。

## Revisit when

- 友人以外にも広げたくなり、投稿を検索から見つけてもらう価値が、利用者の情報が出る懸念を上回ったとき。
