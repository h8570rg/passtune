import type { Database } from "@/lib/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type Profile = {
  id: string;
  handle: string;
  displayName: string;
  avatarPath: string | null;
  avatarUrl: string | null;
};

export type Post = {
  id: string;
  createdAt: string;
  comment: string;
  author: Profile;
  track: {
    appleTrackId: number;
    title: string;
    artistName: string;
    albumName: string | null;
    artworkUrl: string | null;
    durationMs: number | null;
  };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  /** 投稿者本人にだけ値が入る（RLS） */
  playCount: number | null;
};
