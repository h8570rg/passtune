# 音楽サービスの利用条件・ブランドガイドライン（詳細調査）

- Date: 2026-09-28
- Phase: 9
- Question: Apple の試聴の横に Spotify・YouTube Music で開くボタンを置く設計（R3a）について、Apple・Spotify の現行の条件やガイドラインはどうなっているか。守るべき表示ルールは何か
- Related: [risks](../product/risks.md) R3a, [song-matching](2026-09-28-song-matching.md), [architecture](../technical/architecture.md)
- 注意: AI による規約の読み取りで、法的な判断ではない。

## TL;DR

- **iTunes Search API の条件は、今も Apple の現行サイトに掲載されている。** アーカイブ文書（2022 年）だけでなく、Apple Services Performance Partners のページにも同じ条件がある。
- **Apple Music のブランドガイドラインは、他の音楽サービスのバッジと並べることを想定している。** 条件は「Apple Music のバッジを先頭に置く」こと。今の設計（試聴＋各サービスで開くボタン）は、この並べ方に合わせることで条件への適合度を上げられる。
- **Apple Music の公式の埋め込みプレーヤーがある。** 非加入者は 30 秒の試聴、加入者はフル再生ができる。iTunes Search API が使えなくなったときの代わりになる（ただし、再生回数を数えにくい）。
- **Spotify の API もデータも使わないため、Spotify の開発者向け規約は基本的に対象外。** ただし、Spotify のロゴを使うならブランドガイドラインに従う。

## Findings

### Facts（出典あり、確認日 2026-09-28）

**iTunes Search API の条件**
- Promo Content（試聴・アルバムアート・アプリアイコン）の利用条件（その曲の宣伝ページに置く、バッジを近くに置く、「provided courtesy of iTunes」の表記、試聴の保存禁止、それ自体を娯楽として使わない、他の商品・サービスの宣伝に使わない）が、次の 2 つに掲載されている。
  - 現行の [Apple Services Performance Partners: Search API](https://performance-partners.apple.com/search-api)
  - [アーカイブ文書](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)

**Apple Music Identity Guidelines**（[Apple](https://marketing.services.apple/apple-music-identity-guidelines), [Apple（旧 URL）](https://www.apple.com/itunes/affiliates/resources/apple_music_badges.html)）
- Apple Music のバッジを他の音楽サービスのバッジと一緒に使う場合、Apple Music のバッジを先頭に置く。
- バッジやロックアップをオンラインで使う場所には、必ず Apple Music へのリンクを付ける。リンク先は曲・アルバム・アーティストなど、どのページでもよい。
- バッジは Apple 提供のものをそのまま使い、「Listen on」の文言を消したり、変形・回転・影付けなどをしたりしない。1 つの表示の中でバッジは 1 つだけ。バッジは宣伝する画像や文言の下か右に置き、主役より小さくする。
- 広告・アプリ・Web サイト・印刷物で使える。Web やアプリでの通常の利用は事前承認が不要（テレビ・印刷物・目立つ形式などは書面の承認が必要）。

**Apple Music の埋め込みプレーヤー**（[Apple Music for Artists](https://artists.apple.com/support/1117-apple-music-marketing-tools), [Apple Marketing Tools](https://tools.applemediaservices.com/apple-music)）
- 曲・アルバム・プレイリストを Web に埋め込める。
- 非加入者は 30 秒の試聴、Apple Music にログインしている加入者は、サイトを離れずにフル再生できる。
- マーケティングツールでは、アフィリエイトのトークン付きリンク、埋め込みプレーヤー、バッジなどを作れる。

**Spotify**（[Spotify Design & Branding Guidelines](https://developer.spotify.com/documentation/design)）
- ガイドラインの要件は、主に「Spotify のメタデータやコンテンツを使う場合」「利用者の Spotify アカウントと連携する場合」に適用される。
- ロゴを使う場合の決まり:
  - ロゴは 70px 未満にしない。
  - 背景は黒か白の上に Spotify グリーン、またはモノクロ版を使う。
  - 回転・変形・画像の上への配置はしない。
  - 添える文言は「OPEN SPOTIFY」「PLAY ON SPOTIFY」「LISTEN ON SPOTIFY」など。
- ブランドの使い方の相談先は brandapproval@spotify.com。

### Inferences（推測）

- Apple 自身のブランドガイドラインが「他のサービスのバッジとの並び」を想定し、Apple を先頭にするよう求めている。したがって、各サービスで開くボタンを並べること自体が直ちに問題になる可能性は低いと考えられる。
  - ただし、条件 (vi)「Promo Content を他の商品・サービスの宣伝に使わない」との関係は、明確には解消されない。
- 条件 (v)「それ自体を娯楽として使わない」に対しては、「試聴で知って、自分のサービスで聴く（Apple Music を含む）」という流れを保つことが、宣伝目的の範囲にとどまる根拠になる。
- Spotify については、API もデータも使わず、検索画面へのリンクを置くだけ。ロゴを使わず文字のボタン（「Spotify で開く」）にすれば、ブランドガイドラインの対象外になる可能性が高い。

## Implications（設計に取り入れる表示ルールの案）

- 試聴プレーヤーのすぐ近くに、公式の「Listen on Apple Music」バッジを置き、その曲の Apple Music のページへ直接リンクする。
- 「各自のサービスで開く」ボタンを並べるときは、Apple Music を先頭にする。
  - 利用者が設定で選んだサービスを大きく表示する設計（C1）とは、見た目の順序で調整が必要。
- 試聴の近くに「provided courtesy of iTunes」を表記する。
- Spotify・YouTube Music は、ロゴを使わず文字のボタンにする（ブランドガイドラインの対象外にする）。
- iTunes Search API が使えなくなったときの代わりとして、Apple Music の埋め込みプレーヤーを控えにする。

## Open / Next

- [OPEN] 利用者の選んだサービスを大きく表示する設計（C1）と、「Apple Music を先頭に」のガイドラインをどう両立するか
- [OPEN] Apple Music の埋め込みプレーヤーの利用規約の詳細（今回の範囲では見つからず）

## 追加調査: 4 サービスのロゴボタンと、曲ページへのリンク（2026-09-28）

開発者の要望: Apple Music・Spotify・YouTube Music・LINE MUSIC などのロゴボタンを並べ、押すとその曲のページ（各サービスで聴けるページ）へ移動する。

### Facts（確認日 2026-09-28）

**ロゴの使用条件**
- LINE MUSIC: ガイドラインに従えば誰でも使える。[LINE MUSIC ロゴの使用について](https://music.line.me/top/logo/)
  - データの変形・加工、色の変更、クリアスペース内への他の情報の表示は禁止。最小サイズ未満での使用も禁止。
  - シンボル（アイコン）単独の使用は、SNS のアイコン等の既存フォーマットを除き、原則として認められない。
- YouTube Music: 公式のバッジ（「Listen on」等）があり、提供されたデザインをそのまま使う（変形禁止、デジタルで高さ 20px 以上、周囲に高さの 1/10 以上の余白）。[YouTube Music Help（ポッドキャストのバッジ）](https://support.google.com/youtubemusic/answer/13379217?hl=en)
  - ロゴ自体の利用には YouTube Music の許可が必要、という記載もある（二次情報、要確認）。
- Apple Music と Spotify: 上記 Findings のとおり（Apple は提供されたバッジをそのまま使い、並べるときは先頭に置く。Spotify はロゴの最小サイズや配色などの決まり）。

**曲ページへのリンクの作り方**
- Apple Music: 保存している曲 ID から、その曲のページへ直接リンクできる。
- Spotify・YouTube Music・LINE MUSIC の検索画面の URL は、いずれも応答した（HTTP 200、2026-09-28 に確認）。
  - `open.spotify.com/search/<語>`
  - `music.youtube.com/search?q=<語>`
  - `music.line.me/webapp/search?query=<語>`
  - 実際に検索結果が表示されるか（特に LINE MUSIC）は、実機での確認が必要。
- LINE MUSIC は公開 API がない。[Musicfetch](https://musicfetch.io/services/line-music/api)
- 複数サービスの曲ページをまとめて取得できる有料 API がある。[Musicfetch](https://musicfetch.io/)
  - 40 以上のサービスに対応し、LINE MUSIC も含む。
  - 料金は月 50 USD から。予算の目安を大きく超える。
- Spotify の曲ページを特定するには、Spotify API（ログイン不要の方式）で曲名とアーティスト名から検索できる（[音楽 API 調査](2026-09-28-music-api-feasibility.md)）。ただし、Spotify の開発者向け規約の対象になる。

### Inferences（推測）

- 曲ページに直接飛ばせるのは、追加の費用・依存なしでは Apple Music だけ。他の 3 つは、まず「そのサービス内での曲名検索の結果」に飛ばすのが現実的。利用者は結果から 1 タップで曲を開く。
- 小さな正方形のアイコンを並べるデザインは、LINE MUSIC（シンボル単独の原則禁止）や Apple（提供バッジをそのまま使う）の条件と合わない可能性がある。各社の公式バッジやロゴタイプを使う形が安全。
