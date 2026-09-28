# Next.js のホスティング比較

- Date: 2026-09-28
- Phase: 9
- Question: Next.js で作る Web アプリ（PWA）を、1 人保守・年 1 万円程度で、将来の収益化を塞がずに置ける場所はどこか
- Related: [006](../decisions/006-hosting.md), [monetization](2026-09-28-monetization.md), [backend-auth-hosting](2026-09-28-backend-auth-hosting.md)

## TL;DR

| | 料金（この規模） | 商用利用 | Next.js の動かしやすさ | 注意点 |
|---|---|---|---|---|
| Vercel Hobby | 0 円 | **不可**（広告・アフィリエイト・課金は不可。寄付は可） | 最も簡単（Next.js の開発元） | 収益化するなら Pro（月 20 USD ≒ 年 3.6 万円）か移行 |
| Vercel Pro | 月 20 USD | 可 | 最も簡単 | 予算の目安を大きく超える |
| Cloudflare Workers（OpenNext） | 無料プランは実質使えない。有料は月 5 USD（≒ 年 9,000 円） | 可 | 変換用の仕組み（OpenNext）が必要。癖がある | 無料プランは CPU 10ms の上限で、サーバー側の描画（SSR）が失敗する |
| Firebase App Hosting | 無料枠内なら 0 円（ただし従量課金プランの登録が必須） | 可 | 公式対応 | 使った分だけ請求され、支払いの上限を設定できない（予算アラートのみ） |
| Netlify Free | 0 円（月 300 クレジット） | 可 | 公式対応 | 使い切ると全サイトが翌月まで停止。本番デプロイ 1 回 15 クレジット（月 20 回で上限） |
| Next.js を静的サイトとして書き出し、Cloudflare などに置く | 0 円 | 可 | Next.js のサーバー機能（SSR、Server Actions、API ルート）が使えない | BaaS を画面から直接呼ぶ構成になる |

## Findings

### Facts（出典あり、確認日 2026-09-28）

**Vercel**
- Hobby は無料だが、非商用の個人利用のみ。商用には支払いの受け付け・広告・アフィリエイトが含まれる（寄付は例外）。Pro は月 20 USD / 人。[Vercel Hobby](https://vercel.com/docs/plans/hobby), [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
- Hobby の無料枠: 転送 100GB、関数の実行 100 万回、Active CPU 4 時間など。超えると 30 日待ち。同上

**Cloudflare**
- Workers の無料プランは 1 日 10 万リクエスト、1 リクエストあたり CPU 10ms。有料は月 5 USD から（CPU は既定 30 秒、最大 5 分）。静的ファイルへのリクエストは無料・無制限。[Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/), [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- Worker のサイズ上限の記載が食い違っている。
  - Cloudflare の現行文書: 非圧縮 64MiB（無料・有料とも）。
  - OpenNext の文書: 圧縮後で無料 3MiB、有料 10MiB。
  - 一次情報の Cloudflare 側が新しい可能性が高いが、要確認。
- OpenNext は Next.js 16 と、14・15 の最新版に対応。App Router、SSR、ISR、ミドルウェアなどに対応するが、Node Middleware（15.2 で追加）は未対応。[OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- OpenNext の SSR は、無料プランの CPU 10ms を超えてエラー 1102 になるという報告が複数ある。解決策は有料プランへの変更。[opennextjs-cloudflare #598](https://github.com/opennextjs/opennextjs-cloudflare/issues/598), [#1381](https://github.com/opennextjs/opennextjs-cloudflare/issues/1381), [DEV](https://dev.to/ricogr/fixing-error-1102-script-startup-exceeded-cpu-time-limit-on-cloudflare-workers-with-nextjs-4l1n)

**Firebase App Hosting**
- 従量課金の Blaze プランが必須。[Firebase App Hosting Costs](https://firebase.google.com/docs/app-hosting/costs)
- 無料枠: 転送 10GiB / 月、Cloud Run 18 万 vCPU 秒・200 万リクエストなど。月額の最低料金はなく、無料枠を超えた分のみ課金。同上

**Netlify**
- 無料プランは月 300 クレジット。使い切ると翌月までチーム内の全サイトが停止する（超過課金なし）。[Netlify Docs](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/), [Netli.fyi](https://netli.fyi/blog/netlify-free-plan-limits-2026)
- 本番デプロイ 1 回 15 クレジット、転送 1GB あたり 20 クレジット。無料プランに個人利用の制限はない。Pro は月 20 USD。同上（一部二次情報）

### Inferences（推測）

- Cloudflare で Next.js のサーバー機能を使うなら、実質的に有料（月 5 USD）が前提。OpenNext 特有の問題への対応も、保守の負担になる。
- Firebase App Hosting は料金面では有利だが、請求に上限がない。設定ミスや急な利用増による想定外の請求のリスクを、自分で監視する必要がある。
- Netlify の無料プランは、開発中に本番デプロイを繰り返すとクレジットがすぐ尽きる。
- 収益化で費用を上回るのは数千人規模から（[monetization](2026-09-28-monetization.md)）。それまでは Vercel Hobby でも規約上の問題はない。
  - Vercel 独自のサービス（Vercel KV / Blob など）を使わなければ、後で他のホスティングへ移すのは比較的容易。
- 静的に書き出す構成は、最も安く、どこにでも置ける。
  - その代わり、Next.js のサーバー機能を使わず、ほぼすべてのデータ処理を BaaS に任せることになる。
  - BaaS の選定と強く結びつく。
