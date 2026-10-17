# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-10-17

## Current Phase

Phase 11 完了間近: **手元（ローカル）でサービスが完成**（環境変数・外部サービスの認証情報を除く）。次は開発者の MVP 評価（Phase 12）と公開準備（M7 / Phase 13）。

## Current Goal

本番化して、身内（リンクを知っている人）だけで使い始める。検索エンジンにはまだ載せない（[009](docs/decisions/009-search-engine-indexing.md)）。進み具合は [launch-checklist](docs/technical/launch-checklist.md)。

- 2026-10-17: https://passtune.com で本番が動いた（Supabase・Resend・Google・Vercel・Cloudflare の DNS とメール転送）。次は本番での動作確認（ログイン・投稿・Spotify・招待）

## Recently Done（2026-10-11、AI が開発者の指示で一気に実装）

- M1 ログイン（メールの 6 桁コード / Google）とプロフィール（アイコン画像つき）: PR #7
- M2・M3 投稿・試聴・再生回数・各サービスで開く・Spotify への転送: PR #8
- M4 フォロー・タイムライン・いいね・コメント・反応: PR #9
- M5・M6 招待リンク・PWA・ホーム画面追加の案内・規約・CI / バックアップ: PR #12、サンプルデータ: PR #13
- DB 設計（Supabase のベストプラクティス）・RLS テスト: PR #6（[database](docs/technical/database.md)）
- UI 設計（モデルベース UI デザイン）: [ui-design](docs/technical/ui-design.md)
- 手元の Supabase を Docker なしに（Supabase CLI のネイティブ実行、アルファ版）: [development](docs/technical/development.md)
- 2026-10-17: アイコンを開発者作成のものに差し替え（PR #35）、友だち検索（`/search`）を追加
- 検索エンジンに載せるのは LP だけ（[009](docs/decisions/009-search-engine-indexing.md)）。LP を作成
- テスト: Vitest 10 件、pgTAP 16 件、Playwright 9 件、CI（GitHub Actions）

## Key Findings（開発中に分かったこと）

- Docker なしの手元 Supabase はメールテンプレートのファイル指定に未対応 → メール送信フックで、手元でも 6 桁コード入りのメールを送るようにした（[development](docs/technical/development.md)）
- 手元の Supabase は git ブランチごとに別スタック。切り替え時は `pnpm supabase:stop --all`
- GitHub のシークレット検知が手元 Supabase の既定キーも止める → E2E はキーを `supabase status` から読む

## Open Questions（開発者に確認したいこと）

- [OPEN] YouTube での投稿（聴きどころから聴かせる）: 投稿の主役・再生の方式・Shorts・試作の可否（[youtube-posting](docs/product/youtube-posting.md)）
- [OPEN] LP の文言の確認（[ui-design](docs/technical/ui-design.md) の「LP」）
- [OPEN] 判断して進めた事項の確認（下記の一覧は、2026-10-11 の AI の報告を参照）
- [OPEN] 音楽サービスの公式ロゴ素材の入手（今は文字ボタン）
- [OPEN] Spotify の開発モードで、ログイン不要の方式がユーザー数の上限に数えられないか（アプリ登録後に確認）
- [OPEN] YouTube Music を曲ページへ直接飛ばす改善（YouTube Data API）の可否

## Blockers

なし（公開には開発者の認証情報・設定が必要）

## Next Actions

1. 開発者: 手元で MVP を触って評価する（`pnpm dev` → http://localhost:3000、[development](docs/technical/development.md)）
2. 開発者: [launch-checklist](docs/technical/launch-checklist.md) の認証情報・設定をそろえ、AI に値を渡す
3. AI: 受け取った値で本番環境を設定し、公開前の確認を手伝う
