# 001: プロジェクト管理の方法

- Status: DECIDED
- Date: 2026-09-28
- Area: Project
- Related: [PROJECT.md](../../PROJECT.md), [AGENTS.md](../../AGENTS.md)

## Context

1人 + AI Agent で音楽共有SNSを開発する。AI とのセッションは毎回記憶が途切れ、複数の AI を使う可能性もある。
有限資源は開発者の時間・集中力・意思決定コスト・ランニング/保守/作り直しコストで、プロジェクト管理自体が負担になってはいけない。

## Options considered

| Option | メリット | デメリット | 相性 | 後から変更できるか |
|---|---|---|---|---|
| Chat 履歴・AI の記憶に頼る | 手間ゼロ | セッション/ツールをまたぐと失われる。検証不能 | 悪い | ― |
| 外部ツール（Notion 等）を正本にする | 閲覧しやすい | AI Agent から読みにくい。コードと分離する | 普通 | 可能 |
| Git 内 Markdown を正本にする | AI が直接読める。履歴が残る。無料 | 書く規律が必要 | 良い | 可能 |

## Decision

- AI との Chat だけをプロジェクトの記憶にしない。
- Git リポジトリ内の Markdown をプロジェクト知識の Single Source of Truth とする。
- PROJECT.md と STATUS.md を AI がプロジェクトを理解する入口とする。
- 重要な意思決定は Decision Log（`docs/decisions/`）に残す。Product / Business / Project にも使う。
- Research と Decision を分離する。
- 細かい仕様・技術選定に入る前に、上流工程から順番に進める。

Phase 0 レビューで追加（2026-09-28 承認）:

- ラベルに `PROPOSED` を追加する。AI は `DECIDED` を付けず、確定は開発者が行う。
- AI 運用ルールは `AGENTS.md` に置き、`CLAUDE.md` は AGENTS.md / PROJECT.md / STATUS.md を `@import` するだけにする。
- `docs/product|business|technical` などのディレクトリは必要になった時点で作る。
- Phase は厳密なゲートではなく「今の関心事」とし、各 Phase に完了の目安を置く。前の Phase に戻ってよい。
- プロジェクト自体の目的と制約（時間・予算・期限）を Phase 1 で明文化する。
- STATUS.md の Current Cycle は Phase 11（開発）まで使わない。
- AI はドキュメントの変更を開発者の確認なしにコミットしてよい。

## Why

- AI が直接読み書きでき、差分と履歴が残り、追加コストがない。
- 情報を research → decision → PROJECT/STATUS と圧縮することで、毎回大量の文書を読ませずに済む。
- `PROPOSED` と確定権限の明確化: AI が起案した結論が、いつの間にか確定扱いになるのを防ぐ。
- `CLAUDE.md` からの import: Claude Code は CLAUDE.md を自動で読むため、ルールと入口が毎回確実に読まれる。AGENTS.md は他の AI ツールでも読まれる慣習のファイル名。
- 完了の目安: 1人開発では手戻りよりも Discovery が終わらない（分析麻痺）リスクの方が大きい。
- プロジェクトの目的: 「学習目的」と「収益目的」では最適な MVP も技術も変わるため、Why の最上流に置く。
- 自由コミット: Git で戻せるため、確認の往復（意思決定コスト）を省く。

## Tradeoffs / Consequences

- ドキュメント更新の規律が必要。更新を忘れると正本が古くなる → AGENTS.md の「作業終了時」ルールで補う。
- 非エンジニアとの共有には向かない（現状は不要）。

## Revisit when

- ドキュメント維持が開発時間を明らかに圧迫していると感じたとき
- 共同開発者が加わるとき
- タスク数が増え、Markdown でのタスク管理が破綻したとき（Issue 管理の導入を検討）
