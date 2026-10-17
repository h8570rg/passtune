import type { MetadataRoute } from "next";
import { isSearchIndexingEnabled } from "@/lib/utils/indexing";
import { getURL } from "@/lib/utils/url";

/** 検索エンジンに載せるのは LP（`/`）だけ。載せない間は空 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSearchIndexingEnabled()) return [];
  return [{ url: getURL(), changeFrequency: "monthly", priority: 1 }];
}
