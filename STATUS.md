# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 1: Product Vision / Problem Definition

## Current Goal

1. プロジェクト自体の目的と制約（目的の優先順位・時間・予算・期限）を明文化する
2. 「なぜ音楽共有SNSか」の原体験から、Vision と解きたい問題の仮説を書く

## Recently Decided

- [DECIDED] Phase 0 完了。プロジェクト管理の方法と追加ルールを確定（[001](docs/decisions/001-project-management.md)）
- [DECIDED] AI はドキュメントの変更を自由にコミットしてよい（[001](docs/decisions/001-project-management.md)）

## Open Questions

- [OPEN] このプロジェクトの目的の優先順位（学習 / 収益 / 自分が使いたい / ポートフォリオ 等）
- [OPEN] 使える時間（週あたり）、ランニングコストの上限（月あたり）、期限
- [OPEN] 開発者自身の原体験: 音楽共有で何に困っている / 何が欲しいのか
- [OPEN] Git のリモート（GitHub private 等）を置くか（急がない）

## Blockers

なし

## Next Actions

1. 開発者: Phase 1 の問いに回答する（対話）
2. AI: 回答をもとに `docs/product/vision.md`（目的・制約・Vision・問題仮説）を起案し、PROJECT.md の該当欄を更新
3. AI: 問題仮説のうち、早めに確認すべき外部リスク（音楽 API 規約など）を洗い出す（調査のみ、決定しない）
