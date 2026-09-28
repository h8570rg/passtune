# 競合・代替手段（初回調査）

- Date: 2026-09-28
- Phase: 3
- Question: 友人間で「1 曲＋一言」を共有し、サブスクが違っても試聴・反応できるサービスはすでにあるか。このプロダクトが入り込む余地はどこか
- Related: [vision.md](../product/vision.md), [開発者ヒアリング](2026-09-28-developer-interview-1.md), [音楽 API 調査](2026-09-28-music-api-feasibility.md)

## TL;DR

- **コンセプトがほぼ同じアプリは海外にすでにある**（Wullup、Soundscape など）。サービスをまたいだ共有・試聴・リアクションまで備えている。ただし、いずれも評価数が数件〜十数件と小規模で、iPhone のみ・日本語非対応。
- **大手はそれぞれ自分のサービス内に閉じている。** Spotify Messages（DM・グループ最大 10 人）、Apple Music のプロフィール共有、LINE MUSIC など。サービスの違う友人間の共有は解決していない。
- **Airbuds は「今聴いている曲の自動共有」で、意図して勧める形ではない。**
- 余地がありそうなのは次の組み合わせ（推測）。
  - 日本語と日本の楽曲の照合
  - インストール不要で、LINE や X からリンク 1 つで参加できること
  - サービスの違いを気にせず、意図して 1 曲を勧められること

## Findings

### Facts（出典あり）

**同じコンセプトのアプリ**
- **Wullup**（Wullup GmbH）。[App Store](https://apps.apple.com/de/app/wullup/id6477729356)（確認日 2026-09-28）
  - 「今日の 1 曲」の投稿、友人のフィード、試聴、リアクション、グループ、DM を備える。
  - Spotify、Apple Music、YouTube Music など 7 サービスに対応し、各自のサービスにリンクを自動変換する。
  - iPhone のみ・無料。評価 4.5（18 件）。対応言語はドイツ語と英語。
- **Soundscape**。[App Store](https://apps.apple.com/us/app/soundscape-share-your-music/id6739644253)（確認日 2026-09-28）
  - Spotify と Apple Music のユーザーが同じ場で共有できる。フィード、コメント、リアクション、保存、アプリ内で試聴できる。
  - 評価 4.9（9 件）。英語のみ。
- **Songstamp**: 毎日 1 曲と気分・メモを記録する音楽日記。友人のフィードもある。[App Store](https://apps.apple.com/app/id6758682448)（確認日 2026-09-28。詳細は未確認）

- **Tunedrop**（tunedrop.org）。[Tunedrop](https://www.tunedrop.org/)（2026-09-28 の名前調査で発見。検索結果の要約による。詳細は未確認）
  - 投稿・友人のフォロー・1 曲を 30 秒の試聴つきで投稿する機能がある。
  - Spotify・Apple Music・YouTube Music と連携する。
  - コンセプトが非常に近い。

**大手サービスの共有機能**
- **Spotify Messages**。[Spotify Newsroom](https://newsroom.spotify.com/2025-08-26/introducing-messages-a-new-way-to-share-what-you-love-on-spotify-with-friends-and-family/), [2026-01 更新](https://newsroom.spotify.com/2026-01-07/listening-activity-request-to-jam-messages-updates/)（確認日 2026-09-28）
  - 2025-08 に開始したアプリ内 DM。16 歳以上、無料・有料どちらでも使える。
  - 絵文字リアクションあり。2026-01 にグループ（最大 10 人）と、友人の再生状況の表示が追加された。
  - 提供地域は「一部の市場」とされ、日本で使えるかは未確認。Spotify ユーザー同士のみ。
- **Apple Music**: プロフィールを作ると、フォロワーにプレイリストや再生中の曲を公開できる。[Apple Support](https://support.apple.com/guide/iphone/share-music-with-friends-iphe5a418a82/ios)（確認日 2026-09-28）
  - 2026-07 に「Friends」プレイリストが報じられた。[Music Ally](https://musically.com/2026/07/21/apple-music-to-get-more-social-with-new-friends-playlist/)（本文は未取得）
- **Spotify の外部 SNS 共有**: Threads、LinkedIn、Snapchat などへの共有を拡充している。[Music Ally Japan](https://www.musically.jp/spotify-expands-music-sharing-to-snap-map-threads-and-linkedin)（確認日 2026-09-28）

**近いが別のコンセプト**
- **Airbuds**: 友人の「今聴いている曲」をホーム画面のウィジェットでリアルタイムに共有する。2022 年開始。Spotify、Apple Music など複数サービスに対応し、絵文字や写真でリアクション、チャットができる。[App Store](https://apps.apple.com/us/app/airbuds-widget/id1638906106), [Billboard](https://www.billboard.com/pro/social-music-streaming-app-airbuds-inside-startup/)（確認日 2026-09-28）

**日本のサービス**
- **LINE MUSIC**: プレイリストの共有、友だちが聴いている曲の確認ができる（LINE MUSIC 内のみ）。[アプリブ](https://app-liv.jp/sns/socialnet/2478/)（確認日 2026-09-28）
- **なうぷれ**: 再生中の曲を、ジャケット写真付きで SNS に共有する補助アプリ。[App Store](https://apps.apple.com/jp/app/%E3%81%AA%E3%81%86%E3%81%B7%E3%82%8C-nowplaying-%E5%86%8D%E7%94%9F%E4%B8%AD%E3%81%AE%E9%9F%B3%E6%A5%BD%E3%82%92%E5%85%B1%E6%9C%89/id6760329811)（確認日 2026-09-28）
- **PULL**: 音楽の好みが近い、知らない人とつながる SNS。[日本経済新聞](https://www.nikkei.com/article/DGXZQOUC241LH0U1A221C2000000/)（確認日 2026-09-28。現在も運営されているかは未確認）

**開発者の現在の代替手段**
- X への投稿、口頭（[ヒアリング](2026-09-28-developer-interview-1.md)）

### Inferences（推測）

- 「サービスをまたいで、友人に 1 曲を勧め、試聴・反応できる」という機能の組み合わせ自体は新しくない。それでも小規模アプリしかないことから、このジャンルは「作れるが、広がりにくい」可能性がある。
- 広がりにくい理由の仮説は次の 2 つ。
  - 友人全員にインストールしてもらう必要があるネットワーク効果の壁
  - 不定期な投稿によるタイムラインの過疎
- 大手はサービスの違う友人をつなぐ動機が薄いため、この隙間はしばらく残る可能性が高い。
- 日本語の曲名・アーティスト名での照合（表記揺れ、英語表記との対応）は、海外アプリが弱い部分の可能性がある。
- 友人 20 人に使ってもらうという成功基準にとっては、機能の差よりも「参加のしやすさ」（インストール不要、LINE で送られたリンクから開ける）の方が効く可能性がある。

### Opinions（AI の意見）

- 目的は「自分が使いたいもの」なので、競合があることは作らない理由にならない。
- ただし、Wullup などを実際に数日使ってみるのは安く効果的な調査になる。
  - 「何が足りないか」「どこが良いか」が具体的になる。
  - 「既存アプリで十分」と分かれば、作り直しコストを避けられる。

## Implications

- 差別化の仮説（→ Phase 6 で検討）:
  - [HYPOTHESIS] インストール不要で、リンク 1 つで参加・試聴できることが、友人 20 人の参加率を上げる
  - [HYPOTHESIS] 日本の楽曲・日本語の表記揺れに強い照合が、既存の海外アプリより良い体験になる
  - [HYPOTHESIS] 「今聴いている曲」の自動共有ではなく「意図して 1 曲を勧める」体験に絞ることで、Airbuds や Spotify Messages と役割が分かれる
- リスク（→ Phase 5）: ネットワーク効果の壁、タイムラインの過疎

## Open / Next

- ~~開発者が Wullup / Soundscape を試して感じた不足点~~ → 試さないことに決定（2026-09-28）
- 差別化の仮説 3 つは開発者が同意（2026-09-28）。Phase 6 で戦略に落とす
- [OPEN] Spotify Messages は日本で使えるか
- [OPEN] Apple Music「Friends」プレイリストの詳細

## Sources

- [Wullup - App Store](https://apps.apple.com/de/app/wullup/id6477729356) — 確認日 2026-09-28
- [Soundscape - App Store](https://apps.apple.com/us/app/soundscape-share-your-music/id6739644253) — 確認日 2026-09-28
- [Songstamp - App Store](https://apps.apple.com/app/id6758682448) — 確認日 2026-09-28
- [Airbuds Widget - App Store](https://apps.apple.com/us/app/airbuds-widget/id1638906106) — 確認日 2026-09-28
- [Billboard: Inside Airbuds](https://www.billboard.com/pro/social-music-streaming-app-airbuds-inside-startup/) — 確認日 2026-09-28
- [Spotify Newsroom: Introducing Messages (2025-08-26)](https://newsroom.spotify.com/2025-08-26/introducing-messages-a-new-way-to-share-what-you-love-on-spotify-with-friends-and-family/) — 確認日 2026-09-28
- [Spotify Newsroom: Listening Activity and Request to Jam (2026-01-07)](https://newsroom.spotify.com/2026-01-07/listening-activity-request-to-jam-messages-updates/) — 確認日 2026-09-28
- [Apple Support: Share music with friends](https://support.apple.com/guide/iphone/share-music-with-friends-iphe5a418a82/ios) — 確認日 2026-09-28
- [Music Ally: Apple Music Friends playlist (2026-07-21)](https://musically.com/2026/07/21/apple-music-to-get-more-social-with-new-friends-playlist/) — 見出しのみ確認
- [Music Ally Japan: Spotify SNS 共有拡充](https://www.musically.jp/spotify-expands-music-sharing-to-snap-map-threads-and-linkedin) — 確認日 2026-09-28
- [アプリブ: 音楽SNSアプリ](https://app-liv.jp/sns/socialnet/2478/) — 確認日 2026-09-28
- [なうぷれ - App Store](https://apps.apple.com/jp/app/%E3%81%AA%E3%81%86%E3%81%B7%E3%82%8C-nowplaying-%E5%86%8D%E7%94%9F%E4%B8%AD%E3%81%AE%E9%9F%B3%E6%A5%BD%E3%82%92%E5%85%B1%E6%9C%89/id6760329811) — 確認日 2026-09-28
- [日本経済新聞: PULL](https://www.nikkei.com/article/DGXZQOUC241LH0U1A221C2000000/) — 確認日 2026-09-28
