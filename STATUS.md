# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 2: User Research（開始前。進め方を相談中）

## Current Goal

問題仮説 H1〜H8 を、開発者本人以外（友人）でも確かめる。

## Recently Decided

- [DECIDED] Phase 1 完了（[vision](docs/product/vision.md)）
- [DECIDED] 公開の形は「知り合い中心・誰でも参加可」。まず友人約 20 人を優先（[002](docs/decisions/002-audience-and-openness.md)）
- [DECIDED] 開発者は Spotify 利用。使える時間は週約 10 時間、期限なし
- [DECIDED] 予算の目安は年 1 万円（質が落ちるなら増額可）

## Key Findings

- Spotify のユーザー連携は 5 人まで、API ではプレビュー不可。Apple の iTunes Search API はキーなしでプレビュー取得可。Apple Developer Program は約 1.3 万円/年（[research](docs/research/2026-09-28-music-api-feasibility.md)）

## Open Questions

- [PROPOSED] 成功基準: 友人 10 人が公開 3 か月後も週 1 回以上使っている
- [OPEN] Phase 2 の進め方（誰に・何を・どう聞くか）
- [OPEN] 友人の中に YouTube Music やサブスクなしの人がいるか
- [OPEN] Git のリモート（GitHub private 等）を置くか（急がない）

## Blockers

なし

## Next Actions

1. 開発者: 成功基準案と Phase 2 の進め方を確認する
2. 開発者: 友人に話を聞く（Phase 2）
3. AI: 聞き取り結果を docs/research に記録し、仮説を更新する
