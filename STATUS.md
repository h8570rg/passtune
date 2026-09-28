# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 1: Product Vision / Problem Definition

## Current Goal

1. プロジェクト自体の目的と制約（目的の優先順位・時間・予算・期限）を明文化する
2. 「なぜ音楽共有SNSか」の原体験から、Vision と解きたい問題の仮説を書く

## Recently Decided

- [DECIDED] 友人約 20 人から始め、不特定多数にも公開する。ユーザーは増やしたい（当初の「スケールは目標外」から変更）
- [DECIDED] ランニングコストの目安は年 10,000 円以内。質が落ちるなら増額してよい
- [DECIDED] Vision 文案、「将来の余地」＝取り返しのつかない選択を避ける（[vision](docs/product/vision.md)）
- [DECIDED] プロジェクトの目的: 友人間で自分が使いたいものを作る。マネタイズは今は目標にしない

## Open Questions

- [OPEN] 公開の形: 知り合い同士が中心か、知らない人の投稿も流れる発見型か。友人 20 人と友人以外への広がりの優先順位
- [OPEN] 開発者本人が使っている音楽サービス
- [OPEN] X への投稿や口頭での共有で、具体的に何が物足りないか（H6〜H8 の確認）
- [OPEN] 使える時間（週あたり）、期限
- [OPEN] Git のリモート（GitHub private 等）を置くか（急がない）

## Blockers

なし

## Next Actions

1. 開発者: vision.md の PROPOSED を確認し、Open Questions に回答する
2. AI: 回答を反映し、Phase 1 を締める（Vision・問題仮説・成功基準）
3. AI: 外部リスク（音楽 API のプレビュー・ユーザー数制限・規約）を一次情報で調査し docs/research に記録（決定しない）
