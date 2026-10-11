import { AVATAR_BUCKET, AVATAR_OUTPUT_SIZE } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import { resizeToSquareWebp } from "@/lib/utils/image";

/**
 * アイコン画像を縮小して Storage にアップロードし、保存したパスを返す。
 * パスは `<user_id>/<時刻>.webp`。毎回別のパスにして、CDN のキャッシュで古い画像が出るのを防ぐ。
 * 古い画像の削除は、プロフィールの保存時にサーバー側で行う。
 */
export async function uploadAvatar(file: File): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const blob = await resizeToSquareWebp(file, AVATAR_OUTPUT_SIZE);
  const path = `${user.id}/${Date.now()}.webp`;
  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, blob, {
    contentType: "image/webp",
    upsert: false,
  });
  if (error) throw error;
  return path;
}
