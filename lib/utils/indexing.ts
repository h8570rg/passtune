/**
 * 検索エンジンに LP を載せるか（docs/decisions/009-search-engine-indexing.md）。
 * 身内だけで使う間は載せない。公開すると決めたら、Vercel の本番の環境変数に `SEARCH_INDEXING=enabled` を入れる。
 * 本番以外（プレビュー・手元）では、いつも載せない。
 */
export function isSearchIndexingEnabled(): boolean {
  return process.env.VERCEL_ENV === "production" && process.env.SEARCH_INDEXING === "enabled";
}
