# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 1: Product Vision / Problem Definition

## Current Goal

1. プロジェクト自体の目的と制約（目的の優先順位・時間・予算・期限）を明文化する
2. 「なぜ音楽共有SNSか」の原体験から、Vision と解きたい問題の仮説を書く

## Recently Decided

- [DECIDED] プロジェクトの目的: 友人間の狭いコミュニティで自分が使いたいものを作る。マネタイズ・スケールは今は目標にしない（[vision](docs/product/vision.md)）
- [DECIDED] Phase 0 完了。プロジェクト管理の方法と追加ルールを確定（[001](docs/decisions/001-project-management.md)）
- [DECIDED] AI はドキュメントの変更を自由にコミットしてよい（[001](docs/decisions/001-project-management.md)）

## Open Questions

- [PROPOSED] Vision 文案、「将来の余地」の解釈（可逆性を保つ）、Non-goals（[vision](docs/product/vision.md)）
- [OPEN] 今の共有方法とその不満（問題仮説 H1〜H5 の根拠になる原体験）
- [OPEN] 対象の友人の人数と、使っているサブスクの分布
- [OPEN] 使える時間（週あたり）、ランニングコストの具体的な上限、期限
- [OPEN] Git のリモート（GitHub private 等）を置くか（急がない）

## Blockers

なし

## Next Actions

1. 開発者: vision.md の PROPOSED を確認し、Open Questions に回答する
2. AI: 回答を反映し、Phase 1 を締める（Vision・問題仮説・成功基準）
3. AI: 外部リスク（音楽 API のプレビュー・ユーザー数制限・規約）を一次情報で調査し docs/research に記録（決定しない）
