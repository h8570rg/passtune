# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 2: User Research（開発者本人へのヒアリング中）

## Current Goal

開発者本人へのヒアリングで、音楽を共有する場面・欲しい体験・大事にしたいことを具体化する。

## Recently Decided

- [DECIDED] ユーザー調査は行わず、開発者本人へのヒアリングで代える（[003](docs/decisions/003-user-research-approach.md)）
- [DECIDED] 成功基準: 友人 10 人が公開 3 か月後も週 1 回以上使っている
- [DECIDED] Phase 1 完了（[vision](docs/product/vision.md)）
- [DECIDED] 公開の形は「知り合い中心・誰でも参加可」。まず友人約 20 人を優先（[002](docs/decisions/002-audience-and-openness.md)）
- [DECIDED] 開発者は Spotify 利用。使える時間は週約 10 時間、期限なし
- [DECIDED] 予算の目安は年 1 万円（質が落ちるなら増額可）

## Key Findings

- Spotify のユーザー連携は 5 人まで、API ではプレビュー不可。Apple の iTunes Search API はキーなしでプレビュー取得可。Apple Developer Program は約 1.3 万円/年（[research](docs/research/2026-09-28-music-api-feasibility.md)）

- 開発者ヒアリング第 1 回: 試聴できるかどうかが体験の核。反応（いいね・コメント・聴いた表示）が欲しい。共有は 1 曲＋一言（[research](docs/research/2026-09-28-developer-interview-1.md)）

## Open Questions

- [OPEN] ヒアリング残り: 「聴いた」表示のプライバシー感覚、投稿頻度、X での反応の実際
- [OPEN] 友人の中に YouTube Music やサブスクなしの人がいるか
- [OPEN] Git のリモート（GitHub private 等）を置くか（急がない）

## Blockers

なし

## Next Actions

1. 開発者: ヒアリングの残りの質問に回答する
2. AI: Phase 2 を締め、Phase 3（競合・代替手段の調査）へ
