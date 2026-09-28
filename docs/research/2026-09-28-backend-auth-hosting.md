# バックエンド・ログイン方式・ホスティングの比較材料

- Date: 2026-09-28
- Phase: 9
- Question: Web のみ・1 人保守・年 1 万円で、BaaS・ログイン方式・ホスティングは何が合うか
- Related: [005](../decisions/005-platform.md), [006](../decisions/006-hosting.md), [007](../decisions/007-baas-auth.md), [ios-pwa-adoption](2026-09-28-ios-pwa-adoption.md)

## TL;DR

- **Supabase の無料プラン**
  - 1 週間アクセスがないと停止する。
  - 標準のメール送信は 1 時間に 2 通までで、本番では独自の SMTP（メール送信サービス）が必要。
  - 独自のログイン連携（OIDC）は使えるが、LINE ログインは署名方式の違いでそのままでは動かないという報告がある。
- **Firebase の無料プラン（Spark）**: Firestore 1GiB・読み取り 5 万回/日・書き込み 2 万回/日、認証 5 万 MAU。
- **Vercel の無料プラン（Hobby）は非商用の個人利用に限られる。** Cloudflare Workers の無料プランは、静的ファイルの配信が無料・無制限で、商用利用の制限は明記されていない。
- **メール送信の Resend は、無料で月 3,000 通（1 日 100 通まで）。**
- **Google ログインは、LINE などのアプリ内ブラウザでは失敗する**（[ios-pwa-adoption](2026-09-28-ios-pwa-adoption.md)）。メールで届く 6 桁のコードでのログインなら、ブラウザを問わず使える。

## Findings

### Facts（出典あり、確認日 2026-09-28）

- Supabase 無料プラン: DB 500MB、MAU 5 万、ストレージ 1GB、転送量 5GB、プロジェクト 2 つまで。1 週間アクセスがないと停止する。Pro は月 25 USD から（日次バックアップ付き）。[Supabase Pricing](https://supabase.com/pricing)
- Supabase は、メールのリンクに加え、メールで届く 6 桁のコード（OTP）でのログインに対応。[Supabase Docs: Passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- Supabase のメール送信の制限。[Supabase Docs: Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
  - 標準のメール送信は 1 時間に 2 通まで。開発・テスト用で、本番では独自の SMTP が必要。
  - 独自の SMTP の初期上限は 1 時間 30 通（設定で変更可）。
- Supabase の独自 OAuth / OIDC ログイン連携は、無料プランで 3 つまで。[Supabase Docs](https://supabase.com/docs/guides/auth/custom-oauth-providers)
  - LINE ログイン（Web）は署名方式が HS256 で、Supabase が対応する ES256 と合わずに失敗する、という報告がある。[Zenn（2026-03 頃）](https://zenn.dev/sasatech/articles/02b8fb72b45cdd?locale=en)
- Firebase 無料プラン（Spark）: Firestore 1GiB・読み取り 5 万回/日・書き込み 2 万回/日。認証 5 万 MAU（電話番号認証は有料）。Hosting 10GB・転送 360MB/日。[Firebase Pricing](https://firebase.google.com/pricing)
- Vercel Hobby は無料だが、「非商用の個人利用のみ」。Pro は月 20 USD / 人。[Vercel Docs](https://vercel.com/docs/plans/hobby)
- Cloudflare Workers の無料プラン: 1 日 10 万リクエスト、1 回あたり CPU 10ms。静的ファイルへのリクエストは無料・無制限。有料は月 5 USD から。[Cloudflare Docs](https://developers.cloudflare.com/workers/platform/pricing/)
- Resend の無料プラン: 月 3,000 通、1 日 100 通まで、独自ドメイン 1 つ。[Resend Docs](https://resend.com/docs/knowledge-base/what-is-resend-pricing)

### Inferences（推測）

- フォロー関係からタイムラインを作る SNS は、表どうしを結合できるリレーショナル DB（Supabase の Postgres）の方が素直に作れる。Firestore（NoSQL）では、タイムラインを作るためのデータ設計が複雑になりやすい。
- Supabase の「1 週間で停止」は、公開後に友人が使っていれば起きにくい。開発中は止まりうるが、管理画面から再開できる。
- Supabase 無料プランにはバックアップがない。定期的に DB の中身を書き出す仕組み（GitHub Actions などで無料）で補う必要がある。
- 独自の SMTP とメールの送信元に独自ドメインが要る。PWA としても独自ドメインが望ましい。ドメイン代（年 数千円）が主な固定費になる。
- 友人 20 人規模なら、Resend の無料枠（1 日 100 通）で足りる。
- Vercel Hobby は今の段階（非商用）なら使える。将来収益化するなら、Pro（月 20 USD）か別のホスティングへの移行が必要。

## Open / Next

- [OPEN] Supabase を停止させないためのアクセス（定期実行など）が規約上問題ないか
- [OPEN] Sign in with Apple を Web で使う場合に Apple Developer Program が必要か
