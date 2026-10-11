import type { Metadata } from "next";
import { CONTACT_EMAIL, OPERATOR_NAME, SERVICE_NAME } from "@/lib/config";

export const metadata: Metadata = { title: "プライバシーポリシー" };

// TODO(launch): 公開前に内容を見直す（docs/technical/launch-checklist.md）。法的な助言に基づくものではない。
export default function PrivacyPage() {
  return (
    <>
      <h1>プライバシーポリシー</h1>
      <p>
        {OPERATOR_NAME}（以下「運営者」）は、「{SERVICE_NAME}
        」（以下「本サービス」）における利用者の個人情報を、次のとおり取り扱います。
      </p>
      <h2>1. 取得する情報</h2>
      <ul>
        <li>
          メールアドレス（登録・ログインのため）。Google でログインした場合は、Google
          から提供されるメールアドレス等
        </li>
        <li>ユーザー ID、表示名、アイコン画像（利用者が登録したもの）</li>
        <li>投稿、コメント、いいね、フォローの情報</li>
        <li>投稿の延べ再生回数、本サービスを利用した日付（サービス改善のための集計に使います）</li>
        <li>アクセス解析のための閲覧情報（下記 4.）</li>
      </ul>
      <h2>2. 利用目的</h2>
      <ul>
        <li>本サービスの提供、本人確認、ログインのための確認コードの送信</li>
        <li>不正利用の防止、お問い合わせへの対応</li>
        <li>利用状況の集計による、本サービスの改善</li>
      </ul>
      <h2>3. 第三者への提供と委託</h2>
      <p>
        法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。本サービスの運営のため、次の事業者のサービスを利用しています。
      </p>
      <ul>
        <li>Supabase（データベース・認証・画像の保存）</li>
        <li>Vercel（アプリケーションの配信・アクセス解析）</li>
        <li>Resend（確認コードのメール送信）</li>
        <li>Google（Google アカウントでのログイン）</li>
      </ul>
      <h2>4. 外部送信（電気通信事業法に基づく公表）</h2>
      <p>本サービスは、次の情報を外部の事業者に送信します。</p>
      <ul>
        <li>
          Vercel Analytics・Speed Insights（Vercel Inc.）: 閲覧したページの
          URL、参照元、端末・ブラウザの種類、表示速度などの情報。アクセス状況の把握と表示速度の改善のため。
        </li>
        <li>
          iTunes Search API（Apple Inc.）: 楽曲の検索語、楽曲の
          ID。楽曲の検索・情報表示・試聴のため（試聴音源とジャケット画像は Apple
          から直接配信されます）。
        </li>
      </ul>
      <h2>5. 開示・訂正・削除</h2>
      <p>
        プロフィールと投稿・コメントは、本サービス上で利用者自身が変更・削除できます。アカウントの削除などのご希望は、下記の連絡先までご連絡ください。
      </p>
      <h2>6. お問い合わせ</h2>
      <p>
        運営者: {OPERATOR_NAME}
        <br />
        連絡先: {CONTACT_EMAIL}
      </p>
      <p className="text-muted">制定日: 2026 年 10 月 11 日（公開前の暫定版）</p>
    </>
  );
}
