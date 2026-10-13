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
 * 曲名の一致を前提に、アーティスト名の一致と曲の長さの近さ（±3 秒）で点数を付ける。
 * Spotify の API は邦楽のアーティスト名を英語表記で返す（Official髭男dism → OFFICIAL HIGE DANDISM、
 * あいみょん → Aimyon）ため、アーティスト名が違っても「曲名が完全に一致し、長さも一致する」なら同じ曲とみなす。
 * 検索の時点で、日本語のアーティスト名で絞り込めている（artist: の指定は Spotify 側で別表記も含めて照合される）。
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
    let score = 0;
    if (candidateTitle === title) score += 3;
    else if (candidateTitle.includes(title) || title.includes(candidateTitle)) score += 1;
    else continue;

    const artistMatches = candidate.artistNames.some((name) => {
      const normalized = normalizeForMatch(name);
      return normalized === artist || normalized.includes(artist) || artist.includes(normalized);
    });
    if (artistMatches) score += 2;

    if (target.durationMs !== null) {
      const diff = Math.abs(candidate.durationMs - target.durationMs);
      if (diff <= DURATION_TOLERANCE_MS) score += 2;
      else if (diff > 20_000) score -= 2;
    }
    if (!best || score > best.score) best = { candidate, score };
  }
  // 曲名が完全一致＋（アーティスト一致 または 長さ一致）、または曲名の部分一致＋アーティスト一致＋長さ一致
  return best && best.score >= 5 ? best.candidate : null;
}
