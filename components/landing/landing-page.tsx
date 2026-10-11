import {
  ChevronDownIcon,
  HeadphonesIcon,
  HeartIcon,
  LinkIcon,
  MessageCircleIcon,
  MusicIcon,
  PlayIcon,
  SearchIcon,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { OPERATOR_NAME, SERVICE_DESCRIPTION, SERVICE_NAME, SERVICE_NAME_KANA } from "@/lib/config";
import { getURL } from "@/lib/utils/url";

/**
 * LP（未ログインの `/`）。検索エンジンに載せる唯一のページ。
 * 構成と文言の意図は docs/technical/ui-design.md の「LP」。
 */

const SERVICES = [
  { name: "Apple Music", color: "#fa2d48" },
  { name: "Spotify", color: "#1ed760" },
  { name: "YouTube Music", color: "#ff0033" },
  { name: "LINE MUSIC", color: "#06c755" },
];

const PROBLEMS = [
  "X に貼っても、ほかの投稿に流されてしまう",
  "友だちと使っているサブスクが違って、聴いてもらえない",
  "口で勧めた曲は、あとで思い出せない",
];

const FEATURES = [
  {
    icon: MusicIcon,
    title: "1 曲と一言だけ、気軽に投稿",
    body: "曲名で検索して選び、ひとこと添えるだけ。長い文章もプレイリストもいりません。",
  },
  {
    icon: PlayIcon,
    title: "サービスが違っても、すぐ試聴",
    body: "届いた曲はタイムラインでそのまま試聴。気に入ったら、自分の音楽サービスで開けます。",
  },
  {
    icon: HeadphonesIcon,
    title: "どれだけ聴かれたか分かる",
    body: "自分の投稿が何回再生されたかを、自分だけが見られます。",
  },
  {
    icon: HeartIcon,
    title: "いいねとコメントで反応",
    body: "届いた曲に、いいねやひとことで返せます。",
  },
];

const STEPS = [
  { icon: SearchIcon, title: "曲名で検索", body: "届けたい曲を、曲名やアーティスト名で探します。" },
  { icon: SendIcon, title: "一言を添えて投稿", body: "「サビが最高」くらいの一言で十分です。" },
  {
    icon: HeadphonesIcon,
    title: "友だちがタイムラインで聴く",
    body: "フォローしている友だちに届き、その場で試聴できます。",
  },
];

const FAQS = [
  { q: "無料ですか？", a: "はい、無料で使えます。" },
  {
    q: "アプリのインストールは必要ですか？",
    a: "いりません。ブラウザで使えます。スマホのホーム画面に追加すると、アプリのように開けます。",
  },
  {
    q: "音楽サービスに登録していなくても使えますか？",
    a: "使えます。試聴は 30 秒のプレビュー（Apple 提供）で、どなたでも聴けます。最後まで聴くときは、お使いの音楽サービスで開きます。",
  },
  {
    q: "投稿は誰に見えますか？",
    a: "フォローしている人のタイムラインに届きます。投稿やプロフィールのページは、URL を知っていればログインなしでも見られます。検索エンジンには載りません。",
  },
  {
    q: "友だちを誘うには？",
    a: "プロフィールの「招待リンクをコピー」から、LINE などでリンクを送ってください。友だちが登録すると、あなたを自動でフォローします。",
  },
];

export function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SERVICE_NAME,
    alternateName: SERVICE_NAME_KANA,
    url: getURL(),
    description: SERVICE_DESCRIPTION,
    inLanguage: "ja",
  };

  return (
    <div className="min-h-dvh">
      {/* 構造化データ（サイト名）。Next.js の推奨どおり < をエスケープする */}
      <script
        type="application/ld+json"
        // oxlint-disable-next-line react/no-danger -- JSON-LD は script の中身として渡す必要がある。値はすべて定数
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {SERVICE_NAME}
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-default"
          >
            ログイン
          </Link>
        </div>
      </header>

      <main>
        {/* ヒーロー */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-120 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_65%)]"
            aria-hidden
          />
          <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:py-24">
            <div className="space-y-6 text-center md:text-left">
              <p className="text-sm font-medium text-accent">{SERVICE_DESCRIPTION}</p>
              <h1 className="text-4xl leading-tight font-bold tracking-tight md:text-5xl">
                好きな曲を、
                <br />
                友だちに 1 曲ずつ。
              </h1>
              <p className="mx-auto max-w-md leading-relaxed text-muted md:mx-0">
                {SERVICE_NAME}（{SERVICE_NAME_KANA}）は、好きな曲を 1 曲と一言で友だちに届ける SNS
                です。使っている音楽サービスが違っても、届いた曲はその場で試聴できます。
              </p>
              <div className="flex flex-col items-center gap-2 md:items-start">
                <Link
                  href="/login"
                  className="rounded-full bg-accent px-8 py-3 font-medium text-accent-foreground shadow-sm hover:opacity-90"
                >
                  無料ではじめる
                </Link>
                <p className="text-xs text-muted">
                  メールアドレスか Google アカウントで登録できます
                </p>
              </div>
              <ServiceList className="justify-center md:justify-start" />
            </div>
            <PostMock />
          </div>
        </section>

        {/* 課題 */}
        <section className="border-t border-border bg-default/30">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold">
              おすすめの曲、ちゃんと届いていますか？
            </h2>
            <ul className="mx-auto mt-8 grid max-w-3xl gap-3 md:grid-cols-3">
              {PROBLEMS.map((problem) => (
                <li
                  key={problem}
                  className="rounded-2xl border border-border bg-background p-5 text-sm leading-relaxed"
                >
                  {problem}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-sm text-muted">
              {SERVICE_NAME} は、友だちに曲を届けて、聴いてもらうための場所です。
            </p>
          </div>
        </section>

        {/* できること */}
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold">{SERVICE_NAME} でできること</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="space-y-1">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 使い方 */}
        <section className="border-t border-border bg-default/30">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold">使い方</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, body }, index) => (
                <li
                  key={title}
                  className="rounded-2xl border border-border bg-background p-6 text-center"
                >
                  <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-4 text-xs font-medium text-accent">STEP {index + 1}</p>
                  <h3 className="mt-1 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </li>
              ))}
            </ol>
            <p className="mx-auto mt-8 flex max-w-xl items-start justify-center gap-2 text-sm text-muted">
              <LinkIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
              友だちを誘うときは、招待リンクを送るだけ。登録すると自動でつながります。
            </p>
          </div>
        </section>

        {/* 対応サービス */}
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">対応している音楽サービス</h2>
          <ServiceList className="mt-8 justify-center" size="lg" />
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted">
            試聴は 30 秒のプレビュー（Apple
            提供）です。最後まで聴くときは、お使いの音楽サービスで開きます。
          </p>
        </section>

        {/* よくある質問 */}
        <section className="border-t border-border bg-default/30">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold">よくある質問</h2>
            <div className="mt-8 space-y-3">
              {FAQS.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-border bg-background px-5 py-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDownIcon
                      className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 最後の呼びかけ */}
        <section className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h2 className="text-2xl font-bold">さっそく、好きな曲を届けよう</h2>
          <p className="mt-3 text-sm text-muted">
            登録は 1 分。メールアドレスか Google アカウントで。
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-medium text-accent-foreground shadow-sm hover:opacity-90"
          >
            無料ではじめる
          </Link>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {SERVICE_NAME}（運営: {OPERATOR_NAME}）
          </p>
          <nav className="flex gap-4">
            <Link href="/terms" className="hover:underline">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:underline">
              プライバシーポリシー
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ServiceList({ className = "", size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="対応している音楽サービス">
      {SERVICES.map((service) => (
        <li
          key={service.name}
          className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-background font-medium ${
            size === "lg" ? "px-4 py-2 text-sm" : "px-3 py-1 text-xs"
          }`}
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: service.color }}
            aria-hidden
          />
          {service.name}
        </li>
      ))}
    </ul>
  );
}

/** 投稿カードの見本（装飾。実在の曲・ジャケット画像は使わない） */
function PostMock() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden>
      <div className="absolute -top-4 -right-3 left-6 h-full rotate-3 rounded-3xl border border-border bg-default/60" />
      <div className="relative space-y-3 rounded-3xl border border-border bg-background p-5 shadow-xl shadow-accent/10">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
            ゆ
          </span>
          <div className="text-sm leading-tight">
            <p className="font-semibold">ゆうき</p>
            <p className="text-xs text-muted">@yuki · 3 分前</p>
          </div>
        </div>
        <p className="text-[15px]">サビ前のベースラインがたまらない。夜のドライブにぜひ</p>
        <div className="rounded-2xl bg-default/60 p-3">
          <div className="flex items-center gap-3">
            <div className="size-16 shrink-0 rounded-lg bg-[linear-gradient(135deg,#5b5bd6,#c084fc_55%,#f472b6)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">夜明けのドライブ</p>
              <p className="truncate text-sm text-muted">サンプルアーティスト</p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <PlayIcon className="size-4 translate-x-px fill-current" />
            </span>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2">
          {SERVICES.map((service) => (
            <li
              key={service.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium"
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: service.color }} />
              {service.name}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <HeartIcon className="size-4 fill-danger text-danger" />5
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircleIcon className="size-4" />2
          </span>
          <span className="ml-auto inline-flex items-center gap-1">
            <HeadphonesIcon className="size-4" />
            12 回再生
          </span>
        </div>
      </div>
    </div>
  );
}
