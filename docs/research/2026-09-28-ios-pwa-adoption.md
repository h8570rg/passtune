# iPhone ユーザーは PWA をホーム画面に追加してくれるか（事例調査）

- Date: 2026-09-28
- Phase: 9
- Question: Web で招待し「ホーム画面に追加」を案内したとき、iPhone の友人は追加してくれるか。同じ悩みを解決した個人開発の事例と結果はあるか
- Related: [005](../decisions/005-platform.md), [platform-options](2026-09-28-platform-options.md)

## TL;DR

- **iPhone で PWA をホーム画面に追加する率を示した信頼できる公開データは見つからなかった。** 有名な成功事例（Trivago、Flipkart など）は大企業のもので、主に Android か、追加した「後」の効果を測ったもの。
- **「iPhone では追加してもらいにくい」という点は、どの情報源も一致している。**
  - 自動のインストール提案がない。
  - 共有 → 「ホーム画面に追加」の手順を知らない人が大多数。
- **個人開発では、「追加の手順を案内する画面」を作る動きが多数見られる**（GitHub の issue など）。ただし、案内の結果（追加率）まで公開している例は見つからなかった。
- **一部の開発者は、PWA を App Store 用に包んで配布している。** ただし、単純に包むだけでは審査で却下されやすい（[multiplatform-approach](2026-09-28-multiplatform-approach.md)）。

## Findings

### Facts（出典あり）

- iPhone の Safari には自動のインストール提案がない。共有ボタン → スクロール → 「ホーム画面に追加」 → 確定、の手順が必要。
  - 独自の案内バナーを作ることはできるが、その変換率は自動の提案に比べて低いとされる。[MobiLoud](https://www.mobiloud.com/blog/progressive-web-apps-ios/)（確認日 2026-09-28。ネイティブ化サービスの販売元なので、ネイティブ寄りの立場に注意）
- 日本では約半数が iPhone。ホーム画面への追加機能自体を知らない人が大多数で、導入には丁寧な案内の設計が不可欠、という見解がある。[オプスイン（2026 年版 iOS PWA 対応状況）](https://ops-in.com/blog/ios-pwa-support/)（確認日 2026-09-28）
- iOS 26 以降、ホーム画面に追加したサイトは既定で Web アプリとして開く。同上
- 個人・小規模のプロジェクトで、「ホーム画面に追加」の案内を機能として作る issue / PR が複数ある。いずれも「追加の手順が分かりにくく、通知にたどり着けない」ことを課題にしている。[logru #71](https://github.com/takikou347/logru/issues/71), [geonicdb-bosai #65](https://github.com/geolonia/geonicdb-bosai/issues/65), [ganbari-quest #4988](https://github.com/Takenori-Kusaka/ganbari-quest/pull/4988)（確認日 2026-09-28）
- PWA 導入の成功事例（Trivago: ホーム画面に追加した人が 150% 増、Flipkart: 追加経由の人の変換率 70% 増など）は大企業のもの。追加率そのものではなく、追加した人の行動の変化を示している。[Progressier PWA Stats](https://progressier.com/pwa-stats) ほか（確認日 2026-09-28）
- Hacker News でも、iOS の追加手順は技術に詳しくない人には見つけにくい、という声がある。具体的な数字はない。[Hacker News](https://news.ycombinator.com/item?id=38913951)（確認日 2026-09-28）

### Inferences（推測）

- 一般的な Web サイトで、知らない訪問者に「ホーム画面に追加」を案内しても、追加する人は少ないと考えられる。
- ただし、このプロジェクトの状況は一般的な Web サイトと異なる。
  - 招待するのは開発者本人で、相手は友人。直接会って、その場で一緒に追加することもできる。
  - 追加率は一般的な数字より高くなる可能性がある。一方、「会わない友人」や「友人の友人」には効かない。
- 公開データで決着がつかない以上、**友人数人で実際に試すのが最も安く確実な判断材料** になる。

## Open / Next

- [OPEN] 実際の友人（iPhone）が、LINE で手順を送られただけで追加してくれるか

## 追加調査: 友人から友人へ広げるとき、Web リンクとストアリンクの違い（2026-09-28）

### Facts（出典あり）

- LINE で送られたリンクは、LINE アプリ内のブラウザで開く。URL に `openExternalBrowser=1` を付けると、外部ブラウザ（Safari 等）で開かせられる。[LINE for Business](https://help.linebiz.com/lineadshelp/s/article/L000001427?language=ja), [DevelopersIO](https://dev.classmethod.jp/articles/line-open-uri-in-external-browser/)（確認日 2026-09-28）
- Google は、アプリ内ブラウザ（WebView）での Google ログインを拒否する（403 disallowed_useragent）。LINE・Instagram などのアプリ内ブラウザで「Google でログイン」が失敗する。[Google Developers Blog](https://developers.googleblog.com/upcoming-security-changes-to-googles-oauth-20-authorization-endpoint-in-embedded-webviews/), [TrueLink](https://truelink-group.com/en/blog/why-google-login-fails-in-line-facebook-in-app-browsers-2026/)（確認日 2026-09-28）
- Firebase Dynamic Links は 2025-08-25 に終了した。これは「アプリ未インストールの人がリンクから入り、ストアでインストールした後も、リンクの情報（招待者など）を引き継ぐ」仕組み（遅延ディープリンク）の定番だった。代替は有料サービス（Branch、AppsFlyer など）か自作。[Firebase FAQ](https://firebase.google.com/support/dynamic-links-faq), [Airbridge](https://www.airbridge.io/en/blog/firebase-dynamic-links-alternatives)（確認日 2026-09-28）

### Inferences（推測）

**Web リンクのデメリット**
- LINE のアプリ内ブラウザで開かれると、そこではホーム画面に追加できず、Google ログインも失敗する。
  - 対策: 招待リンクに `openExternalBrowser=1` を付ける。アプリ内ブラウザでも使えるログイン方式を選ぶ（Phase 9 後半）。
- 友人の友人は開発者が直接手伝えないため、iPhone での「ホーム画面に追加」は、人づてに広がるほど実行されにくくなる。
- 見慣れないドメインへのリンクは、ストアのリンクより怪しく見える可能性がある（友人経由なら影響は小さい）。

**ストアリンクのデメリット**
- インストールしないと中身が見えない。
- Android と PC の人には使えない。
- 招待情報（招待者の自動フォロー）がインストールの間に途切れる。引き継ぐには遅延ディープリンクが必要で、Firebase Dynamic Links の終了後は有料サービスか自作になる。

**まとめ**
- 共有するリンクは、ネイティブアプリの有無にかかわらず Web リンクにするのが合理的。どの端末でも開け、招待情報も確実に渡る。
- iOS ネイティブアプリがある場合は、Web のページから iOS アプリへ誘導できる（Smart App Banner、Universal Links。Apple の標準機能）。
- したがって、「Web リンクかストアリンクか」は選択の問題ではない。残る論点は、引き続き「iPhone でホーム画面に追加してもらえるか」。
