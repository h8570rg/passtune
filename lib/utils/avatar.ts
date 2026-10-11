import { AVATAR_BUCKET } from "@/lib/config";

/** Storage の公開バケット上のアイコン画像の URL */
export function getAvatarUrl(avatarPath: string | null | undefined): string | null {
  if (!avatarPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${AVATAR_BUCKET}/${avatarPath}`;
}
