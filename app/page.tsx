import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { LandingPage } from "@/components/landing/landing-page";
import {
  LANDING_DESCRIPTION,
  SERVICE_DESCRIPTION,
  SERVICE_NAME,
  SERVICE_NAME_KANA,
} from "@/lib/config";
import { getAuthUser } from "@/lib/data/user";
import { isSearchIndexingEnabled } from "@/lib/utils/indexing";
import { Timeline } from "./_components/timeline";

/**
 * `/` は検索エンジンに載せる唯一のページ（LP）。ほかのページは root layout で noindex にしている。
 * 身内だけで使う間は LP も載せない（`SEARCH_INDEXING=enabled` で載せる）。
 * 検索エンジンのクローラーは未ログインなので、LP だけが見える。
 */
export async function generateMetadata(): Promise<Metadata> {
  const indexable = isSearchIndexingEnabled();
  return {
    title: { absolute: `${SERVICE_NAME}（${SERVICE_NAME_KANA}）| ${SERVICE_DESCRIPTION}` },
    description: LANDING_DESCRIPTION,
    alternates: { canonical: "/" },
    robots: { index: indexable, follow: indexable },
    openGraph: {
      type: "website",
      siteName: SERVICE_NAME,
      title: `${SERVICE_NAME}（${SERVICE_NAME_KANA}）`,
      description: LANDING_DESCRIPTION,
      url: "/",
      locale: "ja_JP",
    },
    twitter: { card: "summary_large_image" },
  };
}

/** ログイン後はタイムライン、未ログインは LP */
export default async function HomePage({ searchParams }: PageProps<"/">) {
  const user = await getAuthUser();
  if (!user) return <LandingPage />;

  const { before } = await searchParams;
  return (
    <AppShell>
      <Timeline before={typeof before === "string" ? before : null} />
    </AppShell>
  );
}
