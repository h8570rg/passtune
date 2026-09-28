# Tech Stack

- Phase: 11（M0 技術選定）
- Last updated: 2026-09-28
- 前提（決定済み）: Web のみ（PWA）、Next.js、Vercel Hobby、Supabase、メールの 6 桁コード＋Google ログイン、Resend（[005](../decisions/005-platform.md)〜[008](../decisions/008-service-name.md)）
- 進め方: AI が候補を比較し、開発者が選ぶ。3 回に分けて決める。
  - 第 1 回: 土台（パッケージマネージャー、スタイリング、UI コンポーネント、アイコン）
  - 第 2 回: データまわり（データ取得・状態管理、フォーム・入力チェック、DB アクセス・型、マイグレーション）
  - 第 3 回: その他（試聴プレーヤー、PWA、フォーマッター・リンター、テスト、CI、エラー監視）

## 一覧

| 項目 | 状態 | 選択 |
|---|---|---|
| Next.js のバージョン | [PROPOSED] | 16 系の最新安定版（2026-09 時点で 16.3 系）。App Router |
| パッケージマネージャー | [PROPOSED] | pnpm |
| スタイリング | [PROPOSED] | Tailwind CSS v4 |
| UI コンポーネント | [PROPOSED] | shadcn/ui（Base UI 版） |
| アイコン | [PROPOSED] | Lucide（shadcn/ui の標準）。音楽サービスのロゴは各社の公式素材 |
| （第 2 回・第 3 回の項目） | [OPEN] | ― |

## 第 1 回: 土台

### Next.js のバージョン

- Next.js 16.3 は 2026-06-26 に公開。2026-09-22 に 16.3.6（上流の依存関係の重大なセキュリティ問題の修正）が出ており、2026-09-30 に 16.3.7 の予定。[Next.js Blog](https://nextjs.org/blog), [Security Update](https://nextjs.org/blog/upcoming-nextjs-security-release-september-22-2026)（確認日 2026-09-28）
- [PROPOSED] 開始時点の 16 系の最新安定版を使い、セキュリティ更新にはすぐ追従する。

### パッケージマネージャー

| Option | メリット | デメリット |
|---|---|---|
| npm | 追加の導入が不要。互換性が最も高い | 遅め。依存関係の管理が緩い |
| **pnpm** | 速い。依存関係の管理が厳密。Vercel が設定なしで認識する | 導入が 1 つ増える |
| Bun | 最も速い | Vercel での Bun ビルドは新しく、一部で不安定との報告 |

- 出典: [Vercel Docs: Package Managers](https://vercel.com/docs/package-managers), [Vercel Changelog: Bun](https://vercel.com/changelog/bun-install-is-now-supported-with-zero-configuration)
- [PROPOSED] pnpm。開発者が普段使っているものがあれば、それを優先する。

### スタイリング

| Option | メリット | デメリット |
|---|---|---|
| **Tailwind CSS v4** | CSS だけで設定でき、v3 より大幅に速い。shadcn/ui の前提。AI の支援を受けやすい | クラス名が長くなりやすい |
| CSS Modules | 素の CSS に近く、Next.js 標準 | コンポーネントライブラリとの組み合わせを自分で整える必要 |
| CSS-in-JS（ランタイム型） | 柔軟 | Server Components と相性が悪い |

- 出典: [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4), [shadcn/ui: Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
- [PROPOSED] Tailwind CSS v4。

### UI コンポーネント

| Option | 仕組み | メリット | デメリット |
|---|---|---|---|
| **shadcn/ui** | 部品のソースコードを自分のリポジトリにコピーして使う | 見た目を自由に変えられる（音楽アプリらしい独自の見た目にしやすい）。依存が少ない。Next.js ＋ Tailwind の定番 | 部品のコードを自分で持つので、更新は自分で取り込む |
| Mantine | npm の 1 パッケージで 100 以上の部品とフック | すぐ揃う。フォーム等のフックも付属 | 独自の見た目に寄せるのに手間。バンドルが大きめ |
| Chakra UI v3 | Panda CSS と Ark UI が土台 | 型安全なスタイル | Tailwind と別系統になる |
| 使わない | すべて自作 | 自由 | ダイアログやメニューなど、アクセシビリティ込みで作るのは重い |

- shadcn/ui は 2026-07 から Base UI を標準の土台にした（Radix も引き続き対応）。[shadcn/ui Changelog](https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default)
- 比較の出典: [Makers Den](https://makersden.io/blog/react-ui-libs-2025-comparing-shadcn-radix-mantine-mui-chakra), [DesignRevision](https://designrevision.com/blog/best-react-component-libraries)（二次情報）
- [PROPOSED] shadcn/ui（Base UI 版）。

### アイコン

- [PROPOSED] Lucide（shadcn/ui の標準）。
- Apple Music・Spotify・YouTube Music・LINE MUSIC のロゴは、アイコン集ではなく各社の公式素材を、各社のガイドラインどおりに使う（[music-terms](../research/2026-09-28-music-terms.md)）。
