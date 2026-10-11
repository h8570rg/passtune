# Database Design

- Phase: 11
- Last updated: 2026-10-11
- 状態: [PROPOSED]（開発者の指示により AI の判断で実装まで進める。2026-10-11）
- 方針: jankiroku ではなく、Supabase 公式のガイドと一般的なベストプラクティスに従う（開発者の指示、2026-10-11）
- 根拠: [mvp](../product/mvp.md), [architecture](architecture.md), [ui-design](ui-design.md)

## 1. 設計の原則

| 原則 | 内容 | 出典 |
|---|---|---|
| 宣言的スキーマ | テーブル定義は `supabase/schemas/*.sql` に「あるべき姿」で書き、`supabase db schema declarative sync`（`pnpm supabase:sync`）でマイグレーションを生成する。手で ALTER を書かない | [Supabase: Declarative database schemas](https://supabase.com/docs/guides/local-development/declarative-database-schemas) |
| RLS を全テーブルで有効化 | 公開スキーマ（`public`）のテーブルはすべて RLS を有効にし、操作ごと（select / insert / update / delete）・ロールごと（`anon` / `authenticated`）にポリシーを分ける | [Supabase: Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) |
| `auth.uid()` は `(select auth.uid())` で包む | 行ごとに関数が評価されるのを防ぎ、ポリシーの性能を上げる | 同上（RLS performance recommendations） |
| ポリシーが参照する列にインデックス | `user_id` 等、ポリシーと結合で使う列にインデックスを張る | 同上 |
| SECURITY DEFINER は最小限 | 必要な関数だけに使い、`set search_path = ''` を付け、テーブル名はスキーマ付きで書く | [Supabase: Database Functions](https://supabase.com/docs/guides/database/functions) |
| ユーザー情報は `public.profiles` に分ける | `auth.users` は直接公開しない。`profiles.id` は `auth.users.id` を参照し、ユーザー削除で連鎖削除 | [Supabase: User Management](https://supabase.com/docs/guides/auth/managing-user-data) |
| 最小権限の GRANT | Supabase の既定では `anon`・`authenticated` に全権限が付くため、テーブルごとに `revoke all` してから必要な操作だけ `grant` する（RLS と二重の防御） | 一般的なベストプラクティス |
| RLS をテストする | pgTAP で、ポリシーと関数の振る舞いをテストする（`supabase/tests/`） | [Supabase: Testing Overview](https://supabase.com/docs/guides/local-development/testing/overview) |
| 制約は DB に書く | 文字数・形式・自己フォロー禁止などは CHECK 制約で守る。アプリ側の入力チェック（Zod）と二重にする | 一般的なベストプラクティス |
| 主キー | 外部に出る ID（投稿など）は `uuid`（`gen_random_uuid()`）。推測されにくい URL にする | 一般的なベストプラクティス |
| 時刻 | すべて `timestamptz`。`created_at` は `now()` が既定値 | 一般的なベストプラクティス |

## 2. テーブル

### profiles（利用者の公開情報）

| 列 | 型 | 制約・既定値 | 説明 |
|---|---|---|---|
| id | uuid | PK、`auth.users(id)` を参照、連鎖削除 | ユーザー ID |
| handle | text | 一意、`^[a-z0-9_]{3,20}$` | ユーザー ID（URL に使う）。小文字に正規化して保存 |
| display_name | text | 1〜30 文字（前後の空白を除く） | 表示名 |
| avatar_path | text | null 可 | Storage の `avatars` バケット内のパス |
| invited_by | uuid | null 可、`profiles(id)` を参照、削除時 null | 招待した人 |
| created_at / updated_at | timestamptz | `now()` | `updated_at` はトリガーで更新 |

- プロフィールは、初回ログイン後のオンボーディング画面で本人が作る（作るまではアプリの主要画面に入れない）。`handle` を必須にできるよう、`auth.users` への挿入トリガーでは作らない。
- `handle` は大文字小文字を区別しない一意性にするため、小文字だけを許可する（入力時に小文字化）。

### follows（フォロー関係）

| 列 | 型 | 制約 |
|---|---|---|
| follower_id | uuid | `profiles(id)`、連鎖削除 |
| followee_id | uuid | `profiles(id)`、連鎖削除 |
| created_at | timestamptz | `now()` |

- PK は `(follower_id, followee_id)`。CHECK で `follower_id <> followee_id`（自分はフォローできない）。
- インデックス: `followee_id`（フォロワー一覧・件数用）。

### posts（投稿: 1 曲＋一言）

| 列 | 型 | 制約 | 説明 |
|---|---|---|---|
| id | uuid | PK、`gen_random_uuid()` | |
| user_id | uuid | `profiles(id)`、連鎖削除 | 投稿者 |
| apple_track_id | bigint | 必須 | iTunes の trackId |
| title | text | 必須 | 曲名（Apple 由来） |
| artist_name | text | 必須 | アーティスト名（Apple 由来） |
| album_name | text | null 可 | アルバム名（Apple 由来） |
| artwork_url | text | null 可 | ジャケット画像の Apple 側の URL（画像そのものは保存しない） |
| duration_ms | integer | null 可、0 以上 | 曲の長さ（Spotify の照合に使う） |
| comment | text | 0〜140 文字 | 一言 |
| created_at | timestamptz | `now()` | |

- インデックス: `(user_id, created_at desc)`（プロフィール・タイムライン）、`(created_at desc)`。
- 試聴音源の URL は保存しない。再生時に iTunes Lookup API で取得する（[architecture](architecture.md)）。

### likes（いいね）

- 列: `user_id`、`post_id`、`created_at`。PK は `(user_id, post_id)`。両方とも連鎖削除。
- インデックス: `post_id`。

### comments（コメント。返信なし）

- 列: `id`（uuid）、`post_id`、`user_id`、`body`（1〜200 文字）、`created_at`。両方の外部キーは連鎖削除。
- インデックス: `(post_id, created_at)`。

### post_play_counts（延べ再生回数。投稿者だけが見られる）

- 列: `post_id`（PK、`posts(id)`、連鎖削除）、`play_count`（bigint、0 以上）、`updated_at`。
- `posts` に列として持たないのは、RLS が行単位で、列単位で「投稿者だけ」に絞れないため。

### daily_activities（計測: 日ごとのアクティブ利用者）

- 列: `user_id`、`activity_date`（date、日本時間の日付）。PK は `(user_id, activity_date)`。
- 「週に 1 回以上開く人の数」を集計するため。1 人 1 日 1 行。

## 3. 関数

| 関数 | 種別 | 誰が呼べるか | 内容 |
|---|---|---|---|
| `increment_play_count(p_post_id uuid)` | SECURITY DEFINER | `anon`、`authenticated` | `post_play_counts` を 1 増やす（なければ作る）。ログインなしの閲覧者の再生も数える |
| `record_daily_activity()` | SECURITY INVOKER | `authenticated` | 今日の `daily_activities` 行を作る（既にあれば何もしない） |
| `set_updated_at()` | トリガー関数 | ― | `updated_at` を更新 |

## 4. RLS（行レベルセキュリティ）

| テーブル | select | insert | update | delete |
|---|---|---|---|---|
| profiles | 誰でも（`anon`・`authenticated`） | 本人（`id = (select auth.uid())`） | 本人 | ― （退会は MVP 外） |
| follows | 誰でも | 本人がフォローする側 | ― | 本人がフォローする側 |
| posts | 誰でも | 本人 | ― （編集なし） | 本人 |
| likes | 誰でも | 本人 | ― | 本人 |
| comments | 誰でも | 本人（ログイン必須） | ― | 本人 |
| post_play_counts | 投稿者本人のみ | ―（関数経由のみ） | ―（関数経由のみ） | ― |
| daily_activities | 本人のみ | 本人 | ― | ― |

- 「誰でも読める」のは、ログインなしの閲覧（[mvp](../product/mvp.md)）のため。
- 管理者による削除は、Supabase の管理画面（service role、RLS を通らない）から行う（[admin](admin.md)）。

## 5. Storage（アイコン画像）

- バケット `avatars`: 公開読み取り。1 ファイル 2MB まで、`image/jpeg`・`image/png`・`image/webp` のみ。
- パスは `<user_id>/<ファイル名>`。書き込み・更新・削除は、先頭のフォルダが自分の `user_id` の場合だけ許可（`storage.foldername(name)[1] = (select auth.uid())::text`）。
- 出典: [Supabase: Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control)
- アイコン画像のアップロードは、開発者の指示で MVP に追加（2026-10-11）。投稿への画像添付は引き続きなし。

## 6. 主な読み取り

| 画面 | 読み方 |
|---|---|
| タイムライン | 自分＋フォロー中の人の `posts` を `created_at` の降順で取得。続きは「最後の `created_at` より前」で取得（キーセット方式） |
| 投稿の件数 | PostgREST の集計（`likes(count)`、`comments(count)`）で一緒に取得 |
| 自分がいいね済みか | `likes` を自分の `user_id` で絞って一緒に取得 |
| 反応の確認 | 自分の投稿に付いた他人の `likes`・`comments` を新しい順に取得し、アプリ側で時系列に並べる |
