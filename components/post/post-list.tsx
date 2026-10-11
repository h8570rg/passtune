import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { LikeButton } from "@/components/social/like-button";
import type { PostPage } from "@/lib/data/post";
import { PostCard } from "./post-card";

/** 投稿の一覧。続きはキーセット方式（?before=<最後の投稿の時刻>）で読み込む */
export function PostList({
  page,
  viewerId,
  basePath,
}: {
  page: PostPage;
  viewerId: string | null;
  basePath: string;
}) {
  return (
    <div>
      {page.posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          viewerId={viewerId}
          showCounts={false}
          actions={
            <>
              <LikeButton
                postId={post.id}
                liked={post.likedByMe}
                count={post.likeCount}
                isLoggedIn={viewerId !== null}
              />
              <Link
                href={`/posts/${post.id}`}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <MessageCircleIcon className="size-4" />
                {post.commentCount}
              </Link>
            </>
          }
        />
      ))}
      {page.nextCursor ? (
        <div className="py-6 text-center">
          <Link
            href={`${basePath}?before=${encodeURIComponent(page.nextCursor)}`}
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-default"
          >
            もっと見る
          </Link>
        </div>
      ) : null}
    </div>
  );
}
