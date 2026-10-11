import type { MetadataRoute } from "next";
import { getURL } from "@/lib/utils/url";

/** 検索エンジンに載せるのは LP（`/`）だけ */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: getURL(), changeFrequency: "monthly", priority: 1 }];
}
