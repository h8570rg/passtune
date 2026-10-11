import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileRow } from "@/lib/type";
import { getAvatarUrl } from "@/lib/utils/avatar";

export function toProfile(
  row: Pick<ProfileRow, "id" | "handle" | "display_name" | "avatar_path">,
): Profile {
  return {
    id: row.id,
    handle: row.handle,
    displayName: row.display_name,
    avatarPath: row.avatar_path,
    avatarUrl: getAvatarUrl(row.avatar_path),
  };
}

/** ログイン中のユーザー（未ログインなら null）。1 リクエスト内では 1 回だけ問い合わせる。 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** ログイン中のユーザーのプロフィール（未ログイン・未作成なら null） */
export const getMyProfile = cache(async (): Promise<Profile | null> => {
  const user = await getAuthUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, handle, display_name, avatar_path")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data ? toProfile(data) : null;
});

/** ログイン必須の画面で使う。未ログインならログインへ、プロフィール未作成ならオンボーディングへ。 */
export async function requireProfile(nextPath: string): Promise<Profile> {
  const user = await getAuthUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  const profile = await getMyProfile();
  if (!profile) redirect("/onboarding");
  return profile;
}

export const getProfileByHandle = cache(async (handle: string): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, handle, display_name, avatar_path")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data ? toProfile(data) : null;
});
