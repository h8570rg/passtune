# Web・iOS・Android の作り方と配布の条件

- Date: 2026-09-28
- Phase: 9
- Question: Web・iOS・Android の 3 つを 1 人で作り保守するには、どの作り方が合うか。Google Play の 12 人テスト要件をどう満たすか。BaaS（Supabase）は予算に収まるか
- Related: [005](../decisions/005-platform.md), [platform-options](2026-09-28-platform-options.md)

## TL;DR

- **Web をそのまま包んだだけのアプリは、App Store 審査（4.2 最低限の機能）で却下されやすい。** 通知・共有・ネイティブの画面遷移など、アプリならではの価値を足す必要がある。
- **Expo（React Native）なら、1 つのコードで iOS・Android・Web を作れる。** Web の静的レンダリングにも対応する。React の知識が生きる。
- **Google Play の 12 人・14 日テストは、組織アカウントなら免除。** 個人事業主でも D-U-N-S 番号を取れば組織アカウントにできる（事例多数）。テスターは実機の Android で実際に使う必要がある。
- **Supabase の無料プランは、1 週間アクセスがないと停止する。** 有料の Pro は月 25 USD（年 約 4.5 万円）で、予算の目安を大きく超える。
- **iOS でソーシャルログイン（Google など）を使うなら、Sign in with Apple などの代替ログインも必要**（審査 4.8）。

## Findings

### Facts（出典あり）

**App Store の審査**
- 審査ガイドライン 4.2（最低限の機能）: アプリは「作り直したウェブサイト」以上の機能・コンテンツ・UI を持つべき。[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)（確認日 2026-09-28）
- 審査ガイドライン 4.8: 第三者・ソーシャルログインを使うアプリは、データ収集が限定された別のログイン手段も用意する必要がある（名前とメールのみ、メールを非公開にできる等）。同上
- Web を包んだアプリ（Capacitor 等）は、4.2 で却下されやすい。対策として、プッシュ通知・共有・ネイティブのナビゲーションなどを加えることが勧められている。[Capawesome](https://capawesome.io/blog/11-steps-to-get-your-web-app-on-the-app-store/), [Publishd](https://publishd.app/blog/why-wrapping-a-web-app-doesnt-work)（二次情報、確認日 2026-09-28）

**Expo**
- Expo Router は、Android・iOS・Web で同じコンポーネントと画面遷移を共有できる。[Expo Docs](https://docs.expo.dev/router/introduction/)（確認日 2026-09-28）
- Web は静的レンダリング（ビルド時に HTML を生成）またはサーバーレンダリングに対応。ただし同じプロジェクトで両方を混ぜることはできない。[Static rendering](https://docs.expo.dev/router/web/static-rendering/), [Server rendering](https://docs.expo.dev/router/web/server-rendering/)（確認日 2026-09-28）

**Google Play**
- 2023-11-13 以降に作成された個人アカウントは、12 人以上 × 14 日間のクローズドテストが本番公開の条件。組織アカウントは対象外。[Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)（確認日 2026-09-28）
- テスターは実機の Android にインストールし、実際に使う必要がある。インストールだけで使っていない場合、本番申請が却下されうる。[Google Play Developer Community](https://support.google.com/googleplay/android-developer/community-guide/255621488/everything-about-the-12-testers-requirement?hl=en)（確認日 2026-09-28）
- 個人事業主でも D-U-N-S 番号（東京商工リサーチ経由、約 1 週間）を取得し、組織アカウントを作った事例が複数ある。
  - 費用は無料という記載と 3,300 円という記載がある。
  - 組織アカウントでは、ストアに実名ではなく屋号を表示でき、住所にバーチャルオフィスを使えるという記載もある。
  - 出典: [ZeroCreate](https://zero-webcreate.com/kigyou-04/), [ソウサクカツドウ](https://teammoko.jp/googleplay_account_makeorg), [プログラマーのメモ書き](https://blog.mori-soft.com/entry/2023/12/02/161630)（二次情報、確認日 2026-09-28）

**Supabase**
- 無料プランの主な条件: DB 500MB、MAU 5 万、ストレージ 1GB、転送量 5GB、プロジェクト 2 つまで。**1 週間アクセスがないと停止する。** [Supabase Pricing](https://supabase.com/pricing)（確認日 2026-09-28）
- Pro は月 25 USD から（MAU 10 万、DB 8GB、日次バックアップなど）。同上

### Inferences（推測）

- 友人の多くが iPhone なので、Android の実機テスター 12 人を友人だけで集めるのは難しい。
- 公開後に友人が週 1 回以上使っていれば、Supabase の無料プランが 1 週間の無操作で止まることはまず起きない。ただし、開発中や利用が止まった時期には止まりうる。
- 無料プランには日次バックアップがない。データを失ったときの復旧手段は別途考える必要がある（Phase 9 後半）。
- Expo の Web 出力は React Native の部品（View、Text など）で作るため、CSS や DOM を直接書く通常の Web 開発とは書き方が違う。Web のエキスパートにとっては、自由度が下がる部分がある。

## Open / Next

- [OPEN] D-U-N-S 番号の取得費用（無料か 3,300 円か）と、個人事業主の開業届による税務上の影響
- [OPEN] Expo の Web 出力の品質（ログインなしで見る投稿ページ、ホーム画面追加）の実地確認
- [OPEN] EAS（Expo のビルド・配布サービス）の無料枠
