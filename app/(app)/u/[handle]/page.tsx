import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post/post-card";
import { UserAvatar } from "@/components/user-avatar";
import { getPostsByUser } from "@/lib/data/post";
import { getAuthUser, getProfileByHandle } from "@/lib/data/user";

export async function generateMetadata({ params }: PageProps<"/u/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  return profile ? { title: `${profile.displayName}（@${profile.handle}）` } : {};
}

export default async function ProfilePage({ params }: PageProps<"/u/[handle]">) {
  const { handle } = await params;
  const profile = await getProfileByHandle(decodeURIComponent(handle));
  if (!profile) notFound();
  const [user, page] = await Promise.all([getAuthUser(), getPostsByUser(profile.id)]);
  const isMe = user?.id === profile.id;

  return (
    <div className="space-y-4">
      <section className="flex items-center gap-4 border-b border-border pb-4">
        <UserAvatar avatarUrl={profile.avatarUrl} name={profile.displayName} className="size-16" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold">{profile.displayName}</h1>
          <p className="text-sm text-muted">@{profile.handle}</p>
        </div>
        {isMe ? (
          <Link
            href="/settings"
            className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-default"
          >
            編集
          </Link>
        ) : null}
      </section>
      {page.posts.length === 0 ? (
        <div className="space-y-3 py-12 text-center text-sm text-muted">
          <p>まだ投稿がありません</p>
          {isMe ? (
            <Link
              href="/new"
              className="inline-block rounded-full bg-accent px-4 py-2 text-accent-foreground"
            >
              最初の 1 曲を投稿する
            </Link>
          ) : null}
        </div>
      ) : (
        <div>
          {page.posts.map((post) => (
            <PostCard key={post.id} post={post} viewerId={user?.id ?? null} />
          ))}
        </div>
      )}
    </div>
  );
}
