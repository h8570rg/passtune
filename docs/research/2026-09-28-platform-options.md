# Web / ネイティブの比較材料

- Date: 2026-09-28
- Phase: 9
- Question: iPhone と Android の両方で、年 1 万円程度の予算・1 人保守で提供するなら、Web とネイティブアプリのどちらが合うか
- Related: [mvp](../product/mvp.md), [business](../business/business-model.md), [音楽 API 調査](2026-09-28-music-api-feasibility.md)

## TL;DR

- **iPhone の Web アプリでも、プッシュ通知は受け取れる**（iOS 16.4 以降）。ただし、ホーム画面に追加したときのみ（EU 以外）。
- **ネイティブで配布する場合の費用と壁:**
  - Apple Developer Program: 年 約 12,980 円
  - Google Play: 登録料が一度だけかかる
  - Google Play の新しい個人アカウントは、12 人以上のテスターによる 14 日間のクローズドテストが本番公開の条件。これは「MVP は開発者だけで評価する」方針と衝突する。

## Findings

### Facts（出典あり）

- iOS / iPadOS 16.4 以降、ホーム画面に追加した Web アプリは Web Push を受け取れる。通知の許可を求められるのは、利用者の操作（ボタンを押すなど）に応じたときのみ。[WebKit Blog](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)（確認日 2026-09-28）
- iOS 26 では、ホーム画面に追加したサイトは既定で Web アプリとして開く。EU では iOS 17.4 以降、ホーム画面 Web アプリの Push が使えない。[MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)（二次情報、確認日 2026-09-28）
- 2023-11-13 以降に作成された Google Play の個人デベロッパーアカウントは、本番公開の前に、12 人以上のテスターが 14 日間続けて参加したクローズドテストを行う必要がある（2024-12 に 20 人から 12 人に緩和）。[Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)（確認日 2026-09-28）
- Apple Developer Program は年 99 USD（日本では 12,980 円前後）。[Apple](https://developer.apple.com/programs/whats-included/)（[音楽 API 調査](2026-09-28-music-api-feasibility.md) 参照）

### Inferences（推測）

- Web なら、iPhone と Android の両方に 1 つのコードで届き、ストアの費用・審査・テスター要件がない。
- Web なら、ログインなしでの閲覧（X のように URL で投稿を見られる）が自然に実現できる。開発者は「Web であれば含めてよい」と回答済み。
- Web の弱点は、iPhone で通知を受けるにはホーム画面への追加が必要なこと。ただし通知は MVP の範囲外で、開発者の使い方も「暇なときに開く」が中心なので、影響は小さい。
- 試聴（30 秒の音声再生）は利用者がタップして始めるため、ブラウザの自動再生制限には当たらない。
- Web で作っておけば、後からネイティブアプリ化（Web を包む、または作り直す）する道は残る。逆（ネイティブから Web）は作り直しに近い。

## Open / Next

- [OPEN] ホーム画面に追加した Web アプリでの、音声再生の挙動（画面ロック時など）。試聴用途では重要度は低い。
