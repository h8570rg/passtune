# 一般公開する SNS の法的義務（初回調査）

- Date: 2026-09-28
- Phase: 5
- Question: 個人が日本で、誰でも登録できる音楽共有 SNS を運営するとき、最低限どんな義務が発生するか
- Related: [risks.md](../product/risks.md), [002](../decisions/002-audience-and-openness.md)
- 注意: AI による一般的な情報整理であり、法的助言ではない。公開前に一次資料で再確認し、必要なら専門家に相談する。

## TL;DR

- **個人情報保護法は、個人・非営利・少人数でも適用されうる**（取り扱う人数の要件は撤廃済み）。プライバシーポリシーの整備が前提になる。
- **特定の利用者同士だけでやりとりする DM 機能を持つと、電気通信事業の届出が必要になる。** 通信の秘密の義務も伴う。投稿を不特定多数が見る形の SNS は、一般に届出不要とされる。
- **届出不要の SNS でも、外部送信規律（2023-06-16 施行）の対象になる。** アクセス解析などで利用者の情報を外部に送る場合、その内容・送信先・目的を公表する必要がある。

## Findings

### Facts（出典あり）

- 個人情報保護法の「事業」は、営利・非営利を問わない。[個人情報保護委員会 FAQ](https://www.ppc.go.jp/all_faq_index/faq1-q1-54/)（確認日 2026-09-28）
- 取り扱う個人情報が 5,000 人以下なら対象外、という要件は撤廃されている。[契約ウォッチ](https://keiyaku-watch.jp/media/hourei/kojinjoho-toriatukai/)（二次情報、確認日 2026-09-28）
- SNS は、一般的には他人の通信を媒介しないため、登録・届出が不要な事業（いわゆる第三号事業）に該当する。一方、特定の利用者間のみでやりとりできる DM 機能は他人の通信の媒介にあたり、届出が必要になる。[総務省 電気通信事業参入マニュアル［追補版］](https://www.soumu.go.jp/main_content/000477428.pdf)（確認日 2026-09-28。内容は検索結果の要約経由で確認）
- DM 機能で届出を行った場合、通信の秘密の保護などの義務が生じる。[Web Lawyers](https://web-lawyers.net/chat_telecommunications_business_law/)（二次情報、確認日 2026-09-28）
- 外部送信規律は、届出の有無を問わず、利用者が投稿した情報を不特定多数が閲覧できる SNS なども対象になる。義務の内容は、送信される情報・送信先・利用目的の「通知または公表」「同意取得」「オプトアウト」のいずれか。[Priv Lab](https://privtech.co.jp/blog/law/guidelines-revised-telecommunications-business-law.html)（二次情報、確認日 2026-09-28）

### Inferences（推測）

- DM を持たず、投稿へのコメントを公開の形に限れば、届出は不要な範囲に収まる可能性が高い。
  - ただし、「知り合い中心」の設計で投稿やコメントの公開範囲を絞った場合（例: フォロワー限定）、それが「特定の利用者間の通信」とみなされるかは要確認。
- 必要な文書は、最低限「利用規約」と「プライバシーポリシー（外部送信の公表を含む）」。
- 誰でも登録できる以上、不適切な投稿・コメントへの通報と削除の手段、およびブロック機能は、公開時点で最低限必要になる（法的義務というより運営上の必要）。

## Open / Next

- [OPEN] フォロワー限定などの公開範囲の制限が、「他人の通信の媒介」に当たるかどうか（公開の形を決める Phase 7〜8 で再確認）
- [OPEN] 未成年の利用をどう扱うか（年齢制限を設けるか）
- [OPEN] 利用規約・プライバシーポリシーのひな形の入手先

## Sources

- [個人情報保護委員会 FAQ（非営利団体への適用）](https://www.ppc.go.jp/all_faq_index/faq1-q1-54/) — 確認日 2026-09-28
- [契約ウォッチ: 個人情報取扱事業者とは](https://keiyaku-watch.jp/media/hourei/kojinjoho-toriatukai/) — 確認日 2026-09-28
- [総務省: 電気通信事業参入マニュアル［追補版］](https://www.soumu.go.jp/main_content/000477428.pdf) — 確認日 2026-09-28
- [Web Lawyers: チャット・メッセージ機能の電気通信事業法対応](https://web-lawyers.net/chat_telecommunications_business_law/) — 確認日 2026-09-28
- [Priv Lab: 外部送信規律](https://privtech.co.jp/blog/law/guidelines-revised-telecommunications-business-law.html) — 確認日 2026-09-28
