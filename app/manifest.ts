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
    background_color: "#0b0b12",
    theme_color: "#5b5bd6",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/192-maskable", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/512-maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
