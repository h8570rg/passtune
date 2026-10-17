import { describe, expect, test } from "vitest";
import { containsPattern, normalizeUserQuery } from "./search";

describe("normalizeUserQuery", () => {
  test("前後の空白と先頭の @ を外す", () => {
    expect(normalizeUserQuery("  @alice ")).toBe("alice");
    expect(normalizeUserQuery("@@bob")).toBe("bob");
    expect(normalizeUserQuery(null)).toBe("");
  });

  test("30 文字で切る", () => {
    expect(normalizeUserQuery("a".repeat(40))).toHaveLength(30);
  });
});

describe("containsPattern", () => {
  test("部分一致のパターンにする", () => {
    expect(containsPattern("アリス")).toBe("%アリス%");
  });

  test("% _ \\ を文字として扱う", () => {
    expect(containsPattern("a_b%c\\d")).toBe("%a\\_b\\%c\\\\d%");
  });
});
