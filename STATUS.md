# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 10: Roadmap / Task Breakdown

## Current Goal

MVP を作るためのマイルストーンとタスクを決め、開発（Phase 11）を始められる状態にする。

## Recently Decided

- [DECIDED] Phase 9 完了。Web のみ（PWA）・Next.js・Vercel Hobby・Supabase・メールの 6 桁コード＋Google・Resend（[005](docs/decisions/005-platform.md)〜[007](docs/decisions/007-baas-auth.md)、[architecture](docs/technical/architecture.md)）
- [DECIDED] 各サービスのロゴボタン: Apple Music・Spotify は曲ページ（Spotify は押された時点でサーバーが検索して転送）、YouTube Music・LINE MUSIC は検索結果
- [DECIDED] MVP は完成に近い形で、開発者が PC のみで評価（[mvp](docs/product/mvp.md)）
- Phase 1〜8 の決定は PROJECT.md の Key Decisions と docs/product/ を参照

## Key Findings

- Spotify のユーザー連携は 5 人まで、API ではプレビュー不可。Apple の iTunes Search API はキーなしでプレビュー取得可（[research](docs/research/2026-09-28-music-api-feasibility.md)）
- 曲の照合: Apple Music リンクからは試聴まで確実。曲名検索は日本語・ローマ字・英語で本家が先頭（カバー等も混ざる）。Spotify リンクはキーなしだと曲名のみ（[research](docs/research/2026-09-28-song-matching.md)）

## Open Questions

- [PROPOSED] マイルストーンとタスク（[roadmap](docs/product/roadmap.md)）
- [OPEN] Spotify の開発モードで、ログイン不要の方式がユーザー数の上限に数えられないか（アプリ登録後に確認）
- [OPEN] YouTube Music を曲ページへ直接飛ばす改善（YouTube Data API）の可否
- [OPEN] 友人の中に YouTube Music・LINE MUSIC の利用者やサブスクなしの人がいるか

## Blockers

なし

## Next Actions

1. 開発者: roadmap を確認する
2. AI: GitHub リポジトリの作成（作成前に確認）から M0 を始める（Phase 11）
