# Development

開発の始め方と日常のコマンド。技術の選定理由は [tech-stack](tech-stack.md)、DB の設計は [database](database.md)。

## 必要なもの

- mise（Node.js 24 を `.mise.toml` で固定）。初回は `mise trust` が必要
- pnpm 12（`package.json` の `packageManager`）
- **Docker は不要。** Supabase CLI のネイティブ実行（アルファ版）で、手元の Supabase をプロセスとして動かす（下記）

## 初回

```bash
pnpm install          # lefthook のコミット前フックも入る
cp .env.example .env.local
pnpm supabase:start   # 手元の Supabase を起動（初回はダウンロードに数分）
pnpm supabase:reset   # マイグレーションを当てる
pnpm dev              # http://localhost:3000
```

## 手元の Supabase（Docker なし）

- `supabase/config.toml` の `[experimental] stack = true` と `supabase start --runtime native` で、Docker なしで動かす。2026-10 時点でアルファ版（[Supabase Select 2026 Recap](https://supabase.com/blog/supabase-select-2026-recap)、[CLI config](https://supabase.com/docs/guides/local-development/cli/config)）。2026-10-11 に macOS（Apple silicon）で、DB・API・Auth・Storage・Studio・メールが動くことを確認した。
- Realtime・Edge Functions・Analytics・Pooler は使わないので起動しない（`-x` で除外）。
- **スタックは「ディレクトリ＋ git ブランチ」ごとに別になる。** ブランチを切り替えると、DB は空の別スタックになる。
  - 切り替える前に `pnpm supabase:stop` で止める（ポートを固定しているため、2 つ同時には起動できない）。
  - 切り替えた先で `pnpm supabase:start` と `pnpm supabase:reset` を実行する。
- jankiroku（Docker、543xx 番台）と同時に起動できるよう、ポートは 544xx 番台に固定している。

| 用途 | URL |
|---|---|
| API | http://127.0.0.1:54421 |
| 管理画面（Studio） | http://127.0.0.1:54423 |
| メール確認（ログインの 6 桁コードを受け取る） | http://127.0.0.1:54424 |
| DB | postgresql://postgres:postgres@127.0.0.1:54422/postgres |

## サンプルデータ

- `pnpm supabase:reset` で `supabase/seed.sql` のサンプル（アリス @demo_alice・ボブ @demo_bob と投稿 4 件）が入る。
- 自分のメールアドレスでログインし、@demo_alice か @demo_bob をフォローすると、タイムラインにサンプルの投稿が流れる。
- `pnpm supabase:stop --all` で、全ブランチの手元の Supabase を止められる（ポートがぶつかったとき）。

## 手元でのログイン

- 手元の Supabase が送るメールは、メール確認ツール（http://127.0.0.1:54424）で受け取る。
- 届くメールには 6 桁コードとリンクの両方が入っている。コードをログイン画面に入力するか、ログインした同じブラウザでリンクを開く（`/auth/callback` で処理）。
- 仕組み: Docker なしの実行方式は、メールテンプレートのファイル指定（`content_path`）に未対応（CLI 2.120 で確認。テンプレートは Docker 版の中継サーバー経由で Auth に渡すため）。そこで手元では、Auth のメール送信フック（Send Email Hook。`config.toml` の `[auth.hook.send_email]`）から DB の関数 `local_dev.send_auth_email` を呼び、pg_net でメール確認ツールの送信 API に渡している。
  - 関数は `supabase/seed.sql` にある（手元専用。マイグレーションに入れないので本番には入らない）。`pnpm supabase:reset` で作られる。
  - メールが届かないときは、関数があるか（`pnpm supabase:reset` を実行したか）を確認する。
  - E2E テストも、メール確認ツールの API から確認コードを読んでログインする（`e2e/helpers.ts`）。
- 本番では、Supabase の管理画面で `supabase/templates/otp.html` の内容を「Magic Link」と「Confirm signup」のテンプレートに設定する（6 桁コードとリンクの両方を載せる）。

## 手元で Google ログインと Spotify を動かす（任意）

どちらも、値を入れなくてもほかの機能は動く。値はプロジェクト直下の `.env.local` に書く（Next.js と Supabase CLI の両方が読む。リポジトリには入らない）。

### Google ログイン

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作る。
2. 「Google Auth Platform」（旧 OAuth 同意画面）を設定する: アプリ名 Passtune、対象は「外部」。公開ステータスが「テスト」の間は、「テストユーザー」に追加した Google アカウントだけがログインできる（自分のアカウントを追加する）。
3. 「クライアント」で OAuth クライアント ID を作る: 種類は「ウェブ アプリケーション」、承認済みのリダイレクト URI に `http://127.0.0.1:54421/auth/v1/callback`（手元の Supabase。Supabase の公式手順と同じ形）。本番用の `https://<Supabase の Project URL>/auth/v1/callback` も同じクライアントに追加してよい。
4. クライアント ID とシークレットを `.env.local` の `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID` / `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET` に書く。
5. `pnpm supabase:stop` → `pnpm supabase:start`（Auth の設定は起動時に読む）。

- 設定は `supabase/config.toml` の `[auth.external.google]`。値が空のときは、Google のボタンを押すと Google のエラー画面になる（メールのログインには影響しない）。

### Spotify（「Spotify で開く」を曲ページへ直接飛ばす）

1. [Spotify for Developers](https://developer.spotify.com/dashboard) に Premium のアカウントでログインし、「Create app」。
   - Redirect URI は入力必須だが使わない。`http://127.0.0.1:3000` を入れておく（Spotify は `localhost` を受け付けない）。
   - 使う API は「Web API」。
2. 「Settings」の Client ID と Client secret を `.env.local` の `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` に書く。
3. `pnpm dev` を再起動する。

- 値が空のときは、Spotify の検索結果へ飛ぶ（`app/go/spotify/[postId]/route.ts`）。
- 同じアプリを本番でも使える（本番は Vercel の環境変数に同じ値を入れる）。

## DB の変更の流れ（宣言的スキーマ）

1. `supabase/schemas/*.sql` を「あるべき姿」に書き換える（テーブル・RLS・関数・権限）。
2. `pnpm supabase:sync <名前>` でマイグレーションを生成し、手元の DB に当てる。
   - Supabase CLI 2.120 では、宣言的スキーマからの生成は `supabase db schema declarative sync`（`db diff` は使わない）。
3. `pnpm supabase:type` で `lib/database.types.ts` を更新する。
4. `pnpm supabase:test` で RLS のテスト（`supabase/tests/*.sql`、pgTAP）を実行する。

- Storage のバケットはデータなので、手書きのマイグレーション（`supabase/migrations/*_avatars_storage.sql`）で作る。`storage.objects` のポリシーは、マイグレーションと `supabase/schemas/08_storage.sql` の両方に書く（スキーマ側にないと、同期がポリシーを削除するマイグレーションを作ってしまうため）。
- `supabase migration new` は、標準入力からの SQL を待つ。非対話の環境では `< /dev/null` を付けるか、ファイルを直接作る。

## よく使うコマンド

| コマンド | 内容 |
|---|---|
| `pnpm check` | oxlint（自動修正）と oxfmt |
| `pnpm type` | ルートの型生成と型チェック |
| `pnpm test` | Vitest |
| `pnpm spell` | cspell |
| `pnpm test:e2e` | Playwright（手元の Supabase と開発サーバーを使う） |
| `pnpm supabase:start` / `stop` | 手元の Supabase の起動・停止 |
| `pnpm supabase:reset` | 手元の DB を作り直す（マイグレーションを全部当て直し、`seed.sql` を投入） |
| `pnpm supabase:sync <名前>` | 宣言的スキーマからマイグレーションを生成して当てる |
| `pnpm supabase:type` | DB の型を `lib/database.types.ts` に生成する |
| `pnpm supabase:test` | RLS のテスト（pgTAP） |

コミット時には lefthook が `check`・`type`・`test`・`spell` を実行する。

## 進め方

- コードの変更はブランチを切って PR を作る。2026-10-11 以降、ローカル完成までは AI が承認なしでマージしてよい（開発者の指示）。
- タスクは [roadmap](../product/roadmap.md) のチェックボックスで管理する。
