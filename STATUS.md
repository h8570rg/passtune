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

- [PROPOSED] Supabase 無料プラン、メールの 6 桁コード＋Google ログイン、Resend、独自ドメイン（[006](docs/decisions/006-backend-auth-hosting.md)）
- [OPEN] フロントエンドのフレームワーク（開発者の得意なもの）とホスティング。将来の収益化を見込むなら、最初から商用可のホスティングにするか（[monetization](docs/research/2026-09-28-monetization.md)）
- [OPEN] 友人の中に YouTube Music やサブスクなしの人がいるか
- [OPEN] Git のリモート（GitHub private 等）を置くか（急がない）

## Blockers

なし

## Next Actions

1. 開発者: 006 を確認し、フロントエンドのフレームワークの希望を伝える
2. AI: 006 を確定し、アーキテクチャ概要（docs/technical/）を作る
