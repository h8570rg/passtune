import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "@/components/pwa";
import { SERVICE_DESCRIPTION, SERVICE_NAME } from "@/lib/config";
import { getURL } from "@/lib/utils/url";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: {
    template: `%s | ${SERVICE_NAME}`,
    default: SERVICE_NAME,
  },
  description: SERVICE_DESCRIPTION,
  applicationName: SERVICE_NAME,
  appleWebApp: { capable: true, title: SERVICE_NAME, statusBarStyle: "default" },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b12" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Providers>{children}</Providers>
        <ServiceWorkerRegistration />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
