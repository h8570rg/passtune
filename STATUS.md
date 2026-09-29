# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-30

## Current Phase

Phase 11: Prototype / Development（M0 技術選定と開発の準備）

## Current Goal

M0 を終える: 残りの技術選定と、開発環境の準備。

## Recently Decided

- [DECIDED] コードの変更はブランチと PR で進め、開発者がマージする。ドキュメントは main に直接（[AGENTS.md](AGENTS.md)）
- [DECIDED] 技術スタックは開発者の別アプリ jankiroku と同じ（HeroUI、Conform＋Zod、oxlint/oxfmt、Vitest/Playwright、lefthook、Renovate 等）（[tech-stack](docs/technical/tech-stack.md)）
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

- [OPEN] 残りの技術選定: 試聴プレーヤー、PWA の Service Worker、DB のバックアップ、エラー監視
- ドメインは開発者が取得中。Supabase の本番用の枠は、開発者が既存プロジェクトを停止中（開発は手元の Supabase で進められる）
- [OPEN] Spotify の開発モードで、ログイン不要の方式がユーザー数の上限に数えられないか（アプリ登録後に確認）
- [OPEN] YouTube Music を曲ページへ直接飛ばす改善（YouTube Data API）の可否
- [OPEN] 友人の中に YouTube Music・LINE MUSIC の利用者やサブスクなしの人がいるか

## In Review

- [PR #1](https://github.com/h8570rg/passtune/pull/1) M0: Next.js と手元の Supabase の土台（jankiroku と同じ構成。手元の Supabase はポート 544xx）

## Blockers

なし

## Next Actions

1. 開発者: PR #1 を確認してマージする。Vercel にプロジェクトを作り GitHub と連携する。Spotify アプリを登録する（M3 までに）
2. AI: M1（ログインとプロフィール）に入る前に、ログイン画面と profiles の設計を示す
