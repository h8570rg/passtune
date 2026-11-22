# Development

開発の始め方と日常のコマンド。技術の選定理由は [tech-stack](tech-stack.md)、DB の設計は [database](database.md)。

## 必要なもの

- mise（Node.js 24 を `.mise.toml` で固定）。初回は `mise trust` が必要
- pnpm 12（`package.json` の `packageManager`）
- **Docker は不要。** Supabase CLI のネイティブ実行（アルファ版）で、手元の Supabase をプロセスとして動かす（下記）

## 初回

```bash
pnpm install          # lefthook のコミット前フックも入る
pnpm supabase:start   # 手元の Supabase を起動（初回はダウンロードに数分）。接続先を .env.local に書き出す
pnpm dev              # 起動時に表示される URL（通常は http://localhost:3000）
```

## 手元の Supabase（Docker なし）

- `supabase/config.toml` の `[experimental] stack = true` と `supabase start --runtime native` で、Docker なしで動かす。2026-10 時点でアルファ版（[Supabase Select 2026 Recap](https://supabase.com/blog/supabase-select-2026-recap)、[CLI config](https://supabase.com/docs/guides/local-development/cli/config)）。2026-10-11 に macOS（Apple silicon）で、DB・API・Auth・Storage・Studio・メールが動くことを確認した。
- Realtime・Edge Functions・Analytics・Pooler は使わないので起動しない（`-x` で除外）。
- **スタックは「ディレクトリ＋ git ブランチ」ごと（worktree ごと）に別になる。** ポートは固定せず、CLI が空きを自動で割り当てるので、worktree ごとのスタックを同時に起動できる。
  - 接続先は `pnpm supabase:start` が `.env.local` に書き出す（`pnpm supabase:env` で書き直せる）。手で設定する必要はない。
  - 各サービスの URL（Studio・メール確認ツールなど）は `pnpm run supabase:status` で確認する。
  - 残っているスタックは `pnpm exec supabase stack list` で確認し、`pnpm supabase:destroy`（この worktree）または `pnpm exec supabase stack destroy --yes --stack-id <id>` で消す。
- Claude Code のセッションが終わると、その worktree のスタックは削除される（`.claude/settings.json` の `SessionEnd` フック）。次の作業は `pnpm supabase:start` から始める。
- 同じ worktree で `pnpm dev` が動いていると、E2E は起動できない。

## サンプルデータ

- `pnpm supabase:reset` で `supabase/seed.sql` のサンプル（アリス @demo_alice・ボブ @demo_bob と投稿 4 件）が入る。
- 自分のメールアドレスでログインし、@demo_alice か @demo_bob をフォローすると、タイムラインにサンプルの投稿が流れる。

## 手元でのログイン

- 手元の Supabase が送るメールは、メール確認ツール（`pnpm run supabase:status` の `MAILPIT_URL`）で受け取る。
- 届くメールには 6 桁コードだけが入っている。コードをログイン画面に入力する。手元ではメールのリンクでのログインは使えない（`site_url` が `http://127.0.0.1:3000` で、アプリの `localhost` とクッキーが別になるため）。
- 仕組み: Docker なしの実行方式は、メールテンプレートのファイル指定（`content_path`）に未対応（CLI 2.120 で確認。テンプレートは Docker 版の中継サーバー経由で Auth に渡すため）。そこで手元では、Auth のメール送信フック（Send Email Hook。`config.toml` の `[auth.hook.send_email]`）から DB の関数 `local_dev.send_auth_email` を呼び、pg_net でメール確認ツールの送信 API に渡している。
  - 関数は `supabase/mailpit.sql` にある（手元専用。マイグレーションに入れないので本番には入らない）。`pnpm supabase:reset` で作られ、送り先の URL は `supabase/mailpit.sh`（`pnpm supabase:start` / `pnpm supabase:reset` から呼ばれる）が入れる。
  - メールが届かないときは、`pnpm supabase:start` を実行したかを確認する。
  - E2E テストも、メール確認ツールの API から確認コードを読んでログインする（`e2e/helpers.ts`）。
- 本番のログインコードの有効期限は 10 分（`config.toml` の `otp_expiry = 600`）。本番では、Supabase の管理画面（Authentication → Email）で、有効期限（Email OTP Expiration）を 600 秒にし、`supabase/templates/otp.html` の内容を「Magic Link」と「Confirm signup」のテンプレートに設定する（6 桁コードとリンクの両方を載せる。リンクでのログインは本番だけ）。

## 手元で Google ログインは使えない

- 手元の Supabase の API ポートは worktree ごとに変わる（並列で作業するため固定しない）。Google のリダイレクト URI は完全一致で登録する必要があり、ポートが変わると登録できないので、`config.toml` に Google の設定は入れていない。
- 手元ではメールの 6 桁コードでログインする。Google ログインは、本番の Supabase（管理画面の Authentication → Providers → Google）で確認する。
- 手元で Google ログインのコードを頻繁に触るようになったら、空きポートを探して決まった範囲（例: 54421〜54440）の URI を Google に登録する方法を検討する（`SUPABASE_API_PORT` で API ポートを指定できる）。

## 手元で Spotify を動かす（任意）

値を入れなくてもほかの機能は動く。値はプロジェクト直下の `.env` に書く（Next.js が読む。リポジトリには入らない）。`.env.local` は `pnpm supabase:start` が上書きするので、ここには書かない。

### Spotify（「Spotify で開く」を曲ページへ直接飛ばす）

1. [Spotify for Developers](https://developer.spotify.com/dashboard) に Premium のアカウントでログインし、「Create app」。
   - Redirect URI は入力必須だが使わない。`http://127.0.0.1:3000` を入れておく（Spotify は `localhost` を受け付けない）。
   - 使う API は「Web API」。
2. 「Settings」の Client ID と Client secret を `.env` の `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` に書く。
3. `pnpm dev` を再起動する。

- 値が空のときは、Spotify の検索結果へ飛ぶ（`app/go/spotify/[postId]/route.ts`）。
- 同じアプリを本番でも使える（本番は Vercel の環境変数に同じ値を入れる）。

## DB の変更の流れ（宣言的スキーマ）

1. `supabase/schemas/*.sql` を「あるべき姿」に書き換える（テーブル・RLS・関数・権限）。
2. `pnpm supabase:sync <名前>` でマイグレーションを生成し、手元の DB に当てる。
   - Supabase CLI v3 でも、宣言的スキーマからの生成は `supabase db schema declarative sync`（`db diff` は使わない）。
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
| `pnpm supabase:start` / `stop` | 手元の Supabase の起動・停止（`start` は `.env.local` も書き出す） |
| `pnpm supabase:destroy` | この worktree のスタックを削除する（データも消える） |
| `pnpm supabase:env` | `.env.local` を書き直す |
| `pnpm supabase:reset` | 手元の DB を作り直す（マイグレーションを全部当て直し、`seed.sql` を投入） |
| `pnpm supabase:sync <名前>` | 宣言的スキーマからマイグレーションを生成して当てる |
| `pnpm supabase:type` | DB の型を `lib/database.types.ts` に生成する |
| `pnpm supabase:test` | RLS のテスト（pgTAP） |
| `pnpm supabase:push` | リンクした本番へマイグレーションを適用する |

コミット時には lefthook が `check`・`type`・`test`・`spell` を実行する。

## 進め方

- コードの変更はブランチを切って PR を作る。2026-10-11 以降、ローカル完成までは AI が承認なしでマージしてよい（開発者の指示）。
- タスクは [roadmap](../product/roadmap.md) のチェックボックスで管理する。
