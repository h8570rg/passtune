# STATUS.md

> 今の状態だけを書く。過去の経緯は Git 履歴と Decision Log に任せる。目安 60 行以内。

Last updated: 2026-10-17

## Current Phase

Phase 12〜13: **本番（https://passtune.com）が稼働**。身内（リンクを知っている人）だけで使う段階。検索エンジンにはまだ載せない（[009](docs/decisions/009-search-engine-indexing.md)）。

## Current Goal

友人に招待リンクを送って使い始め、使ってみた気づきから改修する（改修は次のセッションから）。

## 本番環境（詳細は [admin](docs/technical/admin.md)）

- Vercel（東京 `hnd1`）＋ Supabase（東京）＋ Resend（`noreply@passtune.com`）＋ Cloudflare（DNS・`contact@passtune.com` の転送）
- ログイン: メールの 6 桁コード / Google（公開ステータスは本番）。Spotify は曲ページへ直接転送
- GitHub Actions: main のマイグレーションを本番に自動適用、毎日の停止防止、週 1 回のバックアップ（すべて動作確認済み）
- 本番で確認済み: メール・Google のログイン、投稿、試聴、Spotify の転送。未確認: 招待リンク、アイコン画像、フォロー・いいね・コメント、スマホ実機

## Recently Done（2026-10-11〜17）

- 手元でサービス完成（PR #6〜#13）、手元のメールに 6 桁コード（#14）、LP（#17）、招待リンクを UUID に（#20）
- 手元で Google・Spotify も動作（#21）、Spotify の英語表記のアーティスト名に対応（#24）
- 本番化: 身内だけの間は LP も noindex（#30）、問い合わせ先（#31）、バックアップ修正（#32）、Vercel を東京に（#34）
- アイコンを開発者作成のものに差し替え（#35）、友だち検索 `/search`（#36）
- テスト: Vitest 22 件、pgTAP 16 件、Playwright 10 件、CI
- 依存・Node.js・pnpm・GitHub Actions を最新にしてハッシュで固定、Renovate で conform-to をグループ化（#38。next 16.4.1 の重大なセキュリティ修正を含む）

## Key Findings

- Docker なしの手元 Supabase はメールテンプレート未対応 → メール送信フックで代替（[development](docs/technical/development.md)）
- 手元の Supabase は git ブランチごとに別スタック。切り替え時は `pnpm supabase:stop --all`
- 新しい Supabase プロジェクトは確認コードが 8 桁が初期値（6 桁に変更済み。[launch-checklist](docs/technical/launch-checklist.md)）
- Spotify の API は邦楽のアーティスト名を英語表記で返す（照合で吸収済み）

## Open Questions（開発者に確認したいこと）

- [OPEN] YouTube での投稿（聴きどころから聴かせる）。後で検討（[youtube-posting](docs/product/youtube-posting.md)）
- [OPEN] LP の文言の確認（[ui-design](docs/technical/ui-design.md) の「LP」）
- [OPEN] 利用規約・プライバシーポリシーの暫定版の確認（`app/(legal)/`。法的な助言は受けていない）
- [OPEN] 音楽サービスの公式ロゴ素材（今は文字ボタン）
- [OPEN] Spotify の開発モード（5 人まで）が、ログイン不要の検索にもかかるか（今は問題なく動いている）
- [OPEN] AI の判断で進めた事項の確認（再生回数の数え方、成功基準の代替指標、文字数など。2026-10-11 の報告）

## Next Actions

1. 開発者: 本番で未確認の機能（招待リンク・アイコン画像・フォロー・いいね・コメント）とスマホ実機（iPhone の Safari・LINE のアプリ内ブラウザ、Android、ホーム画面に追加）を確かめる
2. 開発者: 友人に招待リンクを送る（プロフィールの「招待リンクをコピー」）
3. 任意: Supabase の Redirect URLs に `https://*-h8570rgs-projects.vercel.app/**`（プレビューでのログイン用）、Vercel の Analytics / Speed Insights を有効化
4. 開発者: GitHub Actions の「本番 DB のバックアップ」を手動実行し、setup-cli v3（CLI を pnpm-lock.yaml のバージョンに固定）で動くことを確かめる
