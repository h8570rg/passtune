import type { MetadataRoute } from "next";
import { SERVICE_DESCRIPTION, SERVICE_NAME } from "@/lib/config";

/** @see node_modules/next/dist/docs/01-app/02-guides/progressive-web-apps.md */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SERVICE_NAME,
    short_name: SERVICE_NAME,
    description: SERVICE_DESCRIPTION,
    lang: "ja",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#1d1d3a",
    theme_color: "#1d1d3a",
    // アイコンの元データは public/brand/（開発者が作成。2026-10-17）
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
