# BaaS の比較

- Date: 2026-09-28
- Phase: 9
- Question: Next.js（Vercel）と組み合わせる BaaS として、1 人保守・バックエンド経験が少ない・年 1 万円の条件で何が合うか
- Related: [007](../decisions/007-baas-auth.md), [backend-auth-hosting](2026-09-28-backend-auth-hosting.md), [006](../decisions/006-hosting.md)

## TL;DR

| | データの形との相性 | ログイン | 無料枠の主な上限 | 停止・消失のリスク | 乗り換えやすさ |
|---|---|---|---|---|---|
| **Supabase** | ◎ リレーショナル（Postgres） | メールの 6 桁コード・Google など標準対応 | DB 500MB、転送 5GB、MAU 5 万 | 1 週間無操作で停止。バックアップなし | ○ DB は標準の Postgres。認証は Supabase 依存 |
| Firebase | △ NoSQL（タイムラインの設計が複雑） | Google 等は標準。メールはリンク方式が標準（6 桁コードは要確認） | Firestore 1GiB、読み取り 5 万回/日 | 停止なし | × Google 独自の DB |
| Convex | ○ TypeScript で書ける独自 DB。リアルタイム更新が得意 | 別途の認証の仕組みが必要 | 関数呼び出し 100 万回、DB 0.5GB、転送 1GB | 無料プランの商用可否・停止条件は未確認 | × 独自 DB |
| Neon ＋ 自前の認証（Better Auth 等） | ◎ リレーショナル（Postgres） | ライブラリで自由に実装 | ストレージ 0.5GB、計算 100 時間、転送 5GB。Auth は MAU 6 万 | 5 分でスリープ（次のアクセスで復帰）。枠を使い切ると翌月まで停止 | ◎ 標準の Postgres ＋オープンソースの認証 |
| Appwrite | ○ 複数の DB を選べる | 標準対応 | 詳細は未確認 | 未確認 | △ |

## Findings

### Facts（出典あり、確認日 2026-09-28）

- Supabase: 無料プランは DB 500MB、MAU 5 万、ストレージ 1GB、転送 5GB。1 週間アクセスがないと停止。Pro は月 25 USD から。無料プランでも商用可。[Supabase Pricing](https://supabase.com/pricing), [Discussion #21044](https://github.com/orgs/supabase/discussions/21044)
- Firebase: 無料プラン（Spark）は Firestore 1GiB・読み取り 5 万回/日・書き込み 2 万回/日、認証 5 万 MAU。[Firebase Pricing](https://firebase.google.com/pricing)
- Convex: 無料プランは関数呼び出し 100 万回、DB 0.5GB、ファイル 1GB、転送 1GB。Professional は開発者 1 人あたり月 25 USD。[Convex Pricing](https://www.convex.dev/pricing)
- Neon: [Neon Pricing](https://neon.com/pricing)
  - 無料プランは、1 プロジェクトあたりストレージ 0.5GB、計算 100 時間、転送 5GB。Auth は MAU 6 万。
  - 5 分で自動スリープ（必須）。計算時間か転送を使い切ると、翌月まで停止する。
  - 有料は使った分だけで、月額の最低料金なし。
- Appwrite: 従量課金型のデータベースは固定費 0 USD で、月 10 USD 分の計算クレジット付き。無料プランの詳細な上限は、今回の取得範囲では確認できず。[Appwrite Pricing](https://appwrite.io/pricing)

### Inferences（推測）

- フォロー・タイムライン・いいね・コメントは、表どうしを結合できるリレーショナル DB の方が素直に作れる。Supabase と Neon が有利。
- バックエンドの経験が少ない場合、DB・認証・アクセス制御（誰がどのデータを読み書きできるか）が一体になった BaaS の方が、自分で書くコードが少ない。
  - Supabase は、アクセス制御を DB の行ごとのルール（RLS）で書ける。サーバー側のコードを最小にできる。
  - Neon ＋ 自前の認証は、乗り換えやすさでは最良。ただし、認証とアクセス制御を自分のコード（Next.js のサーバー側）で書く量が増える。
- Supabase の「1 週間で停止」は、公開後に友人が使っていれば起きにくい。開発中に止まっても、管理画面から再開できる。
- Firebase と Convex は独自 DB のため、乗り換えるときは作り直しに近い。

## Open / Next

- [OPEN] Firebase Auth で、メールの 6 桁コードによるログインが標準でできるか
- [OPEN] Convex・Appwrite の無料プランの停止条件と商用可否
