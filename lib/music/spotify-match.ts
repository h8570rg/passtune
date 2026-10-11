export type SpotifyTrackCandidate = {
  id: string;
  name: string;
  durationMs: number;
  artistNames: string[];
};

/** 比較用に正規化する（全角・半角、大文字小文字、空白、記号、括弧内の補足を吸収） */
export function normalizeForMatch(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[(（[【].*?[)）\]】]/g, "")
    .replace(/\s*-\s*(single|ep|from .*|feat\..*)$/i, "")
    .replace(/[\s・·.,'’"“”!！?？&＆~〜-]/g, "");
}

const DURATION_TOLERANCE_MS = 3000;

/**
 * Apple の曲に最も合う Spotify の候補を選ぶ。
 * 曲名とアーティスト名の一致を優先し、曲の長さが近いもの（±3 秒）でライブ版などの別バージョンを除く。
 */
export function pickBestSpotifyTrack(
  target: { title: string; artistName: string; durationMs: number | null },
  candidates: SpotifyTrackCandidate[],
): SpotifyTrackCandidate | null {
  const title = normalizeForMatch(target.title);
  const artist = normalizeForMatch(target.artistName);

  let best: { candidate: SpotifyTrackCandidate; score: number } | null = null;
  for (const candidate of candidates) {
    const candidateTitle = normalizeForMatch(candidate.name);
    const artistMatches = candidate.artistNames.some((name) => {
      const normalized = normalizeForMatch(name);
      return normalized === artist || normalized.includes(artist) || artist.includes(normalized);
    });
    if (!artistMatches) continue;

    let score = 0;
    if (candidateTitle === title) score += 3;
    else if (candidateTitle.includes(title) || title.includes(candidateTitle)) score += 1;
    else continue;

    if (target.durationMs !== null) {
      const diff = Math.abs(candidate.durationMs - target.durationMs);
      if (diff <= DURATION_TOLERANCE_MS) score += 2;
      else if (diff > 20_000) score -= 2;
    }
    if (!best || score > best.score) best = { candidate, score };
  }
  return best && best.score >= 3 ? best.candidate : null;
}
