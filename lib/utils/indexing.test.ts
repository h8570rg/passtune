import { afterEach, describe, expect, test, vi } from "vitest";
import { isSearchIndexingEnabled } from "./indexing";

describe("isSearchIndexingEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("本番で SEARCH_INDEXING=enabled のときだけ true", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SEARCH_INDEXING", "enabled");
    expect(isSearchIndexingEnabled()).toBe(true);
  });

  test("本番でも、SEARCH_INDEXING がなければ false（身内だけで使う間の既定）", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("SEARCH_INDEXING", "");
    expect(isSearchIndexingEnabled()).toBe(false);
  });

  test("プレビューでは、SEARCH_INDEXING=enabled でも false", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SEARCH_INDEXING", "enabled");
    expect(isSearchIndexingEnabled()).toBe(false);
  });
});
