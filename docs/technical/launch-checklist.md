# Launch Checklist（公開前にやること）

- Phase: 11 → 13
- Last updated: 2026-10-11
- 2026-10-11 時点で、手元（ローカル）ではサービスが完成している。以下は、本番に出すまでに必要な設定と確認。
- 進み具合: ✅ は完了（2026-10-17 時点）。残りは本番での動作確認（開発者のログイン）、Vercel のプレビュー用の Redirect URL、Analytics、ロゴ素材。
- 担当: 「開発者」は開発者のアカウントでの作業、「AI」は値をもらえれば AI が行える作業。

## 1. 認証情報と外部サービスの設定

| # | 項目 | 担当 | やること | 使う場所 |
|---|---|---|---|---|
| 1 | ✅ Supabase 本番プロジェクト | 開発者 | 既存プロジェクトを 1 つ一時停止してから、新規作成（リージョンは東京） | 全体 |
| 2 | ✅ Supabase の値 | 開発者 → AI | Project URL、Publishable key、Project ID、DB パスワード、Access Token | Vercel の環境変数、GitHub Actions |
| 3 | ✅ マイグレーションの適用 | AI | `supabase link` → `supabase db push`（以降は GitHub Actions が自動で適用） | 本番 DB |
| 4 | ✅ メールテンプレート | 開発者 | Supabase 管理画面の Authentication → Email Templates の「Magic Link」と「Confirm signup」に `supabase/templates/otp.html` の内容を設定（件名: Passtune の確認コード） | ログイン |
| 5 | ✅ URL 設定 | 開発者 | Authentication → URL Configuration: Site URL を `https://<ドメイン>`、Redirect URLs に `https://<ドメイン>/auth/callback` と Vercel のプレビュー URL（`https://*-<アカウント>.vercel.app/auth/callback`） | ログイン |
| 6 | ✅ Resend | 開発者 | アカウント作成、独自ドメインの DNS 認証、API キー発行 → Supabase の Authentication → SMTP Settings に設定（送信元: `noreply@<ドメイン>`）。レート制限（既定 30 通/時）を確認 | 確認コードのメール |
| 7 | ✅ Google ログイン | 開発者 | Google Cloud で OAuth クライアント（ウェブ）を作成。承認済みのリダイレクト URI に `https://<Supabase の Project URL>/auth/v1/callback`。Client ID / Secret を Supabase の Authentication → Providers → Google に設定。手元でも使うなら `http://127.0.0.1:54421/auth/v1/callback` も追加（[development](development.md)）。公開前に Google Auth Platform の公開ステータスを「本番」にする（「テスト」のままだとテストユーザーしかログインできない） | ログイン |
| 8 | Spotify | 開発者 → AI | Spotify for Developers でアプリを登録（Premium のアカウントで）。Client ID / Secret を Vercel の環境変数 `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` に設定 | Spotify の曲ページへの転送 |
| 9 | ✅ Vercel | 開発者 | プロジェクトを作成して GitHub と連携。環境変数: `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`、`NEXT_PUBLIC_SITE_URL`（本番のみ `https://<ドメイン>`）、`SPOTIFY_CLIENT_ID`、`SPOTIFY_CLIENT_SECRET` | 配信 |
| 10 | ✅ ドメイン | 開発者 | Vercel にドメインを設定 | 配信・メール |
| 11 | ✅ GitHub Actions | 開発者 | Variables: `SUPABASE_PROJECT_ID`、`SUPABASE_URL`、`SUPABASE_PUBLISHABLE_KEY`。Secrets: `SUPABASE_ACCESS_TOKEN`、`SUPABASE_DB_PASSWORD` | 自動マイグレーション・停止防止・バックアップ |
| 12 | Vercel Analytics | 開発者 | Vercel の管理画面で Web Analytics と Speed Insights を有効化 | 計測 |
| 12a | ✅ 検索エンジン | 開発者 | **身内だけで使う間は何もしない**（全ページ noindex）。公開すると決めたら、Vercel の本番の環境変数に `SEARCH_INDEXING=enabled` を入れて再デプロイ（[009](../decisions/009-search-engine-indexing.md)） | 検索 |
| 12b | Google Search Console（公開時・任意） | 開発者 | ドメインを登録し、`https://<ドメイン>/sitemap.xml` を送信する。LP が検索に早く載る。`NEXT_PUBLIC_SITE_URL` が本番のドメインになっていること（robots.txt・sitemap・OGP の URL に使う） | 検索 |

## 2. 内容の確認・差し替え

| # | 項目 | 担当 | やること |
|---|---|---|---|
| 13 | ✅ 問い合わせ先 | 開発者 | `contact@passtune.com`（2026-10-17 決定。`lib/config.ts` は差し替え済み）。Cloudflare の Email → Email Routing で、開発者の普段のアドレスへの転送を設定する |
| 14 | 利用規約・プライバシーポリシー | 開発者 | 暫定版（`app/(legal)/`）を確認。法的な助言は受けていない |
| 14b | LP の文言 | 開発者 | `components/landing/landing-page.tsx` の文言を確認（AI の起案） |
| 15 | 音楽サービスのロゴ | 開発者 | 各社の公式素材（Apple Music のバッジ、Spotify・YouTube Music・LINE MUSIC のロゴ）を入手し、利用条件を確認したうえで AI に渡す。今は文字ボタンで代用（`components/post/service-buttons.tsx`） |
| 16 | Spotify の照合精度 | 開発者 | よく聴く曲を投稿し、「Spotify」で正しい曲ページが開くか確かめる |
| 17 | スマホ実機 | 開発者 | iPhone（Safari、LINE のアプリ内ブラウザ）と Android で、ログイン・試聴・ホーム画面への追加・招待リンクを確かめる |

## 3. 公開

- 友人に招待リンク（プロフィールの「招待リンクをコピー」）を送る。
- 公開後は [admin](admin.md) の計測の SQL で、[mvp](../product/mvp.md) の「確かめたいこと」を見る。
