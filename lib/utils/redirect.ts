/**
 * ログイン後などに戻る先として、自サイト内の相対パスだけを許可する（オープンリダイレクト対策）。
 */
export function safeNextPath(next: string | null | undefined, fallback = "/"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
