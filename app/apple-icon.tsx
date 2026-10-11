import { brandIcon } from "@/lib/brand-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS はホーム画面のアイコンを自動で角丸にするため、背景は四角のまま（maskable と同じ扱い）にする
export default function AppleIcon() {
  return brandIcon(180, { maskable: true });
}
