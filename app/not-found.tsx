import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-xl font-bold">ページが見つかりません</h1>
      <p className="text-sm text-muted">削除されたか、URL が間違っている可能性があります。</p>
      <Link href="/" className="rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground">
        ホームへ
      </Link>
    </main>
  );
}
