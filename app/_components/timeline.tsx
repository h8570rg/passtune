import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { PostList } from "@/components/post/post-list";
import { getPostsByUsers } from "@/lib/data/post";
import { getFolloweeIds } from "@/lib/data/social";
import { getMyProfile } from "@/lib/data/user";

/** タイムライン（自分とフォロー中の人の投稿） */
export async function Timeline({ before }: { before: string | null }) {
  const profile = await getMyProfile();
  if (!profile) return null;

  const followeeIds = await getFolloweeIds(profile.id);
  const page = await getPostsByUsers([profile.id, ...followeeIds], before);

  return (
    <div className="space-y-2">
      <h1 className="sr-only">タイムライン</h1>
      {followeeIds.length === 0 ? (
        <div className="flex items-start gap-3 rounded-2xl bg-default/60 p-4 text-sm">
          <UsersIcon className="mt-0.5 size-5 shrink-0 text-accent" />
          <div className="space-y-1">
            <p className="font-medium">まだ誰もフォローしていません</p>
            <p className="text-muted">
              すでに使っている友人は「さがす」から見つけられます。まだの友人は、プロフィールの「招待リンクをコピー」から誘うと、登録したときに自動でつながります。
            </p>
            <div className="flex gap-4">
              <Link href="/search" className="text-accent underline">
                友だちを探す
              </Link>
              <Link href={`/u/${profile.handle}`} className="text-accent underline">
                プロフィールへ
              </Link>
            </div>
          </div>
        </div>
      ) : null}
      {page.posts.length === 0 ? (
        <div className="space-y-3 py-12 text-center text-sm text-muted">
          <p>まだ投稿がありません</p>
          <Link
            href="/new"
            className="inline-block rounded-full bg-accent px-4 py-2 text-accent-foreground"
          >
            最初の 1 曲を投稿する
          </Link>
        </div>
      ) : (
        <PostList page={page} viewerId={profile.id} basePath="/" />
      )}
    </div>
  );
}
