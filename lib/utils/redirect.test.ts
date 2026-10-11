import { describe, expect, it } from "vitest";
import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("相対パスはそのまま返す", () => {
    expect(safeNextPath("/posts/1")).toBe("/posts/1");
  });
  it("外部 URL やプロトコル相対 URL は既定値にする", () => {
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
  });
  it("空なら既定値にする", () => {
    expect(safeNextPath(null, "/home")).toBe("/home");
  });
});
