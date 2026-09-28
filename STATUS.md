# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 3: Market / Competitor Research

## Current Goal

似たサービスと、今の代わりの手段を調べ、このプロダクトが入り込む余地を整理する。

## Recently Decided

- [DECIDED] Phase 2 完了
- [DECIDED] ユーザー調査は行わず、開発者本人へのヒアリングで代える（[003](docs/decisions/003-user-research-approach.md)）
- [DECIDED] 成功基準: 友人 10 人が公開 3 か月後も週 1 回以上使っている
- [DECIDED] Phase 1 完了（[vision](docs/product/vision.md)）
- [DECIDED] 公開の形は「知り合い中心・誰でも参加可」。まず友人約 20 人を優先（[002](docs/decisions/002-audience-and-openness.md)）
- [DECIDED] 開発者は Spotify 利用。使える時間は週約 10 時間、期限なし
- [DECIDED] 予算の目安は年 1 万円（質が落ちるなら増額可）

## Key Findings

- Spotify のユーザー連携は 5 人まで、API ではプレビュー不可。Apple の iTunes Search API はキーなしでプレビュー取得可。Apple Developer Program は約 1.3 万円/年（[research](docs/research/2026-09-28-music-api-feasibility.md)）

- 開発者ヒアリング第 1 回: 試聴できるかどうかが体験の核。反応（いいね・コメント・聴いた表示）が欲しい。共有は 1 曲＋一言。再生回数は投稿者だけが見る。投稿は不定期（[research](docs/research/2026-09-28-developer-interview-1.md)）

## Open Questions

- [HYPOTHESIS] Spotify の曲の試聴は、Apple 側で同じ曲を探して使う（開発者の意向。Phase 7 / 9 で決定）
- [OPEN] 投稿が不定期なため、タイムラインが空きやすいリスク
- [OPEN] 友人の中に YouTube Music やサブスクなしの人がいるか
- [OPEN] Git のリモート（GitHub private 等）を置くか（急がない）

## Blockers

なし

## Next Actions

1. AI: 競合・代替手段を調べ、docs/research に記録する
2. 開発者: 調査結果を確認し、差別化の方向を相談する
