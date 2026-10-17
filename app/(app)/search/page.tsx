import type { Metadata } from "next";
import { FollowButton } from "@/components/social/follow-button";
import { UserList } from "@/components/social/user-list";
import { getFolloweeIds, getRecentProfiles, searchProfiles } from "@/lib/data/social";
import { requireProfile } from "@/lib/data/user";
import { normalizeUserQuery } from "@/lib/utils/search";
import { SearchBox } from "./_components/search-box";

export const metadata: Metadata = { title: "友だちを探す" };

/** 友だち検索（ユーザー ID・表示名）。何も入力していないときは、最近はじめた人を出す */
export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const profile = await requireProfile("/search");
  const { q } = await searchParams;
  const query = normalizeUserQuery(typeof q === "string" ? q : null);
  const [users, followeeIds] = await Promise.all([
    query ? searchProfiles(query, profile.id) : getRecentProfiles(profile.id),
    getFolloweeIds(profile.id),
  ]);
  const following = new Set(followeeIds);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">友だちを探す</h1>
      <SearchBox defaultValue={query} />
      <section className="space-y-1">
        <h2 className="text-sm text-muted">{query ? "見つかった人" : "最近はじめた人"}</h2>
        <UserList
          users={users}
          emptyMessage={
            query
              ? "見つかりませんでした。ユーザー ID か表示名の一部で試してください。"
              : "まだほかの人がいません。招待リンクで友だちを誘いましょう。"
          }
          action={(user) => <FollowButton userId={user.id} following={following.has(user.id)} />}
        />
      </section>
    </div>
  );
}
