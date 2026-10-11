/**
 * iTunes Search / Lookup API（Apple）。キー不要で、ブラウザからもサーバーからも呼べる（CORS 許可済み）。
 * 上限は IP ごとに約 20 回/分のため、検索は基本的にブラウザから呼ぶ（docs/technical/architecture.md）。
 * @see https://performance-partners.apple.com/search-api
 */

const ITUNES_BASE = "https://itunes.apple.com";
const COUNTRY = "JP";

export type Track = {
  trackId: number;
  title: string;
  artistName: string;
  albumName: string | null;
  artworkUrl: string | null;
  previewUrl: string | null;
  durationMs: number | null;
  trackViewUrl: string | null;
};

type ITunesTrack = {
  wrapperType?: string;
  kind?: string;
  trackId?: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  trackViewUrl?: string;
};

/** 100x100 のジャケット画像の URL を、指定サイズの URL に置き換える（画像は Apple から直接配信される） */
export function resizeArtworkUrl(url: string | null | undefined, size = 300): string | null {
  if (!url) return null;
  return url.replace(/\/\d+x\d+bb\./, `/${size}x${size}bb.`);
}

export function toTrack(item: ITunesTrack): Track | null {
  if (item.kind !== "song" || !item.trackId || !item.trackName || !item.artistName) return null;
  return {
    trackId: item.trackId,
    title: item.trackName,
    artistName: item.artistName,
    albumName: item.collectionName ?? null,
    artworkUrl: resizeArtworkUrl(item.artworkUrl100),
    previewUrl: item.previewUrl ?? null,
    durationMs: item.trackTimeMillis ?? null,
    trackViewUrl: item.trackViewUrl ?? null,
  };
}

/** 曲名・アーティスト名で曲を検索する */
export async function searchTracks(term: string, signal?: AbortSignal): Promise<Track[]> {
  const query = term.trim();
  if (!query) return [];
  const url = new URL("/search", ITUNES_BASE);
  url.search = new URLSearchParams({
    term: query,
    entity: "song",
    country: COUNTRY,
    lang: "ja_jp",
    limit: "20",
  }).toString();
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`iTunes search failed: ${response.status}`);
  const data = (await response.json()) as { results?: ITunesTrack[] };
  return (data.results ?? []).map(toTrack).filter((track): track is Track => track !== null);
}

/** 曲 ID から曲の情報を取得する（複数 ID をまとめて 1 回で取得できる） */
export async function lookupTracks(
  trackIds: number[],
  init?: RequestInit,
): Promise<Map<number, Track>> {
  const ids = [...new Set(trackIds)].filter((id) => Number.isSafeInteger(id) && id > 0);
  const result = new Map<number, Track>();
  if (ids.length === 0) return result;
  const url = new URL("/lookup", ITUNES_BASE);
  url.search = new URLSearchParams({
    id: ids.join(","),
    country: COUNTRY,
    lang: "ja_jp",
  }).toString();
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`iTunes lookup failed: ${response.status}`);
  const data = (await response.json()) as { results?: ITunesTrack[] };
  for (const item of data.results ?? []) {
    const track = toTrack(item);
    if (track) result.set(track.trackId, track);
  }
  return result;
}
