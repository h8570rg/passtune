# 音楽 API の実現性・規約リスク（初回調査）

- Date: 2026-09-28
- Phase: 1（Phase 5 のリスク分析を前倒し）
- Question: 開発者のアイデア（曲検索・Spotify/Apple Music リンクでの投稿、プレビュー再生、各自のサブスクで開けるリンク）は、個人開発・友人 20 人〜一般公開・年 1 万円の制約で実現できるか
- Related: [vision.md](../product/vision.md), [002](../decisions/002-audience-and-openness.md)

## TL;DR

- **Spotify のユーザーログイン連携は、事実上 5 人までしか使えない。** 開発モードは 1 アプリ 5 ユーザーで、上限を外す申請は法人かつ MAU 25 万以上が条件。個人では友人 20 人にも届かない。
- **Spotify API からプレビュー音源は取れない**（2024-11-27 以降に作られたアプリ）。Spotify の埋め込みプレーヤー（Embed）なら再生できる可能性があるが、条件は未確認。
- **Apple の iTunes Search API は、キーなし・無料でプレビュー音源の URL を返す**（実際にリクエストして確認）。ただし「宣伝目的」「購入 / 視聴ページへのリンクの併置」「キャッシュ禁止」などの条件がある。
- **Apple Developer Program の年会費は 12,980 円前後で、それだけで予算の目安（年 1 万円）を超える。** MusicKit やネイティブ iOS アプリにはこれが必要になる。
- **サービス間リンク変換の定番 Odesli（song.link）は、キーなしの API が廃止された**（実際に 401 を確認）。キーの入手条件と料金は不明。

## Findings

### Facts（出典あり）

**Spotify**
- 2024-11-27 以降に作成されたアプリでは `preview_url` が返らない。レコメンド・audio features なども同時に制限された。[Brizm](https://developers.brizm.dev/blog/spotify-api-changes-2026/), [Spotify Community](https://community.spotify.com/t5/Spotify-for-Developers/Missing-Preview-URL-using-Client-Credentials/td-p/6492694)（確認日 2026-09-28。Spotify 公式発表そのものは未確認）
- 2025-05-15 以降、Extended Quota Mode の申請は組織のみ受付。登記済みの法人・ローンチ済みのサービス・MAU 25 万以上などが条件。[Spotify Community](https://community.spotify.com/t5/Spotify-for-Developers/Clarification-on-Extended-Quota-Mode-Eligibility/td-p/7503072), [TechCrunch](https://techcrunch.com/2026/02/06/spotify-changes-developer-mode-api-to-require-premium-accounts-limits-test-users/)（確認日 2026-09-28）
- 2026-02-11 以降の新規開発モードアプリには次の条件がかかる。[Spotify 公式 移行ガイド](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide)（確認日 2026-09-28）
  - オーナーに Premium 契約が必要
  - 1 アプリあたりユーザー 5 人まで
  - 複数 ID の一括取得エンドポイントは廃止
  - 検索の `limit` 上限は 10
  - トラックの `popularity` などのフィールドは削除
- 2026-07-23: Client ID の上限が 1 → 25 に緩和された。ただし、クォータは開発者アカウント単位で共有される。[Spotify 公式ブログ](https://developer.spotify.com/blog/2026-07-23-web-api-quota-updates)（確認日 2026-09-28）
- 開発者規約（2025-05-15 発効）の主な条件。[Spotify Developer Terms](https://developer.spotify.com/terms)（確認日 2026-09-28）
  - Spotify コンテンツの一時的な範囲を超えるキャッシュは禁止
  - 表示するデータは最新にする
  - 広告ネットワークなどへのデータ提供は禁止
  - 商用の機能には別途条件がある
- 埋め込みプレーヤーについては、状況によって「30 秒未満のプレビューのみ」再生される、と公式に記載がある。[Spotify Embeds Troubleshooting](https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting)（確認日 2026-09-28）

**Apple**
- iTunes Search API は、キーなしで `previewUrl`（試聴用の音声 URL）と `trackViewUrl`（Apple Music の曲ページ）を返す。2026-09-28 に実際のリクエストで確認した。
- iTunes Search API の利用条件。[Apple 公式（アーカイブ文書）](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)（確認日 2026-09-28）
  - プレビューは宣伝目的で使う
  - iTunes / App Store へのリンク（バッジ）の近くに置く
  - ストリーミングのみで、保存・キャッシュはしない
  - 「provided courtesy of iTunes」と表記する
- Apple Developer Program は年 99 USD。日本では 12,980 円（Web 登録）という記載が複数ある。[Apple 公式](https://developer.apple.com/programs/whats-included/), [テクラル](https://www.tekural.com/blog/apple-developer-program-cost)（確認日 2026-09-28。円建て価格は二次情報）

**サービス間リンク変換**
- Odesli（song.link）API に、キーなしでリクエストすると `401 PUBLIC_API_ACCESS_DEPRECATED` が返る。2026-09-28 に実際のリクエストで確認した。
- キーの入手はメール申請（developers@song.link）という記載がある。料金は不明。[jentic](https://jentic.com/apis/odesli)（二次情報）

### Inferences（推測）

- 「Spotify でログイン」や「ユーザーの Spotify データを読む」機能は、友人 20 人の段階でも成り立たない（1 アプリ 5 ユーザーの上限と、法人・MAU 25 万の拡張条件から）。
- ユーザーログインを伴わない Spotify API の利用（Client Credentials での曲検索・情報取得）は、ユーザー数の上限に当たらない可能性がある。ただし公式文書に明記はなく、クォータの数え方も不明。
- プレビュー再生は、Apple 側（iTunes Search API）の方が素直に実現できる。友人に Apple Music 利用者が多いこととも合う。
- Spotify の曲のプレビューは、API ではなく埋め込みプレーヤー経由になる。ただし表示が重く、UI の自由度は低い。
- Apple Developer Program を必要としない構成（Web ＋ iTunes Search API など）なら、予算の目安に収まる余地がある。ネイティブ iOS アプリや MusicKit が必要になった時点で、予算の目安を超える。
- サービス間の曲の対応付けは、有料キーの API に頼るか、曲名とアーティスト名で各サービスを検索して照合するかになる。後者は精度に課題がある。

### Opinions（AI の意見）

- アイデアの中心である「プレビュー再生」と「各自のサブスクで開けるリンク」は、Spotify 公式 API のみでは実現が難しい。一方で、Apple 系 API と各サービスの埋め込みプレーヤーを組み合わせれば実現の余地がある。
- 「Spotify ユーザー連携」は当面の選択肢から外れる可能性が高い。そのため、Phase 7（解決策の検討）はこの前提で考えるのが安全。

## Implications

- H1（サブスクの違い）と H4（試聴）を解く手段は、外部 API の制約に強く縛られる。解決策の比較（Phase 7）はこの調査を前提にする。
- 予算に効くのは「Apple Developer Program が必要になるか」。これはプラットフォーム戦略（Web / Native）の判断材料になる。ただし決定は Phase 9。
- 一般公開の段階では、どの API もユーザー数・リクエスト数の上限と規約（キャッシュ禁止など）の確認が再度必要になる。

## Open / Next

- [OPEN] Spotify の Client Credentials 利用が、開発モードのユーザー上限やクォータにどう数えられるか
- [OPEN] Spotify Embed の再生条件（未ログイン時は 30 秒プレビューか、全曲か）と、埋め込みに API キーや開発者登録が要るか
- [OPEN] Apple Music の埋め込みプレーヤーの利用条件
- [OPEN] iTunes Search API のレート制限（公式の数値は未確認）と、現行の利用規約（アーカイブ文書が最新かどうか）
- [OPEN] Odesli のキー取得条件と料金。代替手段（ISRC での照合など）の可否
- [OPEN] YouTube Music など、他サービスを使う友人がいるか

## Sources

- [Spotify: February 2026 Web API Dev Mode Changes - Migration Guide](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide) — 確認日 2026-09-28
- [Spotify: Web API quota updates for Development Mode (2026-07-23)](https://developer.spotify.com/blog/2026-07-23-web-api-quota-updates) — 確認日 2026-09-28
- [Spotify Developer Terms](https://developer.spotify.com/terms) — 確認日 2026-09-28
- [Spotify Embeds Troubleshooting](https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting) — 確認日 2026-09-28
- [TechCrunch: Spotify changes developer mode API (2026-02-06)](https://techcrunch.com/2026/02/06/spotify-changes-developer-mode-api-to-require-premium-accounts-limits-test-users/) — 確認日 2026-09-28
- [Spotify Community: Extended Quota Mode Eligibility](https://community.spotify.com/t5/Spotify-for-Developers/Clarification-on-Extended-Quota-Mode-Eligibility/td-p/7503072) — 確認日 2026-09-28
- [Spotify Community: Missing Preview URL](https://community.spotify.com/t5/Spotify-for-Developers/Missing-Preview-URL-using-Client-Credentials/td-p/6492694) — 確認日 2026-09-28
- [Brizm: Spotify API Changes](https://developers.brizm.dev/blog/spotify-api-changes-2026/) — 確認日 2026-09-28
- [Apple: iTunes Search API（アーカイブ）](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html) — 確認日 2026-09-28
- [Apple: Membership Details](https://developer.apple.com/programs/whats-included/) — 確認日 2026-09-28
- [テクラル: Apple Developer Program 費用](https://www.tekural.com/blog/apple-developer-program-cost) — 確認日 2026-09-28
- [jentic: Odesli API](https://jentic.com/apis/odesli) — 確認日 2026-09-28
- 実際のリクエスト: `api.song.link/v1-alpha.1/links`（401）、`itunes.apple.com/search`（200、previewUrl あり）— 2026-09-28
