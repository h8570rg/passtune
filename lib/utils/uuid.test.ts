import { describe, expect, test } from "vitest";
import { isUuid } from "./uuid";

describe("isUuid", () => {
  test("UUID の形式なら true", () => {
    expect(isUuid("a1111111-1111-4111-8111-111111111111")).toBe(true);
    expect(isUuid("A1111111-1111-4111-8111-111111111111")).toBe(true);
  });

  test("形式が違えば false", () => {
    expect(isUuid("demo_alice")).toBe(false);
    expect(isUuid("a1111111-1111-4111-8111-11111111111")).toBe(false);
    expect(isUuid("------------------------------------")).toBe(false);
    expect(isUuid(undefined)).toBe(false);
  });
});
