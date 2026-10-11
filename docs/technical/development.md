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
