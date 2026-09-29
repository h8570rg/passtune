# Development

開発の始め方と日常のコマンド。技術の選定理由は [tech-stack](tech-stack.md)。

## 必要なもの

- mise（Node.js 24 を `.mise.toml` で固定）
- pnpm 12（`package.json` の `packageManager`）
- Docker（手元の Supabase を動かすため）

## 初回

```bash
pnpm install          # lefthook のコミット前フックも入る
cp .env.example .env.local
pnpm supabase:start   # 手元の Supabase を起動（初回はイメージの取得に数分）
pnpm dev              # http://localhost:3000
```

## 手元の Supabase

jankiroku と同時に起動できるよう、ポートを 544xx 番台にずらしている（`supabase/config.toml`）。

| 用途 | URL |
|---|---|
| API | http://127.0.0.1:54421 |
| 管理画面（Studio） | http://127.0.0.1:54423 |
| メール確認（ログインの 6 桁コードを受け取る） | http://127.0.0.1:54424 |
| DB | postgresql://postgres:postgres@127.0.0.1:54422/postgres |

## よく使うコマンド

| コマンド | 内容 |
|---|---|
| `pnpm check` | oxlint（自動修正）と oxfmt |
| `pnpm type` | ルートの型生成と型チェック |
| `pnpm test` | Vitest |
| `pnpm spell` | cspell |
| `pnpm supabase:migration <名前>` | マイグレーションを作る |
| `pnpm supabase:reset` | 手元の DB を作り直す（マイグレーションを全部当て直す） |
| `pnpm supabase:type` | DB の型を `lib/database.types.ts` に生成する |

コミット時には lefthook が `check`・`type`・`test`・`spell` を実行する。

## 進め方

- コードの変更はブランチを切って PR を作り、開発者がマージする（[AGENTS.md](../../AGENTS.md)）。
- タスクは [roadmap](../product/roadmap.md) のチェックボックスで管理する。
