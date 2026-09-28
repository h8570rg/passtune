# Business Model / Cost

- Phase: 4
- Last updated: 2026-09-28
- Related: [vision.md](../product/vision.md), [音楽 API 調査](../research/2026-09-28-music-api-feasibility.md)

## 1. Monetization

- [DECIDED] 今は収益化しない。将来できる余地は残す（取り返しのつかない選択を避ける）。

### 将来の収益化の候補（調査のみ、決定しない）

| 候補 | 規約・条件（事実） | メモ |
|---|---|---|
| Apple Music のアフィリエイト | Apple Services Performance Partners は、Apple Music 新規加入の初月分などに報酬がある。日本も対象。参加は「量と質を満たす一部のパートナー」に限定。[Apple](https://performance-partners.apple.com/program-overview)（確認日 2026-09-28） | 試聴のそばに Apple Music へのリンクを置くことは、iTunes Search API の利用条件でもある。収益化と相性がよい |
| 広告 | Spotify: 広告の販売が禁止されるのは Spotify で音楽を再生するアプリ（Streaming SDA）のみ。それ以外のアプリは、有料化や広告が可能。[Spotify Developer Policy](https://developer.spotify.com/policy)（確認日 2026-09-28） | Apple の試聴音源（宣伝目的での利用が条件）の近くに広告を置けるかは [OPEN] |
| 有料機能・寄付 | ― | 友人規模では現実的でない。一般に広がった後の話 |

### 塞がないために守ること [PROPOSED]

- Spotify の曲情報を表示するときは、Spotify のロゴや表記による出典表示と、Spotify へのリンクを付ける（Spotify Developer Policy II.4）。
- Apple の試聴音源は、Apple Music へのリンクと「provided courtesy of iTunes」の表記を併置する。保存やキャッシュはしない。
- Spotify の API で音楽を再生するアプリ（Streaming SDA）にしない（そうなると広告や有料化が禁止されるため）。

## 2. Cost

- [DECIDED] ランニングコストの目安は年 10,000 円（月 約 830 円）。サービスの質が落ちるなら増額してよい。

### 費用の種類（推測。具体的なサービスと価格は Phase 9 で確認する）

| 費用 | 目安 | 予算への影響 |
|---|---|---|
| ドメイン | 年 数千円程度（種類による） | 小 |
| アプリの実行環境・データベース | 無料枠〜月数百円〜数千円 | 無料枠に収まるかで大きく変わる |
| Apple Developer Program | 年 約 12,980 円（ネイティブ iOS アプリや MusicKit を使う場合のみ） | それだけで予算超過 |
| Google Play デベロッパー登録 | 一度きりの登録料（Android ネイティブの場合のみ。金額は要確認） | 中 |
| 音声・画像の配信 | 試聴音源とジャケット画像は Apple / Spotify から直接配信され、自前の保存はしない（規約上キャッシュ不可） | ほぼ 0 |

### コストを抑えるプロダクト上の選択 [PROPOSED]

- 投稿は「曲への参照＋一言テキスト」だけにする。ユーザーが画像・音声・動画をアップロードする機能は当面持たない。
  - 理由: ストレージと配信の費用、およびモデレーション（不適切な画像など）の負担を避けるため。
- この条件なら、コストの大半は「アプリの実行環境・データベース」と「Apple Developer Program が必要な構成かどうか」で決まる（→ Phase 9）。

## Revisit when

- 一般公開後にユーザーが増え、無料枠や予算の目安を超えそうになったとき
- 収益化を検討したくなったとき
