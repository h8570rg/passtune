import "server-only";
import { pickBestSpotifyTrack, type SpotifyTrackCandidate } from "./spotify-match";

/**
 * Spotify Web API（Client Credentials。利用者のログインは不要）。
 * Spotify から取ったデータは保存しない（Spotify Developer Terms のキャッシュ制限）。
 * @see https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
 */

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.value;
}

/** 曲名・アーティスト名・長さから Spotify の曲 ID を探す。見つからない・設定がない場合は null */
export async function findSpotifyTrackId(target: {
  title: string;
  artistName: string;
  durationMs: number | null;
}): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const url = new URL("https://api.spotify.com/v1/search");
  url.search = new URLSearchParams({
    q: `track:${target.title} artist:${target.artistName}`,
    type: "track",
    market: "JP",
    limit: "10",
  }).toString();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const data = (await response.json()) as {
    tracks?: {
      items?: { id: string; name: string; duration_ms: number; artists: { name: string }[] }[];
    };
  };
  const candidates: SpotifyTrackCandidate[] = (data.tracks?.items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    durationMs: item.duration_ms,
    artistNames: item.artists.map((artist) => artist.name),
  }));
  return pickBestSpotifyTrack(target, candidates)?.id ?? null;
}
