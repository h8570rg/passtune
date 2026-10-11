import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { UserList } from "@/components/social/user-list";
import { getFollowing } from "@/lib/data/social";
import { getProfileByHandle } from "@/lib/data/user";

export const metadata: Metadata = { title: "フォロー中" };

export default async function Page({ params }: PageProps<"/u/[handle]/following">) {
  const { handle } = await params;
  const profile = await getProfileByHandle(decodeURIComponent(handle));
  if (!profile) notFound();
  if (decodeURIComponent(handle) !== profile.handle)
    permanentRedirect(`/u/${profile.handle}/following`);
  const users = await getFollowing(profile.id);
  return (
    <div className="space-y-2">
      <h1 className="text-lg font-bold">
        <Link href={`/u/${profile.handle}`} className="hover:underline">
          {profile.displayName}
        </Link>
        <span className="text-muted"> のフォロー中</span>
      </h1>
      <UserList users={users} emptyMessage="まだ誰もフォローしていません" />
    </div>
  );
}
