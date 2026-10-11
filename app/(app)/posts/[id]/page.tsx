import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post/post-card";
import { getPost } from "@/lib/data/post";
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

  return (
    <div>
      <PostCard
        post={post}
        viewerId={user?.id ?? null}
        redirectAfterDelete={`/u/${post.author.handle}`}
      />
    </div>
  );
}
