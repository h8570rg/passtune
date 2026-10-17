import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SERVICE_NAME } from "@/lib/config";
import { getAuthUser } from "@/lib/data/user";
import { safeNextPath } from "@/lib/utils/redirect";
import { LoginFlow } from "./_components/login-flow";

export const metadata: Metadata = { title: "ログイン" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : null;
  if (await getAuthUser()) redirect(safeNextPath(nextPath));

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-8 px-4 py-12">
      <div className="space-y-2 text-center">
        <Link href="/" className="inline-flex flex-col items-center gap-3 text-2xl font-bold">
          <Image
            src="/brand/icon.svg"
            alt=""
            width={56}
            height={56}
            unoptimized
            className="size-14"
          />
          {SERVICE_NAME}
        </Link>
        <p className="text-sm text-muted">ログイン / 新規登録</p>
      </div>
      <LoginFlow next={nextPath} />
      <p className="text-center text-xs text-muted">
        続けると、
        <Link href="/terms" className="underline">
          利用規約
        </Link>
        と
        <Link href="/privacy" className="underline">
          プライバシーポリシー
        </Link>
        に同意したものとみなします。
      </p>
    </main>
  );
}
