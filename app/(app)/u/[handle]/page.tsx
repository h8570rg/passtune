import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { PostList } from "@/components/post/post-list";
import { FollowButton } from "@/components/social/follow-button";
import { InviteLinkButton } from "@/components/social/invite-link-button";
import { UserAvatar } from "@/components/user-avatar";
import { getPostsByUser } from "@/lib/data/post";
import { getFollowCounts, isFollowing } from "@/lib/data/social";
import { getAuthUser, getProfileByHandle } from "@/lib/data/user";

export async function generateMetadata({ params }: PageProps<"/u/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfileByHandle(decodeURIComponent(handle));
  return profile ? { title: `${profile.displayName}（@${profile.handle}）` } : {};
}

export default async function ProfilePage({ params, searchParams }: PageProps<"/u/[handle]">) {
  const { handle } = await params;
  const { before, invited } = await searchParams;
  const profile = await getProfileByHandle(decodeURIComponent(handle));
  if (!profile) notFound();
  // 大文字を含む URL などは、正しい表記の URL にそろえる
  if (decodeURIComponent(handle) !== profile.handle) {
    const query = new URLSearchParams(
      Object.entries(await searchParams).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    ).toString();
    permanentRedirect(`/u/${profile.handle}${query ? `?${query}` : ""}`);
  }
  const user = await getAuthUser();
  const isMe = user?.id === profile.id;
  const [page, counts, following] = await Promise.all([
    getPostsByUser(profile.id, typeof before === "string" ? before : null),
    getFollowCounts(profile.id),
    user && !isMe ? isFollowing(user.id, profile.id) : Promise.resolve(false),
  ]);

  return (
    <div className="space-y-2">
      {invited && !user ? (
        <div className="rounded-2xl bg-accent/10 p-4 text-sm">
          <p className="font-medium">{profile.displayName} さんから Passtune に招待されました</p>
          <p className="mt-1 text-muted">
            登録すると {profile.displayName}{" "}
            さんを自動でフォローし、おすすめの曲がタイムラインに届きます。
          </p>
          <Link
            href={`/login?next=${encodeURIComponent("/")}`}
            className="mt-3 inline-block rounded-full bg-accent px-4 py-2 font-medium text-accent-foreground"
          >
            登録してはじめる
          </Link>
        </div>
      ) : null}
      <section className="space-y-3 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <UserAvatar
            avatarUrl={profile.avatarUrl}
            name={profile.displayName}
            className="size-16"
          />
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
          ) : user ? (
            <FollowButton userId={profile.id} following={following} />
          ) : (
            <Link
              href={`/login?next=${encodeURIComponent(`/u/${profile.handle}`)}`}
              className="rounded-full bg-accent px-4 py-1.5 text-sm text-accent-foreground"
            >
              フォローする
            </Link>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href={`/u/${profile.handle}/following`} className="hover:underline">
            <span className="font-bold">{counts.following}</span>{" "}
            <span className="text-muted">フォロー中</span>
          </Link>
          <Link href={`/u/${profile.handle}/followers`} className="hover:underline">
            <span className="font-bold">{counts.followers}</span>{" "}
            <span className="text-muted">フォロワー</span>
          </Link>
          {isMe ? (
            <span className="ml-auto">
              <InviteLinkButton userId={profile.id} />
            </span>
          ) : null}
        </div>
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
        <PostList page={page} viewerId={user?.id ?? null} basePath={`/u/${profile.handle}`} />
      )}
    </div>
  );
}
