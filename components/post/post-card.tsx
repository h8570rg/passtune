import { HeadphonesIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/user-avatar";
import type { Post } from "@/lib/type";
import { formatRelativeTime } from "@/lib/utils/date";
import { PostMenu } from "./post-menu";
import { ServiceButtons } from "./service-buttons";
import { TrackBlock } from "./track-block";

type PostCardProps = {
  post: Post;
  viewerId: string | null;
  /** 投稿詳細では、いいね・コメントの操作を別に置くので件数表示を省く */
  showCounts?: boolean;
  /** 削除したあとに移動する先（投稿詳細から削除した場合など） */
  redirectAfterDelete?: string;
  actions?: React.ReactNode;
};

/** 投稿カード: 投稿者 → 一言 → 曲（試聴） → 各サービスのボタン → 反応 */
export function PostCard({
  post,
  viewerId,
  showCounts = true,
  redirectAfterDelete,
  actions,
}: PostCardProps) {
  const isMine = viewerId === post.author.id;
  return (
    <article className="space-y-3 border-b border-border py-4">
      <header className="flex items-center gap-3">
        <Link href={`/u/${post.author.handle}`} className="shrink-0">
          <UserAvatar avatarUrl={post.author.avatarUrl} name={post.author.displayName} size="sm" />
        </Link>
        <div className="min-w-0 flex-1 text-sm leading-tight">
          <Link
            href={`/u/${post.author.handle}`}
            className="block truncate font-semibold hover:underline"
          >
            {post.author.displayName}
          </Link>
          <span className="text-xs text-muted">
            @{post.author.handle} ·{" "}
            <Link href={`/posts/${post.id}`} className="hover:underline">
              <time dateTime={post.createdAt}>{formatRelativeTime(post.createdAt)}</time>
            </Link>
          </span>
        </div>
        {isMine ? <PostMenu postId={post.id} redirectTo={redirectAfterDelete} /> : null}
      </header>
      {post.comment ? (
        <p className="text-[15px] wrap-break-word whitespace-pre-wrap">{post.comment}</p>
      ) : null}
      <TrackBlock
        playKey={`post:${post.id}`}
        postId={post.id}
        appleTrackId={post.track.appleTrackId}
        title={post.track.title}
        artistName={post.track.artistName}
        artworkUrl={post.track.artworkUrl}
      />
      <ServiceButtons
        postId={post.id}
        appleTrackId={post.track.appleTrackId}
        title={post.track.title}
        artistName={post.track.artistName}
      />
      <footer className="flex items-center gap-5 text-sm text-muted">
        {actions}
        {showCounts ? (
          <>
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <HeartIcon className={post.likedByMe ? "size-4 fill-danger text-danger" : "size-4"} />
              {post.likeCount}
            </Link>
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <MessageCircleIcon className="size-4" />
              {post.commentCount}
            </Link>
          </>
        ) : null}
        {isMine && post.playCount !== null ? (
          <span
            className="ml-auto inline-flex items-center gap-1"
            title="延べ再生回数（あなたにだけ表示）"
          >
            <HeadphonesIcon className="size-4" />
            {post.playCount} 回再生
          </span>
        ) : isMine ? (
          <span
            className="ml-auto inline-flex items-center gap-1"
            title="延べ再生回数（あなたにだけ表示）"
          >
            <HeadphonesIcon className="size-4" />0 回再生
          </span>
        ) : null}
      </footer>
    </article>
  );
}
