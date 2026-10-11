import "server-only";
import { cache } from "react";
import { TIMELINE_PAGE_SIZE } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/type";
import { isUuid } from "@/lib/utils/uuid";
import { getAuthUser, toProfile } from "./user";

/**
 * 投稿の取得で共通の select。著者・件数・自分のいいね・再生回数（RLS で投稿者本人のみ）を一緒に取る。
 * PostgREST の集計（count）と埋め込みを使う。
 */
const POST_SELECT = `
  id, created_at, comment, apple_track_id, title, artist_name, album_name, artwork_url, duration_ms,
  author:profiles!posts_user_id_fkey (id, handle, display_name, avatar_path),
  likes(count),
  comments(count),
  my_like:likes(user_id),
  post_play_counts(play_count)
`;

type PostRow = {
  id: string;
  created_at: string;
  comment: string;
  apple_track_id: number;
  title: string;
  artist_name: string;
  album_name: string | null;
  artwork_url: string | null;
  duration_ms: number | null;
  author: { id: string; handle: string; display_name: string; avatar_path: string | null } | null;
  likes: { count: number }[];
  comments: { count: number }[];
  my_like: { user_id: string }[];
  post_play_counts: { play_count: number } | { play_count: number }[] | null;
};

function toPost(row: PostRow): Post | null {
  if (!row.author) return null;
  const playCounts = Array.isArray(row.post_play_counts)
    ? row.post_play_counts[0]
    : row.post_play_counts;
  return {
    id: row.id,
    createdAt: row.created_at,
    comment: row.comment,
    author: toProfile(row.author),
    track: {
      appleTrackId: row.apple_track_id,
      title: row.title,
      artistName: row.artist_name,
      albumName: row.album_name,
      artworkUrl: row.artwork_url,
      durationMs: row.duration_ms,
    },
    likeCount: row.likes[0]?.count ?? 0,
    commentCount: row.comments[0]?.count ?? 0,
    likedByMe: row.my_like.length > 0,
    playCount: playCounts ? playCounts.play_count : null,
  };
}

async function baseQuery() {
  const supabase = await createClient();
  const user = await getAuthUser();
  // 自分のいいねだけを埋め込む。未ログインなら誰にも一致しない ID で絞る。
  const myId = user?.id ?? "00000000-0000-0000-0000-000000000000";
  // クエリビルダーは thenable なので、await で実行されないようオブジェクトに包んで返す
  return { query: supabase.from("posts").select(POST_SELECT).eq("my_like.user_id", myId) };
}

export const getPost = cache(async (postId: string): Promise<Post | null> => {
  if (!isUuid(postId)) return null;
  const { data, error } = await (await baseQuery()).query.eq("id", postId).maybeSingle();
  if (error) throw error;
  return data ? toPost(data as unknown as PostRow) : null;
});

export type PostPage = { posts: Post[]; nextCursor: string | null };

function toPage(rows: unknown[] | null): PostPage {
  const posts = ((rows ?? []) as PostRow[])
    .map(toPost)
    .filter((post): post is Post => post !== null);
  const nextCursor = posts.length === TIMELINE_PAGE_SIZE ? (posts.at(-1)?.createdAt ?? null) : null;
  return { posts, nextCursor };
}

/** ある利用者の投稿（新しい順、キーセット方式で続きを取得） */
export async function getPostsByUser(userId: string, before?: string | null): Promise<PostPage> {
  let query = (await baseQuery()).query
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(TIMELINE_PAGE_SIZE);
  if (before) query = query.lt("created_at", before);
  const { data, error } = await query;
  if (error) throw error;
  return toPage(data);
}

/** 複数の利用者の投稿（タイムライン用） */
export async function getPostsByUsers(
  userIds: string[],
  before?: string | null,
): Promise<PostPage> {
  if (userIds.length === 0) return { posts: [], nextCursor: null };
  let query = (await baseQuery()).query
    .in("user_id", userIds)
    .order("created_at", { ascending: false })
    .limit(TIMELINE_PAGE_SIZE);
  if (before) query = query.lt("created_at", before);
  const { data, error } = await query;
  if (error) throw error;
  return toPage(data);
}
