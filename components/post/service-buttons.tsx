import { buildServiceLinks, type MusicService } from "@/lib/music/service-links";

/**
 * 各音楽サービスで開くボタン。Apple Music を先頭に並べる。
 * TODO(launch): 各社の公式バッジ・ロゴ素材に差し替える（docs/research/2026-09-28-music-terms.md）。
 * 素材を入手するまでは、ブランドカラーの丸印とサービス名の文字ボタンで代用する。
 */
const DOT_COLORS: Record<MusicService, string> = {
  apple_music: "#fa2d48",
  spotify: "#1ed760",
  youtube_music: "#ff0033",
  line_music: "#06c755",
};

export function ServiceButtons({
  postId,
  appleTrackId,
  title,
  artistName,
}: {
  postId: string;
  appleTrackId: number;
  title: string;
  artistName: string;
}) {
  const links = buildServiceLinks({ postId, appleTrackId, title, artistName });
  return (
    <ul className="flex flex-wrap gap-2" aria-label="ほかのサービスで開く">
      {links.map((link) => (
        <li key={link.service}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-default"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: DOT_COLORS[link.service] }}
              aria-hidden
            />
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
