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

  it("アーティストが一致する候補を、表記の違う候補より優先する", () => {
    const result = pickBestSpotifyTrack(target, [
      { id: "cover", name: "夜に駆ける", durationMs: 261000, artistNames: ["Piano Echoes"] },
      { id: "original", name: "夜に駆ける", durationMs: 261500, artistNames: ["YOASOBI"] },
    ]);
    expect(result?.id).toBe("original");
  });

  it("アーティスト名が英語表記でも、曲名と長さが一致すれば選ぶ", () => {
    const result = pickBestSpotifyTrack(
      { title: "Pretender", artistName: "Official髭男dism", durationMs: 326843 },
      [
        {
          id: "live",
          name: "Pretender - Live",
          durationMs: 344813,
          artistNames: ["OFFICIAL HIGE DANDISM"],
        },
        {
          id: "original",
          name: "Pretender",
          durationMs: 326842,
          artistNames: ["OFFICIAL HIGE DANDISM"],
        },
      ],
    );
    expect(result?.id).toBe("original");
  });

  it("アーティストが違い、長さも違えば null", () => {
    expect(
      pickBestSpotifyTrack(target, [
        { id: "cover", name: "夜に駆ける", durationMs: 240000, artistNames: ["Piano Echoes"] },
      ]),
    ).toBeNull();
  });

  it("アーティストが違い、曲名も部分一致だけなら null", () => {
    expect(
      pickBestSpotifyTrack(target, [
        {
          id: "inst",
          name: "夜に駆ける - Instrumental",
          durationMs: 261013,
          artistNames: ["Ayase"],
        },
      ]),
    ).toBeNull();
  });
});
