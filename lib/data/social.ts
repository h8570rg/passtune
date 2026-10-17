import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/type";
import { containsPattern } from "@/lib/utils/search";
import { toProfile } from "./user";

const PROFILE_COLUMNS = "id, handle, display_name, avatar_path";

export const getFollowCounts = cache(async (userId: string) => {
  const supabase = await createClient();
  const [following, followers] = await Promise.all([
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("followee_id", userId),
  ]);
  if (following.error) throw following.error;
  if (followers.error) throw followers.error;
  return { following: following.count ?? 0, followers: followers.count ?? 0 };
});

export async function isFollowing(followerId: string, followeeId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

/** フォロー中の人の ID（タイムライン用） */
export const getFolloweeIds = cache(async (userId: string): Promise<string[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("followee_id")
    .eq("follower_id", userId);
  if (error) throw error;
  return data.map((row) => row.followee_id);
});

export async function getFollowing(userId: string): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select(`created_at, profile:profiles!follows_followee_id_fkey (${PROFILE_COLUMNS})`)
    .eq("follower_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.flatMap((row) => (row.profile ? [toProfile(row.profile)] : []));
}

export async function getFollowers(userId: string): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("follows")
    .select(`created_at, profile:profiles!follows_follower_id_fkey (${PROFILE_COLUMNS})`)
    .eq("followee_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.flatMap((row) => (row.profile ? [toProfile(row.profile)] : []));
}

export type Comment = { id: string; body: string; createdAt: string; author: Profile };

const USER_SEARCH_LIMIT = 20;

/**
 * 友だち検索。ユーザー ID か表示名の部分一致（大文字小文字は区別しない）。自分は除く。
 * ID が完全に一致する人 → ID が前方一致する人 → それ以外 の順に並べる。
 */
export async function searchProfiles(query: string, excludeUserId: string): Promise<Profile[]> {
  if (!query) return [];
  const supabase = await createClient();
  const pattern = containsPattern(query);
  const [byHandle, byName] = await Promise.all([
    supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .ilike("handle", pattern)
      .neq("id", excludeUserId)
      .limit(USER_SEARCH_LIMIT),
    supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .ilike("display_name", pattern)
      .neq("id", excludeUserId)
      .limit(USER_SEARCH_LIMIT),
  ]);
  if (byHandle.error) throw byHandle.error;
  if (byName.error) throw byName.error;

  const lower = query.toLowerCase();
  const rank = (handle: string) => (handle === lower ? 0 : handle.startsWith(lower) ? 1 : 2);
  const unique = new Map([...byHandle.data, ...byName.data].map((row) => [row.id, row]));
  return [...unique.values()]
    .sort((a, b) => rank(a.handle) - rank(b.handle) || a.handle.localeCompare(b.handle))
    .slice(0, USER_SEARCH_LIMIT)
    .map(toProfile);
}

/** 最近はじめた人（友だち検索で、まだ何も入力していないときに出す）。自分は除く */
export async function getRecentProfiles(excludeUserId: string, limit = 10): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .neq("id", excludeUserId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(toProfile);
}

export async function getComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(`id, body, created_at, author:profiles!comments_user_id_fkey (${PROFILE_COLUMNS})`)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data.flatMap((row) =>
    row.author
      ? [{ id: row.id, body: row.body, createdAt: row.created_at, author: toProfile(row.author) }]
      : [],
  );
}

export type Activity = {
  kind: "like" | "comment";
  id: string;
  createdAt: string;
  actor: Profile;
  post: { id: string; title: string; artistName: string };
  body?: string;
};

const ACTIVITY_LIMIT = 50;

/** 自分の投稿に付いた、他の人のいいね・コメント（新しい順） */
export async function getActivities(userId: string): Promise<Activity[]> {
  const supabase = await createClient();
  const [likes, comments] = await Promise.all([
    supabase
      .from("likes")
      .select(
        `user_id, post_id, created_at,
         actor:profiles!likes_user_id_fkey (${PROFILE_COLUMNS}),
         post:posts!inner (id, title, artist_name, user_id)`,
      )
      .eq("post.user_id", userId)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_LIMIT),
    supabase
      .from("comments")
      .select(
        `id, body, created_at,
         actor:profiles!comments_user_id_fkey (${PROFILE_COLUMNS}),
         post:posts!inner (id, title, artist_name, user_id)`,
      )
      .eq("post.user_id", userId)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_LIMIT),
  ]);
  if (likes.error) throw likes.error;
  if (comments.error) throw comments.error;

  const activities: Activity[] = [
    ...likes.data.flatMap((row) =>
      row.actor && row.post
        ? [
            {
              kind: "like" as const,
              id: `like:${row.user_id}:${row.post_id}`,
              createdAt: row.created_at,
              actor: toProfile(row.actor),
              post: { id: row.post.id, title: row.post.title, artistName: row.post.artist_name },
            },
          ]
        : [],
    ),
    ...comments.data.flatMap((row) =>
      row.actor && row.post
        ? [
            {
              kind: "comment" as const,
              id: `comment:${row.id}`,
              createdAt: row.created_at,
              actor: toProfile(row.actor),
              post: { id: row.post.id, title: row.post.title, artistName: row.post.artist_name },
              body: row.body,
            },
          ]
        : [],
    ),
  ];
  return activities.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, ACTIVITY_LIMIT);
}
