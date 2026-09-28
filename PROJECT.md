# PROJECT.md

> このプロジェクトの入口。新しいセッションや新しいAIは、まずこのファイルと [STATUS.md](STATUS.md) を読む。
> 比較的安定した情報だけを置く。詳細は `docs/` 配下へ。目安 150 行以内。

## 1. Overview

友人間でお互いに好きな音楽を共有するための SNS を個人開発する。最初は友人約 20 人から始め、不特定多数にも公開する。
現在は Product Discovery 中。プロダクトの中身・技術構成は未決定。

## 2. Vision / Problem

詳細: [docs/product/vision.md](docs/product/vision.md)

- [DECIDED] Vision: 仲の良い友人同士が、使っている音楽サービスの違いを気にせず、好きな曲を気軽に届け合い、聴き合える場所。
- [HYPOTHESIS] 問題: 音楽を共有する専用の場がない（現状は X への投稿か口頭）。そのため共有の回数が少なく、共有されても埋もれる・記録に残らない・サブスクが違うなどの理由で聴かれない。

## 3. Project Goals & Constraints

プロダクトの目標とは別に、「このプロジェクトを何のためにやるか」。成功の定義や撤退の判断に使う。

| 項目 | 状態 | 内容 |
|---|---|---|
| プロジェクトの目的 | [DECIDED] | 友人間の狭いコミュニティで、自分が使いたいものを作る |
| マネタイズ | [DECIDED] | 今は目標にしない。将来できる余地は残す（取り返しのつかない選択を避ける） |
| 対象・公開範囲 | [DECIDED] | 友人約 20 人から始め、誰でも参加できる形で公開する。体験の中心は知り合い同士（[002](docs/decisions/002-audience-and-openness.md)） |
| 使える時間 | [DECIDED] | 週 約 10 時間 |
| ランニングコストの上限 | [DECIDED] | 目安は年 10,000 円以内。質が落ちるなら増額してよい |
| 期限 | [DECIDED] | なし |
| 開発体制 | [DECIDED] | 開発者1人 + AI Agent |

## 4. Principles

### Project principles [DECIDED]

- 有限資源は **開発者の時間・集中力・意思決定コスト・ランニングコスト・保守コスト・作り直しコスト**。人件費は考えない。
- 「無料だが複雑」より「多少費用がかかっても単純で保守しやすい」を選ぶことがある。
- 必要になったときに必要な複雑さを追加する。将来必要かもしれないだけの設計・プロセス・ドキュメントは作らない。
- **Why → Who → Problem → Business → What → How** の順で考える。Solution / Technology を早く決めない。
- 「調査」と「決定」を分ける。How に関する調査は早い段階でもしてよいが、決定はしない。

### Product principles [DECIDED]

詳細: [docs/product/strategy.md](docs/product/strategy.md)。上ほど優先する。

1. 聴くまでの手間を最小にする
2. サービスの違いを意識させない
3. 参加の手間を小さくする
4. 投稿は軽く（1 曲＋一言）
5. 聴く側に負担をかけない
6. 小さく、安く、保守しやすく

## 5. Status labels

情報には次のラベルを付ける。未検証の考えを事実や決定として扱わない。

| Label | 意味 |
|---|---|
| `[DECIDED]` | ユーザー（開発者）が確定した。根拠は Decision Log にある |
| `[PROPOSED]` | 決定案。AI または開発者が起案し、確定待ち |
| `[HYPOTHESIS]` | 検証すべき仮説。検証方法と判定基準を持つ |
| `[ASSUMPTION]` | 検証せずに前提として置いたもの。崩れたら影響範囲を見直す |
| `[OPEN]` | 未解決の問い |
| `[DEPRECATED]` | 廃止。何に置き換わったかを併記する |

- HYPOTHESIS と ASSUMPTION の違い: HYPOTHESIS は「確かめにいく」、ASSUMPTION は「今は確かめずに進む」。
- AI は `[DECIDED]` を付けない。確定するのは開発者のみ（→ [AGENTS.md](AGENTS.md)）。

## 6. Process / Roadmap

各 Phase は厳密なゲートではなく「今の主な関心事」。後の Phase で分かったことで前の Phase に戻ってよい。
各 Phase は「完了の目安」を満たしたら次へ進む（完璧を目指さない）。

| Phase | 名前 | 完了の目安 |
|---|---|---|
| 0 | Project Setup | 運用ルール・入口ドキュメント・テンプレートが揃い、開発者が承認 |
| 1 | Product Vision / Problem Definition | プロジェクトの目的、Vision、解きたい問題の仮説が書かれている |
| 2 | User Research | 開発者本人へのヒアリングで、利用場面と欲しい体験が具体化されている（[003](docs/decisions/003-user-research-approach.md)） |
| 3 | Market / Competitor Research | 主要な競合・代替手段と、その空白地帯の整理 |
| 4 | Business Model / Monetization | 収益化の方針（しない、も含む）とランニングコスト許容範囲 |
| 5 | Risk Analysis | プロダクトを殺しうるリスク（規約・API・法務・需要）の一覧と対処方針 |
| 6 | Product Strategy | 何をやり、何をやらないか |
| 7 | Solution Exploration | 解決策の候補と比較 |
| 8 | MVP Definition | 最小の検証対象と、成功/失敗の判定基準 |
| 9 | Technical Strategy / Architecture | 技術選定の Decision Log |
| 10 | Roadmap / Task Breakdown | 着手可能なタスク一覧 |
| 11 | Prototype / Development | 動くもの |
| 12 | User Testing | 実ユーザーからの学び |
| 13 | Launch | 公開 |
| 14 | Measurement / Iteration | 指標に基づく改善サイクル |

## 7. Key Decisions

| # | Decision | Status |
|---|---|---|
| [001](docs/decisions/001-project-management.md) | プロジェクト管理の方法 | DECIDED |
| [002](docs/decisions/002-audience-and-openness.md) | 対象ユーザーと公開の形（知り合い中心・誰でも参加可） | DECIDED |
| [003](docs/decisions/003-user-research-approach.md) | ユーザー調査は行わず、開発者本人へのヒアリングで代える | DECIDED |
| [004](docs/decisions/004-product-strategy.md) | プロダクト戦略（1 曲を勧める・直接の声かけで広げる・片方向フォロー・iPhone と Android） | DECIDED |
| [005](docs/decisions/005-platform.md) | 提供形態（Web） | PROPOSED |

## 8. Documentation Structure

```
/
├─ AGENTS.md          AI Agent の運用ルール（CLAUDE.md から読み込む）
├─ CLAUDE.md          Claude Code 用の入口（AGENTS.md / PROJECT.md / STATUS.md を読み込むだけ）
├─ PROJECT.md         安定した全体像（このファイル）
├─ STATUS.md          今の状態
└─ docs/
   ├─ decisions/      Decision Log（NNN-slug.md）。テンプレート: _template.md
   ├─ research/       調査記録（YYYY-MM-DD-slug.md）。テンプレート: _template.md
   ├─ product/        Vision・問題仮説・MVP 定義など
   └─ business/       ビジネスモデル・コスト
```

以下は **必要になった時点で** 作る（空のディレクトリを先に作らない）。

- `docs/technical/` — アーキテクチャ概要

情報の流れ（圧縮）: `research/`（根拠・生データ） → `decisions/`（判断と理由） → `PROJECT.md` / `STATUS.md`（結論だけ）

## 9. Operating Rules（要約）

- 正本は Git リポジトリ内の Markdown。Chat の履歴や AI の記憶に依存しない。
- 重要な結論が出たら Chat だけに残さず、research → decisions → PROJECT / STATUS の順に反映する。
- 既存 Decision と矛盾する提案は「既存 Decision の変更提案」と明示する。
- AI はドキュメントの変更を自由にコミットしてよい。
- 詳細は [AGENTS.md](AGENTS.md)。
