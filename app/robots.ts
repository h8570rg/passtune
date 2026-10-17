import type { MetadataRoute } from "next";
import { isSearchIndexingEnabled } from "@/lib/utils/indexing";
import { getURL } from "@/lib/utils/url";

/**
 * 検索エンジンに載せるのは LP（`/`）だけ。それも `SEARCH_INDEXING=enabled` のときだけ（docs/decisions/009-search-engine-indexing.md）。
 * 投稿・プロフィールなどは root layout の noindex で載せない。noindex をクローラーに読ませるため、巡回は禁止しない。
 * 中身のない転送用のパスは、巡回されると外部 API を無駄に使うので禁止する。
 * 本番以外（プレビューなど）は、すべて禁止する。
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/go/", "/i/", "/auth/"] },
    ...(isSearchIndexingEnabled() ? { sitemap: `${getURL()}sitemap.xml` } : {}),
  };
}
