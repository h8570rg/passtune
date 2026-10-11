import Link from "next/link";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { UserAvatar } from "@/components/user-avatar";
import { SERVICE_NAME } from "@/lib/config";
import { getAuthUser, getMyProfile } from "@/lib/data/user";

/**
 * アプリの共通レイアウト。ログインなしでも投稿・プロフィールは見られる。
 * ログイン済みでプロフィール未作成なら、オンボーディングへ送る。
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await getAuthUser();
  const profile = user ? await getMyProfile() : null;
  if (user && !profile) redirect("/onboarding");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            {SERVICE_NAME}
          </Link>
          {profile ? (
            <Link href="/settings" aria-label="設定">
              <UserAvatar avatarUrl={profile.avatarUrl} name={profile.displayName} size="sm" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground"
            >
              ログイン
            </Link>
          )}
        </div>
      </header>
      <div className="mx-auto flex max-w-4xl gap-8 px-4 md:py-6">
        {profile ? (
          <aside className="hidden w-48 shrink-0 md:block">
            <AppNav handle={profile.handle} variant="side" />
          </aside>
        ) : null}
        <main className="w-full max-w-xl min-w-0 flex-1 py-4 pb-24 md:pb-8">{children}</main>
      </div>
      {profile ? <AppNav handle={profile.handle} variant="tabs" /> : null}
    </div>
  );
}
