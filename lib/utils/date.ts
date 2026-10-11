import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ja");

/** 「3 分前」のような相対時刻。1 週間より前は日付で表す。 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const date = dayjs(iso);
  const diffDays = dayjs(now).diff(date, "day");
  if (diffDays >= 7) {
    const sameYear = date.tz("Asia/Tokyo").year() === dayjs(now).tz("Asia/Tokyo").year();
    return date.tz("Asia/Tokyo").format(sameYear ? "M月D日" : "YYYY年M月D日");
  }
  return date.from(now);
}
