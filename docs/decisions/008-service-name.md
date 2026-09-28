# 008: サービス名とコードネーム

- Status: DECIDED
- Date: 2026-09-28
- Area: Product
- Related: [vision](../product/vision.md), [strategy](../product/strategy.md)

## Context

- リポジトリ名（コードネーム）を決める必要があり、開発者の希望でサービス名も同時に決めることにした。
- 基準: コンセプト（友人に 1 曲を届ける）が伝わる、口に出して言いやすい、短い、既存サービスとかぶらない、ドメインが取れる。

## Options considered

| 候補 | 評価 |
|---|---|
| Todoke / Otomo / Kikasete / Oshikyoku など日本語由来 | 開発者の好みは英語の「曲をパスする」方向 |
| Kiite | 同名の音楽サービスが既にある可能性 |
| Tunedrop | 同名で、コンセプトの近いサービスが既にある（[competitors](../research/2026-09-28-competitors.md)） |
| Tunerelay | 同名の既存製品（AirPlay の音声中継ソフト） |
| Tunebaton / Earpass / Tunepass / Passong など | 候補として検討 |
| **Passtune** | 採用 |

## Decision

- サービス名: **Passtune**（パスチューン）
- コードネーム（リポジトリ名など）: **passtune**

## Why

- 「曲（tune）を友人にパスする」というコンセプトが、そのまま伝わる。
- 「パスチューンで送ったよ」と、会話で使いやすい。

## 確認した事実（2026-09-28 時点）

- ドメインは、passtune.com・.app・.jp・.net・.io がいずれも未登録だった（各レジストリの whois / RDAP で確認）。
- 同名の音楽アプリやサービスは、Web 検索では見つからなかった。
  - 「passtune」は、ゲーム NetHack で城の跳ね橋を開ける 5 音の曲を指す用語として使われている（[NetHack Wiki](https://nethackwiki.com/wiki/Passtune)）。
- 商標（J-PlatPat、2026-09-28 検索）: 「パスチューン」の商標登録出願が 1 件ある。
  - 商願 2026-078188、出願日 2026-07-03、第 5 類、株式会社養日化学研究所、審査待ち。
  - 第 5 類は薬剤・サプリメント等の区分。このサービスに関係しうるソフトウェア・通信・娯楽・SNS 等の区分とは異なる。
  - 影響は小さいと考えられるが、法的な判断ではない。

## Tradeoffs / Consequences

- 英語の造語なので、初めて見る人には意味の説明が要る場合がある。
- ドメインと商標の状況は変わりうる。ドメインは早めに取得するのが望ましい。

## Revisit when

- 取りたいドメインが取れなくなったとき
- 同じ区分で、同名や似た名前の商標・サービスが見つかったとき
