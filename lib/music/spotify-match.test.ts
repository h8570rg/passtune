import { describe, expect, it } from "vitest";
import { normalizeForMatch, pickBestSpotifyTrack } from "./spotify-match";

describe("normalizeForMatch", () => {
  it("全角・括弧・記号を吸収する", () => {
    expect(normalizeForMatch("夜に駆ける (Live)")).toBe(normalizeForMatch("夜に駆ける"));
    expect(normalizeForMatch("ＹＯＡＳＯＢＩ")).toBe("yoasobi");
  });
});

describe("pickBestSpotifyTrack", () => {
  const target = { title: "夜に駆ける", artistName: "YOASOBI", durationMs: 261013 };

  it("曲名・アーティスト・長さが一致する候補を選ぶ", () => {
    const result = pickBestSpotifyTrack(target, [
      { id: "live", name: "夜に駆ける - Live", durationMs: 300000, artistNames: ["YOASOBI"] },
      { id: "original", name: "夜に駆ける", durationMs: 261500, artistNames: ["YOASOBI"] },
      { id: "cover", name: "夜に駆ける", durationMs: 261000, artistNames: ["Someone"] },
    ]);
    expect(result?.id).toBe("original");
  });

  it("アーティストが違う候補しかなければ null", () => {
    expect(
      pickBestSpotifyTrack(target, [
        { id: "cover", name: "夜に駆ける", durationMs: 261000, artistNames: ["Piano Echoes"] },
      ]),
    ).toBeNull();
  });
});
