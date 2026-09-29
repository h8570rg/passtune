import type { Metadata } from "next";
import { SERVICE_NAME } from "@/lib/config";
import { getURL } from "@/lib/utils/url";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: {
    template: `%s | ${SERVICE_NAME}`,
    default: SERVICE_NAME,
  },
  description: "友人と好きな曲を 1 曲ずつ届け合う音楽共有 SNS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
