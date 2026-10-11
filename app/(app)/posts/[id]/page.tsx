import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post/post-card";
import { CommentSection } from "@/components/social/comment-section";
import { LikeButton } from "@/components/social/like-button";
import { getPost } from "@/lib/data/post";
import { getComments } from "@/lib/data/social";
import { getAuthUser } from "@/lib/data/user";

export async function generateMetadata({ params }: PageProps<"/posts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return {};
  return {
    title: `${post.track.title} / ${post.track.artistName}（${post.author.displayName}）`,
    description: post.comment || `${post.author.displayName} さんのおすすめの 1 曲`,
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const [post, user] = await Promise.all([getPost(id), getAuthUser()]);
  if (!post) notFound();
  const comments = await getComments(post.id);
  const viewerId = user?.id ?? null;

  return (
    <div>
      <PostCard
        post={post}
        viewerId={viewerId}
        showCounts={false}
        redirectAfterDelete={`/u/${post.author.handle}`}
        actions={
          <LikeButton
            postId={post.id}
            liked={post.likedByMe}
            count={post.likeCount}
            isLoggedIn={viewerId !== null}
          />
        }
      />
      <CommentSection postId={post.id} comments={comments} viewerId={viewerId} />
    </div>
  );
}
