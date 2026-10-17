# 聴かせたいところ（サビなど）を聴いてもらう方法

- Date: 2026-10-17
- Phase: 12（開発者が手元で使ってみた気づき）
- Question: 試聴（30 秒）がイントロだけでサビが聴けないことがある。投稿者が「いい感じのところ」を聴かせるには、どんな方法があるか。
- Related: [service-deeplinks](2026-09-28-service-deeplinks.md), [music-terms](2026-09-28-music-terms.md), [strategy](../product/strategy.md)

## TL;DR

- 今の試聴は Apple が用意した 30 秒の音源で、**どの 30 秒かは Apple（レーベル）が決める**。こちらでは選べない。
- 曲の好きな位置から聴かせられるのは、実質 **YouTube の埋め込み（開始位置を指定できる。無料・誰でも聴ける）** と **Apple Music のフル再生（MusicKit JS。Apple Music 会員だけ・年 99 ドル）**。
- Spotify のフル再生（Web Playback SDK）は、Premium 必須かつ開発モードは 5 人までで、このプロジェクトでは使えない。
- AI の推奨: 「聴きどころ」から YouTube で聴ける機能を追加する（30 秒の試聴はそのまま残す）。要確認事項は Open を参照。

## Findings

### Facts（出典あり）

- 今の試聴は iTunes Search API の `previewUrl`（30 秒の音源ファイル）。区間は Apple 側で固定されていて、指定できない。（実装: `lib/music/itunes.ts`）
- **YouTube の埋め込み**
  - `start` / `end` パラメーターで、再生の開始・終了位置（秒）を指定できる。キーフレームの関係で最大 2 秒ほど早く始まることがある。[YouTube Player Parameters](https://developers.google.com/youtube/player_parameters)（確認日 2026-10-17）
  - 埋め込みプレーヤーは 200×200px 以上が必要。[同上](https://developers.google.com/youtube/player_parameters)
  - 禁止事項: 音声と映像を分離すること、表示していないプレーヤー（バックグラウンド）で再生すること、プレーヤーの一部を隠す・ふさぐこと。YouTube の利用規約へのリンク表示と、プライバシーポリシーでの開示が必要。[YouTube API Services Developer Policies](https://developers.google.com/youtube/terms/developer-policies) III.A、III.I.6〜9（確認日 2026-10-17）
- **Apple Music のフル再生（MusicKit JS）**
  - 再生には利用者の認証が必要で、フル再生できるのは Apple Music 会員だけ（会員でなければ試聴のみ）。開発者トークンの発行に Apple Developer Program（年 99 ドル）が必要。[WWDC22 Meet Apple Music API and MusicKit](https://developer.apple.com/videos/play/wwdc2022/10148/)、[Apple Music JavaScript integration guide（第三者）](https://dev.to/areknawo/apple-music-javascript-integration-guide-518b)（確認日 2026-10-17）
- **Spotify のフル再生（Web Playback SDK）**
  - Premium 会員だけが使える。[Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk)（確認日 2026-10-17）
  - 開発モードのアプリは、許可した 5 人まで。拡張（上限解除）は月間 25 万人以上の組織に限られる。[February 2026 Web API Dev Mode Changes](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide)、[Web API quota updates（2026-07-23）](https://developer.spotify.com/blog/2026-07-23-web-api-quota-updates)（確認日 2026-10-17）

### Inferences（推測）

- 30 秒の試聴の範囲内で開始位置を選ぶ方法もあるが、サビが 30 秒に含まれていなければ解決しない。
- YouTube は、公式 MV や「〜 - Topic」チャンネルの音源が多くの邦楽にある。ただし、埋め込みが無効な動画や、YouTube にない曲もある。
- MusicKit JS は、Spotify を使う開発者自身がフル再生できず、友人のうち Apple Music 会員にしか効かない。予算（年 1 万円）も超える。
- Spotify の 5 人の上限が、今使っている Client Credentials（ログインなしの検索）にもかかるかは、公式の記述から読み取れなかった（STATUS の OPEN のまま）。

### Opinions（意見・評価）

- AI: 「サービスの違いを意識させない」「聴くまでの手間を最小にする」に最も合うのは YouTube。誰でも無料で、ログインなしで、サビから聴ける。

## Implications

| 案 | 内容 | 誰が聴けるか | 費用 | 手間 |
|---|---|---|---|---|
| A. 試聴の開始位置を選ぶ | 30 秒の中で、投稿者が開始位置を選ぶ | 全員 | 0 | 小 |
| B. 聴きどころを文字で添える | 「1:05〜サビ」を表示。各サービスで開いたときに自分で飛ばす | 全員（手動） | 0 | 小 |
| **C. YouTube で聴きどころから再生** | 投稿時に YouTube の動画を選び、開始位置を決める。聴く人は押すとそこから再生 | 全員 | 0（YouTube Data API の無料枠） | 中 |
| D. Apple Music でフル再生 | MusicKit JS。会員はアプリ内で好きな位置から再生 | Apple Music 会員だけ | 年 99 ドル | 中〜大 |
| E. Spotify でフル再生 | Web Playback SDK | Premium 会員かつ 5 人まで | 0 | 大 |

- [OPEN] どの案にするか（開発者が決める）。

## Open / Next

- C を選ぶ場合に確認すること:
  - YouTube Data API の検索（search.list）は、検索専用の枠で 1 日 100 回まで（無料）。投稿時だけ検索するなら、友人 20 人規模では足りる見込み。[Quota costs](https://developers.google.com/youtube/v3/determine_quota_cost)（確認日 2026-10-17）
  - 動画を自動で選ぶか、投稿者が候補から選ぶか（MV はイントロに映像だけの部分があることがある）。
  - タイムラインに動画プレーヤーを常に出すと重いので、押したときに読み込む形にする。
  - プライバシーポリシーへの追記（YouTube の埋め込みが閲覧データを集める）と、YouTube 利用規約へのリンク。
