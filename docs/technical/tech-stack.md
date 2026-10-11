# Tech Stack

- Phase: 11（M0 技術選定）
- Last updated: 2026-09-29
- 前提（決定済み）: Web のみ（PWA）、Next.js、Vercel Hobby、Supabase、メールの 6 桁コード＋Google ログイン、Resend（[005](../decisions/005-platform.md)〜[008](../decisions/008-service-name.md)）
- **方針 [DECIDED]:** 開発者の別アプリ [jankiroku](https://github.com/h8570rg/jankiroku)（公開リポジトリ）と基本的に同じ技術スタックにする。UI ライブラリも同じ HeroUI（開発者の決定、2026-09-29）。
  - 理由: 開発者が使い慣れており、設定や書き方を流用できる。保守と意思決定のコストが最小（Project principles）。
  - 当初の比較（shadcn/ui 等）は、この方針により不要になった。
- 下記のバージョンは、2026-09-29 時点の jankiroku の package.json の値。着手時に最新の安定版へ揃える。

## 一覧

| 分類 | 採用 | jankiroku との差 |
|---|---|---|
| 実行環境 | Node.js 24（mise で管理） | 同じ |
| パッケージマネージャー | pnpm（`save-exact=true`） | 同じ |
| フレームワーク | Next.js 16.3 系（App Router）、React 19.3、TypeScript 7 | 同じ |
| スタイリング | Tailwind CSS v4 | 同じ |
| UI コンポーネント | HeroUI v3（`@heroui/react`、`@heroui/styles`）。AI 向けに HeroUI の MCP サーバーを設定 | 同じ |
| アイコン | Lucide（`lucide-react`）、Iconify（`@iconify/react`） | 同じ。ただし音楽サービスのロゴは各社の公式素材を使う（[music-terms](../research/2026-09-28-music-terms.md)） |
| アニメーション | Motion | 同じ |
| テーマ（ダークモード） | next-themes | 同じ |
| フォームと入力チェック | Conform ＋ Zod | 同じ |
| データの取得・更新 | Server Components から `lib/data/` の関数（`server-only`）で取得。更新は Server Actions | 同じ |
| DB アクセス・型 | `@supabase/supabase-js` ＋ `@supabase/ssr`。型は `supabase gen types` で自動生成 | 同じ |
| マイグレーション | Supabase CLI。宣言的スキーマ（`supabase/schemas/`）から `db schema declarative sync` で生成。RLS は pgTAP でテスト（[database](database.md)） | **異なる**: Supabase 公式のベストプラクティスに従う（開発者の指示、2026-10-11） |
| 日付・その他 | dayjs、use-debounce（曲の検索の入力に使える） | recharts は不要 |
| アクセス解析 | Vercel Analytics・Speed Insights | 同じ。外部送信規律の公表対象としてプライバシーポリシーに記載する |
| リンター・フォーマッター | oxlint（＋ oxlint-tailwindcss）、oxfmt、cspell | 同じ |
| Git フック | lefthook（コミット前にチェック・型・テスト・スペル） | 同じ |
| テスト | Vitest（単体）、Playwright（E2E、スマホ端末のエミュレーション） | 同じ |
| 手元の Supabase | Docker なしのネイティブ実行（Supabase CLI 2.120、アルファ版）（[development](development.md)） | **異なる**: jankiroku は Docker |
| CI / CD | GitHub Actions: PR と main で lint・型・単体テスト・スペル・ビルド（`ci.yml`）。main の migrations 変更で本番 DB に適用。Supabase の停止防止の定期アクセス。週 1 回のバックアップ。本番用の値が設定されるまでは本番向けの処理は動かない | **本番の Supabase のみ**（開発用のクラウドプロジェクトは持たない。開発は手元の Supabase） |
| 依存関係の更新 | Renovate（マイナー更新は自動マージ） | 同じ |

## jankiroku から分かったこと

- jankiroku は、Supabase の無料プランの「1 週間無操作で停止」を、GitHub Actions からの毎日の定期アクセスで防いでいる（`keep-supabase-alive.yml`）。
  - Passtune でも同じ方法をとる。[007](../decisions/007-baas-auth.md) の「停止対策」はこれで具体化される。

## 残りの技術選定（2026-10-11、開発者の指示により AI が判断）

- [DECIDED by AI] 試聴プレーヤー: ライブラリを使わず標準の Audio 要素で、同時に 1 曲だけ再生する共通プレーヤー（`components/player-provider.tsx`）。30 秒の試聴に必要な機能は少ないため
- [DECIDED by AI] PWA: ライブラリを使わず、`app/manifest.ts`、`public/sw.js`（fetch ハンドラーでオフライン時の案内のみ。データはキャッシュしない）、アイコンは `next/og` の ImageResponse で生成（画像ファイルを持たない）
- [DECIDED by AI] バックアップ: GitHub Actions で週 1 回 `supabase db dump`、Artifacts に 90 日保存（[admin](admin.md)）
- [DECIDED by AI] エラー監視: MVP では専用サービスを入れず、Vercel のランタイムログで確認する。利用者が増えたら Sentry（無料枠）などを検討する
