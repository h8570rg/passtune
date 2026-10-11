import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./date";

describe("formatRelativeTime", () => {
  const now = new Date("2026-10-11T12:00:00+09:00");
  it("1 週間以内は相対時刻", () => {
    expect(formatRelativeTime("2026-10-11T11:57:00+09:00", now)).toBe("3分前");
  });
  it("1 週間より前は日付", () => {
    expect(formatRelativeTime("2026-09-01T12:00:00+09:00", now)).toBe("9月1日");
    expect(formatRelativeTime("2025-09-01T12:00:00+09:00", now)).toBe("2025年9月1日");
  });
});
