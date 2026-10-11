import "server-only";
import { AVATAR_BUCKET } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** 自分のフォルダのうち、残すもの以外のアイコン画像を削除する（未保存のアップロードや古い画像の掃除） */
export async function removeUnusedAvatars(
  supabase: SupabaseServerClient,
  userId: string,
  keepPath: string | null,
) {
  const { data: files } = await supabase.storage.from(AVATAR_BUCKET).list(userId);
  const unused = (files ?? [])
    .map((file) => `${userId}/${file.name}`)
    .filter((path) => path !== keepPath);
  if (unused.length > 0) {
    await supabase.storage.from(AVATAR_BUCKET).remove(unused);
  }
}

/** アイコン画像のパスが自分のフォルダのものか（他人の画像を指定されないように） */
export function isOwnAvatarPath(userId: string, path: string | null | undefined): path is string {
  return typeof path === "string" && path.startsWith(`${userId}/`) && !path.includes("..");
}
