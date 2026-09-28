# 006: ホスティング（Next.js）

- Status: DECIDED
- Date: 2026-09-28
- Area: Technical
- Related: [nextjs-hosting](../research/2026-09-28-nextjs-hosting.md), [monetization](../research/2026-09-28-monetization.md), [005](005-platform.md), [007](007-baas-auth.md)

## Context

- Web のみ（PWA）で提供する（[005](005-platform.md)）。フレームワークは Next.js（開発者の希望）。
- 予算の目安は年 1 万円。1 人保守。今は収益化しないが、将来の収益化の道は塞がない（取り返しのつかない選択を避ける）。
- 収益化で費用を上回るのは、アクティブな利用者が数千人を超えてから（推測、[monetization](../research/2026-09-28-monetization.md)）。
- BaaS は別途比較して決める（[007](007-baas-auth.md)）。

## Options considered

[nextjs-hosting](../research/2026-09-28-nextjs-hosting.md) の比較表を参照。

| Option | 年間費用（この規模） | 商用 | 保守の手間 | 後から変更できるか |
|---|---|---|---|---|
| A. Vercel Hobby で始め、収益化するときに移行または Pro | 0 円 | 移行するまで不可 | 最小 | 可（Vercel 独自サービスを使わなければ） |
| B. Cloudflare Workers 有料（OpenNext） | 約 9,000 円 | 可 | 中（OpenNext の癖） | 可 |
| C. Firebase App Hosting | ほぼ 0 円 | 可 | 小〜中 | 可 |
| D. Netlify Free | 0 円 | 可 | 小 | 可 |
| E. 静的に書き出して Cloudflare 等 | 0 円 | 可 | 小 | 可（ただし BaaS 中心の構成になる） |

## Decision

A. Vercel Hobby で始める（開発者の決定、2026-09-28）。次の 2 つを守る。

- Vercel 独自のサービス（KV、Blob、Edge Config など）を使わず、他のホスティングへ移せる状態を保つ。
- 収益化（広告・アフィリエイト・課金）を始める前に、Vercel Pro か別のホスティングへ移る。寄付だけなら Hobby のままでよい。

## Why

- Next.js を最も手間なく動かせる。開発者の時間と保守の手間を最小にできる。
- 費用 0 円で予算の目安に収まる。
- 収益化が意味を持つ規模（数千人）はまだ先。移行できる状態を保てば、道は塞がない。
- 他の案の弱点:
  - B: 月 5 USD が必要で、OpenNext 特有の問題に対応する手間がある。
  - C: 請求に上限がない。
  - D: デプロイ回数で上限に達しやすい。
  - E: BaaS 次第で、Next.js の利点が薄れる。

## Tradeoffs / Consequences

- 収益化を始める時点で、移行作業か月 20 USD の費用が発生する。
- 「商用」の定義は広い（制作に関わる誰かが金銭的利益を得るもの）。Apple Music へのリンクにアフィリエイトの情報を付けた時点で商用になる。

## Revisit when

- 収益化（寄付以外）を始めるとき
- BaaS の選定（[007](007-baas-auth.md)）の結果、静的な書き出しや Firebase との組み合わせの方が合理的になったとき
- Vercel Hobby の無料枠（転送 100GB など）に近づいたとき
