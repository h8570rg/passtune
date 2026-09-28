# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-09-28

## Current Phase

Phase 8: MVP Definition

## Current Goal

友人約 20 人に使ってもらう最小の形と、そこで確かめることを決める。

## Recently Decided

- [DECIDED] Phase 7 完了。投稿の入り口・試聴・各自のサービスで開く・招待で自動フォロー・いいねのみ・延べ再生回数・コメント返信なし（[solutions](docs/product/solutions.md)）
- [DECIDED] Phase 6 完了。プロダクト戦略を確定（[004](docs/decisions/004-product-strategy.md), [strategy](docs/product/strategy.md)）
- [DECIDED] Phase 5 完了。リスク対応の方向性を了承。DM 機能は持たない（[risks](docs/product/risks.md)）
- [DECIDED] Phase 4 完了。収益化の道を塞がないルールと、画像・音声アップロードを当面持たないことを決定（[business](docs/business/business-model.md)）
- [DECIDED] Phase 3 完了。競合アプリは試さない。差別化の仮説 3 つに同意（[vision](docs/product/vision.md)）
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

- 競合: 同コンセプトの海外アプリ（Wullup、Soundscape）はあるが小規模・iPhone のみ・日本語非対応。大手は自社サービス内に閉じている（[research](docs/research/2026-09-28-competitors.md)）

- 曲の照合: Apple Music リンクからは試聴まで確実。曲名検索は日本語・ローマ字・英語で本家が先頭（カバー等も混ざる）。Spotify リンクはキーなしだと曲名のみ（[research](docs/research/2026-09-28-song-matching.md)）

## Open Questions

- [HYPOTHESIS] Spotify の曲の試聴は、Apple 側で同じ曲を探して使う（開発者の意向。Phase 7 / 9 で決定）
- [DECIDED] MVP は完成に近い形で作り、開発者自身で評価。誰でも登録可、通報・ブロックなし、通知なし、反応の確認画面あり、ログインなし閲覧は Web の場合のみ（[mvp](docs/product/mvp.md)）
- [PROPOSED] 通報・ブロックの代わりに、管理者による削除手段と問い合わせ先を用意する
- [OPEN] 友人の中に YouTube Music やサブスクなしの人がいるか
- [OPEN] Git のリモート（GitHub private 等）を置くか（急がない）

## Blockers

なし

## Next Actions

1. 開発者: 管理者による削除手段の案を確認する
2. AI: Phase 8 を締め、Phase 9（Technical Strategy / Architecture）へ
