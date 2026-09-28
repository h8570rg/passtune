# 曲の照合と試聴の実験（初回）

- Date: 2026-09-28
- Phase: 7
- Question: Spotify / Apple Music のリンクや曲名から、試聴音源と各サービスへのリンクをどう得られるか
- Related: [音楽 API 調査](2026-09-28-music-api-feasibility.md), [solutions.md](../product/solutions.md)

## TL;DR

- **Apple Music のリンクからは、試聴まで確実に取れる。** リンクに含まれる曲 ID で iTunes の lookup を引けば、曲名・アーティスト名・試聴 URL が得られる。
- **曲名での検索（iTunes Search API）は、日本語・ローマ字・英語表記のどれでも本家の曲が先頭に来た**（3 例）。ただし、カバーや別バージョン（THE FIRST TAKE など）も混ざる。
- **Spotify のリンクからは、キーなしでは曲名しか取れない**（oEmbed。アーティスト名なし）。
  - Spotify API（Client Credentials、ユーザーログイン不要）を使えば、アーティスト名と ISRC（国際標準の録音コード）も取れる。
  - ただし、iTunes Search API は ISRC で検索できない。ISRC で Apple の曲を引くには Apple Music API（有料の Developer Program が必要）が要る。
- **iTunes Search API の上限は「約 20 回/分」（IP あたり、変わりうる）。** サーバーからまとめて呼ぶと、利用者が増えたときに上限に当たりうる。

## Findings

### Facts（実験・出典）

2026-09-28 に実際のリクエストで確認した。

- `itunes.apple.com/lookup?id=1490256995&country=JP` → 次が返る。
  - 返るもの: `trackName`（夜に駆ける）、`artistName`（YOASOBI）、`previewUrl`、`trackViewUrl`（Apple Music の曲ページ）
  - 返らないもの: `isrc`
- `itunes.apple.com/search?entity=song&country=JP` の結果:
  - 「yoru ni kakeru yoasobi」→ 1 位: 夜に駆ける / YOASOBI。2 位以降はピアノ版やオルゴールのカバー。
  - 「夜に駆ける YOASOBI」→ 1 位: 夜に駆ける / YOASOBI。2 位: THE FIRST TAKE 版。
  - 「Idol YOASOBI」→ 1 位: Idol / YOASOBI（英語版）。2 位: アイドル / YOASOBI。
  - いずれも `previewUrl` あり。
- `open.spotify.com/oembed?url=<トラックURL>` → キーなしで取れるのは曲名（`title`）、ジャケット画像、埋め込みプレーヤーの URL。アーティスト名は含まれない。
- Spotify Web API の Get Track は `external_ids.isrc` を返す。Client Credentials（ユーザーログイン不要）で利用できる。[Spotify Web API Reference](https://developer.spotify.com/documentation/web-api/reference/get-track)（確認日 2026-09-28）
  - 2026-02 の開発モード変更で削除されたフィールドの一覧に `external_ids` は含まれていない（[移行ガイド](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide)）。
- iTunes Search API の上限は約 20 回/分（変わりうる）。Apple は大規模サイトに検索結果のキャッシュを勧めている。[Apple Performance Partners: Search API](https://performance-partners.apple.com/search-api), [Podchaser](https://www.podchaser.com/articles/api/itunes-search-api-rate-limit)（確認日 2026-09-28）
  - 「キャッシュ推奨」は検索結果の話。試聴音源そのものの保存・キャッシュは利用条件で禁止されている。

### Inferences（推測）

- Spotify のリンクから投稿する流れは、次の形になる。
  1. Spotify API で曲名・アーティスト名（＋ ISRC）を取得する
  2. iTunes Search API で候補を検索する
  3. 投稿者が候補を確認する
  - ISRC を使った完全一致は、Apple Music API（有料）なしでは難しい。
- 検索結果にはカバーや別バージョンが混ざるため、自動で 1 件に決めるより、投稿者に候補を見せて選んでもらう方が確実（R4 の対応方針と一致）。
- 友人 20 人規模なら、iTunes Search API の上限はまず問題にならない。
  - 呼び出し元を利用者の端末にすれば、IP ごとの上限は分散する。どこから呼ぶかは Phase 9 で決める。

## Open / Next

- [OPEN] Spotify の Client Credentials 利用が、開発モードのクォータにどう数えられるか（実際にアプリを登録して確認する必要がある。Phase 9）
- [OPEN] 曲名検索で、アーティスト名がない場合（oEmbed のみの場合）の照合精度
- [OPEN] Apple Music にない曲（インディーズなど）の割合

## Sources

- 実際のリクエスト: `itunes.apple.com/lookup`, `itunes.apple.com/search`, `open.spotify.com/oembed` — 2026-09-28
- [Spotify Web API Reference: Get Track](https://developer.spotify.com/documentation/web-api/reference/get-track) — 確認日 2026-09-28
- [Spotify February 2026 Migration Guide](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide) — 確認日 2026-09-28
- [Apple Performance Partners: iTunes Search API](https://performance-partners.apple.com/search-api) — 確認日 2026-09-28
- [Podchaser: iTunes Search API Rate Limit](https://www.podchaser.com/articles/api/itunes-search-api-rate-limit) — 確認日 2026-09-28

## 追加調査: iTunes Search API の利用条件と保存の可否（2026-09-28）

### Facts（出典: [Apple 公式（アーカイブ文書、Copyright 2022）](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html), [Apple Performance Partners: Search API](https://performance-partners.apple.com/search-api)、確認日 2026-09-28）

- 「Promo Content」の定義: 曲とミュージックビデオの試聴、アルバムアート、アプリのアイコン。
- Promo Content の利用条件:
  - (i) その Promo Content の元になったコンテンツを宣伝するページにのみ置く
  - (ii) Apple が承認したバッジの近くに置く。バッジは、その曲を購入できる Apple のページへの直接のリンクにする
  - (iii) 試聴には「provided courtesy of iTunes」と表記する
  - (iv) 試聴はストリーミングのみ。ダウンロード・保存・キャッシュをしない
  - (v) 宣伝目的と切り離した、それ自体の娯楽価値のために使わない
  - (vi) 他の商品やサービスの宣伝に使わない
- 検索・lookup の結果については、「大規模なサイトはキャッシュの仕組みを設けるべき」とされている。

### Inferences（推測）

- 曲名・アーティスト名・曲 ID は Promo Content に含まれない。保存しても条件に反しない（Apple 自身が検索結果のキャッシュを勧めている）。
- アルバムアートは Promo Content だが、「保存・キャッシュをしない」（iv）の対象は試聴のみ。したがって画像の保存も明示的には禁止されていない。ただし、保存する必要がないため保存しない。
- **新たな論点:** 条件 (vi)「他の商品やサービスの宣伝に使わない」と、Apple の試聴の横に「Spotify で開く」「YouTube Music で開く」を置く設計が衝突する可能性がある。
- この文書は 2022 年のアーカイブで、現行の条件と同一かは確認できていない。
