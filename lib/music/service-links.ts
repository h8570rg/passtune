/**
 * 各音楽サービスで曲を開くリンク（docs/technical/architecture.md「各サービスで開く」）。
 * Apple Music を先頭に並べる（Apple Music Identity Guidelines）。
 */

export type MusicService = "apple_music" | "spotify" | "youtube_music" | "line_music";

export type ServiceLink = { service: MusicService; label: string; href: string };

export const SERVICE_LABELS: Record<MusicService, string> = {
  apple_music: "Apple Music",
  spotify: "Spotify",
  youtube_music: "YouTube Music",
  line_music: "LINE MUSIC",
};

type LinkTarget = { postId: string; appleTrackId: number; title: string; artistName: string };

export function searchQuery(title: string, artistName: string): string {
  return `${title} ${artistName}`.trim();
}

export function buildServiceLinks(target: LinkTarget): ServiceLink[] {
  const query = encodeURIComponent(searchQuery(target.title, target.artistName));
  return [
    {
      service: "apple_music",
      label: SERVICE_LABELS.apple_music,
      href: `https://music.apple.com/jp/song/${target.appleTrackId}`,
    },
    {
      service: "spotify",
      label: SERVICE_LABELS.spotify,
      // 押された時点でサーバーが Spotify を検索して曲ページへ転送する
      href: `/go/spotify/${target.postId}`,
    },
    {
      service: "youtube_music",
      label: SERVICE_LABELS.youtube_music,
      href: `https://music.youtube.com/search?q=${query}`,
    },
    {
      service: "line_music",
      label: SERVICE_LABELS.line_music,
      href: `https://music.line.me/webapp/search?query=${query}`,
    },
  ];
}

export function spotifySearchUrl(title: string, artistName: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(searchQuery(title, artistName))}`;
}
