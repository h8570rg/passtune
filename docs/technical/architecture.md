# Architecture

- Phase: 9
- Last updated: 2026-09-28
- 状態: [PROPOSED]（採用済みの技術は [005](../decisions/005-platform.md) / [006](../decisions/006-hosting.md) / [007](../decisions/007-baas-auth.md) で DECIDED。このファイルは、それらをどう組み合わせるかの設計案）
- 根拠: [mvp](../product/mvp.md), [solutions](../product/solutions.md), [song-matching](../research/2026-09-28-song-matching.md)

## 1. 全体構成

```
                    ┌──────────────────────────── 利用者の端末（ブラウザ / ホーム画面の PWA）───┐
                    │  Next.js の画面                                                       │
                    │   ├─ 曲の検索・試聴音源の取得 ──────────────→ iTunes Search / Lookup API（Apple）
                    │   ├─ 試聴の再生 ←──────────────────────────── Apple の音声配信（保存しない）
                    │   └─ データの読み書き（Supabase のクライアント）─┐                          │
                    └──────────────────────────────────────────────│───────────────────────────┘
                                                                   │
  ┌──────────── Vercel ────────────┐                               ▼
  │ Next.js（サーバー側）           │                 ┌──────── Supabase ────────┐
  │  └─ 公開ページの描画（投稿・     │ ──データ取得──→ │ Postgres ＋ 行ごとの      │
  │      プロフィール。ログインなし  │                 │ アクセス制御（RLS）       │
  │      でも見られる）             │                 │ Auth（メールの 6 桁コード │
  │                                │                 │  ・Google）              │
  └────────────────────────────────┘                 └──────────┬───────────────┘
                                                                │ ログイン用メール
                                                                ▼
                                                            Resend ──→ 利用者のメール
```

### 役割分担の方針

- **データの読み書きとアクセス制御は Supabase に寄せる。** 誰が何をできるかは、DB のルール（RLS）で決める。Next.js のサーバー側に書くコードは最小にする（バックエンド経験が少ないため）。
- **iTunes Search / Lookup API は、利用者のブラウザから直接呼ぶ。**
  - どちらもブラウザからの呼び出しが許可されている（2026-09-28 に確認: `access-control-allow-origin: *`）。
  - 呼び出し回数の上限（約 20 回/分）は IP ごとなので、利用者ごとに分散される。
  - サーバーを経由しないので、Vercel の実行回数も使わない。
- **Spotify の API や oEmbed は使わない。** 投稿は曲名検索だけ（開発者の決定、2026-09-28）。Spotify へは検索画面へのリンクで誘導する。
- **試聴音源と、Apple のジャケット画像は保存しない。** 表示や再生のたびに Apple から直接取得する（利用条件: キャッシュ禁止）。

## 2. 主な流れ

### 投稿

1. 利用者が曲名（＋アーティスト名）を入力する。
2. ブラウザから iTunes Search API で候補を取得する。
3. 候補を試聴しながら、投稿者が 1 曲を選ぶ（取り違えの防止: R4）。
4. 一言を添えて投稿する。DB には Apple の曲 ID・曲名・アーティスト名を保存する（試聴音源とジャケット画像は保存しない）。

### 試聴と再生回数

1. 再生ボタンを押すと、ブラウザから iTunes Lookup API で試聴音源の URL を取得して再生する。
   - 複数の ID をまとめて 1 回で取得できる（2026-09-28 に確認）。
2. 再生が始まったら、DB の関数を呼んで延べ再生回数を 1 増やす。
3. 再生回数は、投稿者本人だけが読める（RLS）。

### 各自のサービスで開く

- Apple Music: 曲 ID から曲のページへ。
- Spotify: 曲名＋アーティスト名で Spotify の検索画面へ。
- YouTube Music: 曲名＋アーティスト名で検索画面へ。

### 表示のルール（利用条件・ブランドガイドライン）[PROPOSED]

根拠: [music-terms](../research/2026-09-28-music-terms.md)

- 試聴プレーヤーの近くに、公式の「Listen on Apple Music」バッジ（その曲への直接リンク）と「provided courtesy of iTunes」の表記を置く。
- 各サービスで開くボタンを並べるときは、Apple Music を先頭にする。
- Spotify・YouTube Music は、ロゴを使わず文字のボタンにする。

### 招待とログイン

1. 招待リンクは `https://<ドメイン>/i/<招待した人のID>?openExternalBrowser=1`。
   - `openExternalBrowser=1` で、LINE のアプリ内ブラウザではなく普段のブラウザで開かせる。
2. メールの 6 桁コード、または Google でログインする。
3. 初回ログイン時に、招待した人を自動でフォローする。
4. iPhone なら「ホーム画面に追加」の案内を出す。

## 3. データ設計

### テーブル

| テーブル | 主な項目 | 備考 |
|---|---|---|
| profiles | id（Auth のユーザー ID）、handle（一意）、display_name、preferred_service（spotify / apple_music / youtube_music）、invited_by、created_at | 利用者の公開情報 |
| follows | follower_id、followee_id、created_at | 2 つの ID の組が一意 |
| posts | id、user_id、apple_track_id、title、artist_name、comment（一言）、created_at | 試聴音源と画像は保存しない |
| likes | user_id、post_id、created_at | 組が一意 |
| comments | id、post_id、user_id、body、created_at | 返信機能なし |
| post_stats | post_id、play_count | 投稿者だけが読める。増やすのは専用の関数経由のみ |
| daily_active | user_id、date | 「週に 1 回以上開く人の数」の計測用。1 人 1 日 1 行 |

### アクセスのルール（RLS）

| テーブル | 読む | 書く |
|---|---|---|
| profiles | 誰でも（ログインなし閲覧のため） | 本人のみ更新 |
| follows | 誰でも | フォローする本人のみ追加・削除 |
| posts | 誰でも | 本人のみ追加・削除 |
| likes | 誰でも | 本人のみ追加・削除 |
| comments | 誰でも | ログインした人が追加。本人のみ削除 |
| post_stats | **投稿者本人のみ** | 直接の書き込みは不可。再生回数を 1 増やす関数だけを公開（ログインなしの閲覧者の再生も数える） |
| daily_active | 本人のみ | 本人のみ追加 |

- 管理者による削除は、Supabase の管理画面から行う（[mvp](../product/mvp.md) で決定済み）。
- 計測用の集計（登録率・週あたりの投稿数など）は、管理画面から SQL で見る。専用の画面は作らない。

## 4. 環境と運用

| 項目 | 案 |
|---|---|
| 環境 | MVP の評価は PC のみで、手元の Supabase を使う（スマホでは試さない。開発者の決定）。開発も手元の PC で Supabase を動かす（Supabase CLI ＋ Docker）。クラウドの Supabase は本番用の 1 つだけ（既存のプロジェクトを 1 つ一時停止して枠を空ける）。Vercel はプレビュー環境と本番環境 |
| ソースコード | GitHub の非公開リポジトリ。AI が作成する（作成前に必ず開発者に確認する） |
| バックアップ | GitHub Actions で週 1 回、本番 DB を書き出す |
| PWA | Web アプリの設定ファイル（manifest）と Service Worker（Android のインストールに fetch ハンドラーが必要） |
| 固定費 | ドメイン代のみ（年 数千円） |

## 5. 未確定の点

- [OPEN] ログインなしの閲覧者に見せる範囲。個別の投稿ページとプロフィールは見せる。タイムライン（フォロー中の投稿）はログインが必要。
- [DECIDED] Apple の試聴の横に、他のサービス（Spotify・YouTube Music）で開くボタンを置く。iTunes の利用条件と衝突する可能性は承知のうえ（R3a）。
