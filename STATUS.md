# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 9: Technical Strategy / Architecture

## Current Goal

MVP を作るための技術方針を決める。提供形態（Web）は決定済み。次にバックエンド（BaaS）・ログイン方式・ホスティング・フロントエンドの技術。

## Recently Decided

- [DECIDED] 提供形態は Web のみ（PWA）。ネイティブアプリ・ストア公開はしない（[005](docs/decisions/005-platform.md)）
- [DECIDED] MVP は完成に近い形で作り開発者自身で評価。誰でも登録可、通報・ブロックなし（管理者の削除手段と問い合わせ先で代替）、通知なし（[mvp](docs/product/mvp.md)）
- Phase 1〜7 の決定は PROJECT.md の Key Decisions と docs/product/ を参照

## Key Findings

- Spotify のユーザー連携は 5 人まで、API ではプレビュー不可。Apple の iTunes Search API はキーなしでプレビュー取得可（[research](docs/research/2026-09-28-music-api-feasibility.md)）
- 曲の照合: Apple Music リンクからは試聴まで確実。曲名検索は日本語・ローマ字・英語で本家が先頭（カバー等も混ざる）。Spotify リンクはキーなしだと曲名のみ（[research](docs/research/2026-09-28-song-matching.md)）

## Open Questions

- [DECIDED] フロントエンドは Next.js（開発者の希望）
- [DECIDED] ホスティングは Vercel Hobby で始め、収益化前に移行または Pro（[006](docs/decisions/006-hosting.md)）
- [DECIDED] BaaS は Supabase 無料プラン。ログインはメールの 6 桁コード＋Google。独自ドメインを取得（[007](docs/decisions/007-baas-auth.md)）
- [DECIDED] メール送信は Resend の無料枠
- [PROPOSED] 全体構成・データ設計・アクセスのルール・環境（[architecture](docs/technical/architecture.md)）
- [DECIDED] 投稿は曲名検索のみ（Spotify / Apple Music のリンクからの投稿は後で検討）
- [DECIDED] GitHub の非公開リポジトリは AI が作成する。作成前に必ず開発者に確認する
- [DECIDED] DB には曲 ID・曲名・アーティスト名を保存。試聴音源と画像は保存しない
- [DECIDED] Supabase はクラウドに本番用 1 つ（既存を 1 つ一時停止）、開発は手元の PC で動かす
- [OPEN] Apple の試聴の横に Spotify 等で開くボタンを置くことが、iTunes の利用条件と衝突しないか（[risks](docs/product/risks.md) R3a）
- [OPEN] 友人の中に YouTube Music やサブスクなしの人がいるか

## Blockers

なし

## Next Actions

1. 開発者: R3a（iTunes の利用条件）への対応方針を決める
2. AI: Phase 9 を締め、Phase 10（ロードマップ・タスク分解）へ
