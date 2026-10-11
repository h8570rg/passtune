import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { UserList } from "@/components/social/user-list";
import { getFollowers } from "@/lib/data/social";
import { getProfileByHandle } from "@/lib/data/user";

export const metadata: Metadata = { title: "フォロワー" };

export default async function Page({ params }: PageProps<"/u/[handle]/followers">) {
  const { handle } = await params;
  const profile = await getProfileByHandle(decodeURIComponent(handle));
  if (!profile) notFound();
  if (decodeURIComponent(handle) !== profile.handle)
    permanentRedirect(`/u/${profile.handle}/followers`);
  const users = await getFollowers(profile.id);
  return (
    <div className="space-y-2">
      <h1 className="text-lg font-bold">
        <Link href={`/u/${profile.handle}`} className="hover:underline">
          {profile.displayName}
        </Link>
        <span className="text-muted"> のフォロワー</span>
      </h1>
      <UserList users={users} emptyMessage="まだフォロワーはいません" />
    </div>
  );
}
