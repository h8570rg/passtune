import Link from "next/link";
import { SERVICE_DESCRIPTION, SERVICE_NAME } from "@/lib/config";
import { getMyProfile } from "@/lib/data/user";

export default async function HomePage() {
  const profile = await getMyProfile();
  if (!profile) return <Landing />;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">タイムライン</h1>
      <p className="text-sm text-muted">準備中</p>
    </div>
  );
}

function Landing() {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-3xl font-bold">{SERVICE_NAME}</h1>
      <p className="max-w-xs text-muted">
        {SERVICE_DESCRIPTION}。使っている音楽サービスが違っても、すぐ試聴できます。
      </p>
      <Link
        href="/login"
        className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground"
      >
        はじめる
      </Link>
    </section>
  );
}
