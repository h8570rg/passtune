import { HeartIcon, MessageCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import { getActivities } from "@/lib/data/social";
import { requireProfile } from "@/lib/data/user";
import { formatRelativeTime } from "@/lib/utils/date";

export const metadata: Metadata = { title: "反応" };

/** 自分の投稿へのいいね・コメント（新しい順） */
export default async function ActivityPage() {
  const profile = await requireProfile("/activity");
  const activities = await getActivities(profile.id);

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-bold">反応</h1>
      {activities.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">まだ反応はありません</p>
      ) : (
        <ul className="divide-y divide-border">
          {activities.map((activity) => (
            <li key={activity.id}>
              <Link
                href={`/posts/${activity.post.id}`}
                className="flex gap-3 py-3 hover:bg-default/40"
              >
                <div className="relative shrink-0">
                  <UserAvatar
                    avatarUrl={activity.actor.avatarUrl}
                    name={activity.actor.displayName}
                    size="sm"
                  />
                  <span className="absolute -right-1 -bottom-1 rounded-full bg-background p-0.5">
                    {activity.kind === "like" ? (
                      <HeartIcon className="size-3.5 fill-danger text-danger" />
                    ) : (
                      <MessageCircleIcon className="size-3.5 text-accent" />
                    )}
                  </span>
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p>
                    <span className="font-semibold">{activity.actor.displayName}</span>
                    {activity.kind === "like" ? " さんがいいねしました" : " さんがコメントしました"}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {activity.post.title} / {activity.post.artistName}
                  </p>
                  {activity.body ? (
                    <p className="mt-1 line-clamp-2 text-sm">{activity.body}</p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted">
                    {formatRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
