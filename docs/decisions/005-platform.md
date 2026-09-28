# 005: 提供形態と作り方

- Status: PROPOSED（提供形態・開業届なしは DECIDED、作り方と Android の提供方法は PROPOSED）
- Date: 2026-09-28
- Area: Technical
- Related: [multiplatform-approach](../research/2026-09-28-multiplatform-approach.md), [platform-options](../research/2026-09-28-platform-options.md), [mvp](../product/mvp.md), [004](004-product-strategy.md)

## Context

- 開発者の回答（2026-09-28）:
  - Web・iOS・Android の 3 つすべてで提供したい。Web だとブックマークやホーム画面への追加が必要で、アクセスのハードルが高い。
  - Apple Developer Program の費用は許容する。
  - Web フロントエンドはエキスパート。バックエンドは経験が少なく、BaaS（Supabase など）を使いたい。
  - ネイティブは未経験だが、AI の助けを借りて挑戦したい。
- 開発者の不安:
  1. Web を包む形にすると、実装の一貫性は保てるが、審査と性能が不安
  2. Web とネイティブで技術を分けると、デザインや実装の一貫性をどう保つか
  3. ネイティブが未経験
- 開発・保守は 1 人（週 約 10 時間）。

## 提供形態 [DECIDED]

Web・iOS・Android の 3 つで提供する（開発者の決定）。

## Options considered（作り方）

| Option | 内容 | メリット | デメリット | 不安 1〜3 への答え |
|---|---|---|---|---|
| A. Web を包む（Capacitor 等） | Web アプリを作り、ネイティブの殻に入れる | Web の知識がそのまま使える。コードは 1 つ | 審査 4.2 で却下されやすく、ネイティブ機能を足す必要がある。操作感は Web のまま | 1 が残る |
| B. Expo（React Native）で 3 つを 1 つのコードで作る | iOS・Android・Web を同じコードから出す | 審査の心配が小さい（本物のネイティブ UI）。コードが 1 つなので一貫性が保てる。React の知識が生きる。ネイティブのビルドは Expo が肩代わりする | Web 版は React Native の部品で作るため、通常の Web 開発（CSS / DOM）より自由度が低い | 1・2 を解消。3 は React の知識で緩和 |
| C. Web（通常の Web 技術）とネイティブ（Expo）を分ける | 同じリポジトリで、型・データ取得・デザインの値（色・余白など）を共有し、画面は別々に作る | Web もネイティブもそれぞれ最良の体験 | 画面を 2 回作る。作る量と保守がほぼ倍 | 2 は共有部分で緩和するが、完全には揃わない |
| D. Flutter | 別言語（Dart）で 3 つを作る | コード 1 つ | 新しい言語。Web の知識が生きにくい | ― |

## Decision（作り方）

[PROPOSED] B. Expo で iOS・Android・Web を 1 つのコードで作る。

## Why

- 3 つの不安すべてに対して最も素直に答えられる（審査・一貫性・未経験）。
- 1 人・週 10 時間で 3 つを保守するには、コードを 1 つにするのが最も効く。
- React の経験がそのまま生きる。

## Tradeoffs / Consequences

- Web 版は「アプリのような Web」になり、Web 専用に作る場合ほど自由には作れない。
- Web の出力品質（ログインなしで見る投稿ページなど）が不十分なら、Web だけ C に切り替える。
  - その場合も、データ取得や型などの共有部分は残る。

## Android の提供方法

### 前提 [DECIDED]

- 開業届は出さない（税務の手続きを避けたい。開発者の決定、2026-09-28）。
- そのため、Google Play は個人アカウントになる。本番公開には 12 人 × 14 日間のクローズドテストが必要。

### Options considered

| Option | 内容 | メリット | デメリット |
|---|---|---|---|
| AN1. Android は諦める（iOS と Web のみ） | ― | 手間なし | Android 利用者は Web 版のみ。開発者自身も Android |
| AN2. 当面は Web 版（インストールできる Web アプリ）で提供し、Android 利用者が 12 人集まったら Google Play へ | Web 版で公開し、Android の利用者にクローズドテストへの参加を頼む。14 日後に Google Play で公開 | Expo なので Android 版のコードは追加でほぼ不要。Android の Web アプリはインストール・通知の体験が iPhone より良い。公開を Google の手続きで止めない | Google Play 公開の時期は、Android 利用者の集まり方次第 |
| AN3. APK を直接配る（限定配布アカウント、最大 20 台） | Google Play を通さずに友人へ配る | 無料・12 人不要 | 友人が「提供元不明のアプリ」の警告を越える必要がある。誰でも登録できる公開には向かない |
| AN4. 公開前に 12 人を集める | 友人以外（家族・同僚など）も含めて集める | 公開時から 3 つ揃う | 「MVP は開発者だけで評価する」方針と衝突する。集まらないと公開が止まる |

### Decision [PROPOSED]

AN2。Android は諦めず、「公開時は Web 版、条件がそろったら Google Play」の 2 段階にする。

- 開発者自身の Android 端末での MVP 評価は、開発用のビルドを直接インストールして行う（ストア不要）。
- Google Play 公開の条件: Android の利用者（Web 版の利用者を含む）から、クローズドテストに 14 日間参加してくれる人が 12 人集まったとき。

## Revisit when

- Expo の Web 出力が、ログインなし閲覧やホーム画面での利用に耐えないと分かったとき（→ Web を C に）
- Expo でネイティブ機能の壁に当たったとき
- Android の Web 版で不満が多い、または Android の利用者が 12 人に届く見込みが立たないとき（→ AN3 や、開業届の再検討）
- 日本で Android の開発者確認が始まるとき（2027 年以降の見込み）
