# 各サービスの「曲ページ」へのリンク: 体験の差と無料の手段

- Date: 2026-09-28
- Phase: 9
- Question: 検索結果ページに飛ぶのと曲ページに飛ぶので、体験はどれくらい変わるか。曲ページに飛ばす無料の手段はあるか
- Related: [music-terms](2026-09-28-music-terms.md), [architecture](../technical/architecture.md)

## TL;DR

- **体験の差（推測）:**
  - 曲ページなら「タップ → アプリがその曲で開く → 再生」。
  - 検索結果なら「タップ → 検索結果 → カバーや別バージョンから正しい曲を選ぶ → 再生」で、1 タップと判断が 1 回増え、取り違えもありうる。
  - LINE MUSIC の検索は Web ページで開き、アプリに移らない可能性があり、差がさらに大きくなりうる。
- **Spotify は、無料で曲ページに飛ばせる。**
  - 押された時点でサーバーから Spotify API（ログイン不要の方式）で検索し、曲ページへ転送する。
  - Spotify のデータを保存しないので、保存に関する条件の心配も小さい。
  - ただし、2026-02 以降、開発モードのアプリはオーナーの Spotify Premium 契約が必須。
- **YouTube Music は、YouTube Data API で無料で動画 ID を取れる**（検索 100 回/日まで）。取り違えの精度と、保存の条件は要確認。
- **LINE MUSIC は、無料で曲ページに飛ばす手段がない**（公開 API なし）。検索結果へのリンクのみ。
- song.link（Odesli）の公開ページは無料で使えるが、試した曲では Spotify・YouTube Music に直接の URL がなく、LINE MUSIC にも非対応。頼れない。

## Findings

### Facts（確認日 2026-09-28）

- Spotify のリンクは、iOS の Safari・Chrome 等ではユニバーサルリンクでアプリが開く。Android もアプリリンクで開く（設定でオフにされていなければ）。
  - Instagram・TikTok などのアプリ内ブラウザでは、ユニバーサルリンクが働かないことがある。
  - 出典: [Linkly](https://linklyhq.com/support/spotify-open-links-in-app), [Spotify iOS Content Linking](https://developer.spotify.com/documentation/ios/tutorials/content-linking)
- Spotify の検索 API は `isrc` や `track`・`artist` の絞り込みができる。[Spotify Web API: Search](https://developer.spotify.com/documentation/web-api/reference/search)
- 2026-02-11 以降に作られた Spotify の開発モードのアプリには、次の条件がある。[移行ガイド](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide)
  - オーナーの Premium 契約が必須。
  - 検索の件数上限は 10。
- YouTube Data API: search.list は専用の枠で 1 回 1 単位、既定 100 単位/日。その他のエンドポイントは合計 1 万単位/日。[YouTube Data API: Quota](https://developers.google.com/youtube/v3/determine_quota_cost)
- LINE MUSIC の曲ページの URL は `music.line.me/webapp/track/…` の形式。PC からの共有リンクはブラウザ版の LINE MUSIC に移動する。[LINE MUSIC ヘルプ](https://help2.line.me/LINEMusic/web/?contentId=10009642&lang=ja)
  - 公開 API はない。[Musicfetch](https://musicfetch.io/services/line-music/api)
- song.link の公開ページ（`song.link/i/<Apple の曲 ID>`）は、キーなしで表示できた（2026-09-28、夜に駆ける / YOASOBI）。
  - Amazon・Deezer・Tidal・Pandora には直接の URL があった。
  - Spotify・YouTube・YouTube Music は項目だけで、URL が含まれていなかった。
  - LINE MUSIC の項目はなかった。

### Inferences（推測）

**体験の差（アプリが入っている場合）**

| | 曲ページへ | 検索結果へ |
|---|---|---|
| 操作 | タップ → その曲が開く → 再生 | タップ → 検索結果 → 正しい曲を選ぶ → 再生 |
| 判断 | 不要 | 必要（カバー、ライブ版、THE FIRST TAKE 版、英語表記の曲名など） |
| 取り違え | 投稿時の照合が正しければ、ほぼなし | 利用者が別の版を選ぶ可能性 |

- 友人に「この曲いいよ」と勧める体験では、最後のひと手間で聴くのをやめる人が出る（原則 1「聴くまでの手間を最小にする」）。差は小さくない。
- LINE MUSIC の Web 版の検索ページはブラウザで開き、アプリに移らない可能性がある。ログインを求められれば、手間はさらに増える（要実機確認）。

**Spotify の曲ページへの転送**

- 押された時点でサーバー（Vercel）が Spotify を検索して転送する方式なら、Spotify の曲 ID を DB に保存しない。そのため、Spotify のキャッシュ制限との関係がきれいになる。
- 呼び出しは 1 クリック 1 回で、友人規模なら問題にならない。
- 見つからない場合は、検索結果ページへの転送を予備にする。

**YouTube Music**

- 検索 100 回/日の枠なので、押された時点ではなく投稿時に 1 回だけ検索し、動画 ID を保存する形が現実的。
- ただし、YouTube API のデータ保存の条件と、「公式の音源（Topic チャンネル）」を正しく選べるかは要確認。

## Open / Next

- [OPEN] 開発者が Spotify Premium を契約しているか（開発モードの必須条件）
- [OPEN] Spotify の開発モードで、ログイン不要の方式の呼び出しがクォータにどう数えられるか
- [OPEN] YouTube API のデータ保存の条件と、Topic チャンネルの音源を選ぶ精度
- [OPEN] 各サービスの検索 URL と曲ページ URL を実機で開いたときの挙動（特に LINE MUSIC）
