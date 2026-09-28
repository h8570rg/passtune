# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 11: Prototype / Development（M0 技術選定と開発の準備）

## Current Goal

M0 を終える: 技術選定（3 回に分けて決める）と、開発環境の準備。

## Recently Decided

- [DECIDED] Phase 10 完了。ロードマップ M0〜M7（[roadmap](docs/product/roadmap.md)）。GitHub リポジトリ h8570rg/passtune を作成
- [DECIDED] Phase 9 完了。Web のみ（PWA）・Next.js・Vercel Hobby・Supabase・メールの 6 桁コード＋Google・Resend（[005](docs/decisions/005-platform.md)〜[007](docs/decisions/007-baas-auth.md)、[architecture](docs/technical/architecture.md)）
- [DECIDED] 各サービスのロゴボタン: Apple Music・Spotify は曲ページ（Spotify は押された時点でサーバーが検索して転送）、YouTube Music・LINE MUSIC は検索結果
- [DECIDED] MVP は完成に近い形で、開発者が PC のみで評価（[mvp](docs/product/mvp.md)）
- [DECIDED] サービス名は Passtune、コードネームは passtune（[008](docs/decisions/008-service-name.md)）
- Phase 1〜8 の決定は PROJECT.md の Key Decisions と docs/product/ を参照

## Key Findings

- Spotify のユーザー連携は 5 人まで、API ではプレビュー不可。Apple の iTunes Search API はキーなしでプレビュー取得可（[research](docs/research/2026-09-28-music-api-feasibility.md)）
- 曲の照合: Apple Music リンクからは試聴まで確実。曲名検索は日本語・ローマ字・英語で本家が先頭（カバー等も混ざる）。Spotify リンクはキーなしだと曲名のみ（[research](docs/research/2026-09-28-song-matching.md)）

## Open Questions

- [PROPOSED] 技術選定 第 1 回: pnpm、Tailwind CSS v4、shadcn/ui（Base UI 版）、Lucide（[tech-stack](docs/technical/tech-stack.md)）
- ドメインは開発者が取得する（進行中）
- [OPEN] Spotify の開発モードで、ログイン不要の方式がユーザー数の上限に数えられないか（アプリ登録後に確認）
- [OPEN] YouTube Music を曲ページへ直接飛ばす改善（YouTube Data API）の可否
- [OPEN] 友人の中に YouTube Music・LINE MUSIC の利用者やサブスクなしの人がいるか

## Blockers

なし

## Next Actions

1. 開発者: 技術選定 第 1 回を確認する。ドメインを取得する
2. AI: 技術選定 第 2 回（データまわり）を比較する
